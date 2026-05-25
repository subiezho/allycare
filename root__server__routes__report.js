import { Router } from "express";
import { buildAdmissionsReport } from "../services/admissionsReportService.js";
import { UNIVERSITY_DATA } from "../config/universities.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "US Admissions AI",
    timestamp: new Date().toISOString()
  });
});

router.get("/universities", (_req, res) => {
  res.json({
    count: UNIVERSITY_DATA.length,
    universities: UNIVERSITY_DATA.map((u) => ({
      name: u.name,
      type: u.type,
      acceptanceRate: `${Math.round(u.acceptanceRate * 100)}%`,
      meritAid: u.meritAid,
      aidGenerosity: u.aidGenerosity,
      strengths: u.strengths
    }))
  });
});

async function handleReportRequest(req, res) {
  try {
    const payload = req.body || {};

    const hasProfileText = Boolean(String(payload.profileText || payload.profile || "").trim());
    const hasStructuredProfile = payload.profile && Object.keys(payload.profile).length > 0;
    const hasQuestion = Boolean(String(payload.question || "").trim());

    if (!hasProfileText && !hasStructuredProfile && !hasQuestion) {
      return res.status(400).json({
        error: "Please provide a student profile or question.",
        expected: {
          profileText: "Free-form student profile",
          question: "Optional strategic question",
          profile: "Optional structured profile object"
        }
      });
    }

    const report = await buildAdmissionsReport(payload);

    return res.json({
      success: true,
      report
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to generate admissions report.",
      details: error instanceof Error ? error.message : "Unknown server error"
    });
  }
}

router.post("/report", handleReportRequest);
router.post("/analyze", handleReportRequest);

export default router;
