import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import reportRoutes from "./routes/report.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", reportRoutes);
app.use(express.static(publicDir));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  return res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`US Admissions AI running on http://localhost:${PORT}`);
});
