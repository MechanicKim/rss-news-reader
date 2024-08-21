const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchRSS: (source) => ipcRenderer.invoke(`rss:${source}`),
  onUpdateRSS: (callback) => ipcRenderer.on('update-rss', (_event, value) => callback(value)),
  bookmarkFeed: (feed) => ipcRenderer.send('feed:bookmark', feed),
  unbookmarkFeed: (feedID) => ipcRenderer.send('feed:unbookmark', feedID),
  fetchNews: (url, source) => ipcRenderer.send(`news:${source}`, url),
  onUpdateNews: (callback) => ipcRenderer.on('update-news', (_event, value) => callback(value)),
  openExternal: (url) => ipcRenderer.send(`window:external`, url),
});
