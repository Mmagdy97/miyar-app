import { describe, it, expect, afterEach } from "vitest";
import { orgFeatures, setActiveOrg, isTabAllowed, orgLimit, withinLimit, hasFeature } from "./entitlements";

describe("entitlements", () => {
  afterEach(() => setActiveOrg(null));
  it("plan features plus owner-granted extras", () => {
    expect(orgFeatures({ plan: "free" }).size).toBe(0);
    expect(orgFeatures({ plan: "pro" }).has("selections")).toBe(true);
    expect(orgFeatures({ plan: "pro" }).has("certificates")).toBe(false);
    expect(orgFeatures({ plan: "pro", extra_features: ["certificates"] }).has("certificates")).toBe(true);
  });
  it("gates tabs by active office; guests see everything", () => {
    expect(isTabAllowed("Certificates")).toBe(true);
    setActiveOrg({ plan: "pro" });
    expect(isTabAllowed("Certificates")).toBe(false);
    expect(isTabAllowed("Selections")).toBe(true);
    expect(isTabAllowed("Dashboard")).toBe(true);
  });
  it("limits and add-ons", () => {
    expect(orgLimit({ plan: "pro" }, "projects")).toBe(3);
    expect(orgLimit({ plan: "pro", extra_projects: 2 }, "projects")).toBe(5);
    expect(withinLimit({ plan: "free" }, "projects", 1)).toBe(false);
    expect(withinLimit({ plan: "office" }, "cashEngineers", 99)).toBe(true);
    expect(withinLimit(null, "projects", 99)).toBe(true);
  });
  it("new features by plan", () => {
    expect(hasFeature({ plan: "pro" }, "warranty")).toBe(false);
    expect(hasFeature({ plan: "pro", extra_features: ["structural"] }, "structural")).toBe(true);
    expect(hasFeature({ plan: "office" }, "custom_theme")).toBe(false);
    expect(hasFeature({ plan: "enterprise" }, "custom_theme")).toBe(true);
    expect(hasFeature(null, "warranty")).toBe(true);
  });
});
