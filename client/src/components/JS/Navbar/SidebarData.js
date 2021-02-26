import React from 'react';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Resources',
    path: '/home/resources',
    icon: <MdIcons.MdPersonOutline />,
    cName: 'nav-text'
  },
  {
    title: 'Risk Chart',
    path: '/home/risk-chart',
    icon: <AiIcons.AiOutlineAreaChart />,
    cName: 'nav-text'
  },
];
