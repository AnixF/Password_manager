import React, { useState, useEffect } from "react";
import {
  getPasswords,
  addPassword,
  updatePassword,
  deletePassword,
} from "../services/api";

const PasswordManager = () => {
  const [passwords, setPasswords] = useState([]);
  const [formData, setFormData] = useState({ service: "", username: "", password: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPasswords();
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

 const handleSubmit = async (e) => {
  e.preventDefault(); // Чтобы форма не перезагружала страницу
  console.log("Форма отправлена с данными:", formData); // Проверяем данные формы
  try {
    if (editId) {
      await updatePassword(editId, formData);
      setEditId(null);
    } else {
      await addPassword(formData);
    }
    setFormData({ service: "", username: "", password: "" }); // Очистка формы
    loadPasswords(); // Обновление списка
  } catch (error) {
    console.error("Ошибка при сохранении пароля:", error);
  }
};


  const handleEdit = (password) => {
    setEditId(password.id);
    setFormData({ service: password.service, username: password.username, password: password.password });
  };

  const handleDelete = async (id) => {
    try {
      await deletePassword(id);
      loadPasswords();
    } catch (error) {
      console.error("Ошибка при удалении пароля:", error);
    }
  };

  return (
    <div>
      <h1>Управление паролями</h1>
      <form onSubmit={handleSubmit}>
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
          type="text"
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
