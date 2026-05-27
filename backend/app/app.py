# app.py
import os
from flask import Flask
from datetime import timedelta
from flask_cors import CORS
from backend.app.routes.cargo_routes import cargo_bp 
from backend.app.routes.login_routes import login_bp
from flask_jwt_extended import JWTManager
from backend.app.config import configs 

app = Flask(__name__)

# CARREGAR O SETUP DA CLASSE (APP)
# busca um objeto de configuração config.py e injetando todas as variáveis dele diretamente no app.config. 
config_obj = configs["app"]
app.config.from_object(config_obj)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
jwt = JWTManager(app)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

# ==========================
# AMBIENTE
# ==========================
FLASK_ENV = os.getenv("FLASK_ENV", "development")


CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",
    "http://probable-guide-rpv9wgwp5j5fpgvw-5173.app.github.dev"
]}})

# Registrando as rotas
app.register_blueprint(cargo_bp, url_prefix="/api/app")
app.register_blueprint(login_bp, url_prefix="/api/app")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

