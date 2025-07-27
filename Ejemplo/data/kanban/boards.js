import RecentProject01 from 'assets/images/kanban/board_images/1.webp';
import RecentProject02 from 'assets/images/kanban/board_images/2.webp';
import RecentProject03 from 'assets/images/kanban/board_images/3.webp';
import RecentProject04 from 'assets/images/kanban/board_images/4.webp';
import RecentProject05 from 'assets/images/kanban/board_images/5.webp';
import RecentProject06 from 'assets/images/kanban/board_images/6.webp';
import YourProject01 from 'assets/images/kanban/board_images/7.webp';
import YourProject02 from 'assets/images/kanban/board_images/8.webp';
import YourProject03 from 'assets/images/kanban/board_images/9.webp';
import YourProject04 from 'assets/images/kanban/board_images/10.webp';
import YourProject05 from 'assets/images/kanban/board_images/11.webp';
import SharedProject01 from 'assets/images/kanban/board_images/12.webp';
import SharedProject02 from 'assets/images/kanban/board_images/13.webp';
import SharedProject03 from 'assets/images/kanban/board_images/14.webp';
import { users } from 'data/users';

export const recentProjects = {
  id: 'recentProjects',
  title: 'Recent Projects',
  boards: [
    {
      id: 1,
      image: RecentProject01,
      name: 'Abstract Art',
      lastViewAt: '1 hrs ago',
      assignee: [users[15], users[5], users[13]],
    },
    {
      id: 2,
      image: RecentProject02,
      name: 'plasma',
      lastViewAt: '2.5 hrs ago',
      assignee: [users[9], users[1], users[5]],
    },
    {
      id: 3,
      image: RecentProject03,
      name: 'Nature Dance',
      lastViewAt: '3 hrs ago',
      assignee: [users[14], users[11], users[5]],
    },
    {
      id: 4,
      image: RecentProject04,
      name: 'Northern Light',
      lastViewAt: '2 hrs ago',
      assignee: [users[15], users[9], users[3]],
    },
    {
      id: 5,
      image: RecentProject05,
      name: 'Version',
      lastViewAt: '4 hrs ago',
      assignee: [
        users[5],
        users[8],
        users[1],
        users[2],
        users[3],
        users[4],
        users[6],
        users[7],
        users[10],
      ],
    },
    {
      id: 6,
      image: RecentProject06,
      name: 'Magnetosphere',
      lastViewAt: '54 min ago',
      assignee: [users[7], users[9], users[2]],
    },
  ],
};

export const userProjects = {
  id: 'yourProjects',
  title: 'Your Projects',
  boards: [
    {
      id: 1,
      image: YourProject01,
      name: 'Solar wind',
      lastViewAt: '36 min ago',
      assignee: [users[15], users[5], users[13]],
    },
    {
      id: 2,
      image: YourProject02,
      name: 'Ionosphere',
      lastViewAt: '55 min ago',
      assignee: [users[14], users[5], users[13]],
    },
    {
      id: 3,
      image: YourProject03,
      name: 'Solar Flare',
      lastViewAt: '4.5 hrs ago',
      assignee: [users[6], users[13], users[2]],
    },
    {
      id: 4,
      image: YourProject04,
      name: 'coronal mass ejection',
      lastViewAt: '5 hrs ago',
      assignee: [users[9], users[13], users[6]],
    },
    {
      id: 5,
      image: YourProject05,
      name: 'Mass Actor',
      lastViewAt: '8 Aug',
      assignee: [users[2], users[4], users[6]],
    },
  ],
};

export const sharedProjects = {
  id: 'sharedProjects',
  title: 'Shared Projects',
  boards: [
    {
      id: 1,
      image: SharedProject01,
      name: 'Solar wind',
      lastViewAt: '1 hrs ago',
      assignee: [users[8], users[5], users[11]],
    },
    {
      id: 2,
      image: SharedProject02,
      name: 'Ionosphere',
      lastViewAt: '2 hrs ago',
      assignee: [users[12], users[2], users[13]],
    },
    {
      id: 3,
      image: SharedProject03,
      name: 'Health hazard',
      lastViewAt: '3 hrs ago',
      assignee: [users[12], users[3], users[9]],
    },
  ],
};
