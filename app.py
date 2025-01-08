import os
from flask import Flask, send_from_directory
from extensions import db
from routes import init_routes
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder="client/build", static_url_path="")
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///passwords.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    init_routes(app)

    @app.route('/')
    def index():
        return send_from_directory('client/build', 'index.html')

    @app.route('/<path:path>')
    def static_files(path):
        return send_from_directory('client/build', path)

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=port, debug=True)
