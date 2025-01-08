from flask import Blueprint, jsonify, request
from extensions import db
from models import Password

passwords_bp = Blueprint("passwords", __name__, url_prefix="/api/passwords")

@passwords_bp.route("/", methods=["POST"])
def add_password():
    data = request.json
    new_password = Password(
        service=data["service"],
        username=data["username"],
        password=data["password"],
        user_id= data["user_id"] ####

    )
    db.session.add(new_password)
    db.session.commit()
    return jsonify(message="Password added successfully"), 201

@passwords_bp.route("/", methods=["GET"])
def get_passwords():
    user_id = request.args.get("user_id") #####


    passwords = Password.query.filter_by(user_id=user_id).all()
    return jsonify([password.to_dict() for password in passwords]), 200

@passwords_bp.route("/<int:password_id>", methods=["PUT"])
def update_password(password_id):
    data = request.json
    password_entry = Password.query.get_or_404(password_id)
    password_entry.service = data.get("service", password_entry.service)
    password_entry.username = data.get("username", password_entry.username)
    password_entry.password = data.get("password", password_entry.password)
    db.session.commit()
    return jsonify(message="Password updated successfully"), 200

@passwords_bp.route("/<int:password_id>", methods=["DELETE"])
def delete_password(password_id):
    password_entry = Password.query.get_or_404(password_id)
    db.session.delete(password_entry)
    db.session.commit()
    return jsonify(message="Password deleted successfully"), 200
