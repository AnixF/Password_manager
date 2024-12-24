from flask import Blueprint, jsonify, request
from models import db, Password
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

@api.route('/passwords', methods=['GET'])
@jwt_required()
def get_passwords():
    passwords = Password.query.all()
    return jsonify([p.to_dict() for p in passwords])

@api.route('/passwords', methods=['POST'])
@jwt_required()
def create_password():
    data = request.json
    new_password = Password(
        service=data['service'],
        username=data['username'],
        password=data['password']
    )
    db.session.add(new_password)
    db.session.commit()
    return jsonify(new_password.to_dict()), 201

@api.route('/passwords/<int:id>', methods=['PUT'])
@jwt_required()
def update_password(id):
    data = request.json
    password = Password.query.get(id)
    if not password:
        return jsonify({"error": "Password not found"}), 404
    password.service = data['service']
    password.username = data['username']
    password.password = data['password']
    db.session.commit()
    return jsonify(password.to_dict())

@api.route('/passwords/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_password(id):
    password = Password.query.get(id)
    if not password:
        return jsonify({"error": "Password not found"}), 404
    db.session.delete(password)
    db.session.commit()
    return jsonify({"message": "Password deleted"}), 200
