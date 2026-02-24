---
title: "Understanding OpenClaw Profiles in One Go: Split Work vs Personal Assistants on One PC"
date: 2026-02-23
lang: "en"
excerpt: "If you run work and personal in one assistant, it eventually gets mixed. This post shows a simple setup: two Telegram chats + two assistants (two OpenClaw profiles) to reduce mistakes and review fatigue."
tags: ["openclaw", "ops"]
series: "OpenClaw Ops"
series_no: 1
---

> Language: **English** | [한국어](/ko/posts/openclaw-profiles-work-personal)

> Series: OpenClaw Ops
> - Part 1 ✅ (this post)

Sometimes the best improvement isn’t “make the assistant smarter.”
It’s “make the assistant less likely to do something you’ll regret.”

If you put *work* and *personal* into a single assistant, it eventually gets mixed.
Once it’s mixed, you start reviewing everything more often — and the assistant turns from a helper into something you need to babysit.

---

## One‑sentence summary

In OpenClaw, a **profile** is not a “tone setting.” It’s a switch that separates an assistant’s **memory / logins / rules / workspace**.
If you split work vs personal into two profiles, you reduce cross‑talk, mistakes, and review fatigue.

---

## A concrete example: two Telegram chats (“Work” / “Personal”)

The most intuitive setup for real users isn’t “use two apps.”
It’s “use two chats in Telegram.”

- **Work chat (Work assistant):** meetings, docs, work links, work tools
- **Personal chat (Personal assistant):** daily life, personal plans, private notes

> Key point: you don’t need to remember tags.
> You reduce mistakes simply by **picking the right chat**.

```plain text
[Work chat] (Work assistant)
Me: I have a 2pm meeting today. Summarize last week’s decisions + links + my action items.
Assistant: (collect links → summarize → checklist)

[Personal chat] (Personal assistant)
Me: Give me 3 dinner ideas. If possible, use what’s already in my fridge.
Assistant: (simple options + shopping list)

Point: same person, same day — but different chats reduce the chance of memory/rules/permissions getting mixed.
```

### The “Work” moment that actually saves time: a 10‑minute meeting prep routine

When an assistant becomes genuinely useful at work, it’s usually **right before a meeting**:
links are scattered, decisions are unclear, and you still need to send messages.

1. Collect meeting links/materials in one place
2. Compress the situation into 5 lines (context / issues / decision points)
3. Create 5 questions to ask today
4. Turn notes into action items with priority + due dates

> If you standardize a repeatable routine like “meeting prep,” the assistant gets faster the more you use it.

```plain text
Help me prepare for a meeting.

- Title: {meeting title}
- Time: {time}
- Attendees: {people/team}
- My goal: {1–2 decisions I need}
- Reference links/files: {links}

Output in this order:
1) 5-line summary (context/issues/decision points)
2) 5 questions to confirm in the meeting
3) 5 action items (include priority + due date)
4) 1 short message draft I can send before the meeting
```

### Copy‑paste prompts (Work)

- “Prepare today’s meeting(s). Collect links, then write a 5‑line summary + 5 questions.”
- “Write a short, clear pre‑meeting message I can send.”
- “Turn meeting notes into action items with owner / priority / due date.”

### Copy‑paste prompts (Personal)

- “Make a grocery list. Ask what’s already in my fridge first.”
- “Create a checklist to review my monthly fixed expenses.”
- “Make a travel packing checklist: 3 days before / the day before / the day of.”

---

## 1) What goes wrong when work + personal share one assistant

- **Context leaks:** personal gets handled in a work tone, and vice‑versa
- **Permissions expand:** work tools/permissions become available in personal chats
- **Review fatigue:** you end up checking more often what the assistant did

---

## 2) The fix: two assistants = two profiles

“Two assistants” here is not a metaphor — it means **two OpenClaw profiles**.
Different profiles mean the assistant’s state is separated by default.

```plain text
# conceptually, you run them separately
openclaw --profile work     gateway --port 18789
openclaw --profile personal gateway --port 19001

# and each profile is connected to a different Telegram bot (two chats)
```

---

## 3) What a profile actually separates (plain language)

- **Memory/records:** chat history and “what happened” logs
- **Logins/credentials:** which accounts the assistant can access
- **Rules:** what can run automatically vs what must ask for confirmation
- **Workspace:** the assistant’s working folder and skill files

---

## 4) Benefits you’ll feel (not just theory)

1. Fewer mistakes: your personal assistant is less likely to affect work conversations
2. Lower review load: it’s obvious which assistant did what
3. Better privacy: personal context is less likely to leak into work flows
4. Easier maintenance: if work gets messy, personal doesn’t break too
5. Easy to extend: you can add more assistants later (finance, travel, etc.)

---

## 5) Why “two profiles + two Telegram chats” beats other approaches

- **One assistant + tags:** simplest, but one forgotten tag can cause a mistake
- **Multiple agents inside one Gateway:** lighter, but major failures can still be shared
- **VM/Docker full isolation:** powerful but heavy (setup + cost + maintenance)

Profiles are the sweet spot for most people.

---

## 6) 10‑minute setup guide (WorkBot + PersonalBot + two profiles)

This is intentionally minimal. You only need two things:
(1) **two Telegram bots**, and (2) **two OpenClaw profiles**.

> Tip: keep two terminal windows open (one for work, one for personal).

### 1) Create two Telegram bots (WorkBot / PersonalBot)

1. Open Telegram and message **@BotFather**
2. Run `/newbot` twice (create two bots)
3. Copy each bot token somewhere safe (WorkBot token / PersonalBot token)

### 2) Create two OpenClaw profiles (work / personal)

```bash
openclaw --profile work setup
openclaw --profile personal setup
```

### 3) Connect each profile to its bot token

```bash
openclaw --profile work config set channels.telegram.enabled true
openclaw --profile work config set channels.telegram.botToken "<WORK_BOT_TOKEN>"

openclaw --profile personal config set channels.telegram.enabled true
openclaw --profile personal config set channels.telegram.botToken "<PERSONAL_BOT_TOKEN>"
```

### 4) Run both assistants (two terminals)

```bash
## Terminal A (Work)
openclaw --profile work gateway --port 18789

## Terminal B (Personal)
openclaw --profile personal gateway --port 19001
```

> Tip: keep ~20 ports of spacing to avoid conflicts with derived ports.

### 5) (First time only) approve pairing if the bot doesn’t reply

1. Send a DM to each bot once (e.g., “hi”)
2. Check pairing code:

```bash
openclaw --profile work pairing list telegram
```

3. Approve:

```bash
openclaw --profile work pairing approve telegram <CODE>
```

Repeat once for the personal profile.

### 6) Pin the two chats

Pin both chats in Telegram:
- Work chat (WorkBot DM)
- Personal chat (PersonalBot DM)

Now the “rule” is simple: **work in the work chat, personal in the personal chat**.

---

## FAQ

- **Isn’t running two assistants annoying?**
  - After the initial setup, it’s usually *less* annoying than constantly reviewing one mixed assistant.

- **Can my personal assistant see my work content?**
  - With separate profiles, the default state/history is separated, which greatly reduces mixing.

- **Does it cost more?**
  - Usage may increase. The goal is to reduce mistakes and review overhead (total fatigue goes down).
