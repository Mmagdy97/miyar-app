import { describe, it, expect } from "vitest";
import { mapRows, toNumber, parseCsv, toCsv } from "./boqImport";
describe("boq import", () => {
  it("parses numbers in ar/en/tr formats", () => {
    expect(toNumber("١٥٬٠٠٠")).toBe(15000);
    expect(toNumber("1,234.5")).toBe(1234.5);
    expect(toNumber("1.234,5")).toBe(1234.5);
    expect(toNumber("320 ج.م")).toBe(320);
  });
  it("maps Arabic headers and carries section categories", () => {
    const r = mapRows([
      ["مقايسة فيلا"],
      ["القسم", "البند", "الوحدة", "الكمية", "سعر الوحدة", "هامش الربح"],
      ["أعمال الكهرباء", "", "", "", "", ""],
      ["", "نقطة إنارة", "نقطة", "40", "350", "0.2"],
      ["", "لوحة توزيع", "عدد", "2", "4,500", ""],
      ["", "بند بدون كمية", "م2", "", "100", ""],
    ], { startId: 1 });
    expect(r.items).toHaveLength(2);
    expect(r.items[0]).toMatchObject({ category: "أعمال الكهرباء", name: "نقطة إنارة", quantity: 40, unitCost: 350, margin: 20 });
    expect(r.items[1]).toMatchObject({ unitCost: 4500, margin: 20 });
    expect(r.errors).toEqual([{ row: 6, name: "بند بدون كمية" }]);
  });
  it("maps English headers", () => {
    const r = mapRows([["Description", "Qty", "Unit Price", "Margin %"], ["Paint", "100", "45", "25"]]);
    expect(r.items[0]).toMatchObject({ name: "Paint", quantity: 100, unitCost: 45, margin: 25 });
  });
  it("reports missing headers", () => expect(mapRows([["a", "b"], ["1", "2"]]).items).toEqual([]));
  it("csv round trip", () => {
    const items = [{ category: "سباكة", name: 'خلاط "جروهي"', unit: "عدد", quantity: 3, unitCost: 2500, margin: 15, note: "" }];
    const r = mapRows(parseCsv(toCsv(items)), { startId: 1 });
    expect(r.items[0]).toMatchObject({ name: 'خلاط "جروهي"', quantity: 3, unitCost: 2500, margin: 15 });
  });
});
