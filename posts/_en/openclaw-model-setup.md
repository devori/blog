---
title: "OpenClaw model setup: start free, scale smart with failover"
date: "2026-02-10"
lang: "en"
excerpt: "Use Gemini’s free tier for day-to-day, and automatically fail over to Claude only when you need it. A practical setup for balancing quality and cost."
tags: ["openclaw"]
---

> Language: **English** | [한국어](/ko/posts/openclaw-model-setup)

When you start using an AI assistant seriously, you run into one unavoidable problem:
**quality vs cost**.

Top-tier models (e.g. Claude Opus) are great — and expensive.
Free models are cheap — but sometimes you get a “is this really the best?” answer.
Manually switching models all the time is also annoying.

OpenClaw’s **failover** solves this cleanly:
use a free model for most requests, and automatically bring in a premium model only when it matters.

## Install & basics (do this first)

This post focuses on “Primary/Fallback model setup,” but you need OpenClaw installed and the Gateway running first.

### 1) Install

On Node **22+**, the simplest path is: install the CLI, then run the onboarding wizard.

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

- This installs the Gateway (daemon) so it keeps running in the background.
- On macOS, OpenClaw.app (menu bar app) is convenient for system permissions (notifications/screen access).

### 2) Connect a channel (e.g. Telegram)

OpenClaw shines when it replies in the channels you already use.

- For Telegram: create a bot via BotFather, set the token, then approve pairing.
- The official guide is the safest source for exact steps: https://docs.openclaw.ai/start/getting-started

### 3) Prepare provider auth (Gemini / Claude)

To use model providers you need credentials:

- Gemini: API key
- Claude (Anthropic): token / plan (paid)

Once these are ready, you can set up automatic model switching.

## Why connect multiple models?

With a single model you eventually hit pain.

**If you use only a free model:**
- rate limits can make you suddenly unable to get responses
- quality can drop on complex coding or long-document tasks
- you end up fighting “try again later” messages

**If you use only a paid model:**
- you pay for trivial questions (“what’s the weather?”)
- end-of-month bills surprise you
- cost anxiety reduces your actual usage

With multiple models, you can get both:
free for normal conversation, premium power only for hard moments.

## Gemini free tier is more generous than you think

Google Gemini’s free tier is fairly friendly for personal use.

- **RPM**: 15 requests per minute
- **RPD**: 1,500 requests per day
- **TPM**: 1,000,000 tokens per minute

1,500/day is plenty for one person.
But **15 RPM** can be tight in workflows that call tools repeatedly.
That’s where failover is valuable.

## Claude Opus as the “backup you actually trust”

When Gemini is rate-limited, or you hit a genuinely hard problem, you want a strong fallback.

**Typical pricing (example):**
- Input: $5 / MTok
- Output: $25 / MTok

It looks expensive, but if used only as a fallback, monthly cost can be small.
And Opus tends to shine on:
- complex refactors
- nuance-heavy writing
- multi-constraint analysis

## Setup: 3 minutes

Open the OpenClaw config and edit only the model section.

**Config path:** `~/.openclaw/openclaw.json`

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "google/gemini-3-flash-preview",
        "fallbacks": ["anthropic/claude-opus-4-5"]
      }
    }
  }
}
```

Two keys matter:

- `primary`: default model
- `fallbacks`: backup models (in order)

You can chain multiple fallbacks:

```json
"fallbacks": ["anthropic/claude-sonnet-4", "anthropic/claude-opus-4-5"]
```

So you try Gemini → Sonnet → Opus, maximizing cost efficiency.

## How it feels: you don’t have to think about it

After setup:

1. Gemini handles most requests
2. if rate-limited / error / outage happens
3. OpenClaw automatically switches to the next fallback
4. when the primary recovers, it returns

From a user’s perspective it’s usually just “responses got slightly slower,” not a hard stop.

## Practical token/cost tips

### 1) Use compaction

Long chats grow context, and context grows tokens.
Compaction summarizes older history to keep context size under control.

```json
"compaction": {
  "mode": "safeguard"
}
```

### 2) Start a new session when the topic changes

If you jump to a totally new topic in the same session, old context keeps consuming tokens.

When the topic changes, use `/clear` (or start a new session) to reset context.

### 3) Prompt caching (Claude)

On Claude, repeated system prompts can be cached and reused.
Done right, this can reduce cost dramatically.

OpenClaw typically uses a short cache by default.
For long sessions, you can extend retention:

```json
"models": {
  "anthropic/claude-opus-4-5": {
    "params": { "cacheRetention": "long" }
  }
}
```

## What a week might look like

With this setup:

- Gemini: ~200–300 requests/day
- Opus fallback: 3–5 times/week (mostly rate limits)
- weekly cost: often under $1

Three minutes of setup, benefits you feel every day.
