import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/passwords/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data.service);
        setUsername(data.username);
        setPassword(data.password);
      })
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/passwords/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service, username, password }),
      });

      if (response.ok) {
        alert("Пароль обновлён!");
        navigate("/");
      } else {
        alert("Ошибка обновления.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Редактировать пароль</h1>
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
      <button type="submit">Сохранить</button>
    </form>
  );
}

export default EditPassword;
