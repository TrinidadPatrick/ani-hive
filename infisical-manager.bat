@echo off
title Infisical Manager
cd /d "%~dp0"

:menu
cls
echo ==========================================
echo           INFISICAL MANAGER
echo ==========================================
echo.
echo Project: %CD%
echo.
echo [1] Push .env to Infisical
echo [2] Pull Infisical to .env
echo [3] Run Development Server
echo [4] View Secrets
echo [5] Login to Infisical
echo [6] Exit
echo.
set /p choice="Choose an option: "

if "%choice%"=="1" goto push
if "%choice%"=="2" goto pull
if "%choice%"=="3" goto run
if "%choice%"=="4" goto view
if "%choice%"=="5" goto login
if "%choice%"=="6" goto exit

echo.
echo Invalid choice.
pause
goto menu


:: ==========================================
:: SELECT ENVIRONMENT
:: ==========================================

:select_env
cls
echo ==========================================
echo           SELECT ENVIRONMENT
echo ==========================================
echo.
echo [1] Development
echo [2] Staging
echo [3] Production
echo [4] Cancel
echo.

set /p envchoice="Choose an environment: "

if "%envchoice%"=="1" goto env_dev
if "%envchoice%"=="2" goto env_staging
if "%envchoice%"=="3" goto env_prod
if "%envchoice%"=="4" goto menu

echo.
echo Invalid choice.
pause
goto select_env


:env_dev
set "ENV=dev"
set "ENV_NAME=Development"
goto select_folder


:env_staging
set "ENV=staging"
set "ENV_NAME=Staging"
goto select_folder


:env_prod
set "ENV=prod"
set "ENV_NAME=Production"
goto select_folder


:: ==========================================
:: SELECT FOLDER
:: ==========================================

:select_folder
cls
echo ==========================================
echo             SELECT FOLDER
echo ==========================================
echo.
echo Environment: %ENV_NAME%
echo.
echo [1] Root
echo [2] Inside Folder
echo [3] Cancel
echo.

set /p folderchoice="Choose an option: "

if "%folderchoice%"=="1" goto folder_root
if "%folderchoice%"=="2" goto folder_input
if "%folderchoice%"=="3" goto menu

echo.
echo Invalid choice.
pause
goto select_folder


:folder_root
set "FOLDER=/"
set "FOLDER_NAME=Root"
goto folder_selected


:folder_input
echo.
set /p "FOLDER=Enter Infisical folder path (e.g. /Server): "

if not defined FOLDER goto folder_empty

set "FOLDER_NAME=%FOLDER%"
goto folder_selected


:folder_empty
echo.
echo Folder path cannot be empty.
pause
goto select_folder


:: ==========================================
:: FOLDER SELECTED
:: ==========================================

:folder_selected

if "%FOLDER%"=="/" goto folder_root_selected

set "HAS_FOLDER=1"
goto operation_selected


:folder_root_selected
set "HAS_FOLDER=0"
goto operation_selected


:: ==========================================
:: PUSH .ENV → INFISICAL
:: ==========================================

:push
set "OPERATION=push"
call :select_env

:operation_selected
if "%OPERATION%"=="push" goto push_execute
if "%OPERATION%"=="pull" goto pull_execute
if "%OPERATION%"=="view" goto view_execute

goto menu


:push_execute
cls
echo ==========================================
echo        PUSH .ENV TO INFISICAL
echo ==========================================
echo.
echo Environment: %ENV_NAME%
echo Folder:      %FOLDER_NAME%
echo.
echo This will add/update secrets in:
echo Infisical - %ENV_NAME%
echo Folder - %FOLDER_NAME%
echo.
echo Local file:
echo %CD%\.env
echo.

if "%ENV%"=="prod" goto push_prod_warning

goto push_confirm


:push_prod_warning
echo ==========================================
echo WARNING: PRODUCTION ENVIRONMENT
echo ==========================================
echo.
echo You are about to upload your local .env
echo to the PRODUCTION environment.
echo.
set /p "confirm=Continue? (Y/N): "

if /i not "%confirm%"=="Y" goto menu


