import os
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Best password manager"

if __name__ == "__main__":
    # Получаем порт из переменной окружения (Railway передаёт порт сюда)
    port = int(os.environ.get("PORT", 5000))
    # Слушаем все адреса, а не только локальный хост
    app.run(host="0.0.0.0", port=port, debug=True)
