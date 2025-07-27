import avatar2 from 'assets/images/avatar/avatar_2.webp';
import avatar4 from 'assets/images/avatar/avatar_4.webp';
import avatar6 from 'assets/images/avatar/avatar_6.webp';
import chestnut1 from 'assets/images/ecommerce/products/details/chestnut_1.webp';
import chestnut2 from 'assets/images/ecommerce/products/details/chestnut_2.webp';
import chestnut3 from 'assets/images/ecommerce/products/details/chestnut_3.webp';
import chestnut4 from 'assets/images/ecommerce/products/details/chestnut_4.webp';
import chestnut5 from 'assets/images/ecommerce/products/details/chestnut_5.webp';
import grey1 from 'assets/images/ecommerce/products/details/grey_1.webp';
import grey2 from 'assets/images/ecommerce/products/details/grey_2.webp';
import grey3 from 'assets/images/ecommerce/products/details/grey_3.webp';
import grey4 from 'assets/images/ecommerce/products/details/grey_4.webp';
import grey5 from 'assets/images/ecommerce/products/details/grey_5.webp';
import stain1 from 'assets/images/ecommerce/products/details/stain_1.webp';
import stain2 from 'assets/images/ecommerce/products/details/stain_2.webp';
import stain3 from 'assets/images/ecommerce/products/details/stain_3.webp';
import stain4 from 'assets/images/ecommerce/products/details/stain_4.webp';
import stain5 from 'assets/images/ecommerce/products/details/stain_5.webp';
import stain6 from 'assets/images/ecommerce/products/details/stain_6.webp';
import product1 from 'assets/images/ecommerce/products/product_1.webp';
import product2 from 'assets/images/ecommerce/products/product_2.webp';
import product3 from 'assets/images/ecommerce/products/product_3.webp';
import product4 from 'assets/images/ecommerce/products/product_4.webp';
import product5 from 'assets/images/ecommerce/products/product_5.webp';
import product6 from 'assets/images/ecommerce/products/product_6.webp';
import product7 from 'assets/images/ecommerce/products/product_7.webp';
import product8 from 'assets/images/ecommerce/products/product_8.webp';
import product9 from 'assets/images/ecommerce/products/product_9.webp';
import product10 from 'assets/images/ecommerce/products/product_10.webp';
import product11 from 'assets/images/ecommerce/products/product_11.webp';
import product12 from 'assets/images/ecommerce/products/product_12.webp';
import product13 from 'assets/images/ecommerce/products/product_13.webp';
import product14 from 'assets/images/ecommerce/products/product_14.webp';
import product15 from 'assets/images/ecommerce/products/product_15.webp';

