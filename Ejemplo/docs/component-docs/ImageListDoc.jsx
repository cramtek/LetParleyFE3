import img12 from 'assets/images/ecommerce/banners/banner_1.webp';
import img1 from 'assets/images/ecommerce/categories/category_1.webp';
import img2 from 'assets/images/ecommerce/categories/category_2.webp';
import img3 from 'assets/images/ecommerce/categories/category_3.webp';
import img4 from 'assets/images/ecommerce/categories/category_4.webp';
import img5 from 'assets/images/ecommerce/categories/category_5.webp';
import img6 from 'assets/images/ecommerce/categories/category_6.webp';
import img7 from 'assets/images/ecommerce/categories/category_7.webp';
import img8 from 'assets/images/ecommerce/categories/category_8.webp';
import img9 from 'assets/images/ecommerce/categories/category_9.webp';
import img10 from 'assets/images/ecommerce/categories/category_10.webp';
import img11 from 'assets/images/ecommerce/categories/category_11.webp';
import img13 from 'assets/images/ecommerce/gallery/gallery_2.webp';
import img14 from 'assets/images/ecommerce/gallery/gallery_3.webp';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { cssVarRgba, kebabCase } from 'lib/utils';
import Image from 'components/base/Image';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const standardImageListCode = `
import Image from 'components/base/Image';

const StandardImageList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <ImageList sx={{ width: 550, height: 450 }} cols={3} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem key={item.title}>
            <Image
              height={164}
              src={item.img}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
};
render(<StandardImageList/>)

const itemData = [
  {
    img: img11,
    title: 'product1',
  },
  {
    img: img1,
    title: 'product2',
  },
  {
    img: img2,
    title: 'product3',
  },
  {
    img: img3,
    title: 'product4',
  },
  {
    img: img4,
    title: 'product5',
  },
  {
    img: img5,
    title: 'product6',
  },
  {
    img: img6,
    title: 'product7',
  },
  {
    img: img7,
    title: 'product8',
  },
  {
    img: img8,
    title: 'product9',
  },
  {
    img: img9,
    title: 'product10',
  },
  {
    img: img10,
    title: 'product11',
  },
  {
    img: img11,
    title: 'product12',
  },
];
`.trim();

const quiltedImageListCode = `
import Image from 'components/base/Image';

const QuiltedImageList = () => {
  const baseSize = 130; // Base size for a single column/row
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <ImageList sx={{ width: 600, height: 500 }} variant="quilted" cols={4} rowHeight={baseSize}>
        {itemData.map((item) => {
          return (
            <ImageListItem key={item.title} cols={item.cols || 1} rows={item.rows || 1}>
              <Image src={item.img} alt={item.title} loading="lazy" sx={{ height:1 }} />
            </ImageListItem>
          );
        })}
      </ImageList>
    </Stack>
  );
};
render(<QuiltedImageList/>)

const itemData = [
  {
    img: img12,
    title: 'Product 1',
    rows: 2,
    cols: 2,
  },
  {
    img: img3,
    title: 'Product 2',
  },
  {
    img: img1,
    title: 'Product 4',
  },
  {
    img: img14,
    title: 'Product 5',
    cols: 2,
  },
  {
    img: img13,
    title: 'Product 3',
    cols: 2,
  },
  {
    img: img5,
    title: 'Product 6',
    rows: 2,
    cols: 2,
  },
  {
    img: img4,
    title: 'Product 7',
  },
  {
    img: img6,
    title: 'Product 8',
  },
  {
    img: img8,
    title: 'Product 9',
    rows: 2,
    cols: 2,
  },
  {
    img: img2,
    title: 'Product 10',
  },
  {
    img: img9,
    title: 'Product 11',
  },
  {
    img: img13,
    title: 'Product 12',
    cols: 2,
  },
];
`.trim();

const wovenImageListCode = `
import Image from 'components/base/Image';

const WovenImageList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <ImageList sx={{ width: 500, height: 450 }} variant="woven" cols={3} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.title}>
            <Image
              src={item.img}
              alt={item.title}
              loading="lazy"
              sx={{ height:1 }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
};
render(<WovenImageList/>)

const itemData = [
  {
    img: img11,
    title: 'product1',
  },
  {
    img: img1,
    title: 'product2',
  },
  {
    img: img2,
    title: 'product3',
  },
  {
    img: img3,
    title: 'product4',
  },
  {
    img: img4,
    title: 'product5',
  },
  {
    img: img5,
    title: 'product6',
  },
  {
    img: img6,
    title: 'product7',
  },
  {
    img: img7,
    title: 'product8',
  },
  {
    img: img8,
    title: 'product9',
  },
  {
    img: img9,
    title: 'product10',
  },
  {
    img: img11,
    title: 'product11',
  },
  {
    img: img10,
    title: 'product12',
  },
];
`.trim();

