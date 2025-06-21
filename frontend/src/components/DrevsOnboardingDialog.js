import { useState } from "react";

// Новый компонент для кнопок-ответов
function AnswerOptions({ options, onSelect }) {
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleBtnClick = (option) => {
    if (option === "Другое") {
      setShowInput(true);
    } else {
      onSelect(option);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customValue.trim()) {
      onSelect(customValue.trim());
      setCustomValue("");
      setShowInput(false);
    }
  };

  return (
    <div style={{ margin: "8px 0" }}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleBtnClick(option)}
          style={{
            margin: "4px 8px 4px 0",
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #e0e0e0",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
      <button
        onClick={() => handleBtnClick("Другое")}
        style={{
          margin: "4px 8px 4px 0",
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px dashed #aaa",
          background: "#faf7f0",
          cursor: "pointer",
        }}
      >
        Другое
      </button>
      {showInput && (
        <form onSubmit={handleCustomSubmit} style={{ marginTop: 8 }}>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Введи свой ответ"
            style={{ padding: 8, marginRight: 8, borderRadius: 6, border: "1px solid #ccc" }}
            autoFocus
          />
          <button type="submit" style={{ padding: "8px 16px", borderRadius: 8 }}>
            Отправить
          </button>
        </form>
      )}
    </div>
  );
}

// Функция для попытки выделить варианты ответа из сообщения Древса
function extractOptions(message) {
  // Пример поиска строк "Варианты: ..." или "Варианты ответа: ..."
  const re = /Варианты:?([\s\S]+?)(?:\n|$|Если твой вариант|Если ваш вариант|Если не подходит|Напиши свой|$)/i;
  const match = message.match(re);
  if (match) {
    // Разбиваем по запятым, точкам с запятой или переводам строк
    return match[1]
      .split(/[,;\n]/)
      .map((v) => v.trim())
      .filter(Boolean)
      .filter((v) => !/^если/iu.test(v)); // отсеиваем фразы типа "Если твой вариант..."
  }
  return null;
}

export default function DrevsOnboardingDialog({ onComplete }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привет! Я Владимир Древс. Давай познакомимся, чтобы понять, как тебе лучше развиваться. Готов?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Проверяем, есть ли варианты ответа в последнем сообщении Древса
  const assistantLast = messages.length ? messages[messages.length - 1] : null;
  const options = assistantLast && assistantLast.role === "assistant"
    ? extractOptions(assistantLast.content)
    : null;

  const sendMessage = async (userInput) => {
    const text = typeof userInput === "string" ? userInput : input;
    if (!text.trim()) return;
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL || ""}/api/dialog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await resp.json();
      const assistantReply = data.reply || "Что-то пошло не так, попробуйте ещё раз.";
      setMessages([...updated, { role: "assistant", content: assistantReply }]);
      setLoading(false);

      if (
        assistantReply.toLowerCase().includes("готов составить план") &&
        onComplete
      ) {
        setTimeout(() => onComplete(updated), 1000);
      }
    } catch (e) {
      setMessages([
        ...updated,
        { role: "assistant", content: "Ошибка соединения. Попробуйте позже." },
      ]);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fcf7ec", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px #e5e5e5" }}>
      <h2>Диалог с Древсом</h2>
      <div style={{ minHeight: 200, marginBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "assistant" ? "left" : "right",
            margin: "10px 0"
          }}>
            <b>{m.role === "assistant" ? "Древс" : "Вы"}:</b> {m.content}
          </div>
        ))}
        {loading && <div><i>Древс печатает...</i></div>}
      </div>
      {/* Если есть варианты — показываем кнопки */}
      {options && !loading ? (
        <AnswerOptions
          options={options}
          onSelect={sendMessage}
        />
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ваш ответ..."
            style={{ flex: 1, padding: 8 }}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>Отправить</button>
        </div>
      )}
    </div>
  );
}