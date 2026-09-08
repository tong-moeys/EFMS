import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const formattedHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: "You are a helpful assistant for a Cambodian school inventory and budget system (TongICT Inventory System for Rauk Primary School). You speak fluent Khmer and English. You help users understand their data, navigate the system, and answer questions about holidays or general school administration. Keep responses concise and friendly." }]
          },
          {
            role: "model",
            parts: [{ text: "សួស្តី! ខ្ញុំគឺជាជំនួយការ AI សម្រាប់ប្រព័ន្ធគ្រប់គ្រងសារពើភ័ណ្ឌ និងថវិកាសាលារៀន។ តើថ្ងៃនេះមានអ្វីឲ្យខ្ញុំជួយទេ?" }]
          },
          ...formattedHistory,
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "បរាជ័យក្នុងការភ្ជាប់ទៅកាន់ AI: " + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support Express v4 syntax
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
