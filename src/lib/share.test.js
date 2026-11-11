import { describe, it, expect } from "vitest";
import { encodeSnapshot, decodeSnapshot, sanitizeSnapshot, whatsappLink } from "./share";

describe("share", () => {
  it("round-trips Arabic text", () => {
    const s = { name: "فيلا الياسمين", progress: 78, phase: "تشطيب", timeline: [{ title: "سباكة", pct: 100 }] };
    const back = decodeSnapshot(encodeSnapshot(s));
    expect(back.name).toBe("فيلا الياسمين");
    expect(back.progress).toBe(78);
    expect(back.timeline[0].pct).toBe(100);
  });
  it("clamps and strips untrusted input", () => {
    const s = sanitizeSnapshot({ progress: 900, phone: "+20 (100) abc 234", name: 5, evil: "<script>" });
    expect(s.progress).toBe(100);
    expect(s.phone).toBe("+20100234");
    expect(s.name).toBe("");
    expect(s.evil).toBeUndefined();
  });
  it("returns null for garbage", () => {
    expect(decodeSnapshot("!!!not-base64")).toBeNull();
  });
  it("builds a wa.me link", () => {
    expect(whatsappLink("مرحبا")).toBe("https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7");
    expect(whatsappLink("x", "+20 100")).toContain("wa.me/20100?");
  });
});
