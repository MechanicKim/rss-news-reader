const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');

const { readyFile, loadRss, bookmark, unbookmark, fetchHK, fetchMK } = require('./mainUtil.js');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: '광고 없이 깔끔한 오늘의 뉴스',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
  return win;
};

app.whenReady().then(() => {
  readyFile();
  let win = createWindow();

  ipcMain.handle('rss:hk', async () => {
    const rss = await loadRss('https://www.hankyung.com/feed/economy', 'hk');
    win.webContents.send('update-rss', rss);
  });

  ipcMain.handle('rss:mk', async () => {
    const rss = await loadRss('https://www.mk.co.kr/rss/30100041', 'mk');
    win.webContents.send('update-rss', rss);
  });

  ipcMain.on('feed:bookmark', bookmark);
  ipcMain.on('feed:unbookmark', unbookmark);
  ipcMain.on('news:hk', async (event, url) => {
    const newsInfo = await fetchHK(url);
    win.webContents.send('update-news', newsInfo);
  });
  ipcMain.on('news:mk', async (event, url) => {
    const newsInfo = await fetchMK(url);
    win.webContents.send('update-news', newsInfo);
  });
  ipcMain.on('window:external', (event, url) => {
    shell.openExternal(url);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
