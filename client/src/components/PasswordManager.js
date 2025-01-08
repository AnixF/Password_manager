import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Для редиректа на другую страницу
import {
  getPasswords,
  addPassword,
  updatePassword,
  deletePassword,
  registerUser,
  loginUser,
} from "../services/api";

const PasswordManager = () => {
  const [passwords, setPasswords] = useState([]);
  const [formData, setFormData] = useState({ service: "", username: "", password: "" });
  const [editId, setEditId] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // Режим авторизации или регистрации
  const [authData, setAuthData] = useState({ username: "", email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Для редиректа

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      loadPasswords(); // Загружаем пароли, если пользователь залогинен
    }
  }, []);

  const loadPasswords = async () => {
    try {
      const data = await getPasswords();
      setPasswords(data);
    } catch (error) {
      console.error("Ошибка при загрузке паролей:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Необходимо войти в систему");
      return;
    }

    const userId = localStorage.getItem("user_id"); // Получаем user_id
    const passwordData = { ...formData, user_id: userId };

    try {
      if (editId) {
        await updatePassword(editId, passwordData);
        setEditId(null);
      } else {
        await addPassword(passwordData);
      }
      setFormData({ service: "", username: "", password: "" });
      loadPasswords();
    } catch (error) {
      console.error("Ошибка при сохранении пароля:", error);
    }
  };

  const handleEdit = (password) => {
    setEditId(password.id);
    setFormData({
      service: password.service,
      username: password.username,
      password: password.password,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deletePassword(id);
      loadPasswords();
    } catch (error) {
      console.error("Ошибка при удалении пароля:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Авторизация</h1>
        <p>Для работы с паролями, пожалуйста, войдите в систему.</p>
        <button onClick={() => navigate("/login")}>Перейти к форме входа</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Управление паролями</h1>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="text"
          name="service"
          placeholder="Сервис"
          value={formData.service}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Логин"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editId ? "Сохранить изменения" : "Добавить"}</button>
      </form>

      <h2>Список паролей</h2>
      <ul>
        {passwords.map((password) => (
          <li key={password.id}>
            <strong>{password.service}</strong> — {password.username} — {password.password}
            <button onClick={() => handleEdit(password)}>Редактировать</button>
            <button onClick={() => handleDelete(password.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordManager;
