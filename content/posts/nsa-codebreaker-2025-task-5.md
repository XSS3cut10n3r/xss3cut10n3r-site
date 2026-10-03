---
title: "NSA Codebreaker 2025 - Task 5: Putting It All Together"
subtitle: "The investigative handoff from malware to infrastructure"
date: "2026-10-03T00:05:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "cryptanalysis"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

## Task 5 - Putting It All Together - (Cryptanalysis)

> NSA analysts confirm that there is solid evidence that this binary was at least part of what had been installed on the military development network. Unfortunately, we do not yet have enough information to update NSA senior leadership on this threat. We need to move forward with this investigation!

> The team is stumped - they need to identify something about who was controlling this malware. They look to you. "Do you have any ideas?"

---

## Task

Submit the full URL to the adversary's server

---

## Writeup

This task is unusual: it ships no new files. Everything needed is already in hand, the packet capture from Task 2 and the implant we unpacked in Task 4. The goal is to read the one conversation in that capture we could never make sense of, because it was encrypted, and pull the adversary's server URL out of it.

The short version: the malware's author rolled their own encryption on top of AES and made three mistakes. Any one of them would have been bad. Together they let a laptop recover the secret keys in under a minute and read every message.

### The conversation we could not read

Back in Task 2 I flagged one TCP conversation between the infected host and an outside server that started with the odd marker bytes `de c0 de c0 ff ee`. Following that stream shows a tidy back-and-forth of seven messages:

<img src="/images/codebreaker-2025/task5-flow.png" alt="The seven-message C2 handshake in the Task 2 capture"/>

Cross-referencing this with the `Comms` class in the Task 4 payload, the exchange is a handshake:

1. The server sends an RSA public key in the clear.
2. The client makes up two AES keys, encrypts them with that RSA public key, and sends them back. RSA here is just an envelope: only the server (which holds the matching private key) can open it, so the keys are hidden from anyone watching the wire.
3. The server replies `KEY_RECEIVED` in the clear.
4. From here on both sides talk using those AES keys. There are four encrypted messages left, and the last ones are where the URL lives.

Every message, once decrypted, begins with the same `dec0dec0ffee` marker. Hold onto that fact, it turns out to be the crowbar.

### A two-minute crypto primer

If you already know AES you can skip this. If not, here is everything you need for this task:

- **A symmetric cipher** like AES scrambles data with a secret number called a key. Whoever has the key can scramble (encrypt) and unscramble (decrypt). AES works on 16-byte chunks called blocks.
- The key is normally 128 bits, a number between 0 and roughly 340 undecillion (`2^128`). You cannot guess it by trying every value: even at a billion billion guesses a second you would not finish before the sun burns out. That huge space of possibilities is the entire reason AES is safe.
- **ECB mode** is the simplest way to use a block cipher: chop the message into 16-byte blocks and encrypt each one on its own. It is simple and, as we will see, leaky.
- A **known-plaintext attack** is when you already know what some encrypted message *says*. If you know both the plaintext and its ciphertext, you can test a guessed key by encrypting the plaintext yourself and checking whether you get the matching ciphertext.

The malware's security rests entirely on that `2^128` number being too big to search. All three flaws below chip away at exactly that.

### Flaw 1: the keys are almost entirely zero

Looking at `gen_key` in the payload, it starts out doing the right thing: it reads 32 bytes of real randomness from `/dev/random`. Then it throws nearly all of it away. After a chain of hashing, XORs and bit shifts, the net effect is that only the low 26 bits survive. The finished 16-byte key always looks like this:

```text
XX XX XX 0Y 00 00 00 00 00 00 00 00 00 00 00 00
|__________|  \__ the rest of the key is always zero
  26 bits that actually vary (0Y is only 0x00-0x03)
```

In plain terms: instead of `2^128` possible keys, there are only `2^26`, which is about 67 million. That is not a cryptographic key space, that is a number a laptop chews through in seconds. Both AES keys the malware generates have this same weakness.

### Flaw 2: ECB with no randomization leaks structure

AES-ECB has a well-known property: the same 16-byte input always encrypts to the same 16-byte output under a given key. There is no IV (initialization vector), the random salt that normally makes two identical blocks encrypt differently. Here there is none, so identical plaintext blocks are visible as identical ciphertext blocks.

You can see it directly in the capture. The last 16 bytes of all four encrypted messages are byte-for-byte identical:

```text
msg4 tail: 409a5a9dafac6df2db0a970fb723a1bb
msg5 tail: 409a5a9dafac6df2db0a970fb723a1bb
msg6 tail: 409a5a9dafac6df2db0a970fb723a1bb
msg7 tail: 409a5a9dafac6df2db0a970fb723a1bb
```

That repeated block is padding (explained next), and because ECB leaks it, it hands us a free crib.

### Flaw 3: double encryption that helps the attacker

The author clearly worried that one layer of AES was not enough, so `send_message` encrypts every message twice, first with key 1, then the result again with key 2. The idea is "twice the encryption, twice the safety." It does not work that way when each key only has 26 bits, and it actually leaks a gift.

