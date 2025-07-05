@echo off
echo 启动应用使用时长监控器...
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
)

REM 启动开发服务器
echo 启动开发服务器...
start /B npm run dev

REM 等待服务器启动
timeout /t 3 /nobreak > nul

REM 启动 Electron
echo 启动 Electron 应用...
set NODE_ENV=development
electron .

pause 