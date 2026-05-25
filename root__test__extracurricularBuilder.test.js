import test from "node:test";
import assert from "node:assert/strict";
import { analyzeStudentProfile } from "../server/modules/profileAnalyzer.js";
import { generateExtracurricularStrategy } from "../server/modules/extracurricularBuilder.js";

test("extracurricular strategy returns concrete recommendations", () => {
  const profileAnalysis = analyzeStudentProfile({
    profileText: "Grade 11 student. GPA 3.9, SAT 1500, interested in computer science."
  });

  const strategy = generateExtracurricularStrategy(profileAnalysis);

  assert.ok(Array.isArray(strategy.concreteRecommendations));
  assert.ok(strategy.concreteRecommendations.length > 0);
  assert.ok(Array.isArray(strategy.concreteNext30Days));
  assert.ok(strategy.concreteNext30Days.length >= 3);
  assert.ok(Array.isArray(strategy.clarifyingQuestions));
});