:push_confirm
echo.
echo Uploading secrets...
echo.

if "%HAS_FOLDER%"=="1" (
    infisical secrets set --env %ENV% --path "%FOLDER%" --file .env
) else (
    infisical secrets set --env %ENV% --file .env
)

echo.
echo ==========================================
echo Done.
echo ==========================================
pause
goto menu


:: ==========================================
:: PULL INFISICAL → .ENV
:: ==========================================

:pull
set "OPERATION=pull"
call :select_env


:pull_execute
cls
echo ==========================================
echo        PULL INFISICAL TO .ENV
echo ==========================================
echo.
echo Environment: %ENV_NAME%
echo Folder:      %FOLDER_NAME%
echo.
echo WARNING:
echo This will OVERWRITE your local .env file.
echo.
echo Source:
echo Infisical - %ENV_NAME%
echo Folder - %FOLDER_NAME%
echo.
echo Destination:
echo %CD%\.env
echo.

set /p "confirm=Continue? (Y/N): "

if /i not "%confirm%"=="Y" goto menu

if "%ENV%"=="prod" goto pull_prod_warning

goto pull_download


:pull_prod_warning
cls
echo ==========================================
echo       !!! PRODUCTION WARNING !!!
echo ==========================================
echo.
echo You are about to replace your local .env
echo with PRODUCTION secrets.
echo.
echo This can cause your local application to
echo connect to production services/databases.
echo.
set /p "confirmprod=ARE YOU SURE? (Y/N): "

if /i not "%confirmprod%"=="Y" goto menu


:pull_download
echo.
echo Downloading secrets...
echo.

if "%HAS_FOLDER%"=="1" (
    infisical export --env %ENV% --path "%FOLDER%" --format dotenv > .env
) else (
    infisical export --env %ENV% --format dotenv > .env
)

echo.
echo ==========================================
echo .env updated successfully.
echo ==========================================
echo.
pause
goto menu


:: ==========================================
:: RUN DEVELOPMENT SERVER
:: ==========================================

:run
cls
echo ==========================================
echo       RUN DEVELOPMENT SERVER
echo ==========================================
echo.
echo The development server will use:
echo Infisical Development environment
echo.
echo Command:
echo infisical run --env dev -- npm run dev
echo.

set /p "confirm=Start server? (Y/N): "

if /i not "%confirm%"=="Y" goto menu

cls
echo ==========================================
echo        STARTING DEVELOPMENT SERVER
echo ==========================================
echo.

infisical run --env dev -- npm run dev

echo.
echo Development server stopped.
pause
goto menu


:: ==========================================
:: VIEW SECRETS
:: ==========================================

:view
set "OPERATION=view"
call :select_env


:view_execute
cls
echo ==========================================
echo             VIEW SECRETS
echo ==========================================
echo.
echo Environment: %ENV_NAME%
echo Folder:      %FOLDER_NAME%
echo.
echo WARNING:
echo Secret values will be displayed below.
echo.

if "%ENV%"=="prod" goto view_prod_warning

goto view_show


:view_prod_warning
echo ==========================================
echo WARNING: PRODUCTION SECRETS
echo ==========================================
echo.
set /p "confirm=Show production secrets? (Y/N): "

if /i not "%confirm%"=="Y" goto menu


:view_show
cls
echo ==========================================
echo      SECRETS - %ENV_NAME%
echo      FOLDER  - %FOLDER_NAME%
echo ==========================================
echo.

if "%HAS_FOLDER%"=="1" (
    infisical export --env %ENV% --path "%FOLDER%" --format dotenv
) else (
    infisical export --env %ENV% --format dotenv
)

echo.
pause
goto menu


:: ==========================================
:: LOGIN
:: ==========================================

:login
cls
echo ==========================================
echo           INFISICAL LOGIN
echo ==========================================
echo.
echo Opening Infisical authentication...
echo.

infisical login

echo.
echo ==========================================
echo Login process finished.
echo ==========================================
pause
goto menu


:: ==========================================
:: EXIT
:: ==========================================

:exit
cls
echo Goodbye!
timeout /t 1 >nul
exit