/**
 * Minimal smoke test to verify Jest setup works.
 * Tests that the test infrastructure can import and execute TypeScript code.
 */

describe("Test Setup Verification", () => {
  test("Jest is configured and running", () => {
    expect(true).toBe(true);
  });

  test("TypeScript types are recognized", () => {
    const value: string = "test";
    expect(typeof value).toBe("string");
  });

  test("Module resolution with path aliases works", () => {
    // This test verifies that @/ path alias is resolved correctly
    // by importing a simple utility that uses the alias
    const cn = require("@/lib/utils").cn;
    expect(typeof cn).toBe("function");
  });

  test("cn utility function works", () => {
    const { cn } = require("@/lib/utils");
    const result = cn("px-2", "py-1");
    expect(typeof result).toBe("string");
    expect(result).toContain("px-2");
  });
});
