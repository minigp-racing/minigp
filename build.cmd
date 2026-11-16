@echo off
rem Junta las tres piezas en index.html (el juego completo, un solo archivo)
cd /d "%~dp0"
copy /b src\head.html + src\core.js + src\ui.js index.html >nul
echo index.html generado.
