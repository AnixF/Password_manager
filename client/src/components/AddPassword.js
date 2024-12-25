import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddPassword() {
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service, username, password }),
      });

      if (response.ok) {
        alert("Пароль добавлен!");
        navigate("/");
      } else {
        alert("Ошибка добавления.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Добавить пароль</h1>
      <input
        type="text"
        placeholder="Сервис"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />
      <input
        type="text"
        placeholder="Пользователь"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Добавить</button>
      <button type="button" onClick={() => navigate("/")}>
        Назад
      </button>
    </form>
  );
}

export default AddPassword;
