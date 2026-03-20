import { getConversion } from "./api.js";

export async function convertValue(value, from, to) {
    try {

        const conversion = await getConversion(from, to);

        // FACTOR CASE
        if (conversion.factor !== null) {
            return value * conversion.factor;
        }

        // FORMULA CASE (temperature)
        if (conversion.formula) {
            const formula = conversion.formula.replace(/x/g, value);
            return eval(formula);
        }

        throw new Error("Invalid conversion");

    } catch (error) {
        alert("Conversion not available for this pair");
        console.error(error);
        return null;
    }
}