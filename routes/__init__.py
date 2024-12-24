from routes.passwords import passwords_bp

def init_routes(app):
    app.register_blueprint(passwords_bp)
