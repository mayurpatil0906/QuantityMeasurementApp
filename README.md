# 📏 Quantity Measurement WebApp — JavaScript + JSON Server Measurement System

> A browser-based Quantity Measurement WebApp built using **Vanilla JavaScript**, **Fetch API**, and **JSON Server**.  
The app performs **conversion**, **comparison**, and **arithmetic operations** across multiple measurement types while teaching API integration, DOM manipulation, modular JavaScript, and client-server data flow.

---

# 📋 Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Core Features](#core-features)
- [Use Case Scenarios](#use-case-scenarios)
- [Module Responsibilities](#module-responsibilities)
- [Application Flow](#application-flow)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [JSON Server Database](#json-server-database)
- [Getting Started](#getting-started)
- [Sample UI Flow](#sample-ui-flow)
- [Use Case Summary](#use-case-summary)
- [Educational Goals](#educational-goals)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

# 📌 Project Overview

The **Quantity Measurement WebApp** is a plain HTML, CSS, and JavaScript application that allows users to perform measurement-based operations such as:

- Unit conversion
- Value comparison
- Arithmetic between measurements
- History tracking

The UI design is provided through `index.html` and `style.css`, while the trainee builds the complete logic and data layer using JavaScript and JSON Server.

The project uses **Vanilla JavaScript ES6+** and the **Fetch API** for communication with a local JSON Server backend.

There is no build tool, no React, no Vite, and no framework. All JavaScript files are loaded directly using `<script>` tags.

---

# 🌍 Problem Statement

Measurement systems are commonly used in calculators, engineering tools, educational apps, and scientific applications.

A real-world quantity measurement app must support:

- Multiple measurement types
- Dynamic unit loading
- Conversion factor lookup
- Temperature formula conversion
- Comparison after normalization
- Arithmetic after unit conversion
- Result history persistence
- Clean UI updates
- API-based data fetching

This project solves these problems using modular JavaScript and JSON Server as a lightweight backend.

---

# ✨ Core Features

| Module | Features |
|---|---|
| 📏 Measurement Types | Length, Weight, Temperature, Volume |
| 🔁 Conversion | Convert one unit into another |
| ⚖️ Comparison | Compare two measurement values |
| ➕ Arithmetic | Add, subtract, multiply, divide measurements |
| 🌡️ Formula Support | Temperature conversions using formula strings |
| 🌐 API Layer | Fetch units, conversions, and history |
| 🧠 State Management | Shared app state object |
| 🎨 UI Helpers | Dropdowns, active buttons, result panel |
| 🕘 History Tracking | Save and render calculation history |
| ⚠️ Error Handling | Server failure and invalid conversion handling |

---

# 🧩 Use Case Scenarios

---

# 🗄️ UC-JS-01 — Create JSON Server Database

## Goal

Define the JSON Server database schema and seed measurement data.

## Actor

Developer / End User

## Trigger

Developer sets up the project for the first time.

## Preconditions

```text
json-server is installed globally
```

## Key Requirements

- Create `db.json` at project root
- Add `units` collection
- Add `conversions` collection
- Add empty `history` collection
- Run JSON Server on port `3000`

## Database Collections

```json
{
  "units": [],
  "conversions": [],
  "history": []
}
```

## Example Unit Object

```json
{
  "id": 1,
  "type": "Length",
  "label": "Kilometer",
  "symbol": "km"
}
```

## Example Conversion Object

```json
{
  "id": 1,
  "from": "km",
  "to": "m",
  "factor": 1000,
  "formula": null
}
```

## Temperature Formula Example

```json
{
  "id": 20,
  "from": "C",
  "to": "F",
  "factor": null,
  "formula": "(x*9/5)+32"
}
```

## Output

```text
GET http://localhost:3000/units
Returns all unit records
```

## Benefits

- Creates lightweight backend
- Separates data from UI
- Enables runtime history persistence
- Simulates real REST API behavior

---

# 🚀 UC-JS-02 — Initialise App on Page Load

## Goal

Wire up event listeners and load default app data.

## Trigger

`DOMContentLoaded` event fires.

## Preconditions

- JSON Server is running
- All JS files are loaded
- DOM elements are available

## Main Flow

```text
DOMContentLoaded
      ↓
Create Shared State Object
      ↓
Attach Event Listeners
      ↓
Load Length Units
      ↓
Set Default Active Buttons
      ↓
Hide Operator Row
      ↓
Load History
```

## State Object

```javascript
const state = {
  type: "Length",
  action: "Conversion",
  fromVal: null,
  fromUnit: "",
  toVal: null,
  toUnit: "",
  operator: "+"
};
```

## Benefits

- Prevents DOM access before page load
- Maintains one source of truth
- Initializes the app safely
- Prepares UI for interaction

---

# 🌐 UC-JS-03 — Fetch Units by Type

## Goal

Fetch unit records based on selected measurement type.

## File

```text
js/api.js
```

## API Endpoint

```text
GET /units?type=Length
```

## Key Requirements

- Define `BASE_URL`
- Use Fetch API
- Filter units using query parameter
- Check `res.ok`
- Return unit array

## Sample Function

```javascript
const BASE_URL = "http://localhost:3000";

async function getUnits(type) {
  const res = await fetch(`${BASE_URL}/units?type=${type}`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return await res.json();
}
```

## Benefits

- Keeps API calls separate
- Avoids client-side filtering
- Improves modularity
- Handles server errors cleanly

---

# 🔁 UC-JS-04 — Fetch Conversion Record

## Goal

Fetch conversion factor or formula for a unit pair.

## API Endpoint

```text
GET /conversions?from=km&to=m
```

## Key Point

JSON Server returns an array even for one matching record.

## Sample Function

```javascript
async function getConversion(from, to) {
  const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  if (!data.length) {
    throw new Error("No conversion found");
  }

  return data[0];
}
```

## Benefits

- Supports dynamic conversion lookup
- Handles missing conversion records
- Separates data fetching from calculation logic

---

# 🕘 UC-JS-05 — Save Calculation Record to History

## Goal

Persist successful calculation records.

## API Endpoint

```text
POST /history
```

## Record Format

```javascript
{
  type: "Length",
  action: "Conversion",
  expression: "1 km to m",
  result: "1000 m",
  timestamp: new Date().toISOString()
}
```

## Sample Function

```javascript
async function saveHistory(record) {
  const res = await fetch(`${BASE_URL}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  });

  return await res.json();
}
```

## Benefits

- Saves calculation history
- Adds persistence to the application
- Simulates backend write operation

---

# 📜 UC-JS-06 — Load History Records

## Goal

Load calculation history newest-first.

## API Endpoint

```text
GET /history?_sort=timestamp&_order=desc
```

## Sample Function

```javascript
async function getHistory() {
  const res = await fetch(`${BASE_URL}/history?_sort=timestamp&_order=desc`);

  if (!res.ok) {
    return [];
  }

  return await res.json();
}
```

## Benefits

- Displays previous calculations
- Improves user experience
- Demonstrates sorted API queries

---

# 🧮 UC-JS-07 — Apply Conversion

## Goal

Convert a value using either factor or formula.

## File

```text
js/conversion.js
```

## Factor-Based Conversion

```javascript
value * factor
```

## Formula-Based Conversion

```javascript
(x*9/5)+32
```

## Sample Function

```javascript
function applyConversion(value, convObj) {
  if (Number.isNaN(value)) {
    throw new Error("Invalid number");
  }

  if (convObj.factor !== null) {
    return parseFloat((value * convObj.factor).toFixed(6));
  }

  const expr = convObj.formula.replace("x", value);

  try {
    return parseFloat(eval(expr).toFixed(6));
  } catch {
    throw new Error("Bad formula");
  }
}
```

## Safety Note

```text
Only formulas from db.json should be evaluated.
Never pass user input directly into eval().
```

## Benefits

- Supports normal units and temperature units
- Avoids floating-point noise
- Keeps calculation logic reusable

---

# ⚖️ UC-JS-08 — Compare Two Values

## Goal

Compare two values after normalizing them to a base unit.

## Sample Function

```javascript
function compareValues(v1, u1, v2, u2, base1, base2) {
  if (Number.isNaN(v1) || Number.isNaN(v2)) {
    return "Invalid values — cannot compare";
  }

  if (base1 > base2) {
    return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
  }

  if (base1 < base2) {
    return `${v1} ${u1} is LESS than ${v2} ${u2}`;
  }

  return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}
```

## Benefits

- Gives readable comparison result
- Teaches normalization before comparison
- Supports unit-aware decision making

---

# ➕ UC-JS-09 — Perform Arithmetic Operation

## Goal

Perform arithmetic after converting second value into the first value’s unit.

## Supported Operators

```text
+
-
*
/
```

## Sample Function

```javascript
function performArithmetic(v1, v2normalised, op) {
  switch (op) {
    case "+":
      return parseFloat((v1 + v2normalised).toFixed(6));

    case "-":
      return parseFloat((v1 - v2normalised).toFixed(6));

    case "*":
      return parseFloat((v1 * v2normalised).toFixed(6));

    case "/":
      if (v2normalised === 0) {
        throw new Error("Divide by zero");
      }
      return parseFloat((v1 / v2normalised).toFixed(6));

    default:
      throw new Error("Unknown operator");
  }
}
```

## Benefits

- Supports mathematical operations
- Prevents divide-by-zero errors
- Keeps arithmetic logic clean

---

# 🎚️ UC-JS-10 — Populate Unit Dropdown

## Goal

Fill `<select>` dropdowns with unit options.

## File

```text
js/ui.js
```

## Sample Function

```javascript
function populateDropdown(selectEl, units) {
  if (!selectEl) {
    console.warn("Dropdown not found");
    return;
  }

  selectEl.innerHTML = "";

  const defaultOpt = document.createElement("option");
  defaultOpt.textContent = "-- Select Unit --";
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  selectEl.appendChild(defaultOpt);

  units.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.symbol;
    opt.textContent = `${u.label} (${u.symbol})`;
    selectEl.appendChild(opt);
  });
}
```

## Benefits

- Updates UI dynamically
- Avoids hardcoded dropdowns
- Keeps DOM logic reusable

---

# 🎯 UC-JS-11 — Set Active Button

## Goal

Highlight the selected card, action tab, or operator button.

## Sample Function

```javascript
function setActive(parentEl, clickedEl, childSelector) {
  if (!parentEl) return;

  parentEl.querySelectorAll(childSelector).forEach((el) => {
    el.classList.remove("active");
  });

  clickedEl.classList.add("active");
}
```

## Benefits

- Gives visual feedback
- Maintains clean UI state
- Reuses one function for multiple button groups

---

# 📢 UC-JS-12 — Show Result

## Goal

Display calculated result in the result panel.

## Sample Function

```javascript
function showResult(value, unitSymbol) {
  document.querySelector("#result-value").textContent = value ?? "—";
  document.querySelector("#result-unit").textContent = unitSymbol || "";
}
```

## Benefits

- Updates result panel
- Supports numeric and sentence outputs
- Improves user feedback

---

# ➗ UC-JS-13 — Toggle Operator Row

## Goal

Show operator buttons only in Arithmetic mode.

## Sample Function

```javascript
function toggleOperators(show) {
  const operatorSelector = document.querySelector("#operator-selector");

  if (!operatorSelector) {
    console.warn("Operator selector not found");
    return;
  }

  operatorSelector.style.display = show ? "flex" : "none";
}
```

## Benefits

- Keeps UI mode-specific
- Avoids unnecessary controls
- Improves user experience

---

# 🕘 UC-JS-14 — Render History List

## Goal

Render history records in the history panel.

## Sample Function

```javascript
function renderHistory(records = []) {
  const list = document.querySelector("#history-list");

  if (!list) return;

  list.innerHTML = "";

  if (!records.length) {
    list.innerHTML = "<li>No history yet.</li>";
    return;
  }

  records.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `${r.expression} = ${r.result} (${new Date(
      r.timestamp
    ).toLocaleString()})`;
    list.appendChild(li);
  });
}
```

## Benefits

- Shows previous calculations
- Handles empty history
- Keeps UI synchronized with backend

---

# 🖱️ UC-JS-15 — Handle Type Card Click

## Goal

Update selected measurement type and reload units.

## Main Flow

```text
Click Type Card
      ↓
