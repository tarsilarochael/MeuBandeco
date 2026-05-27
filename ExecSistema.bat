@echo off
setlocal
title Sistema - Dev Environment

echo ======================================
echo  AMBIENTE DE DESENVOLVIMENTO - Sistema
echo ======================================

set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

:: Configura  es de Ambiente
set "FLASK_ENV=development"
set "PYTHONPATH=%BASE_DIR%"
set "VENV_PY=%BASE_DIR%venv\Scripts\python.exe"

:: 1. VERIFICA  O DA VENV
if not exist "%VENV_PY%" (
    echo [AVISO] Criando ambiente virtual...
    python -m venv venv
)

echo [INFO] Atualizando dependencias...
"%VENV_PY%" -m pip install -r "%BASE_DIR%backend\requirements.txt"

:: 2. LIMPEZA
echo [INFO] Finalizando processos Python antigos...
taskkill /f /im python.exe /t >nul 2>&1


echo [START] Iniciando servicos em novas janelas...

start "BACKEND APP" cmd /k "cd /d "%BASE_DIR%" && set PYTHONPATH=%BASE_DIR% && "%VENV_PY%" -m backend.app.app"

echo [START] Iniciando Frontend...
start "FRONTEND" cmd /c "cd /d %BASE_DIR%frontend && npm run dev"

echo [INFO] Aguardando inicializacao para abrir o browser...
timeout /t 8 /nobreak > nul
start chrome http://localhost:5173/

echo.
echo === AMBIENTE RODANDO ===
pause