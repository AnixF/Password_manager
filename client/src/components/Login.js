import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("An error occurred while logging in");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>Нет аккаунта? <button onClick={() => navigate("/register")}>Зарегистрируйтесь</button></p> {/* Кнопка перехода */}
    </div>
  );
}

export default Login;
