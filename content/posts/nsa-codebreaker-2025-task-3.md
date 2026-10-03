---
title: "NSA Codebreaker 2025 - Task 3: Digging Deeper"
subtitle: "Moving from network evidence to a router memory image"
date: 2025-10-05
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "reverse engineering"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

## Task 3 - Digging Deeper - (Reverse Engineering)

> The network administrators confirm that the IP address you provided in your description is an edge router. DAFIN-SOC is asking you to dive deeper and reverse engineer this device. Fortunately, their team managed to pull a memory dump of the device.

> Scour the device's memory dump and identify anomalous or malicious activity to find out what's going on.

> Your submission will be a list of IPs and domains, one per line. For example:
- `127.0.0.1 localhost`
- `192.168.54.131 corp.internal`
- `...`

---

## Downloads

- **Memory Dump** (`memory.dump.gz`)
- **Metadata** (`System.map.br`)
- **Kernel Image** (`vmlinux.xz`)

---

## Task

- **Submit a complete list of affected IPs and FQDNs, one per line.**

---

## Writeup

A reverse engineering task where we're given a memory dump, the kernel symbol map, and the kernel image. The first step is to discover the malicious binary and the second step is to reverse engineer it. To start with, I set up my memory forensics tooling and the kernel images.

> **Note:** Codebreaker generated a unique memory dump for each participant, and I didn't keep my original copy. The IPs and domains below come from a publicly shared copy of the Task 3 files, so the specific values differ from my submission, but the method is identical.

### Setting Up Symbols

The dump is an ELF core file, and the kernel banner identifies the device as an OpenWrt router:

```bash
~/Downloads ❯ gunzip memory.dump.gz && brotli -d System.map.br && xz -d vmlinux.xz

~/Downloads ❯ strings memory.dump | grep -m1 "Linux version"
Linux version 5.15.134 (dsu@Ubuntu) (x86_64-openwrt-linux-musl-gcc (OpenWrt GCC 12.3.0 r23497-6637af95aa) 12.3.0, GNU ld (GNU Binutils) 2.40.0) #0 SMP Mon Oct 9 21:45:35 2023
```

Linux memory analysis needs a symbol table that matches the exact kernel, which is what the provided `vmlinux` and `System.map` are for. I built one with `dwarf2json` and pointed `fvol` at it:

```bash
~/Downloads ❯ dwarf2json linux --elf vmlinux --system-map System.map | xz > symbols/linux/openwrt-5.15.134.json.xz
```

### Finding the Malicious Process

The process tree is mostly what you'd expect on OpenWrt (`procd`, `netifd`, `dropbear`, `dnsmasq`), except for one process with the name `4`:

<img src="/images/codebreaker-2025/task3-psaux.png" alt="fvol process list with the dns-patch process highlighted"/>

A binary called `dns-patch`, launched from an interactive shell, that is restarting the router's DNS server is a strong lead. Its memory map shows that it isn't running from disk at all; both the executable and its argument are deleted in-memory files (`memfd`), a common fileless malware technique:

```bash
~/Downloads ❯ fvol -s symbols -f memory.dump linux.proc.Maps --pid 1552
0x55b5976d7000  0x55b5976d8000  r--  /memfd:x (deleted)
0x55b5976d8000  0x55b5976d9000  r-x  /memfd:x (deleted)
...

~/Downloads ❯ fvol -s symbols -f memory.dump linux.lsof.Lsof --pid 1552
1552    4    5    /memfd:c (deleted)
```

So `memfd:x` is the program and `memfd:c` (file descriptor 5, passed as its argument) is its input. I dumped the ELF out of memory:

```bash
~/Downloads ❯ fvol -s symbols -f memory.dump -o out linux.elfs.Elfs --pid 1552 --dump
1552    4    0x55b5976d7000    0x55b5976d8000    /memfd:x (deleted)    pid.1552.4.0x55b5976d7000.dmp
```

### Reverse Engineering `dns-patch`

The strings already outline the whole program:

```
Usage: %s <encoded file>
Decoded payload too short to even have the key...
opening /etc/hosts
%s %s
warning: weird token count (%zu); ignoring last... check this fff
service dnsmasq restart
```

Since the binary was carved from memory it has no section headers, so I resolved its imports from the dynamic relocations and disassembled it with Capstone. `main` does the following:

1. Reads the file given as `argv[1]` into memory.
2. Base64-decodes it (the lookup table at `0x4040` is the standard alphabet, and invalid characters are skipped).
3. Takes the first 4 bytes of the decoded data as a little-endian 32-bit key.
4. Decrypts the rest in place with the function at `0x18fb`.
5. Splits the plaintext on whitespace and appends each pair of tokens to `/etc/hosts` as `"%s %s"`.
6. Runs `service dnsmasq restart` so the router starts serving the new entries.

The decryption routine at `0x18fb` is a small stream cipher. The highlighted instructions are the interesting ones: the constant added to the state, the `>> 13` mix, the two XORs, and saving the ciphertext byte for the next round:

<img src="/images/codebreaker-2025/task3-decrypt.png" alt="Disassembly of the decrypt routine"/>

In C, it comes out as:

```c
uint32_t state = key;
uint8_t prev = key & 0xff;
for (size_t i = 0; i < len; i++) {
    state += 0x722633ad;
    uint8_t ks = (state ^ (state >> 13)) & 0xff;
    uint8_t c = buf[i];
    buf[i] = c ^ ks ^ prev;
    prev = c;
}
```

### Decrypting the Payload

The encoded payload is still in memory: one copy sits inside the malware's loaded image, and an identical copy appears elsewhere in physical memory. I re-implemented the decoder in Python:

```python
import base64

def decrypt(blob):
    key = int.from_bytes(blob[:4], "little")
    state, prev, out = key, key & 0xFF, bytearray()
    for c in blob[4:]:
        state = (state + 0x722633AD) & 0xFFFFFFFF
        out.append(c ^ ((state ^ (state >> 13)) & 0xFF) ^ prev)
        prev = c
    return bytes(out)

plain = decrypt(base64.b64decode(open("payload.b64", "rb").read())).decode("latin-1")
tok = plain.split()
for i in range(0, len(tok) - 1, 2):
    print(tok[i], tok[i + 1])
```

<img src="/images/codebreaker-2025/task3-decoded.png" alt="Decoded hosts entries"/>

The key was `0x006f0dbb`, and the plaintext held 74 tokens, an even count, so the "weird token count" warning never fired. The result is 37 hosts entries pointing software update and package mirrors (PyPI, kernel.org, Debian, Ubuntu, Fedora, Arch, Alpine, NixOS and more) at three attacker-controlled addresses. Any machine behind this router that installs or updates software would be silently redirected, which makes this a supply chain attack staged from the network edge.

### Submission

The entries in the order the malware writes them:

```
203.0.113.11 files.pythonhosted.org
203.0.113.161 mirrors.kernel.org
203.0.113.9 repo.almalinux.org
203.0.113.161 mirror.rackspace.com
203.0.113.9 ports.ubuntu.org
203.0.113.9 packages.linuxmint.com
203.0.113.161 mirrors.opensuse.org
203.0.113.9 repos.opensuse.org
203.0.113.161 geo.mirror.pkgbuild.com
203.0.113.9 security.debian.org
203.0.113.9 security.ubuntu.org
203.0.113.9 download1.rpmfusion.org
203.0.113.161 mirrors.rpmfusion.org
203.0.113.161 mirrors.rockylinux.org
203.0.113.9 archive.ubuntu.org
203.0.113.11 pypi.io
203.0.113.9 us.archive.ubuntu.com
203.0.113.9 security.ubuntu.com
203.0.113.9 distfiles.gentoo.org
203.0.113.9 dl.rockylinux.org
203.0.113.9 dl-cdn.alpinelinux.org
203.0.113.161 mirrors.alpinelinux.org
203.0.113.161 xmirror.voidlinux.org
203.0.113.9 cache.nixos.org
203.0.113.9 http.kali.org
203.0.113.9 download.opensuse.org
203.0.113.11 pypi.org
203.0.113.161 mirrors.fedoraproject.org
203.0.113.161 mirror.stream.centos.org
203.0.113.11 pypi.python.org
203.0.113.9 archive.ubuntu.com
203.0.113.9 repo-default.voidlinux.org
203.0.113.9 ftp.us.debian.org
203.0.113.9 deb.debian.org
203.0.113.9 ports.ubuntu.com
203.0.113.9 dl.fedoraproject.org
203.0.113.9 archive.archlinux.org
```

<p align="center">
<img src="/images/codebreaker-2025/badge3.png" alt="Badge" width="300"/>
</p>

**Success!** Three down, four to go.


---

[← Task 2](/posts/nsa-codebreaker-2025-task-2/) · [Series overview](/posts/nsa-codebreaker-2025/) · [Task 4 →](/posts/nsa-codebreaker-2025-task-4/)
