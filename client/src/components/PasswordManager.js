import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPasswords, addPassword, updatePassword, deletePassword } from "../services/api";
import "../styles/PasswordManager.css";

const PasswordManager = () => {
  const [passwords, setPasswords] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(
    localStorage.getItem("expandedIndex") ? parseInt(localStorage.getItem("expandedIndex"), 10) : null
  );
  const [formData, setFormData] = useState({ service: "", username: "", password: "" });
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || ""); // Сохраняем строку поиска
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Войдите в аккаунт");
      navigate("/login");
      return;
    }
    loadPasswords();
  }, []);

  useEffect(() => {
    localStorage.setItem("expandedIndex", expandedIndex !== null ? expandedIndex.toString() : "");
    localStorage.setItem("searchQuery", searchQuery);
  }, [expandedIndex, searchQuery]);

  const loadPasswords = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("Ошибка: пользователь не авторизован");
      navigate("/login");
      return;
    }

    try {
      const data = await getPasswords(userId);
      setPasswords(data);
    } catch (error) {
      console.error("Ошибка при загрузке паролей:", error);
    }
  };

  const toggleTab = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedPasswords = [...passwords];
    updatedPasswords[index] = { ...updatedPasswords[index], [field]: value };
    setPasswords(updatedPasswords);
  };

  const handleSave = async (index) => {
    const passwordData = passwords[index];
    try {
      await updatePassword(passwordData.id, passwordData);
      alert("Изменения сохранены!");
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePassword(id);
      setPasswords(passwords.filter((password) => password.id !== id));
      alert("Аккаунт удалён!");
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Необходимо войти в систему!");
      return;
    }

    const newPassword = {
      service: formData.service || "Без названия",
      username: formData.username,
      password: formData.password,
      user_id: userId,
    };

    try {
      const addedPassword = await addPassword(newPassword);
      setPasswords([...passwords, addedPassword]);
      setFormData({ service: "", username: "", password: "" });
      alert("Аккаунт добавлен!");
      loadPasswords();
    } catch (error) {
      console.error("Ошибка при добавлении аккаунта:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Чистим весь localStorage
    alert("Вы вышли из аккаунта");
    navigate("/login");
  };

  const filteredPasswords = passwords.filter((password) =>
    password.service?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="password-manager">
      {/* Боковая панель */}
      <div className="sidebar">
        <button onClick={() => navigate("/password-manager")}>
          <img src="home.png" alt="Главная" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
        </button>
        <button onClick={() => navigate("/edit-profile")}>
          <img src="profile.png" alt="Редактировать профиль" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
        </button>
        <button onClick={handleLogout}>
          <img src="exit.png" alt="Выйти" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
        </button>
      </div>

      {/* Поиск */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по сервису..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Список аккаунтов */}
      <div className="accounts-list">
        {filteredPasswords.map((password, index) => (
          <div
            key={password.id}
            className={`account-tab ${expandedIndex === index ? "expanded" : ""}`}
          >
            <div className="account-header" onClick={() => toggleTab(index)}>
              <span>{password.service}</span>
              <button>{expandedIndex === index ? "▲" : "▼"}</button>
            </div>
            {expandedIndex === index && (
              <div className="account-details">
                <form>
                  <input
                    type="text"
                    value={password.service}
                    onChange={(e) => handleFieldChange(index, "service", e.target.value)}
                    placeholder="Сервис"
                  />
                  <input
                    type="text"
                    value={password.username}
                    onChange={(e) => handleFieldChange(index, "username", e.target.value)}
                    placeholder="Логин"
                  />
                  <input
                    type="text"
                    value={password.password}
                    onChange={(e) => handleFieldChange(index, "password", e.target.value)}
                    placeholder="Пароль"
                  />
                  <button type="button" onClick={() => handleSave(index)}>
                    Сохранить
                  </button>
                  <button type="button" onClick={() => handleDelete(password.id)}>
                    Удалить
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}

        {/* Вкладка добавления аккаунта */}
        <div
          className={`account-tab ${expandedIndex === passwords.length ? "expanded" : ""}`}
        >
          <div className="account-header" onClick={() => toggleTab(passwords.length)}>
            <span>Добавить аккаунт</span>
            <button>{expandedIndex === passwords.length ? "▲" : "＋"}</button>
          </div>
          {expandedIndex === passwords.length && (
            <div className="account-details">
              <form onSubmit={handleAddAccount}>
                <input
                  type="text"
                  name="service"
                  placeholder="Сервис"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Логин"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <input
                  type="text"
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button type="submit">Добавить</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordManager;