const titleBarImageListCode = `
import Image from 'components/base/Image';

const TitlebarImageList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <ImageList sx={{ width: 500, height: 450 }}>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">December</ListSubheader>
        </ImageListItem>
        {itemData.map((item) => (
          <ImageListItem key={item.title}>
            <Image
              height={164}
              src={item.img}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.author}
              actionIcon={
                <IconButton
                  sx={{ color: (theme) => cssVarRgba(theme.vars.palette.common.whiteChannel, 0.54) }}
                  aria-label={\`info about \${item.title}\`}
                >
                  <IconifyIcon icon="material-symbols-light:info" />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
};
render(<TitlebarImageList/>)

const itemData = [
  {
    img: img1,
    title: 'Recliner Chair',
    author: '@furnishings_luxe',
  },
  {
    img: img2,
    title: 'Green Couch',
    author: '@homedecor_master',
  },
  {
    img: img3,
    title: 'Modern Minimalist Sofa',
    author: '@urban_living',
  },
  {
    img: img4,
    title: 'Cushioned Chair',
    author: '@modern_designs',
  },
  {
    img: img5,
    title: 'Side Table',
    author: '@comfort_corner',
  },
  {
    img: img6,
    title: 'Bar Stool',
    author: '@dreamy_beds',
  },
  {
    img: img7,
    title: 'Dining Table',
    author: '@cozy_nook',
  },
  {
    img: img8,
    title: 'Bed Frame',
    author: '@storage_solutions',
  },
  {
    img: img9,
    title: 'Wooden Side Table',
    author: '@media_units',
  },
  {
    img: img10,
    title: 'Cotiere Dresser',
    author: '@relax_lounge',
  },
  {
    img: img11,
    title: 'Wooden Chair',
    author: '@kitchen_comfort',
  },
  {
    img: img1,
    title: 'Armchair',
    author: '@footrest_fancy',
  },
];
`.trim();

const titleBarMasonryImageListCode = `
import Image from 'components/base/Image';

const TitlebarBelowMasonryImageList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box sx={{ width: 500, height: 450, overflowY: 'scroll' }}>
        <ImageList variant="masonry" cols={3} gap={8}>
          {itemData.map((item) => (
            <ImageListItem key={item.title}>
              <img
                srcSet={\`\${item.img}?w=248&fit=crop&auto=format&dpr=2 2x\`}
                src={\`\${item.img}?w=248&fit=crop&auto=format\`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar position="below" title={item.author} />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Stack>
  );
};


render(<TitlebarBelowMasonryImageList/>)

const itemData = [
  {
    img: img13,
    title: 'product1',
    author: '@furnishings_luxe',
  },
  {
    img: img11,
    title: 'product2',
    author: '@kitchen_comfort',
  },
  {
    img: img2,
    title: 'product3',
    author: '@homedecor_master',
  },
  {
    img: img3,
    title: 'product4',
    author: '@urban_living',
  },
  {
    img: img4,
    title: 'product5',
    author: '@modern_designs',
  },
  {
    img: img5,
    title: 'product6',
    author: '@comfort_corner',
  },
  {
    img: img12,
    title: 'product7',
    author: '@dreamy_beds',
  },
  {
    img: img7,
    title: 'product8',
    author: '@cozy_nook',
  },
  {
    img: img14,
    title: 'product9',
    author: '@storage_solutions',
  },
  {
    img: img6,
    title: 'product10',
    author: '@dreamy_beds',
  },
  {
    img: img11,
    title: 'product11',
    author: '@kitchen_comfort',
  },
  {
    img: img8,
    title: 'product12',
    author: '@relax_lounge',
  },
];
`.trim();

