import amexIcon from 'assets/images/sections/accounts-page/credit-cards/american_express_icon.webp';
import masterCardIcon from 'assets/images/sections/accounts-page/credit-cards/mastercard_icon.webp';
import visaIcon from 'assets/images/sections/accounts-page/credit-cards/visa_icon.webp';

export const cards = [
  {
    id: 1,
    cardName: 'MasterCard',
    cardNumber: '2412 5629 8734 8899',
    cardHolder: 'John Doe',
    expireDate: '2021-10-01',
    subscriptions: 3,
    icon: masterCardIcon,
    cvc: '123',
  },
  {
    id: 2,
    cardName: 'Visa',
    cardNumber: '2412 5629 8734 8899',
    cardHolder: 'John Doe',
    expireDate: '2021-11-01',
    subscriptions: 2,
    icon: visaIcon,
    cvc: '123',
  },
  {
    id: 3,
    cardName: 'Amex',
    cardNumber: '2412 5629 8734 8899',
    cardHolder: 'John Doe',
    expireDate: '2021-10-01',
    subscriptions: 0,
    icon: amexIcon,
    cvc: '1234',
  },
];
