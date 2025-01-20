const API_URL = "https://passwordmanager-production-553b.up.railway.app/";

// Получить все пароли
export const getPasswords = async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id"); // Берём user_id

  const response = await fetch(`${API_URL}/api/passwords/?user_id=${userId}`, { // Добавляем user_id
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Не удалось получить пароли");
  return await response.json();
};


// Добавить пароль
export const addPassword = async (passwordData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/passwords/`, { // <-- Слэш добавлен
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(passwordData),
  });
  if (!response.ok) throw new Error("Не удалось добавить пароль");
  return await response.json();
};

// Обновить пароль
export const updatePassword = async (id, updatedData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/passwords/${id}`, { // <-- Слэш добавлен
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error("Не удалось обновить пароль");
  return await response.json();
};

// Удалить пароль
export const deletePassword = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/passwords/${id}`, { // <-- Слэш добавлен
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Не удалось удалить пароль");
  return await response.json();
};

// Регистрация пользователя
export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/api/users/`, { // <-- Слэш добавлен
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Не удалось зарегистрировать пользователя");
  return await response.json();
};

// Логин пользователя
export const loginUser = async (data) => {
  const response = await fetch(`${API_URL}/api/users/login/`, { // <-- Слэш добавлен
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Не удалось войти");
  
  const userData = await response.json();
  localStorage.setItem("token", userData.token); // Сохраняем токен в localStorage
  return userData;
};

export const getUserProfile = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Ошибка при загрузке профиля");
  }
  return response.json();
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    throw new Error("Ошибка при обновлении профиля");
  }
  return response.json();
};

