/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "@jest/globals";
import {
    populateDropdown,
    setActive,
    showResult,
    toggleOperators,
    renderHistory
} from "../js/ui.js";

describe("UI Module Tests", () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <select id="dropdown"></select>

            <div id="parent">
                <button class="btn">A</button>
                <button class="btn">B</button>
            </div>

            <div id="resultPanel">
                <span id="result-value"></span>
                <span id="result-unit"></span>
            </div>

            <div id="operator-selector"></div>

            <ul id="history-list"></ul>
        `;
    });

  
    it("populateDropdown fills select with options", () => {
        const select = document.getElementById("dropdown");

        const units = [
            { label: "Meter", symbol: "m" },
            { label: "Kilometer", symbol: "km" }
        ];

        populateDropdown(select, units);

        expect(select.children.length).toBe(3); // default + 2 units
        expect(select.children[1].value).toBe("m");
        expect(select.children[2].textContent).toContain("Kilometer");
    });

    it("populateDropdown handles empty array", () => {
        const select = document.getElementById("dropdown");

        populateDropdown(select, []);

        expect(select.children.length).toBe(1); // only default option
    });

   

    it("setActive sets only clicked element as active", () => {
        const parent = document.getElementById("parent");
        const buttons = parent.querySelectorAll(".btn");

        setActive(parent, buttons[0], ".btn");

        expect(buttons[0].classList.contains("active")).toBe(true);
        expect(buttons[1].classList.contains("active")).toBe(false);
    });

   
    it("showResult displays value and unit", () => {
        showResult(100, "m");

        expect(document.querySelector("#result-value").textContent).toBe("100");
        expect(document.querySelector("#result-unit").textContent).toBe("m");
    });

    it("showResult handles null value", () => {
        showResult(null, "");

        expect(document.querySelector("#result-value").textContent).toBe("—");
    });


    it("toggleOperators shows operator row", () => {
        const el = document.getElementById("operator-selector");

        toggleOperators(true);

        expect(el.style.display).toBe("flex");
    });

    it("toggleOperators hides operator row", () => {
        const el = document.getElementById("operator-selector");

        toggleOperators(false);

        expect(el.style.display).toBe("none");
    });

    it("renderHistory displays history list", () => {
        const records = [
            {
                expression: "1 km → m",
                result: 1000,
                timestamp: new Date().toISOString()
            }
        ];

        renderHistory(records);

        const list = document.getElementById("history-list");

        expect(list.children.length).toBe(1);
        expect(list.textContent).toContain("1 km → m");
    });

    it("renderHistory handles empty records", () => {
        renderHistory([]);

        const list = document.getElementById("history-list");

        expect(list.innerHTML).toContain("No history yet");
    });

});
