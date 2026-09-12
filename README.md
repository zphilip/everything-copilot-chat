<div align="center">

# 🚀 Everything Copilot Chat

**Use 30+ frontier AI models in GitHub Copilot Chat — Bring Your Own Key (BYOK).** No Copilot Pro needed.

One picker, four providers — **OpenCode Go** · **OpenCode Zen** · **Volcengine Ark** · **Qianwen AI** — so you can route each chat to the cheapest capable model.

[![CI](https://github.com/zphilip/everything-copilot-chat/actions/workflows/ci.yml/badge.svg)](https://github.com/zphilip/everything-copilot-chat/actions/workflows/ci.yml)
[![VS Code Marketplace](https://img.shields.io/badge/Install-VS%20Code%20Marketplace-007ACC?logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=ltmoerdani.everything-copilot-chat)
[![Version](https://img.shields.io/github/v/release/zphilip/everything-copilot-chat?label=Version&color=6c47ff)](https://github.com/zphilip/everything-copilot-chat/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.125%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)](./CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/zphilip/everything-copilot-chat?style=social)](https://github.com/zphilip/everything-copilot-chat)

[**🔌 Providers**](#-providers) · [**🧠 Models**](#-models) · [**⚡ Quick Start**](#-quick-start) · [**✨ Features**](#-features) · [**🔧 Settings**](#-settings) · [**❓ FAQ**](#-faq) · [**💬 Community**](#-community)

</div>

---

> **💡 The pitch**
>
> Copilot Chat is great, but its premium models cost $39/mo (Pro+) and the free tier is rate-limited. This extension plugs multiple **model gateways** into the Copilot Chat model picker. You keep the native Copilot UI, tool-calling, and Agent Mode — you just get a **much wider model catalog**, and you can pick the **cheapest provider per task**.

> 🍴 **Fork of [opencode-copilot-chat](https://github.com/ltmoerdani/opencode-copilot-chat)** — with **Volcengine Ark** and **Qianwen AI** added as plan-based BYOK providers alongside OpenCode Go/Zen. For OpenCode Go/Zen specifics, see the [upstream project](https://github.com/ltmoerdani/opencode-copilot-chat).

---

## 🔌 Providers

The extension registers each provider as a separate vendor in VS Code's **Chat → Manage Language Models**. Any provider can be enabled, disabled, or removed from the picker independently — your API keys are kept, so re-enabling restores everything.

| Provider | What it is | Cost model | Endpoints |
| -------- | ---------- | ---------- | --------- |
| **OpenCode Go** | OpenCode's subscription gateway for curated open models (DeepSeek V4, Kimi K3, GLM-5.2, Qwen3.8 Max, MiMo V2.5, MiniMax M3) | $10/mo subscription (5h/$12 · weekly/$30 · monthly/$60) | OpenAI + Anthropic compatible |
| **OpenCode Zen** | OpenCode's free-tier + pay-as-you-go gateway (Claude, GPT-5.x, Gemini, Grok, DeepSeek, rotating free models) | Free models + pay-per-token premium | OpenAI + Anthropic compatible |
| **Volcengine Ark** | Volcengine's coding-plan endpoint (Doubao Seed, GLM-5.3, MiniMax M3, DeepSeek V4, Kimi K2.7) | Coding-plan subscription | OpenAI-compatible (`/chat/completions`) |
| **Qianwen AI** | Alibaba's token-plan MaaS for Qwen models (`qwen-max`, `qwen-plus`, `qwen-turbo`) | Token-plan subscription | Anthropic-compatible (`/v1/messages`) |

> 💸 **Why plan-based providers?** Per-token pricing on frontier models adds up fast during long agentic sessions. **Volcengine Ark** (coding plan) and **Qianwen AI** (token plan) let you use the same underlying models under a flat plan instead of per-token metering — wire them once and route heavy workloads there.

---

## 🧠 Models

Models are fetched **live** from each provider on startup (Qianwen AI exposes a live `/models` list; Volcengine Ark uses a static list because its coding plan has no `/models` endpoint), with a bundled offline fallback.

### OpenCode Go (subscription)

DeepSeek V4 Pro/Flash, Kimi K3 / K2.7-code / K2.6, GLM-5.2 / 5.1, Qwen3.8/3.7/3.6/3.5 Max+, MiMo V2.5 / V2.5-pro, MiniMax M3 / M2.7, GPT-5.6 Luna, Hy3 — with per-family thinking controls and generous context up to ~1M tokens.

### OpenCode Zen (free + pay-as-you-go)

Rotating **free** models (Big Pickle, DeepSeek V4 Flash Free, MiMo V2.5 Free, Hy3 Free, Nemotron 3 Ultra Free, …) plus paid Claude Opus/Sonnet/Haiku, GPT-5.x, Gemini 3.x, Grok 4.5, DeepSeek V4, Kimi K2.6, MiniMax M2.7, Qwen3.6+, and more.

### Volcengine Ark (coding plan)

Default list (overridable via `volcengineArk.models`):

`doubao-seed-evolving` · `doubao-seed-2.1-turbo` · `doubao-seed-2.0-lite` · `minimax-m3` · `glm-5.3` · `glm-5.3-flash` · `deepseek-v4-flash` · `deepseek-v4-pro` · `kimi-k2.7-code`

### Qianwen AI (token plan)

Live list with these built-in fallbacks (overridable via `qianwenai.models`):

`qwen-max` · `qwen-plus` · `qwen-turbo` · `qwen-max-latest` · `qwen-plus-latest`

> **Context & output limits** resolve per model (live metadata → `models.dev` snapshot → bundled fallback). Deprecated/unavailable models are filtered from the picker automatically.

---

## ⚡ Quick Start

```text
1.  Install or update VS Code 1.125+ ───────────────────────────── ✓
2.  Install this extension ──────────────────────────────────────── ✓
3.  Get an API key from at least one provider (below) ───────────── ✓
4.  Copilot Chat → model picker → "Add Models" → pick your provider ✓
5.  Paste the key → select a model → CHAT 🎉
```

**Get a key:**

- **OpenCode Go / Zen** — sign up at [opencode.ai](https://opencode.ai). Zen starts free (rotating free models); Go is a $10/mo subscription.
- **Volcengine Ark** — Volcengine console → coding plan → create an API key.
- **Qianwen AI** — Alibaba Cloud Model Studio → token-plan MaaS → create an API key.

<details>
<summary><b>📖 Detailed step-by-step</b></summary>

1. Install or update [VS Code](https://code.visualstudio.com/) to 1.125+. BYOK chat works without a GitHub sign-in or Copilot plan.
2. Install this extension from the Marketplace (or press `F5` in this repo for dev mode).
3. Get an API key from one of the providers above.
4. Open **Copilot Chat** (Cmd/Ctrl+Shift+I).
5. Click the **model picker** → **Add Models…**
6. Select **OpenCode Go**, **OpenCode Zen**, **Volcengine Ark**, or **Qianwen AI**.
7. **Paste your API key** when prompted (stored by VS Code in its encrypted language-models storage — it never leaves your machine).
8. Pick the models you want enabled.
9. Select any model from the picker and start chatting. 🚀

> **💡 Tips:**
> - Providers are **independent groups** — add several and switch anytime from the picker.
> - If a model shows in **Language Models** but not the chat picker, hover its row and click the **eye icon (👁)** to enable it.
> - Set `opencodego.freeOnly: false` to reveal paid OpenCode Zen models in the picker.

</details>

---

## ✨ Features

- **Multi-provider routing** — every model family auto-routes to its native transport (`/responses`, `/messages`, `/chat/completions`, `streamGenerateContent`) with per-endpoint tool-calling formats.
- **🧠 Thinking controls** — per-model reasoning effort (DeepSeek `off`→`max`, Qwen `thinking_budget`, GLM/Kimi/MiniMax/MiMo toggles and levels).
- **🖼️ Vision proxy** — text-only models can "see" images via a configured vision model; per-image descriptions are cached and reused across turns.
- **📊 Go usage tracking** — status bar burn-rate across 5h / weekly / monthly tiers (server-synced from OpenCode Go's usage endpoint).
- **🪟 Agents window (Copilot CLI)** — all providers appear in the Agents-window model picker via agent-host variants.
- **🖼️ Vision + PDF + Audio** — multimodal models pass through image, PDF, audio, and video inputs (oversized images auto-resize to 2000×2000 / 5MB).
- **📐 Context-size picker** — tiered-context models expose `256K` vs full-window selection, cheaper tier default.
- **🔌 Provider on/off** — remove or re-add any provider from Language Models & every picker; keys and BYOK groups are kept.
- **✍️ Inline suggestions (experimental)** — opt-in ghost-text completions with thinking forced off.
- **🛠️ Reliability** — transient 5xx retry with backoff, sticky gateway headers, request/stream timeouts, context-overflow auto-retry.

---

## 🔧 Settings

All settings live under the `opencodego.*`, `volcengineArk.*`, and `qianwenai.*` namespaces. Key ones:

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `opencodego.apiBaseUrl` | `https://opencode.ai/zen/go/v1` | Base URL for the Go-compatible gateway |
| `opencodezen.apiBaseUrl` | `https://opencode.ai/zen/v1` | Base URL for the Zen-compatible gateway |
| `volcengineArk.apiBaseUrl` | `https://ark.cn-beijing.volces.com/api/coding/v3` | Volcengine Ark coding-plan base URL (OpenAI-compatible) |
| `volcengineArk.models` | _(built-in list)_ | Comma-separated model-ID override |
| `qianwenai.apiBaseUrl` | `https://token-plan.cn-beijing.maas.aliyuncs.com/apps/anthropic` | Qianwen Anthropic-compatible Messages API base URL |
| `qianwenai.modelsBaseUrl` | `https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1` | Qianwen live-model-list base URL |
| `qianwenai.models` | _(built-in list)_ | Comma-separated model-ID fallback |
| `opencodego.freeOnly` | `true` | Zen: free models only. `false` = include paid |
| `opencodego.temperature` | `0.2` | Sampling temperature (`0`–`2`) |
| `opencodego.maxTokens` / `maxInputTokens` | `0` | Max output / context override (`0` = per-model default) |
| `opencodego.stripThinkTags` | `auto` | Strip `thinking` tags (`never`/`auto`/`always`) |
| `opencodego.agentsWindow` | `true` | Expose agent-host model variants for the Agents window |
| `opencodego.thinking.*` | `off` | Per-family reasoning effort defaults |

Run **Preferences: Open Settings (UI)** and search `opencode` / `volcengine` / `qianwen` for the full list.

---

## 🎛️ Commands

| Command | Description |
| ------- | ----------- |
| `OpenCode Go: Manage Provider` / `Refresh Models` / `Diagnostics` | Test connection, refresh models, report |
| `OpenCode Zen: Manage Provider` / `Refresh Models` / `Diagnostics` | Same for Zen |
| `OpenCode: Model Picker Diagnostics` | All registered models (Go + Zen + Ark + Qianwen + Copilot) side-by-side |
| `OpenCode: Set Thinking Effort…` | Per-family thinking mode picker |
| `OpenCode Go: Show Usage Details` | Detailed Go subscription usage breakdown |
| `OpenCode Go: Set Usage Targets…` | Edit 5h / weekly / monthly spend targets |
| `OpenCode Go: Configure Vision Proxy` | Pick a vision model so text-only models can "see" images |
| `OpenCode Go: Remove/Re-add Provider in Language Models` | Remove or restore OpenCode Go in all pickers |

---

## ❓ FAQ

<details>
<summary><b>Do I need Copilot Pro, Pro+, or Max?</b></summary>

**No.** BYOK chat works without a Copilot plan and without signing in to GitHub. Requests are billed only by the provider you configured and do not consume Copilot requests. (Inline suggestions, next-edit suggestions, and semantic search still require Copilot.)

</details>

<details>
<summary><b>Where is my API key stored?</b></summary>

In VS Code's **language-models configuration** (VS Code stores it in encrypted storage). It never leaves your machine and is only sent to the provider you configured.

</details>

<details>
<summary><b>Can I use multiple providers at the same time?</b></summary>

**Yes.** Each provider is a separate group. Add several via **Language Models → Add Models…**, enter each key separately, and switch between them from the picker anytime.

</details>

<details>
<summary><b>How do I use these models in the Agents window (Copilot CLI)?</b></summary>

Agent-host variants are enabled by default (`opencodego.agentsWindow: true`). Open the **Agents window**, start a Copilot CLI session, and pick any provider's model from the picker.

</details>

<details>
<summary><b>How do I report a bug or request a model?</b></summary>

[Open an issue](https://github.com/zphilip/everything-copilot-chat/issues/new/choose) — pick the Bug Report or Feature Request template, and include the diagnostics report (`OpenCode Go: Diagnostics` / `OpenCode Zen: Diagnostics`).

</details>

---

## 🤝 Contributing

Contributions welcome — typo fixes, new model support, or screenshots. See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guidelines and the development workflow.

Press `F5` in VS Code to open an **Extension Development Host**:

```bash
npm install      # install deps
npm run compile  # build TypeScript
npm run watch    # watch mode
npm run package  # build .vsix
```

---

## 💬 Community

[![GitHub Discussions](https://img.shields.io/badge/Discussions-Ask%20questions-blue?logo=github)](https://github.com/zphilip/everything-copilot-chat/discussions)
[![Issues](https://img.shields.io/badge/Issues-Report%20bugs-red?logo=github)](https://github.com/zphilip/everything-copilot-chat/issues)
[![X / Twitter](https://img.shields.io/badge/X-Share-orange?logo=x)](https://twitter.com/intent/tweet?text=Using%2030%2B%20AI%20models%20in%20GitHub%20Copilot%20Chat%20for%20free%20with%20BYOK!&url=https://github.com/zphilip/everything-copilot-chat&hashtags=vscode,copilot,ai,byok,opencode)
[![Reddit](https://img.shields.io/badge/Reddit-Share-orange?logo=reddit)](https://www.reddit.com/submit?url=https://github.com/zphilip/everything-copilot-chat&title=Everything%20Copilot%20Chat)

**If this saves you money or unlocks a model you needed — ⭐ star the repo and share it!**

---

## 📄 License

[MIT](./LICENSE) © 2026 [ltmoerdani](https://github.com/ltmoerdani), [zphilip](https://github.com/zphilip)

OpenCode is a trademark of [opencode.ai](https://opencode.ai). This project is independent and not affiliated with GitHub, Microsoft, Anthropic, OpenAI, Google, Alibaba, Volcengine, or any model provider.

<div align="center">

**[⬆ Back to top](#-everything-copilot-chat)**

</div>