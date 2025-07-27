import product1 from 'assets/images/ecommerce/products/96x96/product_1.webp';
import product2 from 'assets/images/ecommerce/products/96x96/product_2.webp';
import product3 from 'assets/images/ecommerce/products/96x96/product_3.webp';
import product4 from 'assets/images/ecommerce/products/96x96/product_4.webp';
import product5 from 'assets/images/ecommerce/products/96x96/product_5.webp';
import product6 from 'assets/images/ecommerce/products/96x96/product_6.webp';
import product7 from 'assets/images/ecommerce/products/96x96/product_7.webp';
import product8 from 'assets/images/ecommerce/products/96x96/product_8.webp';
import product9 from 'assets/images/ecommerce/products/96x96/product_9.webp';
import product10 from 'assets/images/ecommerce/products/96x96/product_10.webp';
import product11 from 'assets/images/ecommerce/products/96x96/product_11.webp';
import product12 from 'assets/images/ecommerce/products/96x96/product_12.webp';
import { users } from 'data/users';

export const topProducts = [
  {
    id: 1,
    product: { name: 'Shanty Cotton Seat', image: product1 },
    vendors: [users[2], users[7], users[15]],
    margin: 981.0,
    sold: 29536,
    stock: 'In Stock',
  },
  {
    id: 2,
    product: { name: 'Practical Soft Couch', image: product2 },
    vendors: [users[6], users[11], users[7], users[13]],
    margin: 199,
    sold: 27700,
    stock: 'In Stock',
  },
  {
    id: 3,
    product: { name: 'Rustic Rubber Chair', image: product3 },
    vendors: [users[4], users[3], users[5], users[14], users[1], users[2]],
    margin: 609,
    sold: 21778,
    stock: 'Low Stock',
  },
  {
    id: 4,
    product: { name: 'Ergonomic Frozen Bacon', image: product4 },
    vendors: [users[6], users[5], users[11], users[15]],
    margin: 923,
    sold: 20272,
    stock: 'In Stock',
  },
  {
    id: 5,
    product: { name: 'Unbranded Metal Sofa', image: product5 },
    vendors: [users[12], users[1]],
    margin: 119,
    sold: 17374,
    stock: 'In Stock',
  },
  {
    id: 6,
    product: { name: 'Intelligent Soft Sofa', image: product6 },
    vendors: [users[1], users[2], users[3]],
    margin: 595,
    sold: 14374,
    stock: 'Low Stock',
  },
  {
    id: 7,
    product: { name: 'Handmade Cotton Chair', image: product7 },
    vendors: [users[2], users[3], users[13], users[14], users[15], users[12]],
    margin: 472,
    sold: 12084,
    stock: 'Stockout',
  },
  {
    id: 8,
    product: { name: 'Fantastic Rubber Chair', image: product8 },
    vendors: [users[2], users[7], users[15]],
    margin: 98,
    sold: 48604,
    stock: 'In Stock',
  },
  {
    id: 9,
    product: { name: 'Generic Steel Divan', image: product9 },
    vendors: [users[10], users[13], users[5], users[11], users[12], users[13]],
    margin: 931,
    sold: 2329,
    stock: 'In Stock',
  },
  {
    id: 10,
    product: { name: 'Handmade Beanbag', image: product10 },
    vendors: [users[10], users[2]],
    margin: 5300,
    sold: 70946,
    stock: 'Low Stock',
  },
  {
    id: 11,
    product: { name: 'Practical Metal Sofa', image: product11 },
    vendors: [users[4], users[3], users[13], users[14], users[15], users[11]],
    margin: 282,
    sold: 57682,
    stock: 'In Stock',
  },
  {
    id: 12,
    product: { name: 'Advanced Soft Couch', image: product12 },
    vendors: [users[15], users[10], users[7], users[9]],
    margin: 427,
    sold: 32587,
    stock: 'Low Stock',
  },
];

export const generatedRevenueData = {
  currentYear: [
    200000, 120000, 160000, 140000, 260000, 160000, 175000, 180000, 110000, 130000, 80000, 160000,
    160000, 150000, 90000,
  ],
  lastYear: [
    100000, 150000, 95000, 95000, 98000, 140000, 130000, 150000, 150000, 160000, 255000, 140000,
    140000, 160000, 160000,
  ],
};

export const storages = [
  { label: 'Bed', value: 20 },
  { label: 'Table', value: 30 },
  { label: 'Couch', value: 40 },
  { label: 'Unoccupied', value: 10 },
];

export const clientLocations = [
  { name: 'Japan', value: 44000 },
  { name: 'Greenland', value: 41000 },
  { name: 'India', value: 38000 },
  { name: 'Egypt', value: 27000 },
  { name: 'Mexico', value: 19000 },
  { name: 'Angola', value: 13000 },
  { name: 'Colombia', value: 11000 },
  { name: 'Finland', value: 7000 },
];

export const visitorRevenueChartData = {
  currentYear: [600, 400, 530, 210, 300, 400, 600],
  lastYear: [500, 480, 200, 250, 250, 280, 280],
};

export const monthlyProfitChartData = {
  currentYear: [0, 400, 250, 300, 80, 600],
  lastYear: [100, 250, 150, 200, 400, 250],
};
