# routes/login_routes.py
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from flask import Blueprint, request
from backend.app.service.db import Db, Mode
from backend.app.service.valida import Valida
from backend.app.service.login import inseriUsuario
import bcrypt, re

# Definindo o blueprint
login_bp = Blueprint("login_bp", __name__)

@login_bp.route("/obterUsuarios", methods=["GET"])
@jwt_required()
def get_Usuarios():
    valida = Valida()
       
    sql = """
        SELECT A.codUsuarioCPF,
               A.nomUsuario,
               A.desEmail, 
               A.idPapel
          FROM Usuario A
         ORDER BY 2
        """
    params = ()
           
    db = Db(valida)
    usuarios = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()
    
    if not usuarios:
        valida.addAviso("Usuarios não cadastrados")
        return valida.getMensagens()
    
    # Formata a resposta para um JSON nomeado
    usuarios_formatados = []
    for usuario in usuarios:
        usuarios_formatados.append({
            "codUsuarioCPF": usuario[0],
            "nomUsuario": usuario[1],
            "desEmail": usuario[2],
            "idPapel": usuario[3]
        })

    return usuarios_formatados


      
#ROTA Privada - Usuario ja cadastrado
@login_bp.route("/usuarioJaCadastrado/<codUsuarioCPF>", methods=["GET"])
@jwt_required()
def get_usuarioJaCadastrado(codUsuarioCPF):
    codUsuarioCPFLimpo = re.sub(r'\D', '', codUsuarioCPF  or '') 
    valida = Valida()
    valida.CPF(codUsuarioCPFLimpo)
   
    if valida.temMensagem():
        return valida.getMensagens()
        
    sql = """
        SELECT count(*)
          FROM Usuario
         WHERE codUsuarioCPF = %s
        """
    params = (codUsuarioCPFLimpo,)
    
    db = Db(valida)
    
    usuarios = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()

    if usuarios[0][0] > 0:
        valida.addAviso("Usuário já está cadastrado para este vínculo")
        return valida.getMensagens()
    
    return []
              

#ROTA Pública - Validar login (CPF) de acesso do usuario
@login_bp.route("/loginAcesso/<codUsuarioCPF>", methods=["GET"])
def get_loginAcesso(codUsuarioCPF):
    valida = Valida()
    codUsuarioCPF = re.sub(r'\D', '', codUsuarioCPF or '')
    valida.CPF(codUsuarioCPF)
    if valida.temMensagem():
        return valida.getMensagens()
        
    sql = """
        SELECT desSenha,
               nomUsuario
          FROM Usuario
         WHERE codUsuarioCPF = %s
    """
    params = (codUsuarioCPF,)

    db = Db(valida)
    
    usuarios = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()

    if not usuarios:
        valida.addAviso("Usuario não encontrado!")
        return valida.getMensagens()
    
    usuario = usuarios[0]
    desSenha = usuario[0]
    nomUsuario = usuario[1] 
          
    idtTemSenha = desSenha is not None

    return {"idtTemSenha": idtTemSenha,
            "nomUsuario":nomUsuario}

@login_bp.route("/obterEmailUsuario/<codUsuarioCPF>", methods=["GET"])
def obter_email_usuario(codUsuarioCPF):
    valida = Valida()
    db = Db(valida)
    
    sql = """
        SELECT desEmail
          FROM Usuario
            WHERE codUsuarioCPF = %s
        """
    params = (codUsuarioCPF,)
        
    resultado = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()
   
    if not resultado:
        valida.addAviso("Email do usuário não encontrado!")
        return valida.getMensagens()

    return {"desEmail": resultado[0][0]}


