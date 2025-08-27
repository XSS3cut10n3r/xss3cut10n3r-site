---
title: "Cryptography Cheatsheet for CTFs"
subtitle: "Cheatsheet for obtaining fully-interactive shells"
date: 2025-08-27
tags: ["crypto", "cheatsheet", "ctf"]
featured: false
draft: false
---
# Cryptography CTF Cheatsheet

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

---

## Recognizing Cipher Types

- **Classical ciphers**  
  - Caesar / ROT13: simple alphabet shifts.  
  - Vigenère: repeating-key shifts, look for periodic frequency.  
  - Substitution: letter frequency preserved.  
  - Transposition: characters scrambled, but the set of characters remains the same.  

- **Encodings**  
  - Base64: padded with `=`, mix of A–Z, a–z, 0–9, +, /.  
  - Base32: padded with `=`, uses A–Z and digits 2–7.  
  - Base58: excludes easily confused characters like `0`, `O`, `l`, `I`.  
  - Hexadecimal: pairs of characters like `48656c6c6f`.  

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
