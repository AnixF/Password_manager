from flask import Blueprint, jsonify, request
from extensions import db
from models import Password
import bleach
from encryption import encrypt, decrypt  # Подключаем шифрование

passwords_bp = Blueprint("passwords", __name__, url_prefix="/api/passwords")

def sanitize_input(data):
    return bleach.clean(data)

@passwords_bp.route("/", methods=["POST"])
def add_password():
    data = request.json
    data["service"] = sanitize_input(data["service"])
    data["username"] = sanitize_input(data["username"])
    data["password"] = encrypt(sanitize_input(data["password"]))  # Шифруем пароль

    new_password = Password(
        service=data["service"],
        username=data["username"],
        password=data["password"],
        user_id=data["user_id"]
    )
    db.session.add(new_password)
    db.session.commit()
    return jsonify(message="Password added successfully"), 201

@passwords_bp.route("/", methods=["GET"])
def get_passwords():
    user_id = request.args.get("user_id")
    passwords = Password.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "service": password.service,
            "username": password.username,
            "password": decrypt(password.password)  # Расшифровываем пароль перед отправкой
        } for password in passwords
    ]), 200

@passwords_bp.route("/<int:password_id>", methods=["PUT"])
def update_password(password_id):
    data = request.json
    password_entry = Password.query.get_or_404(password_id)

    if "service" in data:
        password_entry.service = sanitize_input(data["service"])
    if "username" in data:
        password_entry.username = sanitize_input(data["username"])
    if "password" in data:
        password_entry.password = encrypt(sanitize_input(data["password"]))  # Шифруем пароль при обновлении

    db.session.commit()
    return jsonify(message="Password updated successfully"), 200

@passwords_bp.route("/<int:password_id>", methods=["DELETE"])
def delete_password(password_id):
    password_entry = Password.query.get_or_404(password_id)
    db.session.delete(password_entry)
    db.session.commit()
    return jsonify(message="Password deleted successfully"), 200
