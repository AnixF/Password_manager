import pytest
from app import create_app
from extensions import db



@pytest.fixture
def client():
    # Создаём тестовое приложение
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_passwords.db'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Создаём тестовую базу данных
        yield client
        with app.app_context():
            db.drop_all()  # Удаляем тестовую базу после тестов


def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json == {"message": "Best password manager"}


def test_add_password(client):
    response = client.post("/passwords", json={
        "service": "Google",
        "username": "user1",
        "password": "12345"
    })
    assert response.status_code == 201
    assert response.json == {"message": "Password added successfully"}


def test_get_passwords(client):
    client.post("/passwords", json={
        "service": "Google",
        "username": "user1",
        "password": "12345"
    })
    response = client.get("/passwords")
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["service"] == "Google"
