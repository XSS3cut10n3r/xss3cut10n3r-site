---
title: "NSA Codebreaker 2025 — Task 7: Finale"
subtitle: "Archive handling and the boundary between data and code"
date: "2026-10-03T00:07:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "android security"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

The final task supplied a **custom Android APK** used to archive chat messages. It brought together application reverse engineering, archive handling, and reasoning about how data moves through a program.

### Starting with the application

I first reviewed the supplied dependency licenses. An old library looked like a promising lead, but my notes make clear that the decisive issue emerged from examining the application's own handling of files.

That was a useful correction to my initial approach. Dependency age can guide investigation, but it does not establish which behavior is responsible for a vulnerability.

### The underlying security problem

At a high level, the app failed to keep archive extraction reliably contained within its intended directory. It also dynamically loaded format-handling code from writable storage. Those behaviors created a dangerous relationship between **untrusted archived data** and **executable application components**.

The impact depended on their interaction. File handling was not merely a storage concern once writable content could influence which code the application loaded.

### Validation in the challenge environment

My original notes record testing with an Android emulator and completing the final challenge. This post focuses on the root cause and lessons from that analysis, rather than reproducing the payload or delivery procedure.

### Defensive implications

Archive processing should resolve and validate extraction destinations, ensuring every output remains inside the intended directory. Applications should also prevent downloaded content from replacing trusted components.

Dynamic code loading requires a separate trust decision: a writable cache is not inherently a trusted source of executable code. Keeping executable components separate from untrusted content, and verifying their provenance, reduces the risk that an input file can cross that boundary.

### What I took away

Task 7 reinforced the value of tracing the full execution flow. A file's name, extraction destination, overwrite behavior, and eventual use all mattered to the application's security.

Finishing the challenge brought the investigation full circle—from a suspicious filesystem artifact to understanding how an application could turn untrusted content into execution.

---

Based on my [Task 7 repository notes](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025/blob/main/task7.md).

[← Task 6](/posts/nsa-codebreaker-2025-task-6/) · [Series overview](/posts/nsa-codebreaker-2025/)
