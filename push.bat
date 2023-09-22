@echo off
title GIT PUSH
cd %1
git init
git add .
git commit -m "update"
git branch -M main
git push -u origin