---
title: "NSA Codebreaker 2025 — Task 3: Digging Deeper"
subtitle: "Moving from network evidence to a router memory image"
date: "2026-10-03T00:03:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "reverse engineering"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

After the network investigation identified an edge router, Task 3 asked me to look inside the device. The supplied evidence included a **compressed memory dump**, a **kernel symbol map**, and a **kernel image**.

The objective was to identify anomalous or malicious activity and submit a complete list of affected **IP addresses and fully qualified domain names**.

### What my notes record

My repository records the initial setup: preparing **Volatility** and the supplied kernel material for memory analysis. It describes the investigation as two connected stages—finding the malicious binary and then reverse engineering it—and includes the task completion badge.

The published notes do not contain the intermediate analysis or final indicator list. This post therefore documents the challenge's role in the investigation and the recorded starting point, rather than presenting a reconstructed solution.

### Why the memory evidence mattered

The previous task established suspicious network behavior. A memory image offered a different perspective: the state of the device and the software behind that behavior. The kernel material supplied context needed to interpret the dump rather than treating it as an unstructured collection of bytes.

The requested answer also changed the scope of the investigation. Identifying one suspicious router was no longer enough; the task asked for the affected address-and-domain relationships.

### What I took away

My brief writeup is a reminder that a completion badge is not a substitute for investigative notes. A useful record should preserve how the evidence was interpreted, which findings supported the conclusion, and how the submitted indicators were derived.

My overall reflection on Codebreaker mentions having to backtrack because I had not documented findings consistently. Task 3 is a clear example of that documentation gap in the published series.

---

Based on my [Task 3 repository notes](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025/blob/main/task3.md).

[← Task 2](/posts/nsa-codebreaker-2025-task-2/) · [Series overview](/posts/nsa-codebreaker-2025/) · [Task 4 →](/posts/nsa-codebreaker-2025-task-4/)
