import { analyzeStudentProfile } from "../modules/profileAnalyzer.js";
import { evaluateCompetitiveness } from "../modules/competitivenessEngine.js";
import { generateUniversityRecommendations } from "../modules/universityMatchEngine.js";
import { generateFinancialAidStrategy } from "../modules/financialAidStrategist.js";
import { generateEssayStrategy } from "../modules/essayStrategy.js";
import { generateExtracurricularStrategy } from "../modules/extracurricularBuilder.js";
import { generateApplicationTimeline } from "../modules/timelineGenerator.js";
import { generateUniversityResearch } from "../modules/researchSystem.js";
import { composeStructuredFallbackReport } from "../modules/reportComposer.js";
import { ADMISSIONS_SYSTEM_PROMPT } from "../prompts/systemPrompt.js";
import { buildAdmissionsPrompt } from "../prompts/reportPrompt.js";
import { generateStrategicNarrative, isOpenAIConfigured } from "./openaiClient.js";

export async function buildAdmissionsReport(payload = {}) {
  const profileAnalysis = analyzeStudentProfile(payload);
  const competitiveness = evaluateCompetitiveness(profileAnalysis);
  const recommendations = generateUniversityRecommendations(profileAnalysis, competitiveness);
  const financialAid = generateFinancialAidStrategy(profileAnalysis, recommendations);
  const essayStrategy = generateEssayStrategy(profileAnalysis);
  const extracurricularStrategy = generateExtracurricularStrategy(profileAnalysis);
  const timeline = generateApplicationTimeline(profileAnalysis);
  const research = generateUniversityResearch(profileAnalysis, recommendations);

  const reportPayload = {
    profileAnalysis,
    competitiveness,
    recommendations,
    financialAid,
    extracurricularStrategy,
    timeline,
    essayStrategy,
    research
  };

  let reportText;
  let source = "fallback";
  let llmError = null;

  if (isOpenAIConfigured()) {
    try {
      const userPrompt = buildAdmissionsPrompt(reportPayload);
      const aiText = await generateStrategicNarrative({
        systemPrompt: ADMISSIONS_SYSTEM_PROMPT,
        userPrompt
      });

      if (aiText) {
        reportText = aiText;
        source = "openai";
      }
    } catch (error) {
      llmError = error instanceof Error ? error.message : "OpenAI request failed";
    }
  }

  if (!reportText) {
    reportText = composeStructuredFallbackReport(reportPayload);
  }

  return {
    generatedAt: new Date().toISOString(),
    source,
    llmError,
    reportText,
    data: reportPayload
  };
}
