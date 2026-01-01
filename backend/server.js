import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
};

const languageMap = {
  python: 71,
  javascript: 63,
  c: 50,
  cpp: 54,
  go: 60,
  r: 80,
  sql: 82
};

app.post("/api/run", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code required." });
  }

  const language_id = languageMap[language];

  if (!language_id) {
    return res.status(400).json({ error: "Unsupported language." });
  }

  try {
    const submission = await axios.post(
      `${JUDGE0_URL}?wait=true`,
      {
        source_code: code,
        language_id
      },
      { headers: HEADERS }
    );

    const { stdout, stderr, compile_output } = submission.data;

    if (compile_output) {
      return res.json({ error: compile_output });
    }

    if (stderr) {
      return res.json({ error: stderr });
    }

    return res.json({ output: stdout || "" });
  } catch (err) {
    return res.status(500).json({
      error: "Execution failed. Please try again."
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Code runner listening on port 5000");
});

