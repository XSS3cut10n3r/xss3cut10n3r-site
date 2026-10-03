---
title: "NSA Codebreaker 2025 — Task 2: The Hunt Continues"
subtitle: "Tracing inconsistent DNS responses back to a router"
date: "2026-10-03T00:02:00+01:00"
draft: false
featured: false
tags: ["NSA Codebreaker 2025", "ctf", "network forensics"]
---

[← Series overview](/posts/nsa-codebreaker-2025/)

Task 2 moved from a workstation image to **network evidence**. The supplied packet capture contained roughly 2,400 packets, and the objective was to identify every IP address assigned to the malicious device.

### Building a picture of the network

I opened the capture in **Wireshark** and found FTP traffic carrying three router configuration backups. Those backups would become important later: traffic could help identify the suspicious device, while its configuration could explain all of its interfaces.

I also used **PcapXray** to visualize the network. The diagram helped organize the investigation, but I still needed packet-level evidence to distinguish the routers.

### Comparing DNS answers

Filtering for DNS reduced the capture to 36 packets, including 19 responses. The important anomaly was not simply an unfamiliar address: it was **conflicting answers associated with the same DNS transaction**.

Responses for `archive.ubuntu.com` from two routers contained expected Ubuntu mirror addresses. A response associated with the third router instead returned `203.0.113.108`.

My original notes called out that address as belonging to a documentation range. In a fictional challenge capture, that fact alone is not proof of malicious activity. The stronger evidence was the disagreement between answers to the same query, considered alongside the device configuration.

### Identifying all interfaces

The suspicious router's configuration backup listed three addresses:

| Interface | Address |
| --- | --- |
| LAN | `192.168.3.254` |
| Connection to the neighboring router | `192.168.5.1` |
| Loopback | `127.7.5.3` |

Submitting all three completed the task. Stopping at the address visible in the suspicious response would have left the answer incomplete.

### What I took away

This was an exercise in correlating evidence. Packet analysis pointed to a device; configuration data established its full identity. Looking back, I could have reached the anomaly sooner by filtering systematically instead of manually inspecting so much traffic.

---

Based on my [Task 2 repository notes](https://github.com/XSS3cut10n3r/My-NSA-Codebreaker-2025/blob/main/task2.md).

[← Task 1](/posts/nsa-codebreaker-2025-task-1/) · [Series overview](/posts/nsa-codebreaker-2025/) · [Task 3 →](/posts/nsa-codebreaker-2025-task-3/)
