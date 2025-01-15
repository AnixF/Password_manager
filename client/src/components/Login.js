import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Подключаем стили

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });

      if (response.data.message === "Login successful") {
        localStorage.setItem("authToken", response.data.token); // Сохраняем токен
        localStorage.setItem("user_id", response.data.user_id); // Сохраняем user_id
        navigate("/password-manager"); // Перенаправляем на страницу управления паролями
      } else {
        alert("Неверное имя пользователя или пароль");
      }
    } catch (error) {
      alert("Ошибка при входе в систему");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Войти</button>
        </form>
        <p>

          <button className="register-button" onClick={() => navigate("/register")}>
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
