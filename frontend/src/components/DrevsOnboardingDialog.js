import { useState } from "react";

export default function DrevsOnboardingDialog({ onComplete }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привет! Я Владимир Древс. Давай познакомимся, чтобы понять, как тебе лучше развиваться. Готов?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    // ЗДЕСЬ ДОЛЖЕН БЫТЬ ЗАПРОС К ТВОЕМУ backend/api/dialog
    // Для MVP можно временно сделать заглушку с таймером
    setTimeout(() => {
      // Пример простого ответа
      const assistantReply = updated.length < 5
        ? "Спасибо за ответ! Расскажи ещё: что тебе сейчас важнее всего изменить в себе?"
        : "Спасибо! Я готов составить для тебя индивидуальный план.";
      setMessages([...updated, { role: "assistant", content: assistantReply }]);
      setLoading(false);
      if (assistantReply.includes("готов составить план") && onComplete) {
        setTimeout(() => onComplete(updated), 1000);
      }
    }, 1200);
  };

  return (
    <div style={{maxWidth: 500, margin: "40px auto", background: "#fcf7ec", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px #e5e5e5"}}>
      <h2>Диалог с Древсом</h2>
      <div style={{minHeight: 200, marginBottom: 10}}>
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
      <div style={{display: "flex", gap: 8}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ваш ответ..."
          style={{flex: 1, padding: 8}}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>Отправить</button>
      </div>
    </div>
  );
}