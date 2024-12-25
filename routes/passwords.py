from flask import Blueprint, jsonify, request
from extensions import db
from models import Password

passwords_bp = Blueprint("passwords", __name__, url_prefix="/api")  # Добавляем префикс

@passwords_bp.route("/", methods=["GET"])  # Переносим это в API
def api_home():
    return jsonify(message="Best password manager API"), 200

@passwords_bp.route("/passwords", methods=["POST"])
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

@passwords_bp.route("/passwords", methods=["GET"])
def get_passwords():
    passwords = Password.query.all()
    return jsonify([password.to_dict() for password in passwords]), 200

@passwords_bp.route("/passwords/<int:password_id>", methods=["PUT"])
def update_password(password_id):
    data = request.json
    password_entry = Password.query.get_or_404(password_id)

    password_entry.service = data.get("service", password_entry.service)
    password_entry.username = data.get("username", password_entry.username)
    password_entry.password = data.get("password", password_entry.password)

    db.session.commit()
    return jsonify(message="Password updated successfully"), 200

@passwords_bp.route("/passwords/<int:password_id>", methods=["DELETE"])
def delete_password(password_id):
    password_entry = Password.query.get_or_404(password_id)
    db.session.delete(password_entry)
    db.session.commit()
    return jsonify(message="Password deleted successfully"), 200
