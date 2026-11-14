import { describe, it, expect } from "vitest";
import { collectBackup, validateBackup, restoreBackup } from "./backup";
const mem = (init = {}) => { const m = new Map(Object.entries(init)); return { get length() { return m.size; }, key: (i) => [...m.keys()][i], getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), m }; };
describe("backup", () => {
  it("collects only miyar data, not consent", () => {
    const b = collectBackup(mem({ "miyar:boq:v1": "[]", "miyar:consent:v1": "1", other: "x" }));
    expect(Object.keys(b.data)).toEqual(["miyar:boq:v1"]);
  });
  it("rejects foreign or corrupt files", () => {
    expect(validateBackup({ foo: 1 }).ok).toBe(false);
    expect(validateBackup({ app: "miyar", data: { "miyar:x": "{bad" } }).reason).toBe("corrupt");
  });
  it("round trips", () => {
    const src = mem({ "miyar:boq:v1": '[{"id":1}]' });
    const dst = mem();
    expect(restoreBackup(dst, collectBackup(src)).ok).toBe(true);
    expect(dst.getItem("miyar:boq:v1")).toBe('[{"id":1}]');
  });
});
