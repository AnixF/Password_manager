import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем данные перед отправкой
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      alert("Имя пользователя должно содержать только буквы, цифры или _ и быть длиной от 3 до 50 символов.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      alert("Пароль должен быть длиной от 8 до 128 символов.");
      return;
    }

    try {
      const response = await axios.post("https://passwordmanager-production-553b.up.railway.app/api/users/login", {
        username,
        password,
      });

      if (response.data.message === "Login successful") {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user_id", response.data.user_id);
        navigate("/password-manager");
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
            maxLength="50" // Ограничиваем длину
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            maxLength="128" // Ограничиваем длину
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
