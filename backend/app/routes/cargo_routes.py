# routes/cargo_routes.py
from flask_jwt_extended import jwt_required
from flask import Blueprint, request
from backend.app.service.db import Db, Mode
from backend.app.service.valida import Valida



cargo_bp = Blueprint("cargo_bp", __name__)

# Rota Pública para popular listbox para cadastrar contatos Prefeitura, Emater, EmpresaGeo
@cargo_bp.route("/cargo", methods=["GET"])
def get_cargo():
    sql = """
        SELECT codCargo,
               nomCargo
          FROM Cargo
        """
    valida = Valida()
    
    db = Db(valida)
    cargos = db.execSql(sql, None, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()

    if not cargos:
        valida.addAviso("Cargo não encontrado")
        return valida.getMensagens()

    formatarCargo = []
    for cargo in cargos:
        formatarCargo.append({
            "codCargo": cargo[0],
            "nomCargo": cargo[1]
        })
    return formatarCargo


# Rota para obter um cargo específico
@cargo_bp.route("/obterCargoPorId/<int:codCargo>", methods=["GET"])
@jwt_required()
def obter_cargoPorId(codCargo):
    valida = Valida()
    valida.codCargo(codCargo)

    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        SELECT nomCargo 
          FROM Cargo
         WHERE codCargo = %s
    """
    params = (codCargo,)
    
    db = Db(valida)
    cargos = db.execSql(sql, params, Mode.SELECT)
    if valida.temMensagem():
        return valida.getMensagens()
     
    if not cargos:
        valida.addAviso("Não foram encontrados Cargos cadastrados!")
        return valida.getMensagens()
    
    return [{"nomCargo": cargos[0][0]}]

# Rota para adicionar um cargo
@cargo_bp.route('/cargo', methods=['POST'])
@jwt_required()
def add_cargo():
    data = request.json
         
    nomCargo = data.get('nomCargo')

    valida = Valida()
    valida.nomCargo(nomCargo)
  
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        INSERT INTO Cargo
          (nomCargo)
            VALUES (%s)
    """
    params = (nomCargo,)
    
    db = Db(valida)
    db.execSql(sql, params)
    return valida.getMensagens()
    
@cargo_bp.route('/cargo', methods=['PUT'])
@jwt_required()
def update_cargo():
    data = request.json  

    codCargo = data.get('codCargo')
    nomCargo = data.get('nomCargo')

    valida = Valida()
    valida.codCargo(codCargo)
    valida.nomCargo(nomCargo)

    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        UPDATE Cargo
           SET nomCargo = %s
         WHERE codCargo = %s
        """
    params = (nomCargo, codCargo,)
        
    db = Db(valida)
    db.execSql(sql, params)
    return valida.getMensagens()

@cargo_bp.route("/cargo/<int:codCargo>", methods=["DELETE"])
@jwt_required()
def deletar_cargo(codCargo):
    valida = Valida()
    valida.codCargo(codCargo)
    
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        DELETE FROM Cargo 
         WHERE codCargo = %s
    """
    params = (codCargo,)

    db = Db(valida)  
    db.execSql(sql, params)
    return valida.getMensagens()

