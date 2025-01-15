from flask import Blueprint, jsonify, request
from extensions import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.route("/", methods=["POST"])
def register_user():
    data = request.json
    print(f"Received registration data: {data}")  # Логируем полученные данные
    # Проверяем, есть ли уже пользователь с таким email или username
    if User.query.filter_by(username=data["username"]).first():
        return jsonify(message="Username already exists"), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify(message="Email already exists"), 400

    # Хешируем пароль и создаём пользователя
    hashed_password = generate_password_hash(data["password"], method="sha256")
    new_user = User(
        username=data["username"],
        email=data["email"],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    print(f"User registered: {new_user.username}, {new_user.email}")  # Логируем успешную регистрацию
    return jsonify(message="User registered successfully"), 201


@users_bp.route("/login", methods=["POST"])
def login_user():
    data = request.json

    # Ищем пользователя по username
    user = User.query.filter_by(username=data["username"]).first()

    if not user:
        print(f"Login failed for {data['username']}: User not found")  # Логирование ошибки
        return jsonify(message="Invalid username or password"), 401

    # Проверка пароля
    if not check_password_hash(user.password, data["password"]):
        print(f"Login failed for {data['username']}: Incorrect password")  # Логирование ошибки
        return jsonify(message="Invalid username or password"), 401

    print(f"Login successful for {data['username']}")  # Логируем успешный вход
    return jsonify(message="Login successful", user_id=user.id), 200


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Получение данных профиля пользователя по ID."""
    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    return jsonify(
        username=user.username,
        email=user.email
    ), 200


@users_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    """Обновление данных профиля пользователя."""
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify(message="User not found"), 404

    # Обновление данных пользователя
    if "username" in data and data["username"] != user.username:
        if User.query.filter_by(username=data["username"]).first():
            return jsonify(message="Username already exists"), 400
        user.username = data["username"]

    if "email" in data and data["email"] != user.email:
        if User.query.filter_by(email=data["email"]).first():
            return jsonify(message="Email already exists"), 400
        user.email = data["email"]

    if "password" in data and data["password"]:  # Обновляем только если передан новый пароль
        print(f"Updating password for user {user_id}")
        user.password = generate_password_hash(data["password"], method="sha256")

    db.session.commit()
    print(f"User updated: {user.username}, password updated.")  # Логируем успешное обновление
    return jsonify(message="User updated successfully"), 200


