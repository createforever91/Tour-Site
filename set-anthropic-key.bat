@echo off
setlocal
title Set Anthropic API Key

echo.
echo  Paste your Anthropic API key below.
echo  It should usually start with sk-ant-
echo.
set /p ANTHROPIC_KEY=Anthropic API key: 

if "%ANTHROPIC_KEY%"=="" (
  echo.
  echo  No key entered. Nothing was changed.
  pause
  exit /b 1
)

(
  echo ANTHROPIC_API_KEY=%ANTHROPIC_KEY%
  echo ANTHROPIC_MODEL=claude-haiku-4-5-20251001
  echo PORT=8080
) > ".env"

echo.
echo  Saved .env successfully.
echo  You can now run start-site.bat and open http://localhost:8080/index.html
echo.
pause
