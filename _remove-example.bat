@echo off

node scripts/remove-example.js


(goto) 2>nul & del "%~f0"