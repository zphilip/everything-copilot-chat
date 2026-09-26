# Changelog

All notable changes to the **Everything Copilot Chat** extension are documented here.

**Everything Copilot Chat** is a fork of [opencode-copilot-chat](https://github.com/ltmoerdani/opencode-copilot-chat) (forked from v0.7.3). The upstream project's history is not included here.

## [0.1.2] — 2026-09-26

### Added

- **MiniMax provider.** MiniMax's token-plan MaaS (MiniMax models), with its own `minimax.apiKey`, Anthropic-compatible chat routing (`/v1/messages`), and a live model list from the OpenAI-compatible endpoint (`v1/models`).

## [0.1.1] — 2026-09-26

### Added

- **Xiaomi MiMo provider.** Xiaomi's token-plan MaaS (MiMo models), with its own `xiaomimimo.apiKey`, Anthropic-compatible chat routing (`anthropic/v1/messages`), and a live model list from the OpenAI-compatible endpoint (`v1/models`).

## [0.1.0] — 2026-09-25

### Added

- **Initial fork release.** Rebranded as Everything Copilot Chat under the `aiwormcn` publisher and added two BYOK providers:
  - **Volcengine Ark** — Volcengine's coding-plan endpoint (OpenAI-compatible), its own `volcengineArk.apiKey`, and a static model list overridable via `volcengineArk.models`.
  - **Qianwen AI** — Alibaba's token-plan MaaS (Qwen models), its own `qianwenai.apiKey`, Anthropic-compatible chat routing (`apps/anthropic/v1/messages`), and a live model list from the OpenAI-compatible endpoint (`compatible-mode/v1/models`).
