@echo off


REM Pull from GitHub repository
git pull

REM Install Node.js app dependencies
echo "installing dependencies ..."
npm install

REM Run the Node.js app
echo "running project ..."
npm start
pause
