@echo off
echo "Compile for web."

rem compile everything
rem call grunt build

rem set grunt=D:\workdir\vb-statsone\node_modules\.bin\grunt

rem watch for updates of files (simpler incremental recompile)
node_modules\.bin\grunt watch
