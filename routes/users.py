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
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify(message="Invalid username or password"), 401

    return jsonify(message="Login successful", user_id=user.id), 200
