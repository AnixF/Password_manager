from cryptography.fernet import Fernet

# Генерация ключа (выполняется один раз)
#with open("secret.key", "wb") as key_file:
#     key_file.write(Fernet.generate_key())

def load_key():
    """Загружаем ключ из файла."""
    with open("secret.key", "rb") as key_file:
        return key_file.read()

cipher = Fernet(load_key())

def encrypt(data):
    """Шифруем данные."""
    return cipher.encrypt(data.encode()).decode()

def decrypt(data):
    """Расшифровываем данные."""
    return cipher.decrypt(data.encode()).decode()
