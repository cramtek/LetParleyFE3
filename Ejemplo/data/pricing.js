import PricingDark1 from 'assets/images/illustrations/pricing-dark-1.webp';
import PricingDark2 from 'assets/images/illustrations/pricing-dark-2.webp';
import PricingDark3 from 'assets/images/illustrations/pricing-dark-3.webp';
import PricingDark4 from 'assets/images/illustrations/pricing-dark-4.webp';
import PricingLight1 from 'assets/images/illustrations/pricing-light-1.webp';
import PricingLight2 from 'assets/images/illustrations/pricing-light-2.webp';
import PricingLight3 from 'assets/images/illustrations/pricing-light-3.webp';
import PricingLight4 from 'assets/images/illustrations/pricing-light-4.webp';

export const pricing = [
  {
    id: 1,
    image: {
      light: PricingLight1,
      dark: PricingDark1,
    },
    columnTitle: 'Pricing Starter',
    tableTitle: 'Starter',
    price: null,
    features: [
      { title: 'Unlimited leads', active: true },
      { title: 'Unlimited emails', active: true },
      { title: 'No Aurora’s branding', active: true },
      { title: 'Email automation', active: false },
      { title: 'Custom fields', active: false },
      { title: 'Pro templates', active: false },
      { title: 'Export leads and reports', active: false },
    ],
    tableFeatures: [
      {
        category: 'Core Features',
        features: [
          { id: 1, title: 'Unlimited leads', active: true },
          { id: 2, title: 'Unlimited emails', active: true },
          { id: 3, title: 'No Aurora’s branding', active: true },
        ],
      },
      {
        category: 'Advanced Features',
        features: [
          { id: 1, title: 'Email automation', active: false },
          { id: 2, title: 'Custom fields', active: false },
          { id: 3, title: 'Pro templates', active: false },
          { id: 4, title: 'Export leads and reports', active: false },
        ],
      },
      {
        category: 'Pro Features',
        features: [
          { id: 1, title: 'Advanced reporting', active: false },
          { id: 2, title: 'Priority customer support', active: false },
          { id: 3, title: 'Custom branding', active: false },
          { id: 4, title: 'Dedicated account manager', active: false },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Best value',
    image: {
      light: PricingLight2,
      dark: PricingDark2,
    },
    columnTitle: 'Pricing Pro',
    tableTitle: 'Pro',
    price: {
      monthly: 14.99,
      yearly: 149.99,
    },
    recommended: true,
    features: [
      { title: 'Unlimited leads', active: true },
      { title: 'Unlimited emails', active: true },
      { title: 'No Aurora’s branding', active: true },
      { title: 'Email automation', active: true },
      { title: 'Custom fields', active: true },
      { title: 'Pro templates', active: false },
      { title: 'Export leads and reports', active: false },
    ],
    tableFeatures: [
      {
        category: 'Core Features',
        features: [
          { id: 1, title: 'Unlimited leads', active: true },
          { id: 2, title: 'Unlimited emails', active: true },
          { id: 3, title: 'No Aurora’s branding', active: true },
        ],
      },
      {
        category: 'Advanced Features',
        features: [
          { id: 1, title: 'Email automation', active: true },
          { id: 2, title: 'Custom fields', active: false },
          { id: 3, title: 'Pro templates', active: false },
          { id: 4, title: 'Export leads and reports', active: false },
        ],
      },
      {
        category: 'Pro Features',
        features: [
          { id: 1, title: 'Advanced reporting', active: true },
          { id: 2, title: 'Priority customer support', active: true },
          { id: 3, title: 'Custom branding', active: true },
          { id: 4, title: 'Dedicated account manager', active: true },
        ],
      },
    ],
  },
  {
    id: 3,
    image: {
      light: PricingLight3,
      dark: PricingDark3,
    },
    columnTitle: 'Pricing Saver',
    tableTitle: 'Bundle',
    price: {
      monthly: 24.99,
      yearly: 249.99,
    },
    features: [
      { title: 'Unlimited leads', active: true },
      { title: 'Unlimited emails', active: true },
      { title: 'No Aurora’s branding', active: true },
      { title: 'Email automation', active: true },
      { title: 'Custom fields', active: true },
      { title: 'Pro templates', active: true },
      { title: 'Export leads and reports', active: true },
    ],
    tableFeatures: [
      {
        category: 'Core Features',
        features: [
          { id: 1, title: 'Unlimited leads', active: true },
          { id: 2, title: 'Unlimited emails', active: true },
          { id: 3, title: 'No Aurora’s branding', active: true },
        ],
      },
      {
        category: 'Advanced Features',
        features: [
          { id: 1, title: 'Email automation', active: true },
          { id: 2, title: 'Custom fields', active: true },
          { id: 3, title: 'Pro templates', active: true },
          { id: 4, title: 'Export leads and reports', active: true },
        ],
      },
      {
        category: 'Pro Features',
        features: [
          { id: 1, title: 'Advanced reporting', active: false },
          { id: 2, title: 'Priority customer support', active: false },
          { id: 3, title: 'Custom branding', active: false },
          { id: 4, title: 'Dedicated account manager', active: false },
        ],
      },
    ],
  },
  {
    id: 4,
    image: {
      light: PricingLight4,
      dark: PricingDark4,
    },
    columnTitle: 'Pricing Industry',
    tableTitle: 'Industry',
    price: {
      monthly: 49.99,
      yearly: 449.99,
    },
    features: [
      { title: 'Unlimited leads', active: true },
      { title: 'Unlimited emails', active: true },
      { title: 'No Aurora’s branding', active: true },
      { title: 'Email automation', active: true },
      { title: 'Custom fields', active: true },
      { title: 'Pro templates', active: true },
      { title: 'Export leads and reports', active: true },
    ],
    tableFeatures: [
      {
        category: 'Core Features',
        features: [
          { id: 1, title: 'Unlimited leads', active: true },
          { id: 2, title: 'Unlimited emails', active: true },
          { id: 3, title: 'No Aurora’s branding', active: true },
        ],
      },
      {
        category: 'Advanced Features',
        features: [
          { id: 1, title: 'Email automation', active: true },
          { id: 2, title: 'Custom fields', active: true },
          { id: 3, title: 'Pro templates', active: true },
          { id: 4, title: 'Export leads and reports', active: true },
        ],
      },
      {
        category: 'Pro Features',
        features: [
          { id: 1, title: 'Advanced reporting', active: true },
          { id: 2, title: 'Priority customer support', active: true },
          { id: 3, title: 'Custom branding', active: true },
          { id: 4, title: 'Dedicated account manager', active: true },
        ],
      },
    ],
  },
];
