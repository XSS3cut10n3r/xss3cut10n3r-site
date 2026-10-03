---
title: "NSA Codebreaker 2025 — Task 5: Putting It All Together"
subtitle: "The investigative handoff from malware to infrastructure"
date: "2026-10-03T00:05:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "cryptanalysis"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

Task 5 asked the investigation to move beyond identifying malware behavior and toward identifying its controller. The objective was to submit the **full URL of the adversary's server**.

### Where it fits in the series

The earlier tasks had built an evidence chain: a suspicious workstation artifact, anomalous network traffic, router memory, and an obfuscated sample. Task 5's title—Putting It All Together—captured the next question: what could those findings reveal about the infrastructure behind the activity?

The repository classifies this task as **cryptanalysis**. Its scenario describes analysts needing more information about who was controlling the malware, rather than another description of the malware itself.

### A gap in my published notes

My `task5.md` currently contains the challenge scenario and requested answer, followed by an unfinished writeup. It does **not** document the cryptanalytic method, recovered URL, or verification steps.

I completed all seven tasks, but that overall result does not supply the missing details for this one. I am leaving the distinction explicit here: this is a summary of the task's objective, not a detailed solution.

### What this gap teaches me

An investigation should preserve the connection between an artifact and the conclusion drawn from it. A final URL would be much more useful to readers if accompanied by the evidence that led to it and an explanation of how it was validated.

This is also why I want the series to distinguish recorded findings from retrospective commentary. The overall challenge taught me to document as I go; the unfinished Task 5 entry shows where that habit still needed work.

The next task continued the fictional investigation through a Mattermost environment, moving the emphasis from malware analysis to application authorization.

---

Based on my [Task 5 repository notes](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025/blob/main/task5.md).

[← Task 4](/posts/nsa-codebreaker-2025-task-4/) · [Series overview](/posts/nsa-codebreaker-2025/) · [Task 6 →](/posts/nsa-codebreaker-2025-task-6/)