export const products = [
  {
    id: 1,
    name: 'VINGLI 56" Modern Sofa, Small Corduroy Couch Deep Seat',
    images: [
      { color: '#F1E6D5', src: stain1 },
      { color: '#9E7B5D', src: chestnut1 },
      { color: '#7C7B77', src: grey1 },
    ],
    variants: [
      { label: 'Size', value: 'S' },
      {
        label: 'Color',
        value: 'Black, White',
      },
    ],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 120,
    price: { regular: 440, discounted: 259, offer: '40%' },
    sold: 2476,
    stock: 2,
    vat: 10,
    margin: 15,
    availability: ['low-stock'],
    sale: ['voucher'],
    material: ['wood'],
    category: ['sofa'],
    features: ['swivel'],
  },
  {
    id: 2,
    name: 'Fabric Recliner Chair Single Sofa',
    images: [{ src: product2 }],
    variants: [
      { label: 'Size', value: 'S' },
      {
        label: 'Color',
        value: 'White Chocolate',
      },
    ],
    tags: ['Living room', 'Armchair'],
    ratings: 3,
    reviews: 90,
    price: { regular: 400, discounted: 109, offer: '20%' },
    sold: 546,
    stock: 4,
    vat: 10,
    margin: 10,
    availability: ['in-stock'],
    sale: ['clearance-sale'],
    material: ['cotton'],
    category: ['recliner'],
    features: ['ergonomic'],
  },
  {
    id: 3,
    name: 'T- CAP  2 Seat Cotton Sofa',
    images: [{ src: product3 }],
    tags: ['Living room', 'Armchair'],
    variants: [
      { label: 'Size', value: 'L' },
      {
        label: 'Color',
        value: 'Chinese Black',
      },
    ],
    ratings: 5,
    reviews: 210,
    price: { regular: 2000, discounted: 1099, offer: '30%' },
    sold: 2456,
    stock: 5,
    vat: 10,
    margin: 5,
    availability: ['in-stock'],
    sale: ['regular-price'],
    material: ['metal'],
    category: ['sectional'],
    features: ['adjustable'],
  },
  {
    id: 4,
    name: 'Little Smile 3X6 size for 1 Person- Moshi Fabric Washable Cover',
    images: [{ src: product4 }],
    tags: ['Living room', 'Armchair'],
    variants: [
      { label: 'Size', value: 'M' },
      { label: 'Color', value: 'Navy Blue' },
    ],
    ratings: 4,
    reviews: 150,
    price: { regular: 740, discounted: 369, offer: '50%' },
    sold: 1918,
    stock: 10,
    vat: 10,
    margin: 20,
    availability: ['in-stock'],
    sale: ['voucher'],
    material: ['upholstered'],
    category: ['divan'],
    features: ['handmade'],
  },
  {
    id: 5,
    name: 'Century Accent Chair, Modern Fabric Upholstered Armchair',
    images: [{ src: product5 }],
    tags: ['Living room', 'Armchair'],
    variants: [
      { label: 'Size', value: 'L' },
      { label: 'Color', value: 'Red' },
    ],
    ratings: 5,
    reviews: 180,
    price: { regular: 600, discounted: 299, offer: '30%' },
    sold: 158,
    stock: 0,
    vat: 10,
    margin: 10,
    availability: ['out-of-stock'],
    sale: ['clearance-sale'],
    material: ['wood'],
    category: ['chair'],
    features: ['waterproof'],
  },
  {
    id: 6,
    name: 'Velvet Swoop Arm Accent Chair',
    images: [{ src: product6 }],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 120,
    price: { regular: 280, discounted: 109, offer: '20%' },
    sold: 1561,
    stock: 8,
    vat: 10,
    margin: 15,
    availability: ['in-stock'],
    sale: ['voucher'],
    material: ['glass'],
    category: ['loveseat'],
    features: ['stackable'],
  },
  {
    id: 7,
    name: 'Mid-Century Accent Arm Modern Retro  Chair with Solid Wood Frame',
    images: [{ src: product7 }],
    tags: ['Living room', 'Armchair'],
    variants: [
      { label: 'Size', value: 'S' },
      { label: 'Color', value: 'Green' },
    ],
    ratings: 4,
    reviews: 140,
    price: { regular: 120, discounted: 59, offer: '20%' },
    sold: 923,
    stock: 1,
    vat: 10,
    margin: 5,
    availability: ['low-stock'],
    sale: ['regular-price'],
    material: ['plastic'],
    category: ['chair'],
    features: ['adjustable'],
  },
  {
    id: 8,
    name: 'Stuffed Animal Storage Bean Bag Chair Cover (No Filler)',
    images: [{ src: product8 }],
    variants: [
      { label: 'Size', value: 'XL' },
      { label: 'Color', value: 'Gray' },
    ],
    tags: ['Living room', 'Armchair'],
    ratings: 5,
    reviews: 160,
    price: { regular: 160, discounted: 79, offer: '30%' },
    sold: 1656,
    stock: 1,
    vat: 10,
    margin: 20,
    availability: ['low-stock'],
    sale: ['clearance-sale'],
    material: ['upholstered'],
    category: ['ottoman'],
    features: ['outdoor'],
  },
  {
    id: 9,
    name: 'Leisure Sofa Single Lazy Sofa Hotel Bar Small Apartment',
    images: [{ src: product9 }],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 130,
    variants: [
      { label: 'Size', value: 'M' },
      { label: 'Color', value: 'Black' },
    ],
    price: { regular: 360, discounted: 229, offer: '40%' },
    sold: 181,
    stock: 6,
    vat: 10,
    margin: 10,
    availability: ['in-stock'],
    sale: ['voucher'],
    material: ['metal'],
    category: ['sofa'],
    features: ['foldable'],
  },
  {
    id: 10,
    name: 'T-Pop Modern Barrel Accent Chair,  Button Tufted Beige Solid Woven',
    images: [{ src: product10 }],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 110,
    variants: [
      { label: 'Size', value: 'L' },
      { label: 'Color', value: 'Blue' },
    ],
    price: { regular: 260, discounted: 169, offer: '30%' },
    sold: 918,
    stock: 1,
    vat: 10,
    margin: 15,
    availability: ['low-stock'],
    sale: ['clearance-sale'],
    material: ['glass'],
    category: ['sectional'],
    features: ['handmade'],
  },
  {
    id: 11,
    name: 'Life.an 38.6" W Modern Style Rolled Arm Chair Sofa',
    images: [{ src: product11 }],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 140,
    variants: [
      { label: 'Size', value: 'S' },
      { label: 'Color', value: 'Red' },
    ],
    price: { regular: 440, discounted: 319, offer: '20%' },
    sold: 628,
    stock: 1,
    vat: 10,
    margin: 20,
    availability: ['low-stock'],
    sale: ['regular-price'],
    material: ['upholstered'],
    category: ['bench'],
    features: ['ergonomic'],
  },
  {
    id: 12,
    name: 'Milano Accent  Chair Modern Retro Leisure Chair with Solid Wood Frame',
    images: [{ src: product12 }],
    tags: ['Living room', 'Armchair'],
    variants: [
      { label: 'Size', value: 'XL' },
      { label: 'Color', value: 'White' },
    ],
    ratings: 4,
    reviews: 130,
    price: { regular: 420, discounted: 239, offer: '30%' },
    sold: 2136,
    stock: 3,
    vat: 10,
    margin: 5,
    availability: ['in-stock'],
    sale: ['voucher'],
    material: ['wood'],
    category: ['loveseat'],
    features: ['outdoor'],
  },
  {
    id: 13,
    name: 'AIA Tri-Fold Wooden effect leg/Sofa',
    images: [{ src: product13 }],
    tags: ['Living room', 'Armchair'],
    ratings: 3,
    reviews: 90,
    price: { regular: 240, discounted: 189, offer: '20%' },
    sold: 544,
    stock: 10,
    vat: 10,
    margin: 10,
    availability: ['in-stock'],
    sale: ['voucher'],
    material: ['plastic'],
    category: ['bench'],
    features: ['ergonomic'],
  },
  {
    id: 14,
    name: 'Relax Lounge Accent Chair for Living Room',
    images: [{ src: product14 }],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 120,
    price: { regular: 640, discounted: 389, offer: '40%' },
    sold: 1245,
    stock: 3,
    vat: 10,
    margin: 5,
    availability: ['in-stock'],
    sale: ['regular-price'],
    material: ['metal'],
    category: ['divan'],
    features: ['foldable'],
  },
  {
    id: 15,
    name: 'BRISTOL Linen Fabric Lounge Chair (Beige)',
    images: [{ src: product15 }],
    tags: ['Living room', 'Armchair'],
    ratings: 4,
    reviews: 110,
    price: { regular: 290, discounted: 129, offer: '30%' },
    sold: 1445,
    stock: 2,
    vat: 10,
    margin: 15,
    availability: ['low-stock'],
    sale: ['clearance-sale'],
    material: ['cotton'],
    category: ['sofa'],
    features: ['swivel'],
  },
];

