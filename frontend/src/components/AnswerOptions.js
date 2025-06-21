import React, { useState } from "react";

/**
 * options - массив строк (вариантов ответа)
 * onSelect - колбэк, вызывается с выбранным значением (строкой)
 */
export default function AnswerOptions({ options = [], onSelect }) {
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
    <div>
      <div style={{ marginBottom: 8 }}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleBtnClick(option)}
            style={{ margin: "4px 8px 4px 0", padding: "8px 16px" }}
          >
            {option}
          </button>
        ))}
        <button
          onClick={() => handleBtnClick("Другое")}
          style={{
            margin: "4px 8px 4px 0",
            padding: "8px 16px",
            background: "#eee",
          }}
        >
          Другое
        </button>
      </div>
      {showInput && (
        <form onSubmit={handleCustomSubmit}>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Введи свой вариант"
            style={{ marginRight: 8, padding: "8px" }}
            autoFocus
          />
          <button type="submit" style={{ padding: "8px 16px" }}>
            Отправить
          </button>
        </form>
      )}
    </div>
  );
}