#ROTA Pública - Validar login (CPF) e obter o token
@login_bp.route("/obterToken", methods=["POST"])
def obter_token():
    data = request.json
    codUsuarioCPF = data.get("codUsuarioCPF")
    desSenhaInfo = data.get("desSenha")
    
    valida = Valida()
    valida.CPF(codUsuarioCPF)
    valida.desSenha(desSenhaInfo)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        SELECT desSenha
          FROM Usuario
         WHERE codUsuarioCPF = %s
    """
    params = (codUsuarioCPF,)
    db = Db(valida)
    
    resultado = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()
 
    if not resultado: 
        valida.addAviso("Usuario não encontrado!")
        return valida.getMensagens()
    
    usuario = resultado[0]
       
    desSenha = usuario[0]
               
    # converte string do banco para bytes
    if not bcrypt.checkpw(desSenhaInfo.encode('utf-8'), desSenha.encode('utf-8')):
        valida.addAviso("Usuário ou senha inválidos!")
        return valida.getMensagens()

    # --- AQUI ENTRA O JWT ---
    token = create_access_token( identity=codUsuarioCPF )
    # Retorna um objeto que contém o TOKEN 
    return {
        "token": token
    }, 200

#ROTA Privada - Login completo com token 
@login_bp.route("/loginAcessoUsuario", methods=["GET"])
@jwt_required()
def post_login_acesso():
    valida = Valida()
    try: 
        codUsuarioCPF = get_jwt_identity()
    except Exception as e:
        valida.addAviso(f"Usuário sem acesso. Falha no token! Erro: {str(e)}")
        return valida.getMensagens()
    
    sql = """
        SELECT nomUsuario,
               idPapel
          FROM Usuario
         WHERE codUsuarioCPF = %s
    """
    params = (codUsuarioCPF,)
    db = Db(valida)
    resultado = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()

    if not resultado: 
        valida.addAviso("Usuario não encontrado!")
        return valida.getMensagens()
    
    usuario = resultado[0]

    nomUsuario = usuario[0]
    idPapel = usuario[1]
       
    return {
        "codUsuarioCPF" : codUsuarioCPF,
        "nomUsuario": nomUsuario,
        "idPapel": idPapel
    }
   
#ROTA Privada - registrar usuário. 
@login_bp.route("/usuario", methods=["POST"])
@jwt_required()
def post_usuario():
    data = request.json

    valida = Valida()
    db = Db(valida)
    db.execSql("", None,  Mode.BEGIN)
    inseriUsuario(db, data)
    if valida.temMensagem():
        return valida.getMensagens()  
    db.execSql("", None,  Mode.COMMIT)
    return valida.getMensagens()  

# Rota para atualizar usuário. 
@login_bp.route("/usuario", methods=["PUT"])
@jwt_required()
def put_usuario():
    data = request.json

    CPF = data.get('codUsuarioCPF')
    codUsuarioCPF = CPF.replace('.', '').replace('-', '').replace('/', '')
    nomUsuario    = data.get('nomUsuario')
    desEmail      = data.get('desEmail')
    idPapel       = data.get('idPapel')

    valida = Valida()
    valida.CPF(codUsuarioCPF)
    valida.nomUsuario(nomUsuario)
    valida.desEmail(desEmail)   
    valida.idPapel(idPapel)
                    
    if valida.temMensagem():
        return valida.getMensagens()

    db = Db(valida)
    sql = """
        UPDATE Usuario 
           SET nomUsuario = %s,
               desEmail = %s,
               idPapel   = %s
         WHERE codUsuarioCPF = %s
        """  
    params = (nomUsuario, desEmail, idPapel, codUsuarioCPF,)
    db.execSql(sql, params)
    return valida.getMensagens()
   

@login_bp.route("/usuario/<codUsuarioCPF>", methods=["PUT"])
@jwt_required()
def put_usuarioSelf(codUsuarioCPF):
    data = request.json
    codUsuarioCPF = codUsuarioCPF.replace('.', '').replace('-', '').replace('/', '')
    nomUsuario = data.get('nomUsuario')
    desEmail = data.get('desEmail')

    valida = Valida()
    valida.CPF(codUsuarioCPF)
    valida.nomUsuario(nomUsuario)
    valida.desEmail(desEmail)
    
    db = Db(valida)

    params = (nomUsuario, desEmail,)
    updSenha = ''
    if (data.get('desSenhaAtual') and data.get('desSenhaNova')):
        desSenhaAtual = data.get('desSenhaAtual')
        desSenhaNova = data.get('desSenhaNova')
        valida.desSenha(desSenhaAtual)
        valida.desSenha(desSenhaNova)
             
        if valida.temMensagem():
             return valida.getMensagens()

        sql = """
            SELECT desSenha
              FROM Usuario
             WHERE codUsuarioCPF = %s
        """
        params = (codUsuarioCPF,)
        resultado = db.execSql(sql, params, Mode.SELECT)
        if valida.temMensagem():
            return valida.getMensagens()

        if not resultado:
            valida.addAviso("Senha do usuario não encontrada!")
            return valida.getMensagens()
 
        desSenhaAtualCripto = resultado[0][0]
        if not bcrypt.checkpw(desSenhaAtual.encode('utf-8'), desSenhaAtualCripto.encode('utf-8')):
            valida.addAviso("Senha atual incorreta!")
            return valida.getMensagens()
        
        desSenhaNovaCripto = bcrypt.hashpw(desSenhaNova.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
        updSenha =  ", desSenha = %s"
    
        params += (desSenhaNovaCripto,)
    
    params += (codUsuarioCPF,)
    sql = f"""
        UPDATE Usuario
           SET nomUsuario = %s,
               desEmail = %s
               {updSenha}
         WHERE codUsuarioCPF = %s
        """
   
    db.execSql(sql, params)
    return valida.getMensagens()

# Rota para deletar usuário.
@login_bp.route("/usuario/<codUsuarioCPF>", methods=["DELETE"])
@jwt_required()
def delete_usuario(codUsuarioCPF):
    valida = Valida()
    valida.CPF(codUsuarioCPF)
    if valida.temMensagem():
        return valida.getMensagens()
    
    db = Db(valida)
    
    sql = """
        DELETE FROM Usuario
         WHERE codUsuarioCPF = %s
        """
    params = (codUsuarioCPF,)
    db.execSql(sql, params)
  
    if valida.temMensagem():
        return valida.getMensagens()
        
    
# Rota publica
@login_bp.route("/alterarSenha", methods=["PUT"])
def put_alterarSenha():
    data = request.json
    codUsuarioCPF = data.get('codUsuarioCPF')
    desSenha      = data.get('desSenha')
 
    valida = Valida()
    valida.CPF(codUsuarioCPF)
    valida.desSenha(desSenha)
    if valida.temMensagem():
        return valida.getMensagens()
       
    # Gerar hash da senha
    desSenhaCripto = bcrypt.hashpw(desSenha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    sql = """
        UPDATE Usuario 
           SET desSenha = %s
         WHERE codUsuarioCPF = %s
    """
    params = (desSenhaCripto, codUsuarioCPF,)
    
    db = Db(valida)
    db.execSql(sql, params)
    return valida.getMensagens()
   

      