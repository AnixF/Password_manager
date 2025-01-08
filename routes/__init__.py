from routes.passwords import passwords_bp
from routes.users import users_bp

def init_routes(app):
    app.register_blueprint(passwords_bp)
    app.register_blueprint(users_bp)