Update state.type
      ↓
Set Active Card
      ↓
Clear Inputs and Result
      ↓
Fetch Units
      ↓
Populate Dropdowns
```

## Sample Logic

```javascript
document.querySelectorAll(".type-card").forEach((card) => {
  card.addEventListener("click", async () => {
    state.type = card.dataset.type;

    setActive(typeSelector, card, ".type-card");

    fromInput.value = "";
    toInput.value = "";
    showResult(0, "");

    const units = await getUnits(state.type);
    populateDropdown(fromSelect, units);
    populateDropdown(toSelect, units);

    state.fromUnit = "";
    state.toUnit = "";
  });
});
```

---

# 🔀 UC-JS-16 — Handle Action Tab Click

## Goal

Switch between Conversion, Comparison, and Arithmetic modes.

## Main Flow

```text
Click Action Button
      ↓
Update state.action
      ↓
Set Active Action
      ↓
Toggle Operator Row
      ↓
Clear Result
```

## Sample Logic

```javascript
document.querySelectorAll(".action-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.action = btn.dataset.action;

    setActive(actionSelector, btn, ".action-btn");

    toggleOperators(state.action === "Arithmetic");
    showResult(0, "");
  });
});
```

---

# 🧠 UC-JS-17 — Execute Calculation

## Goal

Run conversion, comparison, or arithmetic and display result.

## Main Flow

```text
Input Changes
      ↓
