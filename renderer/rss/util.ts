export interface IFeed {
  id: string;
  title: string;
  link: string;
  author: string;
  date: string;
}

function getDateFromItem(item: Element) {
  const date = item.querySelector('pubDate')?.textContent;
  if (!date) return '';
  return new Date(date).toLocaleString();
}

function getIDFromItem(item: Element, source: string, index: number) {
  if (source === 'mk') {
    return item.querySelector('no')?.textContent || '';
  }
  return `f${index}`;
}

export function rssToJSON(source: string, rss: string) {
  const xml = new DOMParser().parseFromString(rss, 'application/xml');

  const items: IFeed[] = [...xml.querySelectorAll('item')].map((item, index) => {
    const id = getIDFromItem(item, source, index);

    return {
      id,
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      author: item.querySelector('author')?.textContent || '',
      date: getDateFromItem(item),
    }
  });
  return items;
}