export const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

export const suggestedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 6);

export const wishlistedProducts = [...products].slice(0, 4);

export const productColorVariants = [
  {
    id: 'satin-linen',
    name: 'Satin linen',
    color: '#F1E6D5',
    images: [stain1, stain2, stain3, stain4, stain5, stain6],
  },
  {
    id: 'dark-chestnut',
    name: 'Dark chestnut',
    color: '#9E7B5D',
    images: [chestnut1, chestnut2, chestnut3, chestnut4, chestnut5],
  },
  {
    id: 'smokey-grey',
    name: 'Smokey grey',
    color: '#7C7B77',
    images: [grey1, grey2, grey3, grey4, grey5],
  },
];

export const productReviewTags = [
  { label: 'All' },
  { label: 'quality', count: 110 },
  { label: 'aesthetics', count: 91 },
  { label: 'comfort', count: 25 },
  { label: 'graceful', count: 50 },
  { label: 'value for money', count: 70 },
];

export const productReviews = [
  {
    id: 1,
    user: {
      name: 'Gojo Satoru',
      image: avatar6,
    },
    rating: 5,
    date: '22 December, 2023',
    content: {
      title: 'Perfection in any setting.',
      body: `LOVE THIS! This works great for my balcony. The aluminum legs are an integral component with a distinctive aesthetic. They are designed to resemble dancing shoes resting gracefully on the floor, perfectly complementing the shell's elegant curves.`,
    },
    helpfulCount: 130,
  },
  {
    id: 2,
    user: {
      name: 'Kugisaki Nobara',
      image: avatar2,
    },
    rating: 5,
    date: '22 December, 2023',
    content: {
      title: 'Great chair for the price. Looks good.',
      body: 'Easy to put together. Packaged VERY well with red tape and string for the hardware package. Extra bolt just in case and the hex screw for assembly.',
    },
    helpfulCount: 130,
  },
  {
    id: 3,
    user: {
      name: 'Kento Nanami',
      image: avatar4,
    },
    rating: 5,
    date: '22 December, 2023',
    content: {
      title: 'Easily one of the bests in the market.',
      body: 'Looks great feels great, totally comfortable. I would recommend.',
    },
    helpfulCount: 130,
  },
];

