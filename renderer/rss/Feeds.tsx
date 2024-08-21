import React, { Dispatch, useEffect, useState } from 'react';

import { IFeed, rssToJSON } from './util';

type TProps = {
  source: string;
  newsLink: string;
  setNewsLink: Dispatch<React.SetStateAction<string>>;
};

function Feeds({ source, newsLink, setNewsLink }: TProps) {
  const [feeds, setFeeds] = useState<IFeed[]>([]);

  useEffect(() => {
    window.electronAPI.onUpdateRSS(({ rss }) => {
      const json = rssToJSON(source, rss);
      if (json.length === 0) return;
      setFeeds(json);
      setNewsLink(json[0].link);
    });
  }, []);

  useEffect(() => {
    window.electronAPI.fetchRSS(source);
  }, [source]);

  // const bookmark = (feed: IFeed) => {
  //   window.electronAPI.bookmarkFeed(feed);
  // };

  // const unbookmark = (feedID: string) => {
  //   window.electronAPI.unbookmarkFeed(feedID);
  // };

  return (
    <ul>
    {feeds.map((feed) => {
      const { id, title, link, date } = feed;
      const bgStyle = link === newsLink ? 'bg-gray-100' : 'hover:bg-gray-100';
      return (
        <li className={`px-3 py-2 flex items-center ${bgStyle}`} key={id}>
          <a className="flex-1 hover:cursor-pointer" onClick={() => setNewsLink(link)}>
            <h4>{title}</h4>
            <div className="text-sm opacity-60">{date}</div>
          </a>
          
          {/* {!bookmarked && (
            <button className="ml-1" type="button" onClick={() => { bookmark(feed); }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                <path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/>
              </svg>
            </button>
          )}
          {bookmarked && (
            <button className="ml-1" type="button" onClick={() => { unbookmark(id); }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                <path d="M840-680H600v-80h240v80ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Z"/>
              </svg>
            </button>
          )} */}
        </li>
      );
    })}
    </ul>
  );
}

export default Feeds;