AES needs messages to be a whole number of 16-byte blocks, so it pads them out using a scheme called PKCS#7. A quirk of that scheme: if the data is *already* a multiple of 16 bytes, it adds a whole extra block of all `0x10` bytes. Because the message is encrypted twice, the second (key 2) layer adds its own padding block on top. That trailing block is therefore just the value `10 10 ... 10` encrypted with key 2 alone. That is the identical tail we saw above, and it is a known-plaintext pair for key 2 by itself.

### The cribs

Putting the flaws together, I have two pieces of known plaintext:

- **For key 2 on its own:** the plaintext `10 10 ... 10` (sixteen `0x10` bytes) encrypts to that repeated tail block `409a5a9d...a1bb`.
- **For both keys together:** from the implant's handshake code, the first encrypted client message is the string `REQCONN`. With the `dec0dec0ffee` marker in front and PKCS#7 padding behind, its first 16-byte plaintext block is exactly `dec0dec0ffee524551434f4e4e030303`, and we can see its ciphertext in the capture.

### The attack

Now the `2^26` key space does all the work. Two quick phases, each a plain brute force:

1. **Recover key 2.** Try all ~67 million candidate keys. For each, decrypt the repeated tail block. The correct key is the one that turns it back into sixteen `0x10` bytes.
2. **Recover key 1.** Peel the key-2 layer off the `REQCONN` ciphertext block to get the value sitting between the two encryptions. Then try all ~67 million candidates again: the correct key 1 is the one that encrypts the known `dec0dec0ffee...REQCONN` block into that middle value.

