# US Admissions AI

US Admissions AI is a full-stack Node.js application that generates strategic US university admissions reports from a student's profile and question.

## Architecture

### Request Flow
1. User submits profile data from the web interface.
2. Express API receives the request at `/api/report`.
3. Backend modules perform deterministic analysis:
   - profile analysis
   - competitiveness scoring
   - reach/target/safety recommendation
   - financial aid strategy
   - extracurricular activities strategy
   - essay strategy
   - application timeline
   - university research insights
4. OpenAI prompt architecture converts the analysis payload into a polished strategic report.
5. If OpenAI is unavailable, the fallback report composer returns a complete deterministic report.
6. Frontend displays the full report.

### Tech Stack
- Node.js
- Express
- OpenAI API (official SDK)
- Vanilla HTML/CSS/JavaScript frontend

## Folder Structure

```
.
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server/
│   ├── index.js
│   ├── config/
│   │   └── universities.js
│   ├── modules/
│   │   ├── profileAnalyzer.js
│   │   ├── competitivenessEngine.js
│   │   ├── universityMatchEngine.js
│   │   ├── financialAidStrategist.js
│   │   ├── extracurricularBuilder.js
│   │   ├── essayStrategy.js
│   │   ├── timelineGenerator.js
│   │   ├── researchSystem.js
│   │   └── reportComposer.js
│   ├── prompts/
│   │   ├── systemPrompt.js
│   │   └── reportPrompt.js
│   ├── routes/
│   │   └── report.js
│   └── services/
│       ├── openaiClient.js
│       └── admissionsReportService.js
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

### `GET /api/health`
Health check endpoint.

### `GET /api/universities`
Returns available university dataset metadata used by recommendation and aid modules.

### `POST /api/report`
Generates full admissions strategy report.

Example body:

```json
{
  "profileText": "Grade 11 student from Kazakhstan, GPA 3.9, SAT 1500, interested in CS and economics, need full aid.",
  "question": "Which schools should I prioritize for aid?",
  "profile": {
    "name": "Aruzhan",
    "citizenship": "Kazakhstan",
    "currentGrade": "11",
    "intendedMajors": "Computer Science, Economics",
    "gpa": 3.9,
    "sat": 1500,
    "budgetUsd": 25000,
    "needFinancialAid": true,
    "isInternational": true
  }
}
```

### `POST /api/analyze`
Alias for `/api/report`.

## Prompt Architecture

- `server/prompts/systemPrompt.js`: defines stable behavior, section contract, and strategy style.
- `server/prompts/reportPrompt.js`: injects structured analysis payload and user question into a deterministic prompt template.
- `server/services/openaiClient.js`: sends the prompt to OpenAI Responses API.
- `server/services/admissionsReportService.js`: orchestrates analysis pipeline and fallback strategy.

## Run Instructions

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

```bash
cp .env.example .env
```

3. Add your API key in `.env`:

```bash
OPENAI_API_KEY=your_real_key
```

4. Start the app:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000`

## Notes

- If `OPENAI_API_KEY` is missing or API request fails, the app still returns a full deterministic strategic report.
- The university dataset is intentionally editable in `server/config/universities.js` to customize strategy behavior.
