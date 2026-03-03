---
title: "Configuring OpenClaw to run multi-day work end-to-end (1): How it works internally"
date: 2026-03-03
lang: "en"
excerpt: "For multi-day tasks like ‘build a household ledger’, you don’t win with a single prompt. You win with an operating model: record → resume → approvals → scheduled reports. Part 1 explains what actually happens internally and where the user should intervene."
tags: ["openclaw", "ops", "automation", "notion", "telegram"]
series: "OpenClaw Long-running Work"
series_no: 1
---

> Series: OpenClaw Long-running Work
> - Part 1 ✅ (this): Internal operating model
> - Part 2: Practical setup (Telegram + Cron + Heartbeat + Notion)

People want: “Give one topic, and the agent plans/designs/builds it.”

Real work is multi-day:

- requirements are incomplete at the start
- decisions branch
- the agent must wait for user confirmation
- the next day, it must reconstruct “where we left off”

This post explains the internal operating model that makes that possible.

---

## The 4 pieces you must pin down

1) **Record**: what’s done, what evidence exists
2) **Resume**: what the next action is
3) **Approval / Brake**: when to stop and ask
4) **Scheduled report**: how to share progress when nothing is blocked

Without these, you either:

- spam the user with questions (work stalls), or
- run ahead without confirmation (rework explodes)

---

## Why Notion matters: “resume vs restart”

Chat is ephemeral. For multi-day work, the agent needs a durable source of truth:

- current Status
- next action
- evidence links
- blocked reason + whose reply is needed

That’s why a Notion board/database (as an ops board) is so effective.

---

## Why Telegram messages should be two kinds

- **Approval questions** (only when Status=Waiting approval)
- **Scheduled reports** (at a fixed time when nothing is blocked)

Part 2 shows how to implement this using Heartbeat + Cron (isolated + announce) + Notion.
