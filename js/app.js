import { getUnits } from "./api.js";
import { convertValue } from "./conversion.js";

document.addEventListener("DOMContentLoaded", async () => {

    attachEventListeners();

    await loadUnits("Length");

    toggleOperators(false);

    loadHistory();

    handleConversion(); // initial conversion
});

// EVENTS
function attachEventListeners() {

    const fromInput = document.querySelectorAll(".box input")[0];
    fromInput.addEventListener("input", handleConversion);

    const selects = document.querySelectorAll(".box select");
    selects.forEach(select => {
        select.addEventListener("change", handleConversion);
    });

    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
        radio.addEventListener("change", async (e) => {
            const selectedType = e.target.id;

            await loadUnits(capitalize(selectedType));

            handleConversion(); // important
        });
    });
}

//LOAD UNITS
async function loadUnits(type) {

    const units = await getUnits(type);

    if (!units || units.length === 0) {
        alert("No units found");
        return;
    }

    const selects = document.querySelectorAll(".box select");

    selects.forEach((select, index) => {
        select.innerHTML = "";

        units.forEach(unit => {
            const option = document.createElement("option");
            option.value = unit.symbol;
            option.textContent = unit.label;
            select.appendChild(option);
        });

        // default selection
        select.selectedIndex = index === 0 ? 0 : 1;
    });
}

//CONVERSION FUNCTION
async function handleConversion() {

    const fromInput = document.querySelectorAll(".box input")[0];
    const toInput = document.querySelectorAll(".box input")[1];

    const fromSelect = document.querySelectorAll(".box select")[0];
    const toSelect = document.querySelectorAll(".box select")[1];

    const value = parseFloat(fromInput.value);
    const fromUnit = fromSelect.value;
    const toUnit = toSelect.value;

    if (isNaN(value) || !fromUnit || !toUnit) return;

    const result = await convertValue(value, fromUnit, toUnit);

    if (result !== null) {
        toInput.value = result;
    }
}


function toggleOperators(show) {
    const operatorRow = document.getElementById("operator-row");
    if (!operatorRow) return;
    operatorRow.style.display = show ? "flex" : "none";
}

async function loadHistory() {
    try {
        const res = await fetch("http://localhost:3000/history");
        const history = await res.json();
        console.log("History:", history);
    } catch (error) {
        console.error(error);
    }
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
