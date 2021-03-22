@echo off
echo chrome://inspect
echo .

node --inspect-brk  _test/crawler.js

@pause
