const { contextBridge, ipcRenderer } = require('electron')

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取使用时长数据
  getUsageData: () => ipcRenderer.invoke('get-usage-data'),
  
  // 启动监控
  startMonitoring: () => ipcRenderer.invoke('start-monitoring'),
  
  // 停止监控
  stopMonitoring: () => ipcRenderer.invoke('stop-monitoring'),
  
  // 监听数据更新
  onUsageDataUpdated: (callback) => {
    ipcRenderer.on('usage-data-updated', (event, data) => callback(data))
  },
  
  // 移除监听器
  removeUsageDataListener: () => {
    ipcRenderer.removeAllListeners('usage-data-updated')
  }
})
