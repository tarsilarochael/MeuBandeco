
# Valida - Comentario a seguir é necessário para visualizar acentos no frontend
# -*- coding: utf-8 -*-

from flask import jsonify


#    SUCESSO = 0
#    AVISO = 1
#    ERRO = 2
       
class Valida:
    def __init__(self):
        self.mensagem = []
        self.tipo = "AVISO"

    def temMensagem(self):
        return len(self.mensagem) > 0
    
    def semMensagem(self):
        return len(self.mensagem) == 0
    
    def addSucesso(self, linha):
        self.mensagem.append(linha)
        self.tipo = "SUCESSO"

    def addAviso(self, linha):
        self.mensagem.append(linha)
        self.tipo = "AVISO"

    def addErro(self, linha):
        self.mensagem.append(linha)
        self.tipo = "ERRO"
    
    def getMensagens(self):
        msg = {
            "tipo": self.tipo, 
            "mensagem": self.mensagem
        }
        
        try:
            return msg, 202   
        except Exception as e:
            return {
               "tipo": "ERRO", 
               "mensagem": [f"Erro indefinido -> {e}"]
            }, 500     
                   
    def token(self, token):
        if token is None:
            self.mensagem.append("Token de acesso não pode ser nulo!")
  
    
    def CPF(self, codCPF):
        if codCPF is None:
            self.mensagem.append("Código do CPF não pode ser nulo!")
        else:
            if not (isinstance(codCPF, str)):
                self.mensagem.append(f"CPF tipo {type(codCPF)} inválido: valor não é uma string!")
            else:
                cpf = codCPF.strip()
                if len(cpf) != 11:
                    self.mensagem.append("Quantidade de dígitos do CPF diferente de 11!")
                else:
                    if not cpf.isdigit():
                        self.mensagem.append("CPF possui caracteres não numéricos!")
        
    def desSenha(self, desSenha):
        if desSenha is None:
            self.mensagem.append("Senha não pode ser nula!")
            return
        if len(desSenha) < 4:
            self.mensagem.append("A senha tem de ter pelo menos 4 caracteres!")
        else:
            tamanho = len(desSenha)
            if tamanho < 4 or tamanho > 12:
                self.mensagem.append("Senha deve ter entre 4 a 12 digitos!")
 

    def nomUsuario(self, nomUsuario):
        if nomUsuario is None:
            self.mensagem.append("Nome do usuário não pode ser nulo!")
        else:
            tamanho = len(nomUsuario)
            if tamanho <= 0 or tamanho > 50:
                self.mensagem.append("Nome do usuário é obrigatório e pode ter até 50 caracteres!")
        
    def desEmail(self, desEmail):
        if desEmail is None:
            self.mensagem.append("E-mail do usuário não pode ser nulo!")
        else:
            tamanho = len(desEmail)
            if tamanho <= 0 or tamanho > 50:
                self.mensagem.append('E-mail do usuario é obrigatório e pode ter até 50 caracteres!')
        
   
    def codCargo(self, codCargo):
        if codCargo is None:
            self.mensagem.append("Código do cargo não pode ser nulo!")
        else:
            try:
                codCargo = int(codCargo)
            except:
                self.mensagem.append('Código do cargo não é numérico!')

    def nomCargo(self, nomCargo):
        if nomCargo is None:
            self.mensagem.append("Nome do cargo não pode ser nulo!")
        else:
            tamanho = len(nomCargo)
            if tamanho <= 0 or tamanho > 50:
                self.mensagem.append('Nome do cargo é obrigatório e pode ter até 30 caracteres!')

    def idPapel(self, idPapel):
        if idPapel is None:
            self.mensagem.append('Papel do usuário não pode ser nulo!')
        else:
            if idPapel <= 0:
               self.mensagem.append('Papel do usuário não pode ser zero!')