Each phase is about 67 million AES operations, a few seconds in compiled code. (A [meet-in-the-middle attack](https://en.wikipedia.org/wiki/Meet-in-the-middle_attack) on a single doubly-encrypted block works too, but peeling the layers using the free key-2 crib is simpler.)

Here is the solver in Rust. It links AES from the system's OpenSSL, recovers both keys, then decrypts all four messages:

```rust
// NSA Codebreaker 2025 - Task 5 solver
//
// The implant (unpacked in Task 4) wraps each C2 message in double AES-128-ECB with no IV.
// Its key generator is broken: each 16-byte key is `v` as 4 little-endian bytes followed by
// 12 zero bytes, with v in [0, 2^26) (bytes 0-2 random, byte 3 in 0..=3). That is only 26 bits
// of entropy per key, so the two keys fall to a known-plaintext brute force.
//
// Cribs taken from the Task 2 capture + protocol constants:
//   * every message ends with E_k2(0x10^16): the second encryption layer's PKCS#7 block,
//     encrypted with key 2 only -> recover key 2 directly.
//   * the first application message decrypts to  dec0dec0ffee + "REQCONN" + PKCS#7(0x03) ->
//     once key 2 is known, recover key 1.
//
// AES comes from libcrypto (linked below); no third-party crates.

#[link(name = "crypto")]
extern "C" {
    fn AES_set_encrypt_key(user_key: *const u8, bits: i32, key: *mut AesKey) -> i32;
    fn AES_set_decrypt_key(user_key: *const u8, bits: i32, key: *mut AesKey) -> i32;
    fn AES_encrypt(inp: *const u8, out: *mut u8, key: *const AesKey);
    fn AES_decrypt(inp: *const u8, out: *mut u8, key: *const AesKey);
}

// OpenSSL AES_KEY: unsigned int rd_key[60]; int rounds;  -> 244 bytes. Over-allocate for safety.
#[repr(C)]
struct AesKey {
    rd_key: [u32; 60],
    rounds: i32,
}
impl AesKey {
    fn zero() -> Self { AesKey { rd_key: [0; 60], rounds: 0 } }
}

const MAX: u32 = 1 << 26;

fn key_from_v(v: u32) -> [u8; 16] {
    let mut k = [0u8; 16];
    k[..4].copy_from_slice(&v.to_le_bytes());
    k
}

fn enc_block(key: &[u8; 16], inp: &[u8; 16]) -> [u8; 16] {
    let mut ak = AesKey::zero();
    let mut out = [0u8; 16];
    unsafe {
        AES_set_encrypt_key(key.as_ptr(), 128, &mut ak);
        AES_encrypt(inp.as_ptr(), out.as_mut_ptr(), &ak);
    }
    out
}

fn dec_block(key: &[u8; 16], inp: &[u8; 16]) -> [u8; 16] {
    let mut ak = AesKey::zero();
    let mut out = [0u8; 16];
    unsafe {
        AES_set_decrypt_key(key.as_ptr(), 128, &mut ak);
        AES_decrypt(inp.as_ptr(), out.as_mut_ptr(), &ak);
    }
    out
}

fn unhex(s: &str) -> Vec<u8> {
    (0..s.len()).step_by(2).map(|i| u8::from_str_radix(&s[i..i + 2], 16).unwrap()).collect()
}

// AES-128-ECB decrypt a whole buffer with one key, then strip PKCS#7 padding.
fn decrypt_layer(key: &[u8; 16], data: &[u8]) -> Vec<u8> {
    let mut out = Vec::with_capacity(data.len());
    for ch in data.chunks_exact(16) {
        let mut b = [0u8; 16];
        b.copy_from_slice(ch);
        out.extend_from_slice(&dec_block(key, &b));
    }
    let pad = *out.last().unwrap() as usize;
    if pad >= 1 && pad <= 16 && pad <= out.len() {
        out.truncate(out.len() - pad);
    }
    out
}

fn main() {
    // Cribs and messages from this capture (stream 19).
    let pad_ct = unhex("409a5a9dafac6df2db0a970fb723a1bb");            // E_k2(0x10^16)
    let reqconn_ct = unhex("42703d2f1090e0e0556125071e3b6469");        // first block of msg4
    let reqconn_pt = unhex("dec0dec0ffee524551434f4e4e030303");        // dec0..+REQCONN+PKCS7
    let messages = [
        ("msg4 C->S", "42703d2f1090e0e0556125071e3b6469409a5a9dafac6df2db0a970fb723a1bb"),
        ("msg5 S->C", "eb11c256aafe5abe289cd8f04f7241afb3f5b4ba9ecd9a03e5a7f108aecb18b9409a5a9dafac6df2db0a970fb723a1bb"),
        ("msg6 C->S", "1332db1a443b7ef7f27b1b448002cd10563c504e8963aa3bc46091f5b36678c29fed247b555ba5a3f45e185aa3df8b27409a5a9dafac6df2db0a970fb723a1bb"),
        ("msg7 S->C", "3610982eaa90dbf184bab42e23f7bb17bac652c79d19f17706c66e01f6affc0c9538c9b4c64dd2f68587edd0e6eea7fdc2dabd1252a0136764895a764c5e98e9409a5a9dafac6df2db0a970fb723a1bb"),
    ];

    let pad_pt = [0x10u8; 16];
    let mut pad_ct_a = [0u8; 16]; pad_ct_a.copy_from_slice(&pad_ct);
    let mut rc_a = [0u8; 16];     rc_a.copy_from_slice(&reqconn_ct);
    let mut pt_a = [0u8; 16];     pt_a.copy_from_slice(&reqconn_pt);

    // Phase 1: key 2 from the single-key padding crib.
    let mut v2 = None;
    for v in 0..MAX {
        if dec_block(&key_from_v(v), &pad_ct_a) == pad_pt { v2 = Some(v); break; }
    }
    let v2 = v2.expect("key 2 not found");
    let k2 = key_from_v(v2);

    // Phase 2: key 1.  D_k2(reqconn_ct) == E_k1(reqconn_pt)
    let inter = dec_block(&k2, &rc_a);
    let mut v1 = None;
    for v in 0..MAX {
        if enc_block(&key_from_v(v), &pt_a) == inter { v1 = Some(v); break; }
    }
    let v1 = v1.expect("key 1 not found");
    let k1 = key_from_v(v1);

    println!("key1 = {}", k1.iter().map(|b| format!("{:02x}", b)).collect::<String>());
    println!("key2 = {}", k2.iter().map(|b| format!("{:02x}", b)).collect::<String>());
    println!();

    // Decrypt each message: outer layer k2, inner layer k1.
    for (name, hexmsg) in messages {
        let ct = unhex(hexmsg);
        let inner = decrypt_layer(&k2, &ct);
        let plain = decrypt_layer(&k1, &inner);
        let body = &plain[6..]; // drop dec0dec0ffee header
        println!("{name}: {}", String::from_utf8_lossy(body));
    }
}
```

### Result

Both keys fall out in about 20 seconds, and the messages decrypt cleanly:

<img src="/images/codebreaker-2025/task5-solve.png" alt="Solver output: recovered keys and decrypted messages"/>

The first two decrypted messages are `REQCONN` and `REQCONN_OK`, exactly the handshake plaintext we predicted, which confirms the keys are correct. Then the client asks the server `DATA REQUEST mattermost_url`, and the server answers with the prize:

```text
key1 = 2b086a03000000000000000000000000
key2 = cd914a00000000000000000000000000

msg4 C->S: REQCONN
msg5 S->C: REQCONN_OK
msg6 C->S: DATA REQUEST mattermost_url
msg7 S->C: https://198.51.100.166/mattermost/5wN1amoCUByjy
```

### Submission

The full URL to the adversary's server:

```text
https://198.51.100.166/mattermost/5wN1amoCUByjy
```



---

<p>
<img src="/images/codebreaker-2025/badge5.png" alt="NSA Codebreaker 2025 Task 5 completion badge" width="300"/>
</p>

[← Task 4](/posts/nsa-codebreaker-2025-task-4/) · [Series overview](/posts/nsa-codebreaker-2025/) · [Task 6 →](/posts/nsa-codebreaker-2025-task-6/)
