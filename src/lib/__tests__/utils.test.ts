import { cn, generateEmployeeId, validateEmail } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("Utils", () => {
  describe("generateEmployeeId", () => {
    it("should generate first employee ID for a department", () => {
      const result = generateEmployeeId("Engineering", []);
      expect(result).toBe("ENG-001");
    });

    it("should generate next sequential ID", () => {
      const existingIds = ["ENG-001", "ENG-002"];
      const result = generateEmployeeId("Engineering", existingIds);
      expect(result).toBe("ENG-003");
    });

    it("should handle different departments", () => {
      const existingIds = ["OPE-001", "FIN-001"];
      const result = generateEmployeeId("Operations", existingIds);
      expect(result).toBe("OPE-002");
    });

    it("should use first 3 characters of department name", () => {
      const result = generateEmployeeId("Marketing", []);
      expect(result).toBe("MAR-001");
    });

    it("should handle non-sequential existing IDs", () => {
      const existingIds = ["ENG-001", "ENG-005", "ENG-003"];
      const result = generateEmployeeId("Engineering", existingIds);
      expect(result).toBe("ENG-006");
    });

    it("should pad numbers with zeros", () => {
      const result = generateEmployeeId("Finance", []);
      expect(result).toBe("FIN-001");
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email format", () => {
      expect(validateEmail("test@company.com")).toBe(true);
      expect(validateEmail("user.name@example.org")).toBe(true);
      expect(validateEmail("email+tag@domain.co.uk")).toBe(true);
    });

    it("should reject invalid email format", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@company.com")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("test@company")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("test @company.com")).toBe(false);
    });
  });

  describe("cn (className merger)", () => {
    it("should merge class names", () => {
      const result = cn("text-red-500", "bg-blue-500");
      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const isHidden = false;
      const result = cn(
        "base-class",
        isActive && "active",
        isHidden && "hidden",
      );
      expect(result).toBe("base-class active");
    });

    it("should handle Tailwind conflicts", () => {
      const result = cn("p-4", "p-8");
      expect(result).toBe("p-8");
    });
  });
});
