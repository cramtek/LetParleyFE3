import { users } from 'data/users';

export const stats = [
  {
    icon: 'material-symbols-light:ads-click-rounded',
    value: '2,110',
    subtitle: 'Visitors',
  },
  {
    icon: 'material-symbols-light:request-quote-outline-rounded',
    value: '$8.2M',
    subtitle: 'Earnings',
  },
  {
    icon: 'material-symbols-light:shopping-cart-checkout-rounded',
    value: '1,124',
    subtitle: 'Orders',
  },
];

export const meetingSchedules = [
  {
    title: 'Collab with Tintin',
    time: '1:30pm - 2:30pm',
    attendants: [users[9], users[0]],
  },
  {
    title: 'Meeting about shipping',
    time: '2:40pm - 4:30pm',
    attendants: [users[3], users[4], users[6], users[10]],
  },
  {
    title: 'Greetings for marketing',
    time: '9:45am - 11:30am',
    attendants: [users[5], users[7], users[12]],
  },
  {
    title: 'Sales pipeline review',
    time: '5:40pm - 6:30pm',
    attendants: [users[1], users[2], users[7], users[12], users[13]],
  },
];
