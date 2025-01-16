import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      alert("Имя пользователя должно содержать только буквы, цифры или _ и быть длиной от 3 до 50 символов.");
      return;
    }

    if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Введите корректный email.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      alert("Пароль должен быть длиной от 8 до 128 символов.");
      return;
    }

    try {
      const response = await axios.post("https://2c1b-83-143-200-19.ngrok-free.app/api/users/", {
        username,
        email,
        password,
      });

      if (response.data.message === "User registered successfully") {
        alert("Регистрация прошла успешно");
        navigate("/login");
      } else {
        alert("Ошибка регистрации: " + response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response
          ? `Ошибка сервера: ${error.response.data.message || error.response.statusText}`
          : error.request
          ? "Сервер не ответил на запрос"
          : `Ошибка при настройке запроса: ${error.message}`
      );
      console.error("Ошибка регистрации: ", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            maxLength="50"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            maxLength="100"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            maxLength="128"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>
          <button className="login-button" onClick={() => navigate("/login")}>
            Войти
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
