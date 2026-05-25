function parseMajorCluster(intendedMajors) {
  const majors = intendedMajors.map((m) => m.toLowerCase()).join(" ");

  if (/computer|data|ai|software|engineering|math/.test(majors)) {
    return "stem";
  }
  if (/business|economics|finance|marketing/.test(majors)) {
    return "business";
  }
  if (/political|international|public policy|law|history/.test(majors)) {
    return "policy";
  }
  if (/biology|medicine|health|neuroscience|psychology/.test(majors)) {
    return "health";
  }
  return "general";
}

function buildCatalog(cluster) {
  const shared = [
    {
      title: "Impact project in local community",
      why: "Shows leadership + measurable outcomes.",
      actions: [
        "Choose one problem (education, environment, health) and run a 6-week pilot.",
        "Track metrics weekly: participants, retention, results.",
        "Publish outcomes in a one-page impact report."
      ],
      resources: [
        { name: "UN SDG Goals", url: "https://sdgs.un.org/goals" },
        { name: "Notion Templates", url: "https://www.notion.so/templates" }
      ],
      metrics: "Goal: 50+ participants or 100+ volunteer-hours with proof."
    },
    {
      title: "Competition strategy",
      why: "Third-party validation is high-signal for admissions.",
      actions: [
        "Pick 1-2 competitions with deadlines in next 3-6 months.",
        "Build weekly prep sprints and mock submissions.",
        "Submit one polished project, not multiple weak attempts."
      ],
      resources: [
        { name: "Devpost", url: "https://devpost.com/hackathons" },
        { name: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
      ],
      metrics: "Goal: finalist ranking, shortlist, or published submission."
    }
  ];

  if (cluster === "stem") {
    return [
      {
        title: "Research + publication track",
        why: "Strong spike for selective STEM admissions.",
        actions: [
          "Choose one narrow research question and replicate 1-2 papers.",
          "Open-source code and write clear experiment logs.",
          "Submit preprint or article to student research outlets."
        ],
        resources: [
          { name: "Google Colab", url: "https://colab.research.google.com" },
          { name: "arXiv", url: "https://arxiv.org" },
          { name: "GitHub", url: "https://github.com" }
        ],
        metrics: "Goal: public repo + technical report + external review."
      },
      ...shared
    ];
  }

  if (cluster === "business") {
    return [
      {
        title: "Micro-startup / revenue experiment",
        why: "Demonstrates initiative, execution, and market thinking.",
        actions: [
          "Launch a niche service/product for students in 4 weeks.",
          "Track customers, retention, and revenue dashboard.",
          "Write a failure/iteration memo every 2 weeks."
        ],
        resources: [
          { name: "Stripe Atlas Guides", url: "https://stripe.com/atlas/guides" },
          { name: "Y Combinator Startup School", url: "https://www.startupschool.org" }
        ],
        metrics: "Goal: first 20 users or first $500 revenue with proof."
      },
      ...shared
    ];
  }

  if (cluster === "policy") {
    return [
      {
        title: "Policy brief + civic advocacy",
        why: "Builds policy evidence beyond debate participation.",
        actions: [
          "Publish 2 policy briefs on local issue with data sources.",
          "Host one community consultation or youth forum.",
          "Send recommendations to local institutions/media."
        ],
        resources: [
          { name: "Our World in Data", url: "https://ourworldindata.org" },
          { name: "World Bank Data", url: "https://data.worldbank.org" }
        ],
        metrics: "Goal: documented stakeholder feedback + public publication."
      },
      ...shared
    ];
  }

  if (cluster === "health") {
    return [
      {
        title: "Public health awareness initiative",
        why: "Combines science interest with measurable social impact.",
        actions: [
          "Design evidence-based awareness materials with citations.",
          "Run workshops in schools or online sessions.",
          "Collect pre/post knowledge data to show effect."
        ],
        resources: [
          { name: "WHO Data", url: "https://www.who.int/data" },
          { name: "CDC Resources", url: "https://www.cdc.gov" }
        ],
        metrics: "Goal: 100+ participants and measurable improvement in survey scores."
      },
      ...shared
    ];
  }

  return [
    {
      title: "Flagship project with public output",
      why: "Creates a clear admissions narrative around one spike.",
      actions: [
        "Choose one problem area and commit for 3+ months.",
        "Build tangible outputs: website, report, toolkit, or app.",
        "Collect evidence and testimonials monthly."
      ],
      resources: [
        { name: "Coursera Guided Projects", url: "https://www.coursera.org/projects" },
        { name: "GitHub", url: "https://github.com" }
      ],
      metrics: "Goal: one credible public portfolio artifact with impact metrics."
    },
    ...shared
  ];
}

function buildClarifyingQuestions(profile) {
  const questions = [];

  if (!profile.weeklyHours) {
    questions.push("How many hours per week can you consistently commit to extracurricular work?");
  }

  if (!profile.opportunities.length) {
    questions.push("What opportunities do you already have access to (labs, mentors, clubs, NGOs, startup communities)?");
  }

  if (!profile.constraints.length) {
    questions.push("What are your constraints (budget, travel, language, internet quality, family responsibilities)?");
  }

  return questions;
}

export function generateExtracurricularStrategy(profileAnalysis) {
  const profile = profileAnalysis.structuredProfile;
  const cluster = parseMajorCluster(profile.intendedMajors);
  const recommendations = buildCatalog(cluster);
  const clarifyingQuestions = buildClarifyingQuestions(profile);

  const concreteNext30Days = [
    "Pick one flagship activity track and define one measurable 8-week target.",
    "Create weekly execution plan (tasks, hours, deliverables).",
    "Publish proof-of-work every 2 weeks (repo, report, portfolio post).",
    "Get one external validator (mentor/teacher/professional) to review your output.",
    "Capture impact metrics in a simple tracker for future application essays."
  ];

  return {
    focusArea: cluster,
    concreteRecommendations: recommendations,
    concreteNext30Days,
    clarifyingQuestions,
    profileSignals: {
      currentActivitiesCount: profile.activities.length,
      weeklyHours: profile.weeklyHours || "not specified",
      opportunities: profile.opportunities,
      constraints: profile.constraints
    }
  };
}
