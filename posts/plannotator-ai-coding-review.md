---
title: "Plannotator: review the plan before AI writes the code"
date: "2026-02-11"
lang: "en"
excerpt: "A tool that lets you review and approve an AI coding agent’s plan (and even review diffs) before it runs. Plus a quick look at the licensing and where this workflow might go." 
tags: ["tools"]
---

> Language: **English** | [한국어](/ko/posts/plannotator-ai-coding-review)

If you use AI coding agents, you’ve probably seen this at least once:

You say “fix this,” and the agent starts modifying 10 files.
Something feels wrong, but it’s already halfway through.
You end up doing `git reset --hard` and starting over.

The core problem is simple:
**the agent executes immediately, without a reviewable plan**.
Humans don’t run big changes that way — we plan, review, then execute.
So why weren’t we demanding the same from AI agents?

## What Plannotator does

[Plannotator](https://github.com/backnotprop/plannotator) addresses exactly this.

When Claude Code or OpenCode produces a plan, Plannotator opens a visual UI in your browser.
There you can:

- **Approve**: the agent starts implementing
- **Request changes**: you leave feedback on the plan

Feedback is structured as delete/insert/replace/comment.
So you can say things like:
- “remove this part”
- “add this step”
- “use approach B instead of A”

## New: code review (diff review)

A feature added in Jan 2026: reviewing diffs via `/plannotator-review`.

After the agent modifies code — but before committing — you can inspect changes visually:
select line ranges, add comments, and switch diff views.
If something looks off, send feedback and have the agent revise.

Plan review + diff review.
That two-step workflow dramatically reduces the chance of the agent running in the wrong direction.

## Installation is straightforward

**Claude Code:**

```bash
# 1) install the plannotator command
curl -fsSL https://plannotator.ai/install.sh | bash

# 2) install the plugin in Claude Code
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator

# 3) restart Claude Code (important)
```

**OpenCode:**

```json
// opencode.json
{
  "plugin": ["@plannotator/opencode@latest"]
}
```

Then run the same install script.

## Team workflows + Obsidian integration

It’s useful solo, but it shines in teams.

You can share plans, review them together, consolidate feedback, then send a clean set of changes back to the agent.
It turns “does this design make sense?” into something you can discuss with a concrete artifact.

Approved plans can also be saved automatically to Obsidian or Bear.
That helps later when you ask: “why did we implement it this way?”

## The license is unusual

Plannotator uses **BSL 1.1 (Business Source License)**.

It’s not open source — but **it becomes open source over time**.

- personal use / internal company use: OK
- selling it as a commercial SaaS to third parties: not allowed
- on **Jan 1, 2030**: it automatically switches to Apache 2.0

This is a strategy MariaDB popularized: prevent hyperscalers from reselling it, while still opening it to the community later.
Projects like Sentry and CockroachDB have used similar approaches.

For most developers, the practical rule is simple:
if you’re not building a paid product that resells it, you can use it freely.

## Where this goes next

An honest thought:

The problem Plannotator solves — plan review + approval — is a core AI-coding workflow.
Right now it’s a third-party tool.
But will it stay third-party?

Claude Code is already integrated into the Claude desktop app.
If plan review proves essential, it’s very plausible that a similar feature becomes built-in over time.
It could even happen before 2030, before the license flips to Apache 2.0.

That’s fine.
Good tools influence the mainstream, and what works becomes standard.
If you want better control over AI coding *today*, Plannotator is a solid choice.