Validate Required Fields
      ↓
Check Current Action
      ↓
Run Calculation
      ↓
Show Result
      ↓
Save History
      ↓
Reload History
```

## Calculation Modes

| Mode | Logic |
|---|---|
| Conversion | Fetch conversion pair and apply factor/formula |
| Comparison | Normalize both values and compare |
| Arithmetic | Normalize second value and apply operator |

## Error Handling

```text
Any error → Show result as "Error: message"
Application remains functional
```

---

# 🧱 Module Responsibilities

| File | Responsibility |
|---|---|
| `db.json` | Stores units, conversions, and history |
| `js/api.js` | Handles all fetch calls |
| `js/conversion.js` | Contains pure calculation functions |
| `js/ui.js` | Contains DOM manipulation helpers |
| `js/app.js` | Manages state, events, and orchestration |
| `index.html` | Trainer-provided UI structure |
| `style.css` | Trainer-provided styling |

---

# 🔄 File Load Order

```html
<script src="js/conversion.js"></script>
<script src="js/api.js"></script>
<script src="js/ui.js"></script>
<script src="js/app.js"></script>
```

## Why This Order Matters

| File | Reason |
|---|---|
| `conversion.js` | Loaded first because it has no dependencies |
| `api.js` | Provides backend functions |
| `ui.js` | Provides UI helper functions |
| `app.js` | Loaded last because it uses all modules |

---

# 🏛️ Application Flow

```text
User Interaction
      ↓
