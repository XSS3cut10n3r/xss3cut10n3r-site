---
title: "Fireplace: Building a Secure, Open-Source Chat App"
subtitle: "Private by default, ready for post-quantum, and designed to be checked by anyone"
description: "Why we are building Fireplace, an end-to-end encrypted, open-source messenger with hybrid post-quantum cryptography, no phone number and no tracking, and what makes it different."
date: 2026-10-05
draft: false
featured: true
pinned: true
tags: ["fireplace", "cryptography", "open source", "privacy", "post-quantum"]
---

![fireplace. banner: the orange flame mark next to the lowercase wordmark on a cream background](/images/fireplace/fireplace-banner.webp)

**fireplace.** is an end-to-end encrypted chat app that we are building in the open: a messenger for the people you actually talk to, where your conversations stay between you and them. It is free, it has no ads and no tracking, and it is licensed under the AGPL-3.0 so that the way it protects a conversation is something anyone can read, question and improve.

It is in active development, iOS first and then Android. This post is about the goal, what makes the app different, and why we are doing it.

## The goal

A private conversation should be the default, not a feature you have to hunt for and not something you have to take on trust. So the goal is simple to say and hard to do well: **a messenger that is secure, open source, and pleasant enough that people choose it for everyday chats.**

That means three things at once:

- **Secure.** Messages are encrypted on your phone and can only be opened on the phone of the person you sent them to. The server in the middle only ever handles ciphertext.
- **Open.** The code is AGPL-3.0 licensed and the design decisions are written down as we make them: why this algorithm, why this limit, what the server can and cannot see. Security you cannot inspect is just a promise.
- **Familiar.** If you have used a chat app before, you already know how to use this one. The chat list, the bubbles, long-press for actions, forward, mute, unread badges and search all work the way you expect, so privacy does not cost you convenience.

## What makes it special

**Built for the computers of the future.** Every message you send today can be recorded and stored. A large quantum computer, if one arrives, could break the encryption most apps use now and read the old recordings. Fireplace protects the key exchange with a hybrid of a classic algorithm (X25519) and a post-quantum one (ML-KEM-768), and signs identities the same way (Ed25519 together with ML-DSA-65). An attacker has to break both. On top of that, a double ratchet changes the encryption keys with every message, so one stolen key never exposes the rest of the conversation, and the session heals itself afterwards.

**No phone number, no email.** You sign up with a username and a password, and join with an invite from someone you know. We do not ask for the one identifier that follows you everywhere, so there is nothing of that kind to leak, sell or be forced to hand over.

**You decide who can write to you.** A stranger cannot just drop messages into your chat. They send a request, you see nothing they wrote until you accept, and you can block or report them in a tap.

**You can verify who you are talking to.** Compare safety numbers or scan a QR code in person. If a contact's keys ever change, Fireplace tells you and holds the conversation until you have reviewed it, instead of quietly carrying on.

**Private on your own phone, too.** Search across all your conversations, unread counts and notification previews are worked out on your device from your encrypted local history. They need no extra data on the server, so they cannot leak from it. There are no read receipts, no typing indicators and no "last seen", on purpose: those small cues say a lot about you.

**A server that knows as little as possible.** It has to route messages, so metadata is the hard part of any messenger. We keep what it can see to the minimum, write down exactly what that is in the threat model, and delete encrypted messages from the server after 30 days.

**Free, with no tracking.** No ads, no analytics, no data selling, and no third-party code that phones home. We would rather stay small and trustworthy than grow by watching people.

<p style="text-align:center"><img src="/images/fireplace/fireplace-flame.webp" alt="The fireplace. flame mark" width="96" height="114"></p>

## Why we are doing this

I work in offensive security and cryptography, and the longer I do it the more the same thing stands out: most of what makes a communication tool trustworthy is invisible to the person using it. You cannot see the key exchange. You cannot check the code. You are asked to believe. I wanted to build something where belief is not required, where the claims are specific enough to be tested and the code is there to be read.

Three reasons keep coming back:

1. **Privacy should not depend on technical skill.** The people who most need a private channel are rarely the ones who will configure one. It has to work properly out of the box, for everyone.
2. **The cryptography is ready; the defaults are not.** Hybrid post-quantum key exchange and a proper double ratchet are well understood now. There is no good reason for everyday chat to wait for them.
3. **Open and honest beats closed and polished.** A small project can win trust the old-fashioned way: by explaining itself, showing its work and fixing what is found. We would rather be checked than be trusted.

It is also, plainly, an excellent thing to build. Cryptographic protocols, careful state handling, hostile input, usability under pressure: it touches everything that makes security engineering interesting.

## Where it is now

The core is built and heavily tested: the handshake and ratchet, device linking and recovery, safety numbers, requests, blocking and reporting, and the chat screens themselves. The next steps are testing on real phones, a first small beta, and an independent look at the cryptography and the app. The project is licensed AGPL-3.0 from the start and is in a private early beta while it gets there; the design notes and threat model are written as we go so they are ready to share.

More will follow here as it takes shape: the protocol decisions, the things that went wrong along the way, and what we learn from building it.
