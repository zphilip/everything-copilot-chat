import * as vscode from "vscode";
import {
  CONFIG_SECTION,
  DEFAULT_MIMO_API_BASE_URL,
  DEFAULT_MIMO_MODELS_BASE_URL,
  DEFAULT_QIANWEN_API_BASE_URL,
  DEFAULT_QIANWEN_MODELS_BASE_URL,
  DEFAULT_VOLC_API_BASE_URL,
  EXTENSION_ID,
  FALLBACK_USER_AGENT,
  FREE_ZEN_MODEL_IDS,
  SETTING_FREE_ONLY,
  SETTING_MIMO_API_BASE_URL,
  SETTING_MIMO_MODELS,
  SETTING_MIMO_MODELS_BASE_URL,
  SETTING_QIANWEN_API_BASE_URL,
  SETTING_QIANWEN_MODELS,
  SETTING_QIANWEN_MODELS_BASE_URL,
  SETTING_VOLC_API_BASE_URL,
  SETTING_VOLC_MODELS,
  normalizeApiBaseUrl,
} from "../config";
import type { ModelEndpointKind } from "../core/registry";
import type { ApiMessage } from "../request/types";
import {
  AGENT_GO_VENDOR,
  AGENT_MIMO_VENDOR,
  AGENT_QIANWEN_VENDOR,
  AGENT_VOLC_VENDOR,
  AGENT_ZEN_VENDOR,
  GO_VENDOR,
  MIMO_VENDOR,
  QIANWEN_VENDOR,
  VOLC_VENDOR,
  ZEN_VENDOR,
  type AllProviderVendor,
} from "../providerTypes";

export type { ModelEndpointKind } from "../core/registry";

export interface ProviderDefinition {
  vendor: AllProviderVendor;
  displayName: string;
  modelNamePrefix: string;
  modelsUrl: string;
  chatCompletionsUrl: string;
  messagesUrl: string;
  responsesUrl?: string;
  testModelId: string;
  fallbackModels: string[];
  filterModel?: (modelId: string) => boolean;
  /** When true, this provider only serves agent-host models (targetChatSessionType=copilotcli). */
  isAgentVariant?: boolean;
  /** The vendor key for the main (non-agent) provider definition this variant mirrors. */
  baseVendor?: typeof GO_VENDOR | typeof ZEN_VENDOR | typeof VOLC_VENDOR | typeof QIANWEN_VENDOR | typeof MIMO_VENDOR;
  /** Skip the live GET /models fetch and use the static model list instead. */
  staticModelList?: boolean;
  /** Full config key for a comma-separated model-ID override (root-scoped). */
  modelListSetting?: string;
}

let cachedUserAgent: string | undefined;

/**
 * Build the User-Agent string from the extension's declared version.
 *
 * CONTRACT:
 * - Reads `context.extension.packageJSON.version` once, caches the result.
 * - Falls back to {@link FALLBACK_USER_AGENT} when version is unavailable
 *   (e.g. tests that construct a stub context).
 * - Avoids the drift that previously hardcoded a version literal here
 *   (issue #78: header reported `0.3.6` while package.json was `0.4.1`).
 */
export function getUserAgent(): string {
  if (cachedUserAgent) return cachedUserAgent;
  const packageJSON = vscode.extensions.getExtension(EXTENSION_ID)?.packageJSON as { version?: unknown } | undefined;
  const version = typeof packageJSON?.version === "string" ? packageJSON.version : undefined;
  cachedUserAgent = version ? `everything-copilot-chat/${version} VSCode` : FALLBACK_USER_AGENT;
  return cachedUserAgent;
}

/**
 * Classify a fetch error as transient (worth retrying) vs. permanent.
 *
 * Defined in `retry.ts` (the shared retry-decision module) and re-exported
 * here so existing importers keep working. See `retry.ts` for the rules and
 * the full implementation.
 */
export { isTransientFetchError } from "../retry";

/** Create an agent-variant provider definition that inherits URLs, models, and filters from a base. */
function providerVariant(
  base: ProviderDefinition,
  agentVendor:
    typeof AGENT_GO_VENDOR | typeof AGENT_ZEN_VENDOR | typeof AGENT_VOLC_VENDOR | typeof AGENT_QIANWEN_VENDOR | typeof AGENT_MIMO_VENDOR,
  displayName: string,
): ProviderDefinition {
  return {
    vendor: agentVendor,
    displayName,
    modelNamePrefix: base.modelNamePrefix,
    modelsUrl: base.modelsUrl,
    chatCompletionsUrl: base.chatCompletionsUrl,
    messagesUrl: base.messagesUrl,
    responsesUrl: base.responsesUrl,
    testModelId: base.testModelId,
    fallbackModels: base.fallbackModels,
    filterModel: base.filterModel,
    staticModelList: base.staticModelList,
    modelListSetting: base.modelListSetting,
  };
}

