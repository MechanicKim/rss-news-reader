const path = require('path');
const fs = require('fs');
const { parse, TextNode } = require('node-html-parser');

const assetsPath = path.resolve(__dirname, './assets');
const filePath = path.resolve(assetsPath, './myBookmark.json');

const readyFile = () => {
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
  }
};

async function fetchRss(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

const loadRss = async (url, source) => {
  const rss = await fetchRss(url);
  const feeds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const filtered = feeds.filter((feed) => feed.id.indexOf(source) === 0).map((feed) => feed.id);
  return { rss, feedIDs: filtered };
};

const bookmark = (event, feed) => {
  const feeds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  feeds.push(feed);
  fs.writeFileSync(filePath, JSON.stringify(feeds), 'utf8');
};

const unbookmark = (event, feedID) => {
  const feeds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const filtered = feeds.filter((feed) => feed.id !== feedID);
  fs.writeFileSync(filePath, JSON.stringify(filtered), 'utf8');
};

const fetchHK = async (url) => {
  const query = {
    title: '#container > div > div > article > h1',
    content: '#articletxt',
  };

  const response = await fetch(url);
  const text = await response.text();
  const root = parse(text);

  const title = root.querySelector(query.title).textContent.replace(/[\n|\t]/g, '');
  const contents = [...root.querySelector(query.content).childNodes]
    .map((node) => {
      if (node instanceof TextNode) {
        return { tag: 'p', text: node.textContent.trim().replace(/[\n|\t]/g, '') };
      }

      if (node.rawTagName === 'figure') {
        const img = node.querySelector('img');
        return { tag: 'img', src: img.getAttribute('src'), alt: img.getAttribute('alt') };
      }
    })
    .filter((content) => {
      if (!content) return false;
      if (content.tag === 'p' && !content.text) return false;
      return true;
    });

  return {
    title,
    contents,
  };
};

const fetchMK = async (url) => {
  const query = {
    title: '#container > section > div.news_detail_head_group.type_none_bg > section > div > div > div > h2',
    content: '#container > section > div.news_detail_body_group > section > div.min_inner > div.sec_body > div.news_cnt_detail_wrap'
  }

  const response = await fetch(url);
  const text = await response.text();
  const root = parse(text);

  const title = root.querySelector(query.title).textContent.replace(/[\n|\t]/g, '');
  const contents = [...root.querySelector(query.content).childNodes]
    .map((node) => {
      const { rawTagName } = node;
      if (rawTagName === 'div') {
        const className = node.getAttribute('class') || '';
        if (className.indexOf('img') > -1) {
          const img = node.querySelector('img');
          return { tag: 'img', src: img.getAttribute('src'), alt: img.getAttribute('alt') };
        } else if (className.indexOf('mid_title') > -1) {
          return { tag: 'p', text: node.textContent.replace(/[\n|\t]/g, '') };
        }
      } if (rawTagName === 'p' || node instanceof TextNode) {
        return { tag: 'p', text: node.textContent.replace(/[\n|\t]/g, '') };
      }
    })
    .filter((content) => {
      if (!content) return false;
      if (content.tag === 'p' && !content.text) return false;
      return true;
    });

  return {
    title,
    contents,
  };
};

module.exports = {
  filePath,
  readyFile,
  loadRss,
  bookmark,
  unbookmark,
  fetchHK,
  fetchMK,
};
