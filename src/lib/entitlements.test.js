import { describe, it, expect, afterEach } from "vitest";
import { orgFeatures, setActiveOrg, isTabAllowed } from "./entitlements";

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
});
