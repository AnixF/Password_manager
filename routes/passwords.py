from flask import Blueprint, jsonify, request
from extensions import db
from models import Password

passwords_bp = Blueprint("passwords", __name__)

@passwords_bp.route("/")
def home():
    return jsonify(message="Best password manager"), 200

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
