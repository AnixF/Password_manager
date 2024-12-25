const API_URL = "http://127.0.0.1:5000";

// Получить все пароли
export const getPasswords = async () => {
  const response = await fetch(`${API_URL}/api/passwords`); // Добавлено /api
  if (!response.ok) throw new Error("Не удалось получить пароли");
  return await response.json();
};

// Добавить пароль
export const addPassword = async (passwordData) => {
  const response = await fetch(`${API_URL}/api/passwords`, { // Добавлено /api
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(passwordData),
  });
  if (!response.ok) throw new Error("Не удалось добавить пароль");
  return await response.json();
};

// Обновить пароль
export const updatePassword = async (id, updatedData) => {
  const response = await fetch(`${API_URL}/api/passwords/${id}`, { // Добавлено /api
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error("Не удалось обновить пароль");
  return await response.json();
};

// Удалить пароль
export const deletePassword = async (id) => {
  const response = await fetch(`${API_URL}/api/passwords/${id}`, { // Добавлено /api
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Не удалось удалить пароль");
  return await response.json();
};
