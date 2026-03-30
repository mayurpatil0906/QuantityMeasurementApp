import { beforeEach, afterEach, describe, expect, it, jest } from "@jest/globals";
import { getUnits, getConversion, saveHistory, getHistory } from "../js/api.js";

describe("API Module Tests", () => {

    beforeEach(() => {
        global.fetch = jest.fn();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it("getUnits returns data on success", async () => {
        const mockData = [{ symbol: "m", label: "Meter" }];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockData
        });

        const result = await getUnits("Length");

        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/units?type=Length");
    });

    it("getUnits returns empty array on error", async () => {
        global.fetch.mockRejectedValue(new Error("Network Error"));

        const result = await getUnits("Length");

        expect(result).toEqual([]);
    });


    it("getConversion returns identity when units are same", async () => {
        const result = await getConversion("m", "m");

        expect(result).toEqual({
            from: "m",
            to: "m",
            factor: 1,
            formula: null
        });

        expect(fetch).not.toHaveBeenCalled();
    });

    it("getConversion returns conversion data", async () => {
        const mockData = [{ from: "m", to: "cm", factor: 100, formula: null }];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockData
        });

        const result = await getConversion("m", "cm");

        expect(result).toEqual(mockData[0]);
    });

    it("getConversion throws error if no data found", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => []
        });

        await expect(getConversion("m", "kg")).rejects.toThrow("No conversion found");
    });


    it("saveHistory posts data and returns response", async () => {
        const mockResponse = { id: 1 };

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        });

        const record = { value: 10 };

        const result = await saveHistory(record);

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("http://localhost:3000/history", expect.any(Object));
    });

    it("saveHistory logs error on failure", async () => {
        global.fetch.mockRejectedValue(new Error("POST failed"));

        const result = await saveHistory({ value: 10 });

        expect(result).toBeUndefined(); // your function does not return anything on error
    });

   
    it("getHistory returns data on success", async () => {
        const mockData = [{ expression: "1 km → m", result: 1000 }];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockData
        });

        const result = await getHistory();

        expect(result).toEqual(mockData);
    });

    it("getHistory returns empty array on failure", async () => {
        global.fetch.mockRejectedValue(new Error("Network Error"));

        const result = await getHistory();

        expect(result).toEqual([]);
    });

});