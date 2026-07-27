@echo off
cd /d "%~dp0"
call npm install
if errorlevel 1 goto :error
call npm start
exit /b 0
:error
echo.
echo Failed to start Nestica. Review the error above.
pause
exit /b 1
