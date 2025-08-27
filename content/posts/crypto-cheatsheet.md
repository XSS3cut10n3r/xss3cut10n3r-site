---
title: "Crypto Cheatsheet for CTFs"
subtitle: "A useful cryptography cheatsheet"
date: 2025-08-27
tags: ["crypto", "cheatsheet", "ctf"]
featured: false
draft: false
---
Cryptography challenges are one of the most common categories in Capture the Flag (CTF) competitions. This guide provides a focused overview of essential algorithms, how to recognize them, common weaknesses exploited in CTFs, and practical resources for practice.

---

## Core Algorithms

### RSA
RSA is an asymmetric encryption algorithm based on modular arithmetic with large primes.

- **Key structure**  
  - Public key: `(n, e)`  
  - Private key: `d`, where `ed ≡ 1 (mod φ(n))`  
  - Encryption: `c = m^e mod n`  
  - Decryption: `m = c^d mod n`  

- **Clues in challenges**  
  - Large integer values, often labeled `n`, `e`, `d`, `p`, `q`.  
  - Small exponents such as `e = 3`.  
  - Modulus values that are not very large (easy to factor).  

- **Common attacks**  
  - Factoring `n` into `p` and `q` when too small.  
  - Broadcast attack when the same message is sent to multiple recipients with small `e`.  
  - Wiener’s attack if the private key `d` is too small.  
  - Common modulus attacks when the same `n` is reused across different keys.  

- **Tooling**  
  - [RsaCtfTool](https://github.com/RsaCtfTool/RsaCtfTool) automates many known attacks.

---

### AES
AES is a symmetric cipher often encountered in ECB or CBC mode.

#### AES-ECB (Electronic Codebook)
- Encrypts each block independently.  
- Easy to spot because identical plaintext blocks lead to identical ciphertext blocks.  
- Often leaks patterns in images or structured data.  

#### AES-CBC (Cipher Block Chaining)
- Each block is XORed with the previous ciphertext block before encryption.  
- Requires an initialization vector (IV).  
- Ciphertexts are usually a multiple of the block size.  
- Challenges may involve padding oracle attacks or IV reuse.

#### Example

```python
SBOX = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
]

RCON = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1B,0x36]

def sub_bytes(s): return [SBOX[b] for b in s]

def shift_rows(s):
    return [
        s[0], s[5], s[10], s[15],
        s[4], s[9], s[14], s[3],
        s[8], s[13], s[2], s[7],
        s[12], s[1], s[6], s[11]
    ]

def xtime(a): return ((a<<1)^0x1B)&0xFF if a&0x80 else (a<<1)
def mix_single_column(col):
    t = col[0]^col[1]^col[2]^col[3]
    u = col[0]; col[0]^=t^xtime(col[0]^col[1])
    col[1]^=t^xtime(col[1]^col[2])
    col[2]^=t^xtime(col[2]^col[3])
    col[3]^=t^xtime(col[3]^u)
def mix_columns(s):
    for i in range(4): mix_single_column(s[i*4:(i+1)*4])
    return s

def add_round_key(s,k): return [a^b for a,b in zip(s,k)]

def key_expansion(key):
    Nk, Nr = 4, 10
    w = [list(key[i:i+4]) for i in range(0,16,4)]
    for i in range(Nk, 4*(Nr+1)):
        temp = w[i-1][:]
        if i%Nk==0:
            temp = temp[1:]+temp[:1]
            temp = [SBOX[b] for b in temp]
            temp[0] ^= RCON[i//Nk - 1]
        w.append([a^b for a,b in zip(w[i-Nk],temp)])
    return [sum(w[4*i:4*i+4],[]) for i in range(Nr+1)]

def aes_encrypt_block(block,key):
    state = list(block)
    round_keys = key_expansion(list(key))
    state = add_round_key(state, round_keys[0])
    for r in range(1,10):
        state = sub_bytes(state)
        state = shift_rows(state)
        state = mix_columns(state)
        state = add_round_key(state, round_keys[r])
    state = sub_bytes(state)
    state = shift_rows(state)
    state = add_round_key(state, round_keys[10])
    return bytes(state)

plaintext = b"ABCDEFGHIJKLMNOP"    # 16 bytes
key       = b"thisisasecretkey"   # 16 bytes (AES-128)
cipher    = aes_encrypt_block(plaintext, key)
print(cipher.hex())
```

---

## Common CTF Crypto Patterns

- Flags often follow formats like `CTF{...}`, which can help in known-plaintext scenarios.  
- Key reuse across ciphertexts can allow XOR analysis.  
- Small RSA exponents (`e = 3`) can lead to direct root extraction if the plaintext is small.  
- Small primes allow for easy factorization of RSA moduli.  
- Padding issues in AES frequently lead to oracle-style attacks.  
- Images encrypted with ECB will show visible repeated patterns.

---

## Tools

- [CyberChef](https://gchq.github.io/CyberChef/) - versatile tool for conversions, encodings, and ciphers.  
- [CacheSleuth MultiDecoder](https://www.cachesleuth.com/multidecoder/) - automated format and cipher detection. Easily my favorite tool.  
- [dCode](https://www.dcode.fr/en) - classical cipher solvers and crypto utilities.  
- [RsaCtfTool](https://github.com/RsaCtfTool/RsaCtfTool) - specialized RSA attack tool.  

---

## Further Practice

- [HackTheBox](https://www.hackthebox.com/) - their labs have a ton of modern crypto challenges but they're quite hard!  
- [CTFtime.org](https://ctftime.org/) - event listings, writeups, and past problems.  
- [CryptoHack](https://cryptohack.org/) - puzzle-based platform for learning cryptography step by step.  
- [picoCTF](https://picoctf.org/) - beginner-friendly competitions with accessible crypto challenges.  
- [OverTheWire Krypton](https://overthewire.org/wargames/krypton/) - practice classical cryptography problems.  