export const productDescriptions = [
  {
    title: 'Modern Looking',
    description:
      'Go for a modern option with our brown leather love seat. It has a sleek yet classic look that can brings contemporary style to your space without sacrificing comfort.Comes in a handful of colors,with fabric,velvet,corduroy and pu leather options. ',
  },
  {
    title: 'Plush and Comfy Cushions',
    description:
      'High-density sponge and metal pocket coils are adopted to offer ideal comfort,its plush cushions and ergonomic design cradles you in relaxation,making it the perfect spot to unwind after a long day.',
  },
  {
    title: 'Made to Last',
    description:
      'When it comes to quality sofa couch,the frame and seating support is always non-concessional,wooden frames,durable metal legs and metal backrests offer superior stability and ensure its ability to retain its shape and stability in the years to come.',
  },
  {
    title: 'Easy Assembly',
    description:
      'Assembly is a breeze with straightforward instructions and minimal steps,allowing you to enjoy your new small couch in no time.The cushions have been vacuum packed,it may take up to 2-3days to fully expand to its original shape.',
  },
  {
    title: 'Versatile Loveseat',
    description:
      'It has a small footprint to fit into any small spaces,sunroom, living room,bedroom or office.',
  },
];

export const productSpecifications = [
  { label: 'Brand', value: 'VIngli' },
  { label: 'Assembly required', value: 'Yes' },
  { label: 'Fabric', value: '100% Cotton' },
  { label: 'Dimensions', value: '56.7" depth x 31.8" width x 33" height' },
  { label: 'Seat Depth', value: '21.2 inches' },
  { label: 'Seat Height', value: '18.1 inches' },
  { label: 'Item Weight', value: '66 pounds' },
  { label: 'Frame', value: 'Plywood, Polyurethane foam, Particleboard, PVA glue, Solid wood' },
  { label: 'Leg', value: 'Solid wood, Polished aluminium' },
  { label: 'Cushion', value: 'Cotton, Polyurethane foam' },
];

