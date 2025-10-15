// ============================
// Elements
// ============================
const metricRadio = document.getElementById("metric");
const imperialRadio = document.getElementById("imperial");

const metricInputs = document.querySelector(".input-container:not(.imperial)");
const imperialInputs = document.querySelector(".input-container.imperial");

const heightInput = document.getElementById("height"); // cm
const weightInput = document.getElementById("weight"); // kg
const heightFtInput = document.getElementById("height-ft");
const heightInInput = document.getElementById("height-in");
const weightStInput = document.getElementById("weight-st");
const weightLbsInput = document.getElementById("weight-lbs");

const resultSection = document.querySelector(".result-section");
const startInfo = document.querySelector(".start-info");
const resultBox = document.querySelector(".calculated-result");
const resultValue = document.querySelector(".calculated-result .result");
const descriptionP = document.querySelector(".calculated-result .description");

// ============================
// Helpers
// ============================
function toFixedNumber(num, digits = 1) {
  return Number.isFinite(num) ? num.toFixed(digits) : null;
}

function lbsToStLbs(totalLbs) {
  const st = Math.floor(totalLbs / 14);
  const lbs = Math.round(totalLbs - st * 14);
  return { st, lbs };
}

function formatStLbs(totalLbs) {
  const { st, lbs } = lbsToStLbs(totalLbs);
  return `${st}st ${lbs}lbs`;
}

function kgToLbs(kg) {
  return kg * 2.2046226218;
}

// ============================
// UI toggling & clearing
// ============================
function clearInputs() {
  [
    heightInput,
    weightInput,
    heightFtInput,
    heightInInput,
    weightStInput,
    weightLbsInput,
  ].forEach((i) => (i.value = ""));
}

function showWelcome() {
  startInfo.classList.remove("hidden");
  resultBox.classList.add("hidden");
}

function showResult() {
  startInfo.classList.add("hidden");
  resultBox.classList.remove("hidden");
}

function toggleUnits() {
  if (metricRadio.checked) {
    metricInputs.classList.remove("hidden");
    imperialInputs.classList.add("hidden");
  } else {
    metricInputs.classList.add("hidden");
    imperialInputs.classList.remove("hidden");
  }
  clearInputs();
  showWelcome();
}

// ============================
// Calculation
// ============================
function calculateBMI() {
  if (metricRadio.checked) {
    const heightCm = parseFloat(heightInput.value);
    const weightKg = parseFloat(weightInput.value);

    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
      showWelcome();
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const roundedBMI = toFixedNumber(bmi, 1);

    const minKg = 18.5 * heightM * heightM;
    const maxKg = 24.9 * heightM * heightM;

    updateResult({
      bmi,
      roundedBMI,
      classification: classifyBMI(bmi),
      ideal: { minKg, maxKg },
      units: "metric",
    });
    return;
  }

  // Imperial
  const ft = parseFloat(heightFtInput.value) || 0;
  const inch = parseFloat(heightInInput.value) || 0;
  const st = parseFloat(weightStInput.value) || 0;
  const lbs = parseFloat(weightLbsInput.value) || 0;

  const totalInches = ft * 12 + inch;
  const totalPounds = st * 14 + lbs;

  if (
    (ft === 0 && inch === 0) ||
    (st === 0 && lbs === 0) ||
    totalInches <= 0 ||
    totalPounds <= 0
  ) {
    showWelcome();
    return;
  }

  const bmi = (totalPounds / (totalInches * totalInches)) * 703;
  const roundedBMI = toFixedNumber(bmi, 1);

  const minLbs = (18.5 * totalInches * totalInches) / 703;
  const maxLbs = (24.9 * totalInches * totalInches) / 703;

  updateResult({
    bmi,
    roundedBMI,
    classification: classifyBMI(bmi),
    ideal: { minLbs, maxLbs },
    units: "imperial",
  });
}

// BMI classification
function classifyBMI(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "overweight";
  return "obese";
}

// Update result DOM
function updateResult({ roundedBMI, classification, ideal, units }) {
  showResult();
  resultValue.textContent = roundedBMI;

  let descText = "";
  if (classification === "underweight") {
    descText = "Your BMI suggests you're underweight.";
  } else if (classification === "healthy") {
    descText = "Your BMI suggests you're a healthy weight.";
  } else if (classification === "overweight") {
    descText = "Your BMI suggests you're overweight.";
  } else {
    descText = "Your BMI suggests you're obese.";
  }

  let idealHtml = "";

  if (units === "metric") {
    const minKgStr = toFixedNumber(ideal.minKg, 1);
    const maxKgStr = toFixedNumber(ideal.maxKg, 1);
    idealHtml = `Your ideal weight is between <span class="bold">${minKgStr}kg - ${maxKgStr}kg</span>.`;
  } else {
    const minStLbsStr = formatStLbs(ideal.minLbs);
    const maxStLbsStr = formatStLbs(ideal.maxLbs);
    idealHtml = `Your ideal weight is between <span class="bold">${minStLbsStr} - ${maxStLbsStr}</span>.`;
  }

  descriptionP.innerHTML = `${descText} ${idealHtml}`;
}

// ============================
// Events
// ============================
metricRadio.addEventListener("change", toggleUnits);
imperialRadio.addEventListener("change", toggleUnits);

[
  heightInput,
  weightInput,
  heightFtInput,
  heightInInput,
  weightStInput,
  weightLbsInput,
].forEach((input) => input.addEventListener("input", calculateBMI));

// Init
toggleUnits();
