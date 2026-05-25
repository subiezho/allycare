const form = document.getElementById("admissions-form");
const submitBtn = document.getElementById("submitBtn");
const outputPanel = document.getElementById("outputPanel");
const errorPanel = document.getElementById("errorPanel");
const reportText = document.getElementById("reportText");
const errorText = document.getElementById("errorText");
const meta = document.getElementById("meta");

function readNumber(name) {
  const value = form[name].value.trim();
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildPayload() {
  return {
    profileText: form.profileText.value.trim(),
    question: form.question.value.trim(),
    profile: {
      name: form.name.value.trim() || undefined,
      citizenship: form.citizenship.value.trim() || undefined,
      currentGrade: form.currentGrade.value.trim() || undefined,
      intendedMajors: form.intendedMajors.value.trim() || undefined,
      gpa: readNumber("gpa") ?? undefined,
      sat: readNumber("sat") ?? undefined,
      act: readNumber("act") ?? undefined,
      toefl: readNumber("toefl") ?? undefined,
      ielts: readNumber("ielts") ?? undefined,
      duolingo: readNumber("duolingo") ?? undefined,
      budgetUsd: readNumber("budgetUsd") ?? undefined,
      weeklyHours: readNumber("weeklyHours") ?? undefined,
      opportunities: form.opportunities.value.trim() || undefined,
      constraints: form.constraints.value.trim() || undefined,
      needFinancialAid: form.needFinancialAid.checked,
      isInternational: form.isInternational.checked,
      firstGen: form.firstGen.checked,
      lowIncome: form.lowIncome.checked
    }
  };
}

function showError(message) {
  errorText.textContent = message;
  errorPanel.hidden = false;
  outputPanel.hidden = true;
}

function showReport(report) {
  const source = report.source === "openai" ? "OpenAI" : "Deterministic engine";
  const generated = new Date(report.generatedAt).toLocaleString();
  const warning = report.llmError ? ` | OpenAI warning: ${report.llmError}` : "";

  meta.textContent = `Generated: ${generated} | Source: ${source}${warning}`;
  reportText.textContent = report.reportText;

  outputPanel.hidden = false;
  errorPanel.hidden = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Generating...";

  try {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildPayload())
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.details || "Unable to generate report.");
    }

    showReport(data.report);
  } catch (error) {
    showError(error instanceof Error ? error.message : "Unexpected client error.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Generate Strategic Report";
  }
});
