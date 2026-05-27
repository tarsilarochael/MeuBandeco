import re
from backend.app.service.db import Mode

def validacaoAdministrador(valida, data):
    try:
        codUsuarioCPF = re.sub(r'\D', '', data.get('codUsuarioCPF', ''))
        nomUsuario = data.get('nomUsuario')
        desEmail = data.get('desEmail')
            
        valida.CPF(codUsuarioCPF)
        valida.nomUsuario(nomUsuario)
        valida.desEmail(desEmail)
    except Exception as e:
        valida.addAviso(f"Erro ao validar dados do usuário -> {e}")

    
def semUsuarioCadastrado(db, codUsuarioCPF):
    sql = """
        SELECT count(*)
          FROM USUARIO 
         WHERE codUsuarioCPF = %s
    """
    params = (codUsuarioCPF,)
   
    resultado = db.execSql(sql, params, Mode.SELECT)
    if db.getValida().temMensagem():
        return
    
    return resultado[0][0] == 0
    
# Função de uso geral para inserir usuario seapa ou externo
def inseriUsuario(db, data):
    print("passou 1")
    codUsuarioCPF =  re.sub(r'\D', '', data.get('codUsuarioCPF', ''))
    nomUsuario = data.get('nomUsuario')
    desEmail = data.get('desEmail')
    idPapel = data.get('idPapel')
    desSenha = data.get('desSenha')
        
    db.getValida().CPF(codUsuarioCPF)
    db.getValida().nomUsuario(nomUsuario)
    db.getValida().desEmail(desEmail)
    db.getValida().idPapel(idPapel)
    if desSenha is not None:
        db.getValida().desSenha(desSenha)

    if db.getValida().temMensagem():
        return   
 
    sql = """
        SELECT count(*)
          FROM Usuario
         WHERE codUsuarioCPF = %s
    """
    params = (codUsuarioCPF,)

    qtd = db.execSql(sql, params, Mode.SELECT)
    if db.getValida().temMensagem():
        return 
    
    temUsuarioCadastrado = qtd[0][0] > 0
    print("Passou 2")
    idPapel = idPapel
    desEmail = desEmail
    if temUsuarioCadastrado:
        db.getValida().addAviso(f"Usuário CPF {codUsuarioCPF}-{nomUsuario} já está cadastrado")
        return 
    
       
    sql = """
        INSERT INTO Usuario 
            (codUsuarioCPF, nomUsuario, desSenha, desEmail, idPapel)
                    VALUES (%s, %s, %s, %s, %s)                   
        """
    params = (codUsuarioCPF, nomUsuario, desSenha, desEmail, idPapel)

    db.execSql(sql, params)

        