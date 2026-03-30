import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { convertValue } from "../js/conversion.js";
import * as api from "../js/api.js";

describe("Conversion Module Tests", () => {

    beforeEach(() => {
        jest.spyOn(global, "alert").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it("returns same value when units are same", async () => {
        jest.spyOn(api, "getConversion").mockResolvedValue({
            from: "m",
            to: "m",
            factor: 1,
            formula: null
        });

        const result = await convertValue(10, "m", "m");

        expect(result).toBe(10);
    });


    it("applies factor conversion correctly", async () => {
        jest.spyOn(api, "getConversion").mockResolvedValue({
            from: "m",
            to: "cm",
            factor: 100,
            formula: null
        });

        const result = await convertValue(2, "m", "cm");

        expect(result).toBe(200);
    });


    it("applies formula conversion correctly", async () => {
        jest.spyOn(api, "getConversion").mockResolvedValue({
            from: "C",
            to: "F",
            factor: null,
            formula: "(x*9/5)+32"
        });

        const result = await convertValue(0, "C", "F");

        expect(result).toBe(32);
    });

    it("returns null for invalid input value", async () => {
        jest.spyOn(api, "getConversion").mockResolvedValue({
            from: "m",
            to: "cm",
            factor: 100,
            formula: null
        });

        const result = await convertValue("abc", "m", "cm");

        expect(result).toBeNull();
        expect(alert).toHaveBeenCalled();
    });


    it("handles bad formula error", async () => {
        jest.spyOn(api, "getConversion").mockResolvedValue({
            from: "C",
            to: "F",
            factor: null,
            formula: "invalid_formula"
        });

        const result = await convertValue(10, "C", "F");

        expect(result).toBeNull();
        expect(alert).toHaveBeenCalled();
    });

    it("handles API failure gracefully", async () => {
        jest.spyOn(api, "getConversion").mockRejectedValue(new Error("API failed"));

        const result = await convertValue(10, "m", "cm");

        expect(result).toBeNull();
        expect(alert).toHaveBeenCalledWith("Conversion not available for this pair");
    });

});
