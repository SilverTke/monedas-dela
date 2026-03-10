import "virtual:uno.css";
import { setupChart } from "./chart";
import "./style.css";
/**
 * @typedef {{codigo: string;nombre: string;unidad_medida: "Pesos";fecha: string;valor: number;}} Unit
 */

async function getCurrencies() {
  try {
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json();
    /** @type {Unit[]} */
    const units = Object.values(data)
      .slice(3)
      .filter((v) => v.unidad_medida === "Pesos");
    return units;
  } catch (err) {
    showError(err);
    return [];
  }
}

function getQuantity() {
  /** @type {HTMLInputElement} */
  const quantityInput = document.querySelector("#quantity");
  return quantityInput.valueAsNumber || 0;
}

export function showError(err) {
  document.querySelector("#result").innerHTML =
    `Error obteniendo valores: ${err}`;
}

async function loadOptions() {
  /** @type {HTMLSelectElement} */
  const currencySelect = document.querySelector("#currency");
  const units = await getCurrencies();
  currencySelect.innerHTML = units
    .map((u) => `<option value="${u.codigo}">${u.nombre}</option>`)
    .join("\n");
  currencySelect.selectedIndex = 0;
  const { unit, quantity } = getUnit(currencySelect, units);
  updateResult(unit, quantity);
  currencySelect.addEventListener("change", () => {
    const { unit, quantity } = getUnit(currencySelect, units);
    updateResult(unit, quantity);
  });
  /** @type {HTMLButtonElement}*/ (
    document.querySelector("#submit")
  ).addEventListener("click", () => {
    const value = currencySelect.value;
    if (value) {
      const { unit, quantity } = getUnit(currencySelect, units);
      updateResult(unit, quantity);
    }
  });
}

/**
 *
 * @param {HTMLSelectElement} currencySelect
 * @param {Unit[]} units
 * @returns {{unit: Unit, quantity: number}}
 */
function getUnit(currencySelect, units) {
  const quantity = getQuantity();
  const value = currencySelect.value;
  const unit = units.find((u) => u.codigo === value);
  return { unit, quantity };
}

/**
 *
 * @param {Unit} unit
 * @param {number} quantity
 */
function updateResult(unit, quantity) {
  const numFormat = Intl.NumberFormat("es-CL");
  document.querySelector("#result").innerHTML =
    `Resultado: ${numFormat.format(quantity / unit.valor)}`;
  setupChart(unit.codigo).catch((e) => showError(e));
}

loadOptions();
