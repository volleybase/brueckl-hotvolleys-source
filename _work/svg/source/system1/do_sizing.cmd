rem echo %1

rem set p=%~dp1
set name=%~nx1
set tgt=%2

rem echo path: %p%
echo in : %1
echo out: %tgt%%name%

magick convert "%1" -resize 250 "%tgt%%name%"