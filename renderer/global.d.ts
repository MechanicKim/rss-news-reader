export interface IElectronAPI {
  fetchRSS: (source: string) => Promise<void>;
  onUpdateRSS: (callback: ({ rss, feedIDs }: { rss: string, feedIDs: string[] }) => void) => Promise<void>;
  bookmarkFeed: (feed) => Promise<void>;
  unbookmarkFeed: (feedID: string) => Promise<void>;
  fetchNews: (url: string, source: string) => Promise<void>;
  onUpdateNews: (callback: (newsInfo) => void) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
