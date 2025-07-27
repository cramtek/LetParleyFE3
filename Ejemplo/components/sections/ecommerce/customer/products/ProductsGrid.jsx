import { Box, Pagination, Stack, Typography } from '@mui/material';
import illustration3dark from 'assets/images/illustrations/3-dark.webp';
import illustration3 from 'assets/images/illustrations/3-light.webp';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Image from 'components/base/Image';
import ProductCard from '../common/ProductCard';

const ProductsGrid = ({ products }) => {
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <>
      <Box sx={{ flex: 1 }}>
        {products.length > 0 ? (
          <Box
            sx={{
              p: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        ) : (
          <Stack
            direction="column"
            sx={{
              height: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
              textAlign: 'center',
              p: 5,
            }}
          >
            <Image
              src={{ light: illustration3, dark: illustration3dark }}
              alt="Products Fallback"
              height={340}
              width={340}
            />
            <Typography variant="h5" maxWidth={540} color="text.secondary">
              Whoops, looks like we didn't find any matches for your search, so here’s a dinosaur in
              a box.
            </Typography>
          </Stack>
        )}
      </Box>

      <Stack
        sx={{
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Pagination
          variant="solid"
          color="primary"
          showFirstButton
          showLastButton
          count={10}
          siblingCount={upSm ? 1 : 0}
        />
      </Stack>
    </>
  );
};

export default ProductsGrid;
