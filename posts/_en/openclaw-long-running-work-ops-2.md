---
title: "Configuring OpenClaw to run multi-day work end-to-end (2): Telegram + Cron (announce) + Heartbeat + Notion"
date: 2026-03-03
lang: "en"
excerpt: "A practical setup for multi-day work: ask on Telegram when blocked (Waiting approval), send daily reports on a fixed schedule (Cron isolated + announce), and resume reliably by reconstructing state from Notion on each heartbeat. Includes copy-paste prompts and message templates."
tags: ["openclaw", "ops", "automation", "notion", "telegram", "cron", "heartbeat"]
series: "OpenClaw Long-running Work"
series_no: 2
---

This post is practical: how to configure a workflow where

- if there’s an issue → OpenClaw asks on Telegram and waits
- if there’s no issue → OpenClaw sends a scheduled progress report
- every time it “wakes up” → it reconstructs state from Notion and resumes

---

## Roles

- **Notion**: durable source of truth (status / evidence / next action)
- **Heartbeat**: periodic wake-up to restore state and resume
- **Cron (isolated + announce)**: scheduled report sender to Telegram
- **Telegram**: the collaboration surface (approval questions + reports)

---

## The key rule (waiting is enforced)

If Status = **Waiting approval** (or Brake? = true), do not proceed.
Only send one approval question and wait for the user reply.

---

## Recommended: let OpenClaw register Cron via a copy-paste prompt

Instead of having readers assemble cron CLI commands, provide a prompt that asks OpenClaw to:

- ask up to 3 clarifying questions
- create an isolated cron job
- announce the report to Telegram
- confirm registration + next run time

(See the Korean version for the full copy-paste prompt block and message examples.)
