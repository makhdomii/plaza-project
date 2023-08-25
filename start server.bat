@echo off
setlocal

REM batch
set "batch_path=%~dp0"

echo Running npm start in PowerShell from batch file
cd /d "%batch_path%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "npm start"

endlocal
