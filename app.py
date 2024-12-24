import os
from flask import Flask
from extensions import db
from routes import init_routes

def create_app():
    app = Flask(__name__)

    # Настройки базы данных
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///passwords.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Инициализация расширений
    db.init_app(app)

    # Регистрация маршрутов
    init_routes(app)

    return app

if __name__ == "__main__":
    app = create_app()

    # Railway передает порт через переменную окружения
    port = int(os.environ.get("PORT", 5000))

    # Создание таблиц
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=port, debug=True)
