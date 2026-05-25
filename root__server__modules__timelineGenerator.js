function annualPlan() {
  return {
    grade9: [
      "Build core academic foundation; target top grades in the most rigorous available courses.",
      "Explore 2-3 activity domains before selecting one long-term impact direction.",
      "Start reading and writing habit to improve future test and essay performance."
    ],
    grade10: [
      "Commit to one high-impact extracurricular track with measurable outcomes.",
      "Take PSAT/pre-ACT baseline and close core weaknesses in math/reading.",
      "Pursue first leadership role or independent project with public output."
    ],
    grade11: [
      "Take SAT/ACT early and retake strategically for score optimization.",
      "Scale flagship activity: research publication, competition result, startup milestone, or community initiative growth.",
      "Build initial college list and classify schools by admission + affordability fit.",
      "Identify recommendation teachers and maintain documented impact in their classes."
    ],
    grade12: [
      "Finalize balanced reach-target-safety portfolio with aid-aware sequencing.",
      "Complete personal statement, supplements, activity list, and recommendation packets early.",
      "Submit financial aid documents on or before deadlines (CSS/ISFAA/IDOC as required).",
      "Maintain grades and continue core activity impact through decision season."
    ]
  };
}

function monthName(monthIndex) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ][monthIndex];
}

function immediateCyclePlan() {
  const now = new Date();

  const m1 = now.getMonth();
  const m2 = (m1 + 1) % 12;
  const m3 = (m1 + 2) % 12;

  return [
    {
      month: monthName(m1),
      priorities: [
        "Audit profile gaps (scores, activities, honors, narrative coherence).",
        "Build final university list with affordability filters.",
        "Draft personal statement v1 and identify recommender strategy."
      ]
    },
    {
      month: monthName(m2),
      priorities: [
        "Revise essays with institution-specific fit details.",
        "Prepare standardized test retake or confirm score-submission strategy.",
        "Compile scholarship spreadsheet with deadline tiers."
      ]
    },
    {
      month: monthName(m3),
      priorities: [
        "Submit early/priority applications where aid and merit leverage is highest.",
        "Complete all financial aid forms and supporting documentation.",
        "Run final quality control across activities, honors, and supplemental responses."
      ]
    }
  ];
}

export function generateApplicationTimeline() {
  return {
    multiYearPlan: annualPlan(),
    next90Days: immediateCyclePlan()
  };
}
