---
title: "NSA Codebreaker 2025 — Task 4: Unpacking Insight"
subtitle: "Understanding an obfuscated Linux sample"
date: "2026-10-03T00:04:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "malware analysis"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

Task 4 was the highlight of my first Codebreaker Challenge. The fictional investigation supplied an **obfuscated executable** and asked for the path of a file written by the malware.

### Looking beyond the outer executable

Initial identification showed a stripped, 64-bit Linux ELF executable. The sample contained multiple anti-debugging checks, including debugger detection and a deliberate crash condition. That explained why simply running it under a debugger did not immediately reveal its behavior.

The important analytical distinction was between the outer program and the payload it concealed. Understanding the wrapper was necessary, but it was not the final objective.

### Observing the unpacked program

In the challenge analysis, I used **GDB** to observe system calls and inspect the relationship between writes, buffers, and file descriptors. One write involved a **memory-backed file**, rather than an ordinary file on disk. The recovered content was another ELF object.

That changed where I focused the reverse engineering. The unpacked object contained the behavior needed to answer the task, while the original executable had largely been hiding it.

### Recognizing the encrypted path

Analysis of the recovered payload revealed an **RC4-based routine** protecting a file path. Understanding the cipher initialization and its use in the program allowed the path to be recovered:

```text
/opt/dafin/intel/ops_brief_redteam.pdf
```

The answer came from connecting the program's behavior to the encrypted data, rather than searching for a readable filename in the original sample.

### What I took away

This task made static and dynamic analysis feel complementary. Static analysis helped explain the program's structure; observing execution clarified what data was being created and where it went.

It also showed why disk artifacts alone can give an incomplete picture. A memory-backed payload can be central to the behavior even when it is not available as a conventional file. For defenders, process and memory evidence can be as important as the original executable.

---

Based on my [Task 4 repository notes](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025/blob/main/task4.md).

[← Task 3](/posts/nsa-codebreaker-2025-task-3/) · [Series overview](/posts/nsa-codebreaker-2025/) · [Task 5 →](/posts/nsa-codebreaker-2025-task-5/)
