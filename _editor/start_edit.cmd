@echo off

set dir=-Dir D:\workdir\brueckl-hotvolleys-source
set run=-run @D:\workdir\brueckl-hotvolleys-source\_editor\edit.txt

start "console" "D:\apps\ConEmu\ConEmu64.exe" %dir% %run%
  
if errorlevel 1 goto error

exit

:error
pause
