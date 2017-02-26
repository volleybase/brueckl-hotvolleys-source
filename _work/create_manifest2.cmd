@echo off
setlocal
set str=%1
set str=%str:".\=%
set str=%str:"=%
set str=%str:\=/%

echo /brueckl-hotvolleys/infos/%str%>> d:\github\brueckl-hotvolleys-source\cache.manifest

rem index.html -> double entry without index.html
set r=%str:~-10%
set str2=%str%
if "%r%" == "index.html" (
  set str2=%str:index.html=%
)
if "%str%" neq "%str2%" (
  echo /brueckl-hotvolleys/infos/%str2%>> d:\github\brueckl-hotvolleys-source\cache.manifest
)

endlocal