export const ecomCoupons = [{ code: 'TAKE100', discount: 100, appliedDiscount: 100 }];

export const productListAdmin = [
  {
    id: 1,
    name: 'Fotobi 47" Black Wood Loveseat Sofa',
    image: { src: product1 },
    category: 'Sofa',
    status: 'active',
    price: {
      regular: 440,
      discounted: 259,
    },
    vendor: 'Fotobi Furniture',
    stock: 2,
    publishedAt: '14 Feb, 23',
  },
  {
    id: 2,
    name: 'Fabric Recliner Chair Single Sofa',
    image: { src: product2 },
    category: 'Chair',
    status: 'inactive',
    price: {
      regular: 400,
      discounted: 109,
    },
    vendor: 'Mojar Furniture',
    stock: 23,
    publishedAt: '14 Feb, 23',
  },
  {
    id: 3,
    name: 'T- CAP  2 Seat Cotton Sofa',
    image: { src: product3 },
    category: 'Sofa',
    status: 'active',
    price: {
      regular: 2000,
      discounted: 1099,
    },
    vendor: 'T-CAP Living',
    stock: 12,
    publishedAt: '15 Feb, 23',
  },
  {
    id: 4,
    name: 'Little Smile 3X6 size for 1 Person- Moshi Fabric Washable Cover',
    image: { src: product4 },
    category: 'Sofa',
    status: 'draft',
    price: {
      regular: 740,
      discounted: 369,
    },
    vendor: 'Little Smile Ltd.',
    stock: 54,
    publishedAt: '16 Feb, 23',
  },
  {
    id: 5,
    name: 'Century Accent Chair, Modern Fabric Upholstered Armchair',
    image: { src: product5 },
    category: 'Chair',
    status: 'active',
    price: {
      regular: 600,
      discounted: 299,
    },
    vendor: 'Home Furniture',
    stock: 45,
    publishedAt: '16 Feb, 23',
  },
  {
    id: 6,
    name: 'Velvet Swoop Arm Accent Chair',
    image: { src: product6 },
    category: 'Chair',
    status: 'inactive',
    price: {
      regular: 280,
      discounted: 109,
    },
    vendor: 'Milano Accent Decor',
    stock: 16,
    publishedAt: '17 Feb, 23',
  },
  {
    id: 7,
    name: 'Mid-Century Accent Arm Modern Retro Chair with Solid Wood Frame',
    image: { src: product7 },
    category: 'Chair',
    status: 'active',
    price: {
      regular: 120,
      discounted: 59,
    },
    vendor: 'Fotobi Furniture',
    stock: 34,
    publishedAt: '18 Feb, 23',
  },
  {
    id: 8,
    name: 'Stuffed Animal Storage Bean Bag Chair Cover (No Filler)',
    image: { src: product8 },
    category: 'Bean Bag',
    status: 'archive',
    price: {
      regular: 160,
      discounted: 79,
    },
    vendor: 'Mojar Furniture',
    stock: 25,
    publishedAt: '18 Feb, 23',
  },
  {
    id: 9,
    name: 'Leisure Sofa Single Lazy Sofa Hotel Bar Small Apartment',
    image: { src: product9 },
    category: 'Sofa',
    status: 'active',
    price: {
      regular: 360,
      discounted: 229,
    },
    vendor: 'T-CAP Living',
    stock: 19,
    publishedAt: '18 Feb, 23',
  },
  {
    id: 10,
    name: 'T-Pop Modern Barrel Accent Chair, Button Tufted Beige Solid Woven',
    image: { src: product10 },
    category: 'Chair',
    status: 'active',
    price: {
      regular: 260,
      discounted: 169,
    },
    vendor: 'Milano Accent Decor',
    stock: 15,
    publishedAt: '19 Feb, 23',
  },
  {
    id: 11,
    name: 'Life.an 38.6" W Modern Style Rolled Arm Chair Sofa',
    image: { src: product11 },
    category: 'Sofa',
    status: 'inactive',
    price: {
      regular: 440,
      discounted: 319,
    },
    vendor: 'Fotobi Furniture',
    stock: 7,
    publishedAt: '21 Feb, 23',
  },
  {
    id: 12,
    name: 'Milano Accent Chair Modern Retro Leisure Chair with Solid Wood Frame',
    image: { src: product12 },
    category: 'Chair',
    status: 'active',
    price: {
      regular: 420,
      discounted: 239,
    },
    vendor: 'Milano Accent Decor',
    stock: 33,
    publishedAt: '22 Feb, 23',
  },
  {
    id: 13,
    name: 'AIA Tri-Fold Wooden effect leg/Sofa',
    image: { src: product13 },
    category: 'Sofa',
    status: 'draft',
    price: {
      regular: 240,
      discounted: 189,
    },
    vendor: 'T-CAP Living',
    stock: 5,
    publishedAt: '22 Feb, 23',
  },
  {
    id: 14,
    name: 'AIA Home Furniture Series Classic Linen Wooden Leg, Armchair',
    image: { src: product14 },
    category: 'Chair',
    status: 'active',
    price: {
      regular: 360,
      discounted: 229,
    },
    vendor: 'Home Furniture',
    stock: 20,
    publishedAt: '24 Feb, 23',
  },
  {
    id: 15,
    name: 'T-Pop Swoop Arm Chair',
    image: { src: product15 },
    category: 'Chair',
    status: 'archive',
    price: {
      regular: 700,
      discounted: 459,
    },
    vendor: 'Milano Accent Decor',
    stock: 27,
    publishedAt: '24 Feb, 23',
  },
];

