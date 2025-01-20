from locust import HttpUser, task, between

class PasswordTest(HttpUser):
    wait_time = between(1, 3)  # Интервал между запросами (в секундах)

    def on_start(self):
        """Логинимся и сохраняем токен"""
        response = self.client.post(
            "/api/users/login/",
            json={"username": "test_user", "password": "test_password"}
        )
        if response.status_code == 200:
            self.token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            print("Ошибка при авторизации")
            self.token = None
            self.headers = {}

    @task(1)
    def add_password(self):
        """Добавление пароля"""
        if not self.token:
            return  # Если нет токена, тест не выполняется
        password_data = {"site": "example.com", "username": "user", "password": "pass123"}
        self.client.post(
            "/api/passwords/",
            json=password_data,
            headers=self.headers
        )

    @task(2)
    def get_passwords(self):
        """Чтение паролей"""
        if not self.token:
            return
        self.client.get(
            "/api/passwords/?user_id=1",  # Здесь укажи правильный user_id
            headers=self.headers
        )
