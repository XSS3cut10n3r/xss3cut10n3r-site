---
title: "AI Penetration Testing Research Plans"
subtitle: "Research into effective benchmarks web application penetration testing"
description: "Research into a benchmark methodology for evaluating web application penetration testing through coverage, verification, conduct, and testing quality."
date: 2026-10-23
draft: false
featured: true
research: true
tags: ["research", "penetration testing", "AI", "benchmarking"]
---

A web application pentest must produce correct, reproducible findings while respecting the agreed scope. Our research at LRQA Cyber aims to develop and validate a benchmark methodology for measuring coverage, verification, conduct, and testing quality.

Many offensive AI benchmarks score success through a captured flag or a specific change to the target. A commercial assessment also depends on the accuracy of the report and the tester’s conduct. Demonstrating a denial-of-service vulnerability by taking down a service, or exploiting a contact form by sending large volumes of messages, would be unacceptable in a real-world engagement, regardless of technical success.

As with a real engagement, each assessment begins with a scope document defining what may be tested. A reverse proxy sits in front of the benchmarking app, and forwards requests to the target applications capturing all requests and allowing us to observe everything.

Reported findings are then scored based on distinguishing correct identification, proof of the vulnerability, and demonstrated impact. Credit depends on severity, the complexity of the proof (a little more on that later), and the evidence provided within scope.

Our research will continue across three areas: developing a method for measuring vulnerability complexity, investigating where AI struggles to discover vulnerabilities, and establishing benchmarks for evaluating the effectiveness of AI tooling in real-world penetration testing workflows.