export const availabilityFilterOptions = [
  {
    label: 'In stock',
    value: 'in-stock',
  },
  {
    label: 'Low Stock',
    value: 'low-stock',
  },
  {
    label: 'Out of stock',
    value: 'out-of-stock',
  },
];

export const saleFilterOptions = [
  {
    label: 'Clearance sale',
    value: 'clearance-sale',
  },
  {
    label: 'Voucher',
    value: 'voucher',
  },
  {
    label: 'Regular price',
    value: 'regular-price',
  },
];

export const materialFilterOptions = [
  {
    label: 'Cotton',
    value: 'cotton',
  },
  {
    label: 'Upholstered',
    value: 'polyester',
  },
  {
    label: 'Metal',
    value: 'metal',
  },
  {
    label: 'Wood',
    value: 'wood',
  },
  {
    label: 'Plastic',
    value: 'plastic',
  },
  {
    label: 'Glass',
    value: 'glass',
  },
];

export const categoryFilterOptions = [
  {
    label: 'Chair',
    value: 'chair',
  },
  {
    label: 'Divan',
    value: 'divan',
  },
  {
    label: 'Sofa',
    value: 'sofa',
  },
  {
    label: 'Sectional',
    value: 'sectional',
  },
  {
    label: 'Loveseat',
    value: 'loveseat',
  },
  {
    label: 'Recliner',
    value: 'recliner',
  },
  {
    label: 'Bench',
    value: 'bench',
  },
  {
    label: 'Ottoman',
    value: 'ottoman',
  },
];

export const featuresFilterOptions = [
  {
    label: 'Outdoor',
    value: 'outdoor',
  },
  {
    label: 'Adjustable',
    value: 'adjustable',
  },
  {
    label: 'Swivel',
    value: 'swivel',
  },
  {
    label: 'Handmade',
    value: 'handmade',
  },
  {
    label: 'Ergonomic',
    value: 'ergonomic',
  },
  {
    label: 'Stackable',
    value: 'stackable',
  },
  {
    label: 'Foldable',
    value: 'foldable',
  },
  {
    label: 'Waterproof',
    value: 'waterproof',
  },
];

export const defaultProductFilterOptions = {
  availability: availabilityFilterOptions,
  sale: saleFilterOptions,
  material: materialFilterOptions,
  category: categoryFilterOptions,
  features: featuresFilterOptions,
  price: [0, 1500],
};
