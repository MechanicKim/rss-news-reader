import React, { Dispatch } from 'react';

type TNavMenuProps = {
  title: string;
  setItem: Dispatch<React.SetStateAction<number>>;
  setNewsLink: Dispatch<React.SetStateAction<string>>;
  index: number;
  selected: boolean;
};

function NavMenu({ title, setItem, setNewsLink, index, selected }: TNavMenuProps) {
  const onClick = () => {
    setNewsLink('');
    setItem(index);
  };

  if (selected) {
    return (
      <li>
        <a className="px-3 py-2 block border-b bg-gray-100">{title}</a>
      </li>
    );
  }

  return (
    <li>
      <a className="px-3 py-2 block border-b hover:cursor-pointer hover:bg-gray-100" onClick={onClick}>{title}</a>
    </li>
  );
}

export default NavMenu;
