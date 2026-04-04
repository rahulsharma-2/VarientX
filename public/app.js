const form = document.querySelector("#assignment-form");
const userIdInput = document.querySelector("#user-id");
const debugCheckbox = document.querySelector("#debug");
const summary = document.querySelector("#summary");
const configOutput = document.querySelector("#config-output");
const rawOutput = document.querySelector("#raw-output");

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  if (!userId) {
    rawOutput.textContent = "Please provide a user ID.";
    return;
  }

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
