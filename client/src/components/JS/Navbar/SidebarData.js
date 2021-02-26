import React from 'react';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Resources',
    path: '/resources',
    icon: <MdIcons.MdPersonOutline />,
    cName: 'nav-text'
  },
  {
    title: 'Risk Chart',
    path: '/risk-chart',
    icon: <AiIcons.AiOutlineAreaChart />,
    cName: 'nav-text'
  },
];
