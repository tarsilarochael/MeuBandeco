import os, sys
from dotenv import load_dotenv

# Le variável de ambiente sistema (padrão é 'development' se não existir)
current_dir = os.path.abspath(os.path.dirname(__file__))
# Sobe um nível para a pasta pai (ex: backend)
base_dir = os.path.dirname(current_dir)
ambiente = os.getenv("FLASK_ENV", "development")
env_file = f".env.{ambiente}"
env_path = os.path.join(base_dir, env_file)

# override=True força o python a priorizar o que está no arquivo .env
if os.path.exists(env_path):
    load_dotenv(env_path, override=True)
else:
    print(f"AVISO: Arquivo {env_file} não encontrado em {base_dir}")
    sys.exit()


if ambiente == "production":
    load_dotenv(os.path.join(base_dir, ".env.production"))
else:
    load_dotenv(os.path.join(base_dir, ".env.development"))

print(f"--- Rodando em modo: {ambiente} ---")

DEBUG_MODE = os.getenv("DEBUG_MODE", "false").lower() == "true"

# Lê as variáveis de ambiente de backend .env do ambiente selecionado
class BaseConfig:
    """ Configurações compartilhadas por todos os serviços """
    SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    PUBLIC_API_KEY = os.getenv("PUBLIC_API_KEY") 

    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # token dura 1 hora

class AppConfig(BaseConfig):
    PORT = int(os.getenv("PORT_APP", 5000))

    print(f" Parametros {os.getenv('DB_NAME')} - {os.getenv('DB_USER')} - {os.getenv('DB_PASS')} - {os.getenv('DB_HOST')} - {os.getenv('DB_PORT')}")
    # Configuração de Banco para o Serviço Principal
    DB_CONFIG = {
        "dbname":   os.getenv("DB_NAME"),
        "user":     os.getenv("DB_USER"),
        "password": os.getenv("DB_PASS"),
        "host":     os.getenv("DB_HOST"),
        "port":     os.getenv("DB_PORT")
    }

configs = {
    "app": AppConfig
    }