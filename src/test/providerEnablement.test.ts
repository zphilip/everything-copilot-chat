import assert from "node:assert/strict";
import { test } from "node:test";
import { providerEnabledSetting } from "../providerEnablement";
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
} from "../providerTypes";

test("providerEnabledSetting — base vendors map to their own setting", () => {
  assert.equal(providerEnabledSetting(GO_VENDOR), "opencodego.enabled");
  assert.equal(providerEnabledSetting(ZEN_VENDOR), "opencodezen.enabled");
  assert.equal(providerEnabledSetting(VOLC_VENDOR), "volcengineArk.enabled");
  assert.equal(providerEnabledSetting(QIANWEN_VENDOR), "qianwenai.enabled");
  assert.equal(providerEnabledSetting(MIMO_VENDOR), "xiaomimimo.enabled");
});

test("providerEnabledSetting — agent-host variants follow their base vendor", () => {
  assert.equal(providerEnabledSetting(AGENT_GO_VENDOR), "opencodego.enabled");
  assert.equal(providerEnabledSetting(AGENT_ZEN_VENDOR), "opencodezen.enabled");
  assert.equal(providerEnabledSetting(AGENT_VOLC_VENDOR), "volcengineArk.enabled");
  assert.equal(providerEnabledSetting(AGENT_QIANWEN_VENDOR), "qianwenai.enabled");
  assert.equal(providerEnabledSetting(AGENT_MIMO_VENDOR), "xiaomimimo.enabled");
});

test("providerEnabledSetting — keys are full root-configuration keys (regression: #125 review)", () => {
  // Section-scoped reads (getConfiguration("opencodego")) resolve keys relative
  // to the section. The Zen flag must be read from the root configuration with
  // the full "opencodezen.enabled" key, otherwise the read silently hits
  // "opencodego.opencodezen.enabled" and always falls back to the default.
  assert.ok(providerEnabledSetting(ZEN_VENDOR).startsWith("opencodezen."));
  assert.ok(providerEnabledSetting(GO_VENDOR).startsWith("opencodego."));
  assert.ok(!providerEnabledSetting(ZEN_VENDOR).startsWith("opencodego."));
});
