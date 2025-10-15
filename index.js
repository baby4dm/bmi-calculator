const metricRadio = document.getElementById("metric");
const imperialRadio = document.getElementById("imperial");

const metricInputs = document.querySelector(".input-container:not(.imperial)");
const imperialInputs = document.querySelector(".input-container.imperial");

const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const heightFtInput = document.getElementById("height-ft");
const heightInInput = document.getElementById("height-in");
const weightStInput = document.getElementById("weight-st");
const weightLbsInput = document.getElementById("weight-lbs");

const resultSection = document.querySelector(".result-section");
const startInfo = document.querySelector(".start-info");
const resultBox = document.querySelector(".calculated-result");
const resultValue = document.querySelector(".result");
const description = document.querySelector(".description");


function toggleUnits() {
  if (metricRadio.checked) {
    metricInputs.classList.remove("hidden");
    imperialInputs.classList.add("hidden");
    clearInputs();
    showWelcome();
  } else {
    metricInputs.classList.add("hidden");
    imperialInputs.classList.remove("hidden");
    clearInputs();
    showWelcome();
  }
}

metricRadio.addEventListener("change", toggleUnits);
imperialRadio.addEventListener("change", toggleUnits);


[
  heightInput,
  weightInput,
  heightFtInput,
  heightInInput,
  weightStInput,
  weightLbsInput,
].forEach((input) => {
  input.addEventListener("input", calculateBMI);
});


function clearInputs() {
  [
    heightInput,
    weightInput,
    heightFtInput,
    heightInInput,
    weightStInput,
    weightLbsInput,
  ].forEach((input) => (input.value = ""));
}

function showWelcome() {
  startInfo.classList.remove("hidden");
  resultBox.classList.add("hidden");
}

function calculateBMI() {
  let bmi;

  if (metricRadio.checked) {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    if (!height || !weight) return showWelcome();

    const heightMeters = height / 100;
    bmi = weight / (heightMeters * heightMeters);
  } else {
    const ft = parseFloat(heightFtInput.value) || 0;
    const inch = parseFloat(heightInInput.value) || 0;
    const st = parseFloat(weightStInput.value) || 0;
    const lbs = parseFloat(weightLbsInput.value) || 0;

    if (!ft && !inch && !st && !lbs) return showWelcome();

    const totalInches = ft * 12 + inch;
    const totalPounds = st * 14 + lbs;

    bmi = (totalPounds / (totalInches * totalInches)) * 703;
  }

  updateResult(bmi);
}

function updateResult(bmi) {
  startInfo.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const roundedBMI = bmi.toFixed(1);
  resultValue.textContent = roundedBMI;

  let message = "";

  if (bmi < 18.5) {
    message = "Your BMI suggests you're underweight.";
  } else if (bmi < 25) {
    message = "Your BMI suggests you're a healthy weight.";
  } else if (bmi < 30) {
    message = "Your BMI suggests you're overweight.";
  } else {
    message = "Your BMI suggests you're obese.";
  }

  description.textContent = message;
}
