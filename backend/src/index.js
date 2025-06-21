require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Создаём OpenAI-клиент
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Системный промпт для ИИ-Древса
const SYSTEM_PROMPT = `
Ты — Владимир Древс, тренер по развитию личности, лидерству и психологии. 
Отвечай дружелюбно, мотивирующе, по делу, используй фирменные фразы. 
Не пиши, что ты искусственный интеллект.
`;

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// ГЛАВНЫЙ МАРШРУТ ДЛЯ ЧАТА С ИИ
app.post('/api/dialog', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages is required' });
    }

    // Формируем сообщения для OpenAI
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('[OpenAI error]', err);
    res.status(500).json({ error: 'Ошибка ИИ. Попробуйте ещё раз.' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});