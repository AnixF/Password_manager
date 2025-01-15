import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../services/api";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Необходимо войти в систему!");
      navigate("/login");
      return;
    }

    try {
      const profile = await getUserProfile(userId);
      setProfileData({ ...profile, password: "" });
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error);
    }
  };

  const handleFieldChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Необходимо войти в систему!");
      navigate("/login");
      return;
    }

    try {
      await updateUserProfile(userId, profileData);
      alert("Профиль обновлён!");
      navigate("/password-manager");
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    alert("Вы вышли из аккаунта");
    navigate("/login");
  };

  return (
    <div className="edit-profile">
      {/* Сайдбар из Password Manager */}
      <div className="sidebar">
        <button onClick={() => navigate("/password-manager")}>
          <img src="home.png" alt="Главная" />
        </button>
        <button onClick={() => navigate("/edit-profile")}>
          <img src="profile.png" alt="Редактировать профиль" />
        </button>
        <button onClick={handleLogout}>
          <img src="exit.png" alt="Выйти" />
        </button>
      </div>

      <div className="profile-content">
        <h2>Редактировать профиль</h2>
        <form>
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => handleFieldChange("username", e.target.value)}
            placeholder="Введите новое имя пользователя"
          />

          <label>Электронная почта:</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="Введите новый email"
          />

          <label>Пароль:</label>
          <input
            type="password"
            value={profileData.password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            placeholder="Введите новый пароль"
          />

          <button type="button" onClick={handleSave}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