const masonryImageListCode = `
import Image from 'components/base/Image';

const MasonryImageList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <ImageList sx={{ width: 500 }} variant="masonry" cols={3} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.title}>
            <Image
              src={item.img}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
};
render(<MasonryImageList/>)

const itemData = [
  {
    img: img13,
    title: 'product1',
  },
  {
    img: img11,
    title: 'product2',
  },
  {
    img: img2,
    title: 'product3',
  },
  {
    img: img3,
    title: 'product4',
  },
  {
    img: img4,
    title: 'product5',
  },
  {
    img: img5,
    title: 'product6',
  },
  {
    img: img12,
    title: 'product7',
  },
  {
    img: img7,
    title: 'product8',
  },
  {
    img: img8,
    title: 'product9',
  },
  {
    img: img6,
    title: 'product10',
  },
  {
    img: img11,
    title: 'product11',
  },
  {
    img: img14,
    title: 'product12',
  },
];
`.trim();

const titleBarBelowImageCode = `
const TitlebarBelowImageList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <ImageList sx={{ width: 500, height: 450 }}>
        {itemData.map((item) => (
          <ImageListItem key={item.title}>
            <img
              srcSet={\`\${item.img}?w=248&fit=crop&auto=format&dpr=2 2x\`}
              src={\`\${item.img}?w=248&fit=crop&auto=format\`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {item.author}</span>}
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
};
render(<TitlebarBelowImageList />)

const itemData = [
  {
    img: img1,
    title: 'Recliner Chair',
    author: '@furnishings_luxe',
  },
  {
    img: img2,
    title: 'Green Couch',
    author: '@homedecor_master',
  },
  {
    img: img3,
    title: 'Modern Minimalist Sofa',
    author: '@urban_living',
  },
  {
    img: img4,
    title: 'Cushioned Chair',
    author: '@modern_designs',
  },
  {
    img: img5,
    title: 'Side Table',
    author: '@comfort_corner',
  },
  {
    img: img6,
    title: 'Bar Stool',
    author: '@dreamy_beds',
  },
  {
    img: img7,
    title: 'Dining Table',
    author: '@cozy_nook',
  },
  {
    img: img8,
    title: 'Bed Frame',
    author: '@storage_solutions',
  },
  {
    img: img9,
    title: 'Wooden Side Table',
    author: '@media_units',
  },
  {
    img: img10,
    title: 'Cotiere Dresser',
    author: '@relax_lounge',
  },
  {
    img: img11,
    title: 'Wooden Chair',
    author: '@kitchen_comfort',
  },
  {
    img: img1,
    title: 'Armchair',
    author: '@footrest_fancy',
  },
];
`.trim();

const standardImageScope = {
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
};
const masonryImageScope = {
  img12,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img14,
  img11,
  img13,
};

const quilledImageScope = {
  img12,
  img13,
  img14,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
};

const ImageListDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Image List',
        description: 'The Image List displays a collection of images in an organized grid.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Image List',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-image-list`,
        folderLink: `${folderBaseLink}/ImageListDoc.jsx`,
      }}
    >
      <DocSection title="Standard Image List">
        <DocCard code={standardImageListCode} scope={{ ...standardImageScope, Image }} noInline />
      </DocSection>
      <DocSection title="Quilted Image List">
        <DocCard code={quiltedImageListCode} scope={{ ...quilledImageScope, Image }} noInline />
      </DocSection>
      <DocSection title="Woven Image List">
        <DocCard code={wovenImageListCode} scope={{ ...standardImageScope, Image }} noInline />
      </DocSection>
      <DocSection title="Masonry Image List">
        <DocCard code={masonryImageListCode} scope={{ ...masonryImageScope, Image }} noInline />
      </DocSection>
      <DocSection title="Image List With Title Bars">
        <DocCard
          code={titleBarImageListCode}
          scope={{ ...standardImageScope, Image, cssVarRgba }}
          noInline
        />
        <DocNestedSection
          title="Title bar below image (Standard)"
          id={kebabCase('Title bar below image (Standard)')}
          sx={{ mt: 3 }}
        >
          <DocCard
            code={titleBarBelowImageCode}
            scope={{ ...standardImageScope, Image }}
            noInline
          />
        </DocNestedSection>
        <DocNestedSection
          title="Title bar below image (Masonry)"
          id={kebabCase('Title bar below image (Masonry)')}
          sx={{ mt: 3 }}
        >
          <DocCard
            code={titleBarMasonryImageListCode}
            scope={{ ...masonryImageScope, Image }}
            noInline
          />
        </DocNestedSection>
      </DocSection>
    </DocPageLayout>
  );
};
export default ImageListDoc;