export const PROVIDERS: Record<ProviderDefinition["vendor"], ProviderDefinition> = (() => {
  const go: ProviderDefinition = {
    vendor: GO_VENDOR,
    displayName: "OpenCode Go",
    modelNamePrefix: "OpenCode Go",
    modelsUrl: "https://opencode.ai/zen/go/v1/models",
    chatCompletionsUrl: "https://opencode.ai/zen/go/v1/chat/completions",
    messagesUrl: "https://opencode.ai/zen/go/v1/messages",
    responsesUrl: "https://opencode.ai/zen/go/v1/responses",
    testModelId: "deepseek-v4-flash",
    fallbackModels: [
      "deepseek-v4-pro",
      "deepseek-v4-flash",
      "glm-5.1",
      "glm-5",
      "hy3-preview",
      "kimi-k2.6",
      "kimi-k2.5",
      "mimo-v2-omni",
      "mimo-v2-pro",
      "mimo-v2.5",
      "mimo-v2.5-pro",
      "minimax-m3",
      "minimax-m2.7",
      "minimax-m2.5",
      "qwen3.7-max",
      "qwen3.7-plus",
      "qwen3.6-plus",
      "qwen3.5-plus",
      "gpt-5.6-luna",
    ],
  };
  const zen: ProviderDefinition = {
    vendor: ZEN_VENDOR,
    displayName: "OpenCode Zen",
    modelNamePrefix: "OpenCode Zen",
    modelsUrl: "https://opencode.ai/zen/v1/models",
    chatCompletionsUrl: "https://opencode.ai/zen/v1/chat/completions",
    messagesUrl: "https://opencode.ai/zen/v1/messages",
    responsesUrl: "https://opencode.ai/zen/v1/responses",
    testModelId: "deepseek-v4-flash-free",
    fallbackModels: [
      "claude-opus-4-7",
      "claude-opus-4-6",
      "claude-opus-4-5",
      "claude-opus-4-1",
      "claude-sonnet-4-6",
      "claude-sonnet-4-5",
      "claude-sonnet-4",
      "claude-haiku-4-5",
      "deepseek-v4-flash-free",
      "gemini-3.5-flash",
      "gemini-3.1-pro",
      "gemini-3-flash",
      "glm-5.1",
      "glm-5",
      "gpt-5.5",
      "gpt-5.5-pro",
      "gpt-5.4",
      "gpt-5.4-pro",
      "gpt-5.4-mini",
      "gpt-5.4-nano",
      "gpt-5.3-codex",
      "gpt-5.3-codex-spark",
      "gpt-5.2",
      "gpt-5.2-codex",
      "gpt-5.1",
      "gpt-5.1-codex",
      "gpt-5.1-codex-max",
      "gpt-5.1-codex-mini",
      "gpt-5",
      "gpt-5-codex",
      "gpt-5-nano",
      "grok-build-0.1",
      "kimi-k2.6",
      "kimi-k2.5",
      "minimax-m2.7",
      "minimax-m2.5",
      "minimax-m2.5-free",
      "nemotron-3-super-free",
      "qwen3.6-plus",
      "qwen3.6-plus-free",
      "qwen3.5-plus",
      "big-pickle",
    ],
    filterModel: (modelId) =>
      vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>(SETTING_FREE_ONLY, true)
        ? modelId.endsWith("-free") || FREE_ZEN_MODEL_IDS.has(modelId)
        : true,
  };
  const volc: ProviderDefinition = {
    vendor: VOLC_VENDOR,
    displayName: "Volcengine Ark",
    modelNamePrefix: "Volcengine Ark",
    // The Ark coding plan has no standard /models endpoint — use a static list
    // (overridable via `volcengineArk.models`).
    modelsUrl: "",
    chatCompletionsUrl: `${normalizeApiBaseUrl(
      vscode.workspace.getConfiguration().get<string>(SETTING_VOLC_API_BASE_URL, ""),
      DEFAULT_VOLC_API_BASE_URL,
    )}/chat/completions`,
    messagesUrl: "",
    testModelId: "doubao-seed-evolving",
    fallbackModels: [
      "doubao-seed-evolving",
      "doubao-seed-2.1-turbo",
      "doubao-seed-2.0-lite",
      "minimax-m3",
      "glm-5.3",
      "glm-5.3-flash",
      "deepseek-v4-flash",
      "deepseek-v4-pro",
      "kimi-k2.7-code",
    ],
    staticModelList: true,
    modelListSetting: SETTING_VOLC_MODELS,
  };
  const qianwen: ProviderDefinition = {
    vendor: QIANWEN_VENDOR,
    displayName: "Qianwen AI",
    modelNamePrefix: "Qianwen AI",
    // Live model list from the OpenAI-compatible endpoint; chat requests route
    // to the Anthropic-compatible endpoint (see the `qianwen` registry entry).
    modelsUrl: `${normalizeApiBaseUrl(
      vscode.workspace.getConfiguration().get<string>(SETTING_QIANWEN_MODELS_BASE_URL, ""),
      DEFAULT_QIANWEN_MODELS_BASE_URL,
    )}/models`,
    chatCompletionsUrl: "",
    messagesUrl: `${normalizeApiBaseUrl(
      vscode.workspace.getConfiguration().get<string>(SETTING_QIANWEN_API_BASE_URL, ""),
      DEFAULT_QIANWEN_API_BASE_URL,
    )}/v1/messages`,
    testModelId: "qwen-max",
    fallbackModels: ["qwen-max", "qwen-plus", "qwen-turbo", "qwen-max-latest", "qwen-plus-latest"],
    modelListSetting: SETTING_QIANWEN_MODELS,
  };
  const mimo: ProviderDefinition = {
    vendor: MIMO_VENDOR,
    displayName: "Xiaomi MiMo",
    modelNamePrefix: "Xiaomi MiMo",
    // Live model list from the OpenAI-compatible endpoint; chat requests route
    // to the Anthropic-compatible endpoint (see the `mimo-messages` registry entry).
    modelsUrl: `${normalizeApiBaseUrl(
      vscode.workspace.getConfiguration().get<string>(SETTING_MIMO_MODELS_BASE_URL, ""),
      DEFAULT_MIMO_MODELS_BASE_URL,
    )}/models`,
    chatCompletionsUrl: "",
    messagesUrl: `${normalizeApiBaseUrl(
      vscode.workspace.getConfiguration().get<string>(SETTING_MIMO_API_BASE_URL, ""),
      DEFAULT_MIMO_API_BASE_URL,
    )}/v1/messages`,
    testModelId: "mimo-v2.5",
    fallbackModels: ["mimo-v2.5", "mimo-v2.5-pro", "mimo-v2-omni", "mimo-v2-pro"],
    modelListSetting: SETTING_MIMO_MODELS,
  };
  return {
    [GO_VENDOR]: go,
    [ZEN_VENDOR]: zen,
    [VOLC_VENDOR]: volc,
    [QIANWEN_VENDOR]: qianwen,
    [MIMO_VENDOR]: mimo,
    [AGENT_GO_VENDOR]: { ...providerVariant(go, AGENT_GO_VENDOR, "OpenCode Go (Agents)"), isAgentVariant: true, baseVendor: GO_VENDOR },
    [AGENT_ZEN_VENDOR]: {
      ...providerVariant(zen, AGENT_ZEN_VENDOR, "OpenCode Zen (Agents)"),
      isAgentVariant: true,
      baseVendor: ZEN_VENDOR,
    },
    [AGENT_VOLC_VENDOR]: {
      ...providerVariant(volc, AGENT_VOLC_VENDOR, "Volcengine Ark (Agents)"),
      isAgentVariant: true,
      baseVendor: VOLC_VENDOR,
    },
    [AGENT_QIANWEN_VENDOR]: {
      ...providerVariant(qianwen, AGENT_QIANWEN_VENDOR, "Qianwen AI (Agents)"),
      isAgentVariant: true,
      baseVendor: QIANWEN_VENDOR,
    },
    [AGENT_MIMO_VENDOR]: {
      ...providerVariant(mimo, AGENT_MIMO_VENDOR, "Xiaomi MiMo (Agents)"),
      isAgentVariant: true,
      baseVendor: MIMO_VENDOR,
    },
  };
})();

