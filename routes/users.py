from flask import Blueprint, jsonify, request
from extensions import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
import bleach
from encryption import encrypt, decrypt  # Подключаем шифрование

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

def sanitize_input(data):
    return bleach.clean(data)

@users_bp.route("/", methods=["POST"])
def register_user():
    data = request.json
    data["username"] = sanitize_input(data["username"])
    data["email"] = sanitize_input(data["email"])

    if User.query.filter_by(username=data["username"]).first():
        return jsonify(message="Username already exists"), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify(message="Email already exists"), 400

    hashed_password = generate_password_hash(data["password"], method="sha256")
    encrypted_email = encrypt(data["email"])  # Шифруем email перед сохранением
    new_user = User(
        username=data["username"],
        email=encrypted_email,
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered successfully"), 201

@users_bp.route("/login", methods=["POST"])
def login_user():
    data = request.json
    data["username"] = sanitize_input(data["username"])

    user = User.query.filter_by(username=data["username"]).first()
    if not user:
        return jsonify(message="Invalid username or password"), 401

    if not check_password_hash(user.password, data["password"]):
        return jsonify(message="Invalid username or password"), 401

    decrypted_email = decrypt(user.email)  # Расшифровываем email
    return jsonify(
        message="Login successful",
        user_id=user.id,
        email=decrypted_email
    ), 200

@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    return jsonify(
        username=sanitize_input(user.username),
        email=decrypt(user.email)  # Расшифровываем email перед отправкой
    ), 200

@users_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify(message="User not found"), 404

    if "username" in data and data["username"] != user.username:
        if User.query.filter_by(username=data["username"]).first():
            return jsonify(message="Username already exists"), 400
        user.username = data["username"]

    if "email" in data and data["email"] != decrypt(user.email):  # Расшифровываем текущий email для проверки
        if User.query.filter_by(email=encrypt(data["email"])).first():
            return jsonify(message="Email already exists"), 400
        user.email = encrypt(data["email"])  # Шифруем новый email

    if "password" in data and data["password"]:
        user.password = generate_password_hash(data["password"], method="sha256")

    db.session.commit()
    return jsonify(message="User updated successfully"), 200
