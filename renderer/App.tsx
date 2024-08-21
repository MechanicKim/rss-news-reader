import React, { useState } from 'react';

import NavMenu from './NavMenu';
import Feeds from './rss/Feeds';
import News from './News';

const navMenuList = [
  { title: '한국경제' },
  { title: '매일경제' }
];

function App() {
  const [newsLink, setNewsLink] = useState('');
  const [item, setItem] = useState(0);
  
  const source = ['hk', 'mk'][item];

  return (
    <main className="w-screen h-screen flex flex-col">
      <header className="border-b bg-gray-900 text-gray-100">
        <h4 className="p-3 font-semibold">{new Date().toLocaleDateString()} 오늘의 뉴스</h4>
      </header>
      <div className="flex-1 flex overflow-y-auto">
        <nav className="w-32 border-r">
          <ul>
          {navMenuList.map(({ title }, index) => (
            <NavMenu
              key={index}
              title={title}
              setItem={setItem}
              setNewsLink={setNewsLink}
              index={index}
              selected={item === index}
            />
          ))}
          </ul>
        </nav>
        <div className="w-96 overflow-y-auto border-r">
          {item <= 1 && <Feeds source={source} newsLink={newsLink} setNewsLink={setNewsLink} />}
        </div>
        <div className="flex-1 overflow-y-auto">
          <News source={source} newsLink={newsLink} />
        </div>
      </div>
    </main>
  );
}

export default App;
