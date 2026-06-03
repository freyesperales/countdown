import { describe, it, expect } from "vitest";
import { pad2, padDays, sanitizeLabel } from "../src/lib/format";

describe("pad2", () => {
  it("pads single digits", () => {
    expect(pad2(0)).toBe("00");
    expect(pad2(7)).toBe("07");
    expect(pad2(9)).toBe("09");
  });
  it("leaves two-digit numbers alone", () => {
    expect(pad2(10)).toBe("10");
    expect(pad2(59)).toBe("59");
  });
  it("does not truncate larger numbers", () => {
    expect(pad2(100)).toBe("100");
  });
  it("handles negatives safely", () => {
    expect(pad2(-1)).toBe("00");
  });
});

describe("padDays", () => {
  it("pads single digits", () => {
    expect(padDays(0)).toBe("00");
    expect(padDays(3)).toBe("03");
  });
  it("does not truncate 100+ day values", () => {
    expect(padDays(365)).toBe("365");
    expect(padDays(1024)).toBe("1024");
  });
});

describe("sanitizeLabel", () => {
  it("returns empty for nullish", () => {
    expect(sanitizeLabel(null)).toBe("");
    expect(sanitizeLabel(undefined)).toBe("");
    expect(sanitizeLabel("")).toBe("");
  });
  it("trims whitespace", () => {
    expect(sanitizeLabel("  Christmas  ")).toBe("Christmas");
  });
  it("caps at 60 chars", () => {
    expect(sanitizeLabel("a".repeat(120)).length).toBe(60);
  });
  it("strips ASCII control chars but keeps printable unicode", () => {
    expect(sanitizeLabel("hi\x00 there\x07")).toBe("hi there");
    expect(sanitizeLabel("Año Nuevo")).toBe("Año Nuevo");
  });
});
