---
title: "NSA Codebreaker 2025: My First Full Challenge"
subtitle: "Seven tasks spanning forensics, reverse engineering, cryptanalysis, and application security"
date: 2025-10-29
draft: false
featured: true
tags: ["NSA Codebreaker 2025", "ctf", "reflection"]
---

The 2025 NSA Codebreaker Challenge was my first Codebreaker, and I completed all seven tasks, becoming one of 82 students to finish the full challenge. It was a chance to connect skills that I had often practiced separately: filesystem forensics, packet analysis, memory analysis, reverse engineering, cryptography, and application security.

The challenge used a fictional investigation into suspicious activity on a military development network. Each task carried the investigation forward, so an answer was more than a flag - it supplied context for the next question.

I've turned my [Codebreaker repository](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025) into this series so that each task has its own post, with this page as the starting point.

### Read the series

| Challenge | Focus |
| --- | --- |
| [1: Getting Started](/posts/nsa-codebreaker-2025-task-1/) | Forensics |
| [2: The Hunt Continues](/posts/nsa-codebreaker-2025-task-2/) | Network Forensics |
| [3: Digging Deeper](/posts/nsa-codebreaker-2025-task-3/) | Reverse Engineering |
| [4: Unpacking Insight](/posts/nsa-codebreaker-2025-task-4/) | Malware Analysis |
| [5: Putting It All Together](/posts/nsa-codebreaker-2025-task-5/) | Cryptanalysis |
| [6: Crossing the Channel](/posts/nsa-codebreaker-2025-task-6/) | Vulnerability Research |
| [7: Finale](/posts/nsa-codebreaker-2025-task-7/) | Android Security |

### The moments that stood out

Task 4 was my favorite. The obfuscated Linux sample pushed me into malware analysis techniques I had not used before. Understanding the layers around the payload, observing its memory-backed behavior, and recognizing how an encrypted path was represented made the problem feel like a puzzle coming together.

Task 6 changed the kind of reasoning I needed. Instead of finding hidden code, I had to notice that an application integration was checking one permission boundary while acting on another. It showed how a subtle authorization mistake can matter more than complicated implementation.

Task 7 brought the pieces together. Reverse engineering the Android application meant following data from an input file through extraction and into the parts of the app that consumed it. The relationship between writable data and dynamically loaded code was the key security lesson.

### What I would do differently

I spent too much time early on trying possibilities before stepping back to understand the mechanism. In Task 2, systematic filtering would have exposed the conflicting DNS responses sooner than manually inspecting traffic.

I also learned to keep better notes. Some of my repository writeups are much more complete than others: Task 3 records only the initial setup and completion, and Task 5's solution is unfinished. Their posts make those limits explicit rather than filling in details from guesswork.

The habit I want to carry forward is simple: record the evidence, explain what it supports, and keep the next investigative question clear.

### Award

Completing all seven tasks earned me an NSA-branded medallion, presented with a letter from the NSA congratulating me on being one of 82 student solvers. It also earned me a $4,500 SANS Institute scholarship in October 2025.

<div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center">
<img src="/images/codebreaker-2025/award-medallion.jpg" alt="NSA medallion in its wooden presentation box" width="300"/>
<img src="/images/codebreaker-2025/award-coin.jpg" alt="Back of the Codebreaker Challenge coin, engraved with hex bytes" width="300"/>
<img src="/images/codebreaker-2025/award-letter.jpg" alt="Congratulations letter from the NSA for completing the 2025 Codebreaker Challenge" width="300"/>
</div>

Start with [Task 1: Getting Started](/posts/nsa-codebreaker-2025-task-1/) or choose a topic from the table above.
