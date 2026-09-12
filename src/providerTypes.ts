export const GO_VENDOR = "opencodego" as const;
export const ZEN_VENDOR = "opencodezen" as const;
export const VOLC_VENDOR = "volcengineArk" as const;
export const QIANWEN_VENDOR = "qianwenai" as const;
export const AGENT_GO_VENDOR = "opencodego-agent" as const;
export const AGENT_ZEN_VENDOR = "opencodezen-agent" as const;
export const AGENT_VOLC_VENDOR = "volcengineArk-agent" as const;
export const AGENT_QIANWEN_VENDOR = "qianwenai-agent" as const;

/** Base vendor IDs used for metadata lookups and API routing. */
export type ProviderVendor = typeof GO_VENDOR | typeof ZEN_VENDOR | typeof VOLC_VENDOR | typeof QIANWEN_VENDOR;

/** All vendor IDs including agent-host variants. */
export type AllProviderVendor =
  | typeof GO_VENDOR
  | typeof ZEN_VENDOR
  | typeof VOLC_VENDOR
  | typeof QIANWEN_VENDOR
  | typeof AGENT_GO_VENDOR
  | typeof AGENT_ZEN_VENDOR
  | typeof AGENT_VOLC_VENDOR
  | typeof AGENT_QIANWEN_VENDOR;

/** Resolve agent-host vendor variants back to their base vendor for metadata/routing lookups. */
export function resolveBaseVendor(vendor: AllProviderVendor): ProviderVendor {
  if (vendor === AGENT_GO_VENDOR) return GO_VENDOR;
  if (vendor === AGENT_ZEN_VENDOR) return ZEN_VENDOR;
  if (vendor === AGENT_VOLC_VENDOR) return VOLC_VENDOR;
  if (vendor === AGENT_QIANWEN_VENDOR) return QIANWEN_VENDOR;
  return vendor;
}

export interface ProviderRoutingDefinition {
  vendor: AllProviderVendor;
  chatCompletionsUrl: string;
  messagesUrl: string;
  modelsUrl: string;
  responsesUrl?: string;
}
