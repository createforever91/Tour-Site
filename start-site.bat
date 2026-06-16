@echo off
title Paradise Cartagena Tours — Local Server + ngrok

echo.
echo  ==========================================
echo   Paradise Cartagena Tours — Live Preview
echo  ==========================================
echo.

:: Kill any existing instances
taskkill /f /im ngrok.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 "') do taskkill /f /pid %%a >nul 2>&1

echo  [1/2] Starting local web server on port 8080...
start "PCT Web Server" /min cmd /c "cd /d ""C:\Users\dentn\Downloads\agency site"" && node server.js"

timeout /t 2 /nobreak >nul

echo  [2/2] Starting ngrok tunnel...
start "PCT ngrok Tunnel" /min cmd /c "ngrok http 8080"

timeout /t 5 /nobreak >nul

echo.
echo  Fetching your public URL...
echo.

:: Use PowerShell to grab the URL from ngrok API
powershell -Command "$t = (Invoke-RestMethod http://localhost:4040/api/tunnels).tunnels | Where-Object { $_.proto -eq 'https' } | Select-Object -First 1; if ($t) { Write-Host '  Your site is LIVE at:' -ForegroundColor Green; Write-Host ''; Write-Host ('  ' + $t.public_url) -ForegroundColor Cyan; Write-Host '' } else { Write-Host '  Could not get URL — check the ngrok window.' -ForegroundColor Yellow }"

echo.
echo  Press any key to STOP the server and close everything.
echo  (Or just close this window to leave it running in the background.)
echo.
pause >nul

:: Cleanup on exit
taskkill /f /im ngrok.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 "') do taskkill /f /pid %%a >nul 2>&1
echo  Server stopped. Goodbye!
