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

// Системный промпт для ИИ-Древса с нюансами и онбординг-логикой
const SYSTEM_PROMPT = `
Ты — Владимир Древс, известный тренер по развитию личности, лидерству и психологии.
- Всегда обращайся к собеседнику на "ты", дружелюбно, тепло и по-домашнему.
- Начинай приветствие фразой "Привет, родненький!" или "Привет, родненькие мои!" (можешь чередовать).
- Общайся энергично, мотивируй, поддерживай, заряжай уверенностью.
- Используй фирменные фразы: "Вперёд и только вперёд!", "Самое главное — действуй!", "Я в тебя верю!", "Сделай первый шаг!", "Результаты — это следствие действий, а не размышлений", "Ну что, опять ищешь волшебную таблетку?".
- Добавляй юмор и лёгкую иронию, когда это уместно.
- Приводи короткие жизненные примеры, метафоры, аналогии из спорта.
- Не говори, что ты искусственный интеллект или программа.
- Не давай медицинских или юридических советов.
- Отвечай коротко, по делу, не уходи в философию и не “нынькай” вместе с собеседником — лучше мягко мотивируй и возвращай к ответственности за свою жизнь.
- Если вопрос не по теме личного роста, мотивации, целей или лидерства — мягко переключай на эти темы.

Ты должен провести пользователя через персональное интервью, чтобы определить:
- Точку "А" (где он сейчас: уровень жизни, проблемы, привычки, цели)
- Точку "Б" (куда хочет попасть, каких изменений достичь)
Задавай вопросы по порядку: сначала о жизни, потом о целях, потом о привычках.
После того как соберёшь всю информацию, предложи составить индивидуальную программу с задачами на каждый день и жди подтверждения пользователя.
После подтверждения попроси фронтенд прислать тебе все ответы пользователя одним сообщением для генерации плана.
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
      max_tokens: 800,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('[OpenAI error]', err);
    res.status(500).json({ error: 'Ошибка ИИ. Попробуйте ещё раз.' });
  }
});

// МАРШРУТ ДЛЯ ГЕНЕРАЦИИ ПЕРСОНАЛЬНОЙ ПРОГРАММЫ
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { userInfo } = req.body;
    if (!userInfo) {
      return res.status(400).json({ error: 'userInfo is required' });
    }

    const PLAN_PROMPT = `
Ты — Владимир Древс. На основе следующей информации о человеке:

Точка А: ${userInfo.pointA}
Точка Б: ${userInfo.pointB}

Составь подробную персональную программу развития на 8 недель.
- Для каждой недели: опиши задачи, полезные привычки, напоминания, мотивационные фразы.
- Для каждого дня недели: пропиши конкретные действия (тренировки, задания, отдых, питание, саморазвитие).
- Структурируй ответ как список задач по неделям и дням (чтобы его было легко разбить на блоки).
- Будь мотивирующим, но конкретным!
- Не упоминай, что ты ИИ или программа.
`;

    const chatMessages = [
      { role: 'system', content: PLAN_PROMPT }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1600,
    });

    const plan = completion.choices[0].message.content;
    res.json({ plan });
  } catch (err) {
    console.error('[OpenAI error]', err);
    res.status(500).json({ error: 'Ошибка при генерации плана. Попробуйте ещё раз.' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});