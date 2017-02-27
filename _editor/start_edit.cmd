@echo off

set dir=-Dir D:\github\brueckl-hotvolleys-source
set run=-run @D:\github\brueckl-hotvolleys-source\_editor\edit.txt

start "console" "D:\Program Files\ConEmu\ConEmu64.exe" %dir% %run%
  
if errorlevel 1 goto error

exit

:error
pause
