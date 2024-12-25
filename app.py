import os
from flask import Flask, send_from_directory
from extensions import db
from routes import init_routes
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder="client/build", static_url_path="")
    CORS(app)

    # Настройки базы данных
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///passwords.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Инициализация расширений
    db.init_app(app)

    # Регистрация маршрутов
    init_routes(app)

    # Главная страница - отдача index.html
    @app.route('/')
    def index():
        return send_from_directory('client/build', 'index.html')

    # Маршрут для других статических файлов (например, JS, CSS)
    @app.route('/<path:path>')
    def static_files(path):
        return send_from_directory('client/build', path)

    return app

if __name__ == "__main__":
    app = create_app()

    # Railway передает порт через переменную окружения
    port = int(os.environ.get("PORT", 5000))

    # Создание таблиц
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=port, debug=True)
