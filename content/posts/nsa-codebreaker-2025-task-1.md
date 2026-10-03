---
title: "NSA Codebreaker 2025 — Task 1: Getting Started"
subtitle: "Finding a suspicious artifact in an EXT2 image"
date: "2026-10-03T00:01:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "forensics"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

The investigation began with a development workstation whose tools were failing tests and whose antivirus was flagging unexpected files. The challenge supplied a zipped **EXT2 filesystem image** and asked for the SHA-1 hash of a suspicious artifact.

### Following the evidence

I mounted the image read-only before exploring it. That kept the evidence intact and let me investigate without changing the filesystem.

The root user's shell history gave me a starting point. It contained repeated local service checks, network probing, USB mounting, and crontab edits. Those entries suggested several lines of inquiry, but the history alone did not prove what had happened. I used references to a local application as a way to narrow the filesystem search.

That search led to an unusual file under the **terminfo directory**. Its content referenced an application path, which was inconsistent with the terminal capability data I expected to find there. The mismatch between its location and its contents made it a stronger candidate than its unfamiliar filename alone.

### The result

The artifact was `/etc/terminfo/s/nsuvzemaow`. Its SHA-1 hash was:

```text
0068e0c3cba711e775fa374b201d5d04ffcef96c
```

Submitting that hash completed my first Codebreaker task.

### What I took away

The useful sequence was preservation, context, a focused search, and identification. Shell history gave me leads; examining the artifact gave those leads substance. Hashing then provided a precise way to identify the file.

This task also established the pattern for the rest of the challenge: each answer was an investigative handoff. Finding a suspicious file on the workstation set up the next question—what was happening on the network?

---

Based on my [Task 1 repository notes](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025/blob/main/task1.md).

[Series overview](/posts/nsa-codebreaker-2025/) · [Task 2 →](/posts/nsa-codebreaker-2025-task-2/)
