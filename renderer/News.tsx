import React, { useEffect, useState } from 'react';

interface INewsContent {
  tag: string;
  text?: string;
  src?: string;
  alt?: string;
}

interface INewsInfo {
  title: string;
  contents: INewsContent[];
};

type TProps = {
  source: string;
  newsLink: string;
};

function News({ source, newsLink }: TProps) {
  const [info, setInfo] = useState<INewsInfo | null>(null);

  useEffect(() => {
    window.electronAPI.onUpdateNews((newsInfo) => {
      setInfo(newsInfo);
    });
  }, []);

  useEffect(() => {
    if (newsLink) {
      window.electronAPI.fetchNews(newsLink, source);
    }
  }, [source, newsLink]);

  if (!newsLink || !info) return null;

  return (
    <article>
      <h4 className="p-5 text-3xl font-semibold text-center">{info.title}</h4>
      <div className="pb-5">
        {info.contents.map((content, index) => {
          if (content.tag === 'img') {
            const { src, alt } = content;
            return (
              <div className="p-5 mx-auto max-w-lg" key={index}>
                <img className="max-w-lg mx-auto" src={src} alt={alt} loading="lazy" />
                <figcaption className="mt-1 text-sm text-center opacity-60">{alt}</figcaption>
              </div>
            );
          }
          return <p className="px-5 py-2 mx-auto max-w-3xl" key={index}>{content.text}</p>;
        })}
      </div>
      <div className="bg-gray-200 fixed right-3 bottom-3">
        <a className="p-3 block hover:cursor-pointer" onClick={() => window.electronAPI.openExternal(newsLink)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>
        </a>
      </div>
    </article>
  );
}

export default News;
