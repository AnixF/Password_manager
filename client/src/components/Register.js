import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css"; // Подключаем стили

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибки
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/users/", {
        username,
        email,
        password,
      });

      if (response.data.message === "User registered successfully") {
        alert("Регистрация прошла успешно");
        navigate("/login"); // Переходим на страницу логина после успешной регистрации
      } else {
        alert("Ошибка регистрации: " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(`Ошибка сервера: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setErrorMessage("Сервер не ответил на запрос");
      } else {
        setErrorMessage(`Ошибка при настройке запроса: ${error.message}`);
      }
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
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
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
