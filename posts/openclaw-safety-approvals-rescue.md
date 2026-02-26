---
title: "OpenClaw safety ops in one go: prevent accidental deletes + recover with a Rescue profile"
date: 2026-02-25
lang: "en"
excerpt: "Deletion mistakes are expensive, and configuration tangles happen eventually. This post shows a practical safety setup: approvals as brakes (ask/allowlist) and a Rescue profile for recovery."
tags: ["openclaw", "ops", "safety"]
series: "OpenClaw Ops"
series_no: 2
---

> Language: **English** | [한국어](/ko/posts/openclaw-safety-approvals-rescue)

> Series: OpenClaw Ops
> - Part 1: [Split work vs personal assistants with profiles](/posts/openclaw-profiles-work-personal)
> - Part 2 ✅ (this post): safety ops (approvals + rescue)

The more capable your assistant becomes, the bigger the blast radius of a mistake.
And **deletion** is the most expensive kind of mistake — because you usually notice it too late.

This post is a practical “non-scary” guide to OpenClaw safety operations:

- **Approvals as brakes** (to prevent accidental deletes)
- a **Rescue profile** (to recover when things get tangled)

---

## One‑sentence summary

In OpenClaw, safety comes from two layers working together:

1) **Tool policy** (remove tools you don’t need)
2) **Exec approvals** (allowlist + confirmation for host commands)

Use them to make deletion slow and deliberate — and keep a separate Rescue profile so you can diagnose problems without breaking your main assistant.

---

## The failure we’re preventing: “clean Downloads” → disaster

You say: “Clean my Downloads folder (older than 30 days).”
The assistant means well.

But a delete command is one wildcard or misread path away from permanent loss.
The problem isn’t that the assistant is dumb.
The problem is there was **no brake**.

---

## The mental model: allow / ask / deny

Think of these as three buttons:

- **allow**: runs automatically
- **ask**: requires confirmation
- **deny**: cannot run at all

For deletion, **ask should be the default**.
For safe inspection steps (listing files, computing sizes), allow is usually fine.

---

## Two brakes that matter

### 1) Tool policy: remove tools you don’t need

Example rule of thumb:

- Personal assistant profile: if you don’t need `exec`, **deny `exec` entirely**
- Work assistant profile: allow `exec`, but keep it behind strict approvals

If a tool doesn’t exist for an assistant, it can’t be misused.

### 2) Exec approvals: control host commands with allowlists + confirmation

Even if `exec` exists, you can require:

- **allowlist** (only known-safe binaries auto-run)
- **ask** prompts for anything else
- **deny** when no UI is available (so “away from keyboard” means “no destructive action”)

A good default shape:

```plain text
defaults.security = deny
agents.main.security = allowlist
ask = on-miss
askFallback = deny
```

Translation:
- deny by default
- allow only what you explicitly allow
- ask when something new appears
- if approvals UI is unreachable, deny

---

## Accidental-delete patterns (the “big 3”)

Most deletion incidents aren’t “someone clicked delete.”
They happen when the target silently changes.

- **Path confusion:** you meant Downloads, but it touches Desktop/Documents
- **Filter expansion:** “only old files” expands to “almost everything”
- **Same-name files:** a batch contains one important file with a similar name

Your goal isn’t “never delete.”
Your goal is: **every delete goes through list → totals → typed confirmation**.

---

## Deletion safety recipe (local files)

1) **Two-step only:**
   - step 1: print candidates (full path + size)
   - step 2: confirm phrase → then execute
2) Prefer **Trash** over permanent delete
3) Never approve “delete a whole folder” without an explicit list + count
4) Use a typed confirmation phrase including folder + count:
   - `DELETE 12 FILES FROM DOWNLOADS`

---

## Safety checklist (copy/paste)

> Deletion is not “execution.” It’s a confirmation process.

1) Print candidate list (path + size)
2) Print totals (count + total size)
3) Show top-3 largest files (this catches mistakes)
4) Confirm: Trash vs permanent
5) Type the confirmation phrase (count + folder)

Template:

```plain text
(Delete request template)

- Target folder: ~/Downloads
- Criteria: files older than 30 days
- Mode: NO permanent delete; move to Trash
- Output required:
  1) candidate list (file + full path + size)
  2) totals (count + total size)
  3) risks (top-3 largest files)
- Execution condition:
  - run only if I type an exact confirmation phrase
  - the phrase must include count + folder

Example confirmation:
DELETE 12 FILES FROM DOWNLOADS
```

---

## A concrete chat example

```plain text
Me: Clean my Downloads folder (older than 30 days).

Assistant (step 1): I found 12 candidates in ~/Downloads:
- IMG_1023.png (3.1 MB)
- screen-recording.mov (820 MB)
- ...
Total: 12 files, ~1.3 GB

Assistant (step 2): Reply with EXACTLY:
DELETE 12 FILES FROM DOWNLOADS

(or: CANCEL)
```

---

## 10-minute setup (minimum viable)

This is intentionally minimal — the goal is to install brakes fast.

### Step 1) Inspect exec approvals

```bash
openclaw approvals get
openclaw approvals get --gateway
```

### Step 2) Allowlist only “inspection” commands

```bash
# Add only safe-ish inspection commands
openclaw approvals allowlist add --agent main "/bin/ls"
openclaw approvals allowlist add --agent main "/usr/bin/du"

# Do NOT allowlist /bin/rm (deletes). Keep it behind explicit approvals.
```

### Step 3) If possible, disable exec in your personal profile

If your personal assistant doesn’t need host commands, removing `exec` entirely is the simplest win.

```bash
openclaw --profile personal config set tools.deny '["exec"]' --json
```

---

## Part 2) Recovery when things get tangled: the Rescue profile

Approvals prevent incidents.
Rescue helps when incidents still happen — or when configs become confusing.

### When do you need Rescue?

Common situations:

- the bot stops replying (token/pairing/channel issues)
- port conflicts (multiple profiles)
- policy/approvals changes accidentally block everything
- too many moving parts (tools/models/env) → hard to locate the cause
- you “fix” multiple things in a rush and make it worse

> Rule: before changing more in your main profile, turn on Rescue and diagnose first.

### 10-minute setup: create a rescue profile

```bash
openclaw --profile rescue setup

# use a separate port
openclaw --profile rescue gateway --port 19789
```

Tip: keep ~20 ports of spacing.

### Recovery routine (copy/paste checklist)

1) **Stop:** don’t keep editing your main config
2) **Start Rescue**
3) **Check status:** identify what’s alive vs broken

```bash
openclaw --profile rescue status
openclaw --profile work status
openclaw --profile personal status
```

4) **Check pairing/channel (most common)**

```bash
openclaw --profile work pairing list telegram
openclaw --profile personal pairing list telegram
```

5) **Check approvals/policy blocks**

```bash
openclaw approvals get
openclaw approvals get --gateway
```

If you’re away from the machine, keep `askFallback=deny` so “no UI” means “no risky execution.”

---

## One-line conclusion + 3 things to do today

> Use approvals as brakes to prevent expensive mistakes, and keep a Rescue profile to recover safely.

Do these three:

1) Make deletes two-step only (list/totals → typed confirmation)
2) Disable exec in personal (if you can)
3) Create a rescue profile and diagnose there first

---

## FAQ

- **Won’t this slow things down?**
  - Only the expensive mistakes. Listing/planning stays fast; delete/exec gets the speed bump.
- **What if I’m not at the computer to approve?**
  - Prefer “no UI = no execution” (`askFallback=deny`) for safety.
- **Do I need this if I trust the assistant?**
  - Trust doesn’t scale; guardrails do.