app.js Event Listener
      ↓
State Update
      ↓
api.js Fetch Data
      ↓
conversion.js Calculate
      ↓
ui.js Render Result
      ↓
api.js Save History
      ↓
ui.js Render History
```

---

# 📁 Project Structure

```text
QuantityMeasurementWebApp/
│
├── index.html
├── style.css
├── db.json
│
├── js/
│   ├── conversion.js
│   ├── api.js
│   ├── ui.js
│   └── app.js
│
├── output/
│   └── screenshots/
│
└── README.md
```

---

# 💻 Tech Stack

| Technology | Purpose |
|---|---|
| HTML | Trainer-provided UI structure |
| CSS | Trainer-provided styling |
| JavaScript ES6+ | Application logic |
| Fetch API | HTTP communication |
| JSON Server | Mock REST backend |
| DOM API | UI manipulation |
| Local JSON Data | Units, conversions, history |

---

# 🗄️ JSON Server Database

## Collections

| Collection | Purpose |
|---|---|
| `units` | Stores measurement units |
| `conversions` | Stores conversion factors and formulas |
| `history` | Stores calculation records |

## Start JSON Server

```bash
json-server --watch db.json --port 3000
```

## Example Endpoints

```text
GET  http://localhost:3000/units
GET  http://localhost:3000/units?type=Length
GET  http://localhost:3000/conversions?from=km&to=m
POST http://localhost:3000/history
GET  http://localhost:3000/history?_sort=timestamp&_order=desc
```

---

# 🚀 Getting Started

---

# Prerequisites

```bash
Node.js
JSON Server
Browser
VS Code
```

---

# Install JSON Server

```bash
npm install -g json-server
```

---

# Run Backend

```bash
json-server --watch db.json --port 3000
```

---

# Run Frontend

```text
Open index.html in browser
```

Or use VS Code Live Server.

---

# 🖥️ Sample UI Flow

```text
1. Select Measurement Type: Length
2. Select Action: Conversion
3. Enter Value: 1
4. Select From Unit: km
5. Select To Unit: m
6. Result: 1000 m
7. History Updated
```

---

# 📊 Use Case Summary

| UC ID | Name | File | Triggered By |
|---|---|---|---|
| UC-JS-01 | Create JSON Server Database | db.json | Project setup |
| UC-JS-02 | App Initialisation | app.js | DOMContentLoaded |
| UC-JS-03 | Fetch Units by Type | api.js | Type card click |
| UC-JS-04 | Fetch Conversion Record | api.js | Calculation |
| UC-JS-05 | Save to History | api.js | After calculation |
| UC-JS-06 | Load History | api.js | Page load / after save |
| UC-JS-07 | Apply Conversion | conversion.js | Conversion mode |
| UC-JS-08 | Compare Values | conversion.js | Comparison mode |
| UC-JS-09 | Perform Arithmetic | conversion.js | Arithmetic mode |
| UC-JS-10 | Populate Unit Dropdown | ui.js | After getUnits() |
| UC-JS-11 | Set Active Button | ui.js | Button click |
| UC-JS-12 | Show Result | ui.js | After calculation |
| UC-JS-13 | Toggle Operator Row | ui.js | Action tab click |
| UC-JS-14 | Render History List | ui.js | Load / save |
| UC-JS-15 | Handle Type Card Click | app.js | Click `.type-card` |
| UC-JS-16 | Handle Action Tab Click | app.js | Click `.action-btn` |
| UC-JS-17 | Execute Calculation | app.js | Input change |

---

# 🎯 Educational Goals

| Module | Learning Outcome |
|---|---|
| JavaScript | ES6 functions, state, event listeners |
| Fetch API | GET and POST requests |
| JSON Server | Mock REST API creation |
| DOM Manipulation | Dynamic dropdowns, result panel, history |
| Modular JS | Separation of API, UI, logic, app orchestration |
| Conversion Logic | Factor and formula-based calculations |
| Error Handling | Server errors, invalid conversions |
| UI State | Active buttons and action modes |

---

# 🔮 Future Enhancements

- React or Vite version
- Spring Boot backend
- MySQL database integration
- User login and personal history
- Export history as CSV
- Dark mode
- Graphical conversion trends
- Offline localStorage support
- Unit test coverage
- Deployment on Netlify or Vercel

---

# 📜 License

This project is created for educational and learning purposes.

---

> 📏 *"A good measurement system is not only about converting units — it is about clean logic, correct data flow, and reliable user interaction."*
