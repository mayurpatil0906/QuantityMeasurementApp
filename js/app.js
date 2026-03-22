import { getUnits, saveHistory } from "./api.js";
import { convertValue } from "./conversion.js";

let isUserTyping = false;
let currentType = "Length";
let lastResult = "";
let lastValue = "";   // store input
let isLoadingUnits = false;

// INIT
document.addEventListener("DOMContentLoaded", async () => {
    attachEventListeners();
    await loadUnits(currentType);
});

// EVENTS
function attachEventListeners() {

    const fromInput = document.querySelectorAll(".box input")[0];

    fromInput.addEventListener("input", () => {
        isUserTyping = true;
        lastValue = fromInput.value;   //store value
        handleConversion();
    });

    const typeRadios = document.querySelectorAll('input[name="type"]');

    typeRadios.forEach(radio => {
        radio.addEventListener("change", async (e) => {

            const selectedType = capitalize(e.target.id);

            if (selectedType === currentType) return;

            currentType = selectedType;

            await loadUnits(selectedType);

            // RESTORE VALUE + RESULT AFTER UI CHANGE
            const fromInput = document.querySelectorAll(".box input")[0];
            const toInput = document.querySelectorAll(".box input")[1];

            if (lastValue !== "") {
                fromInput.value = lastValue;
            }

            if (lastResult !== "") {
                toInput.value = lastResult;
            }
        });
    });
}

// LOAD UNITS
async function loadUnits(type) {

    isLoadingUnits = true;

    const units = await getUnits(type);

    if (!units || units.length === 0) {
        alert("No units found");
        isLoadingUnits = false;
        return;
    }

    const selects = document.querySelectorAll(".box select");

    selects.forEach((select) => {
        select.innerHTML = "";

        units.forEach(unit => {
            const option = document.createElement("option");
            option.value = unit.symbol;
            option.textContent = unit.label;
            select.appendChild(option);
        });
    });

    isLoadingUnits = false;
}

// CONVERSION
async function handleConversion() {

    if (isLoadingUnits) return;

    const fromInput = document.querySelectorAll(".box input")[0];
    const toInput = document.querySelectorAll(".box input")[1];

    const fromSelect = document.querySelectorAll(".box select")[0];
    const toSelect = document.querySelectorAll(".box select")[1];

    const value = parseFloat(fromInput.value);
    const fromUnit = fromSelect.value;
    const toUnit = toSelect.value;

    if (isNaN(value) || !fromUnit || !toUnit) {
        if (lastResult !== "") {
            toInput.value = lastResult;
        }
        return;
    }

    const result = await convertValue(value, fromUnit, toUnit);

    if (result !== null) {

        const finalResult = parseFloat(result.toFixed(4));

        // store values
        lastResult = finalResult;
        lastValue = value;

        // show result
        toInput.value = finalResult;

        if (!isUserTyping) return;

        const selectedType = document.querySelector('input[name="type"]:checked').id;
        const selectedAction = document.querySelector('input[name="action"]:checked').id;

        const record = {
            type: capitalize(selectedType),
            action: capitalize(selectedAction),
            expression: `${value} ${fromUnit} → ${toUnit}`,
            result: finalResult,
            timestamp: new Date().toISOString()
        };

        saveHistory(record).catch(() => {});

        isUserTyping = false;
    }
}

// HELPER
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
