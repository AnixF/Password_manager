import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        alert("Registration successful");
        navigate("/login"); // Переходим на страницу логина после успешной регистрации
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(`Ошибка сервера: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setErrorMessage("Сервер не ответил на запрос");
      } else {
        setErrorMessage(`Ошибка при настройке запроса: ${error.message}`);
      }
      console.error("Registration Error: ", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>Уже есть аккаунт? <button onClick={() => navigate("/login")}>Войти</button></p> {/* Кнопка перехода */}
    </div>
  );
}

export default Register;
