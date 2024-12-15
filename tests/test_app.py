import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app

def test_home():
    with app.test_client() as client:
        response = client.get("/")
        assert response.data == b"Best password manager"
