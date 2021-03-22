@echo off

setlocal
D:
cd \workdir\brueckl-hotvolleys-source\_server

rem set node=D:\nodejs\node.exe
node  --inspect-brk  bhv-server.js

endlocal

echo BHV-Info started.
pause