export interface OpenCodeModel extends vscode.LanguageModelChatInformation {
  endpointKind: ModelEndpointKind;
  provider: ProviderDefinition;
  rawModelId?: string;
  isUserSelectable?: boolean;
  configurationSchema?: vscode.LanguageModelConfigurationSchema;
}

export interface ModelListEntry {
  id?: string;
  owned_by?: string;
  status?: string;
  deprecated?: boolean;
  limit?: {
    context?: number;
    output?: number;
  };
  context_window?: number;
  contextWindow?: number;
  max_output_tokens?: number;
  maxOutputTokens?: number;
  attachment?: boolean;
  image_input?: boolean;
  imageInput?: boolean;
  reasoning?: boolean;
  modalities?: {
    input?: string[];
    output?: string[];
  };
}

export interface ModelListResponse {
  data?: ModelListEntry[];
}

export interface ConvertedMessageResult {
  messages: ApiMessage[];
  normalizedImageCount: number;
}

/**
 * Reasoning effort levels per model family, sourced from the upstream
 * OpenCode provider transform (anomalyco/opencode, packages/opencode/src/provider/transform.ts):
 *
 *   WIDELY_SUPPORTED_EFFORTS = ["low", "medium", "high"]
 *   OPENAI_EFFORTS = ["none", "minimal", "low", "medium", "high", "xhigh"]
 *
 * For @ai-sdk/openai-compatible (Mimo, and most models routed through
 * chat-completions): the default is WIDELY_SUPPORTED_EFFORTS = ["low", "medium", "high"].
 * DeepSeek V4 on openai-compatible additionally adds "max" → ["low", "medium", "high", "max"].
 */
export interface LanguageModelConfiguration {
  apiKey?: unknown;
}

export type ConfiguredLanguageModelInfoOptions = vscode.PrepareLanguageModelChatModelOptions & {
  configuration?: LanguageModelConfiguration;
};

export type ConfiguredLanguageModelResponseOptions = vscode.ProvideLanguageModelChatResponseOptions & {
  configuration?: LanguageModelConfiguration;
};
