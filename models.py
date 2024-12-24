from extensions import db

class Password(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "service": self.service,
            "username": self.username,
            "password": self.password
        }
