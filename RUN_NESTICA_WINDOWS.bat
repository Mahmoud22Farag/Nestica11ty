@echo off
cd /d "%~dp0"
echo Installing Nestica dependencies...
call npm install
if errorlevel 1 goto :error
echo Starting Nestica bilingual website...
call npm start
exit /b 0
:error
echo.
echo The project could not start. Review the error above.
pause
exit /b 1
