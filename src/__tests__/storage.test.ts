import { describe, expect, it, vi } from "vitest";
import {
  getStorageValue,
  removeStorageValue,
  setStorageValue,
} from "../utils/storage";

describe("storage utilities", () => {
  describe("getStorageValue", () => {
    it("returns null when key does not exist", () => {
      const result = getStorageValue("non-existent-key");
      expect(result).toBeNull();
    });

    it("returns value when key exists", () => {
      localStorage.setItem("test-key", "test-value");
      const result = getStorageValue("test-key");
      expect(result).toBe("test-value");
    });

    it("uses sessionStorage when specified", () => {
      sessionStorage.setItem("session-key", "session-value");
      const result = getStorageValue("session-key", { type: "sessionStorage" });
      expect(result).toBe("session-value");
    });

    it("returns null when storage throws error", () => {
      vi.spyOn(localStorage, "getItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = getStorageValue("error-key");
      expect(result).toBeNull();
    });
  });

  describe("setStorageValue", () => {
    it("sets value in localStorage by default", () => {
      const result = setStorageValue("test-key", "test-value");
      expect(result).toBe(true);
      expect(localStorage.getItem("test-key")).toBe("test-value");
    });

    it("sets value in sessionStorage when specified", () => {
      const result = setStorageValue("session-key", "session-value", {
        type: "sessionStorage",
      });
      expect(result).toBe(true);
      expect(sessionStorage.getItem("session-key")).toBe("session-value");
    });

    it("returns false when storage throws error", () => {
      vi.spyOn(localStorage, "setItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = setStorageValue("error-key", "value");
      expect(result).toBe(false);
    });
  });

  describe("removeStorageValue", () => {
    it("removes value from localStorage", () => {
      localStorage.setItem("remove-key", "value");
      const result = removeStorageValue("remove-key");
      expect(result).toBe(true);
      expect(localStorage.getItem("remove-key")).toBeNull();
    });

    it("removes value from sessionStorage when specified", () => {
      sessionStorage.setItem("session-remove", "value");
      const result = removeStorageValue("session-remove", {
        type: "sessionStorage",
      });
      expect(result).toBe(true);
      expect(sessionStorage.getItem("session-remove")).toBeNull();
    });
  });
});
