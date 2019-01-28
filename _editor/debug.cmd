@echo off

echo chrome://inspect
echo .

node --inspect-brk node_modules\grunt-cli\bin\grunt
