@echo off
setlocal

rem set the path
SET mypath=%~dp0
call "%mypath%initpath.cmd"

rem for /F %%i IN('echo aa bb') do echo %%i
rem for /f "delims=" %%i in ('dir /B /A:D "%src%"') do rd /S /Q "%src%%%i"
for /f "delims=" %%i in ('dir /B /A:D') do call :doit %%i

goto :done

rem set pngs=%mypath%\verteidigung\
rem set target=%mypath%..\..\..\..\system1\verteidigung\
rem for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%
rem
rem set pngs=%mypath%\angriff\
rem set target=%mypath%..\..\..\..\system1\angriff\
rem for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%
rem
rem set pngs=%mypath%\annahme\
rem set target=%mypath%..\..\..\..\system1\annahme\
rem for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%

:done
endlocal

pause
exit /B %ERRORLEVEL%
rem goto :done2


:doit

set pngs=%mypath%%1\
set target=%mypath%..\..\..\..\system1\%1\
rem echo %1 %pngs% %target%
for /R %pngs% %%V IN (*.png) do call "%mypath%do_sizing.cmd" %%V %target%

exit /B

