const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');

let mainWindow;
const env = 'pro';

// 运行Java程序
function runExec() {
  require('child_process').exec('.\\jre\\bin\\java.exe -jar .\\spv-1.0.0.jar', (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误1: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`错误输出: ${stderr}`);
      return;
    }
    console.log(`命令输出: ${stdout}`);
  })
}

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,  // 如果你想在 Vue 中使用 Node.js API, 设为 true
      contextIsolation: false
    }
  });

   // 监听窗口大小变化
   mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    // 将窗口大小发送给渲染进程
    mainWindow.webContents.send('window-resized', { width, height });
  });

  if (env === 'pro') {
    mainWindow.loadURL('http://localhost:8000/');
  } else {
    runExec();
    mainWindow.loadFile(path.join(__dirname, '../dist/loading.html'));

    // 每两秒发送一次请求，请求成功（即java运行成功）后，加载index.html页面
    const interval = setInterval(() => {
      const request = net.request({
        method: 'Get',
        url: 'http://localhost:30000/project',
      });
      request.on('error', (e) => {
        console.log(e);
      });
      request.on('response', () => {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
        clearInterval(interval);
      });
      request.end();
    }, 2000);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.close();
  }
});
