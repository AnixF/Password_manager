import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Настройки базы данных
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///passwords.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Модель базы данных
class Password(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "service": self.service,
            "username": self.username,
            "password": self.password
        }

# Маршрут по умолчанию
@app.route("/")
def home():
    return jsonify(message="Best password manager"), 200

# Маршрут для добавления пароля
@app.route("/passwords", methods=["POST"])
def add_password():
    data = request.json
    new_password = Password(
        service=data.get("service"),
        username=data.get("username"),
        password=data.get("password")
    )
    db.session.add(new_password)
    db.session.commit()
    return jsonify(message="Password added successfully"), 201

# Получение всех паролей
@app.route("/passwords", methods=["GET"])
def get_passwords():
    passwords = Password.query.all()
    return jsonify([password.to_dict() for password in passwords]), 200

# Инициализация базы данных при запуске
def init_db():
    with app.app_context():
        db.create_all()

if __name__ == "__main__":
    # Railway передает порт через переменную окружения
    port = int(os.environ.get("PORT", 5000))
    init_db()  # Создание таблиц
    app.run(host="0.0.0.0", port=port, debug=True)
