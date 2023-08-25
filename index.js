import express from "express";
import download from "download";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

async function readFile(file) {
  const filePath = `.`;
  const content = await download(file, filePath);
  console.log(content.toString());
  return content.toString();
}

async function query(req) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(req),
    }
  );
  const result = await response.json();
  return result;
}

app.post("/askQuestion", async (req, res) => {
  try {
    const context = await readFile(req.body.context);

    const response = await query({
      inputs: {
        question: req.body.question,
        context: context,
      },
    });

    console.log(JSON.stringify(response));
    res.send(JSON.stringify(response.answer));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
