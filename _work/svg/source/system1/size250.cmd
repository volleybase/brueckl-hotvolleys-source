@echo off
setlocal

rem set the path
SET mypath=%~dp0
call "%mypath%initpath.cmd"

set pngs=%mypath%\verteidigung\png\
set target=%mypath%..\..\..\..\system1\verteidigung\
for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%

set pngs=%mypath%\angriff\png\
set target=%mypath%..\..\..\..\system1\angriff\
for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%

set pngs=%mypath%\annahme\png\
set target=%mypath%..\..\..\..\system1\annahme\
for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%

:done
endlocal

rem exit /B %ERRORLEVEL%
pause
