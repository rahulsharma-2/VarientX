const form = document.querySelector("#assignment-form");
const userIdInput = document.querySelector("#user-id");
const debugCheckbox = document.querySelector("#debug");
const summary = document.querySelector("#summary");
const configOutput = document.querySelector("#config-output");
const rawOutput = document.querySelector("#raw-output");
const inputError = document.querySelector("#input-error");

const integerUserIdPattern = /^\d+$/;

const setInputError = (message = "") => {
  inputError.textContent = message;
  userIdInput.setAttribute("aria-invalid", message ? "true" : "false");
};

const updateSummary = (payload) => {
  const pairs = [
    payload.data.experiment.name,
    payload.data.assignment.variant,
    payload.data.assignment.bucket
  ];

  [...summary.querySelectorAll("dd")].forEach((node, index) => {
    node.textContent = `${pairs[index]}`;
  });
};

userIdInput.addEventListener("input", () => {
  const digitsOnlyValue = userIdInput.value.replace(/[^\d]/g, "");

  if (userIdInput.value !== digitsOnlyValue) {
    userIdInput.value = digitsOnlyValue;
  }

  if (digitsOnlyValue) {
    setInputError("");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  if (!userId) {
    setInputError("User ID is assumed to be numeric only. Please enter a valid number.");
    rawOutput.textContent = "Please provide a user ID.";
    configOutput.textContent = "No config available.";
    return;
  }

  if (!integerUserIdPattern.test(userId)) {
    setInputError("User ID is assumed to be numeric only. Please enter a valid number.");
    rawOutput.textContent =
      "User ID is assumed to be numeric only. Please enter a valid number.";
    configOutput.textContent = "No config available.";
    return;
  }

  setInputError("");

  const query = new URLSearchParams({ user_id: userId });
  if (debugCheckbox.checked) {
    query.set("debug", "true");
  }

  rawOutput.textContent = "Loading...";
  configOutput.textContent = "Loading...";

  try {
    const response = await fetch(`/experiment?${query.toString()}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? "Request failed.");
    }

    updateSummary(payload);
    configOutput.textContent = JSON.stringify(payload.data.config, null, 2);
    rawOutput.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    rawOutput.textContent = error.message;
    configOutput.textContent = "No config available.";
  }
});
