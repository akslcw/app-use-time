console.log('Electron 主进程已启动');
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')

let mainWindow
let usageData = {}
let monitoringInterval

// 数据文件路径
const dataFilePath = path.join(__dirname, 'usage-data.json')

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron', 'preload.js')
    },
    icon: path.join(__dirname, 'public', 'vite.svg'),
    titleBarStyle: 'default',
    show: false
  })

  // 开发环境加载本地服务器
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 获取当前活跃进程
function getActiveProcess() {
  return new Promise((resolve, reject) => {
    exec('tasklist /FO CSV /NH', (error, stdout) => {
      if (error) {
        reject(error)
        return
      }

      const processes = stdout.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',')
          return {
            name: parts[0].replace(/"/g, ''),
            pid: parts[1].replace(/"/g, ''),
            memory: parts[4].replace(/"/g, '')
          }
        })
        .filter(process => process.name && process.pid !== 'PID')

      // 获取当前活跃窗口的进程
      exec('powershell "Get-Process | Where-Object {$_.MainWindowTitle -ne \"\"} | Select-Object ProcessName,Id | ConvertTo-Json"', (error, stdout) => {
        if (error) {
          // 如果 PowerShell 失败，返回第一个进程
          resolve(processes[0] || { name: 'Unknown', pid: '0', memory: '0' })
          return
        }

        try {
          const activeProcesses = JSON.parse(stdout)
          if (Array.isArray(activeProcesses) && activeProcesses.length > 0) {
            const activeProcess = activeProcesses[0]
            const processInfo = processes.find(p => p.name.toLowerCase() === activeProcess.ProcessName.toLowerCase())
            resolve(processInfo || { name: activeProcess.ProcessName, pid: activeProcess.Id, memory: '0' })
          } else {
            resolve(processes[0] || { name: 'Unknown', pid: '0', memory: '0' })
          }
        } catch (e) {
          resolve(processes[0] || { name: 'Unknown', pid: '0', memory: '0' })
        }
      })
    })
  })
}

// 更新使用时长数据
function updateUsageData() {
  getActiveProcess().then(process => {
    const appName = process.name.replace('.exe', '')
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    if (!usageData[today]) {
      usageData[today] = {}
    }

    if (!usageData[today][appName]) {
      usageData[today][appName] = {
        name: appName,
        minutes: 0,
        icon: getAppIcon(appName),
        lastUpdate: now.getTime()
      }
    }

    // 增加使用时长（每分钟调用一次）
    usageData[today][appName].minutes += 1
    usageData[today][appName].lastUpdate = now.getTime()

    // 保存到文件
    saveUsageData()

    // 发送更新到渲染进程
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('usage-data-updated', usageData[today])
    }
  }).catch(error => {
    console.error('获取进程信息失败:', error)
  })
}

// 获取应用图标
function getAppIcon(appName) {
  const iconMap = {
    'chrome': '🌐',
    'code': '📝',
    'wechat': '💬',
    'qq': '💻',
    'netease': '🎵',
    'spotify': '🎵',
    'notepad': '📄',
    'explorer': '📁',
    'cmd': '💻',
    'powershell': '💻',
    'word': '📄',
    'excel': '📊',
    'powerpoint': '📈',
    'outlook': '📧',
    'teams': '💬',
    'slack': '💬',
    'discord': '🎮',
    'steam': '🎮',
    'origin': '🎮',
    'epicgameslauncher': '🎮'
  }

  const lowerName = appName.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon
    }
  }
  return '📱'
}

// 保存数据到文件
function saveUsageData() {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(usageData, null, 2))
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

// 加载数据文件
function loadUsageData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8')
      usageData = JSON.parse(data)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    usageData = {}
  }
}

// 启动监控
function startMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval)
  }
  
  monitoringInterval = setInterval(updateUsageData, 60000) // 每分钟更新一次
  console.log('开始监控应用使用时长...')
}

// 停止监控
function stopMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval)
    monitoringInterval = null
  }
  console.log('停止监控应用使用时长')
}

// IPC 通信处理
ipcMain.handle('get-usage-data', () => {
  const today = new Date().toISOString().split('T')[0]
  return usageData[today] || {}
})

ipcMain.handle('start-monitoring', () => {
  startMonitoring()
  return { success: true }
})

ipcMain.handle('stop-monitoring', () => {
  stopMonitoring()
  return { success: true }
})

// 应用生命周期
app.whenReady().then(() => {
  loadUsageData()
  createWindow()
  startMonitoring()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  stopMonitoring()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopMonitoring()
  saveUsageData()
}) 