@echo off

setlocal
D:
cd \github\brueckl-hotvolleys-source\infos

rem create the first line and an dummy line with the current timestamp to update the content
rem  (touch is not enough to reload the offline cache, it is necessary to change the content)
echo CACHE MANIFEST> ../cache.manifest
echo # %date% %time%>> ../cache.manifest
echo(>> ../cache.manifest

rem collect all the files to load into the offline cache
echo CACHE:>> ../cache.manifest
forfiles /s /m *.* /c "cmd /c call d:\github\brueckl-hotvolleys-source\_work\create_manifest2.cmd @relpath"
echo(>> ../cache.manifest

rem the network part to load all other files from internet (e.g. xml2.php)
rem it is necessary to whitelist all request with *, otherwise all links, ... will be requested from cache and cannot be found!
echo NETWORK:>> ../cache.manifest
echo *>> ../cache.manifest
rem echo(  => output an empty line
echo(>> ../cache.manifest

rem fallback to switch between file depending on the online/offline situation
echo FALLBACK:>> ../cache.manifest
echo /brueckl-hotvolleys/infos/tabelle.html /brueckl-hotvolleys/infos/tabelleoffline.html>> ../cache.manifest
rem caching with querystring does not work -> fallback to same file
echo /brueckl-hotvolleys/infos/imageview.html /brueckl-hotvolleys/infos/imageview.html>> ../cache.manifest
echo(>> ../cache.manifest


rem copy to result
rem copy  D:\github\brueckl-hotvolleys-source\cache.manifest  D:\github\brueckl-hotvolleys\cache.manifest

endlocal

echo Done.
if not "%1" == "silent"  pause
