# db.py
import psycopg2
import logging, os, sys
from dotenv import load_dotenv
import enum

class Mode(enum.Enum):
    SELECT = 1
    BEGIN = 2
    DEFAULT = 3
    COMMIT = 4


"""
    Executa uma comando SQL com tratamento de erros e
    controle de transação. 
    retorna os resultados (se houver).

    Args:
        sql (str): A consulta SQL com placeholders.
        params (tuple ou dict): Os parâmetros a serem substituídos na consulta.
        mode: pode ser uma das 4 constantes
          BEGIN -> só conecta ou inicia uma transaçao explicita)
          DEFAULT -> conecta se não houver conexão e commita se not inTransactio
          COMMIT -> só comita (fim de transação explicita)
          SELECT -> espera retornar dados
                          
    Returns:
        list: Uma lista de resultados da consulta 
        (se for um SELECT), ou None em caso de erro ou outras consultas.
    """
class Db:
    # config define o banco de conexão {app}
    def __init__(self, valida, config='app'):
        self.valida = valida
        self.config = config

        leitura_sucesso = load_dotenv("backend/.env.development")
        if not leitura_sucesso:
            print("ERRO: O arquivo .env.development nao foi encontrado ou nao pode ser lido.")
            sys.exit(1)

        self.debug = os.getenv("DEBUG_MODE", "true").lower() == "true"

        print(f"Modo de debug = {self.debug}")
       
        self.conn = None
        self.cursor = None
        self.inTransaction = False
        self.idInsert = None
        self.qtdAtu = 0

        logging.basicConfig(level=logging.ERROR,
                            filename='app.log',
                            filemode='a',
                            format='%(asctime)s - %(levelname)s - %(message)s')
        
    def _get_connection(self):
        """Busca as credenciais no .env usando Match Case"""
        try:
            prefix = "DB"
            
            # Conecta usando as variáveis do .env correspondentes ao prefixo
            return psycopg2.connect(
                dbname=os.getenv(f"{prefix}_NAME"),
                user=os.getenv(f"{prefix}_USER"),
                password=os.getenv(f"{prefix}_PASS"),
                host=os.getenv(f"{prefix}_HOST"),
                port=os.getenv(f"{prefix}_PORT")
            )

        except Exception as e:
            msg = f"Erro de conexão com o banco {self.config}: {str(e)}"
            self.valida.addErro(msg)
            if self.debug:
                print(f"ERRO: {msg}")
            return None

    def execSql(self, sql: str, params: tuple=None, mode: Mode=Mode.DEFAULT, atuIdInsert: bool =False):
        results = None
        try:
            if mode == Mode.BEGIN:
                self.inTransaction = True
                sql = "BEGIN;\n" + sql
            elif mode == Mode.COMMIT:
                sql += ";\n COMMIT;"
                
            if not self.conn:  
                self.conn = self._get_connection()
                self.cursor = self.conn.cursor()
            
            if self.debug:
                full_sql = self.cursor.mogrify(sql, params).decode("utf-8")
                print("Mostrando SQL")
                print(full_sql)
                print("Fim SQL")

            self.cursor.execute(sql, params)
            
            if mode == Mode.SELECT:
                results = self.cursor.fetchall()
                return results
            
            if atuIdInsert:
                # busca o id da linha inserida
                row = self.cursor.fetchone()
                if row:
                    self.idInsert = row[0]

            self.qtdAtu += self.cursor.rowcount

            if mode == Mode.COMMIT:
                self.inTransaction = False
                self.valida.addSucesso(f"Transação realizada com sucesso{self.getMsgAtu()}")
            else:    
                if self.inTransaction:
                    return
                
                self.valida.addSucesso(f"Atualização realizada com sucesso{self.getMsgAtu()}")

            self.conn.commit()
        except Exception as e:
            self.valida.addErro(str(e))
            if self.conn:
                self.conn.rollback()
        
        finally:
            if self.debug:       
                print("Resposta API")
                print(results)
                print("Fim Resposta API")

            if self.conn and self.cursor and not self.inTransaction:
                self.cursor.close()
                self.conn.close()
                self.conn = None
             
    def getIdInsert(self):
        return self.idInsert
    
    
    def setQtdAtu(self):
        self.qtdAtu = 0
            
    def getMsgAtu(self):
        msgAtu = ''
        if self.qtdAtu <= 1:
            msgAtu = 'registro atualizado!'
        else:
            if self.qtdAtu > 1:
                msgAtu = 'registros atualizados!'
        return f" - {self.qtdAtu} {msgAtu}"

    def getValida(self):
        return self.valida