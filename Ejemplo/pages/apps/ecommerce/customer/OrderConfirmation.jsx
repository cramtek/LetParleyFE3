import { Container, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import illustration12dark from 'assets/images/illustrations/12-dark.webp';
import illustration12 from 'assets/images/illustrations/12-light.webp';
import { suggestedProducts } from 'data/e-commerce/products';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import SuggestedProducts from 'components/sections/ecommerce/customer/common/SuggestedProducts';
import OrderConfirmationPreview from 'components/sections/ecommerce/customer/order-confirmation/OrderConfirmationPreview';

const OrderConfirmation = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Order confirmed"
          userLoggedIn
          breadcrumb={[
            { label: 'Home', url: paths.ecommerceHomepage },
            { label: 'Order confirmation', active: true },
          ]}
        />
      </Grid>
      <Grid size={12}>
        <Paper sx={{ px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 0 } }}>
            <Grid
              container
              rowSpacing={5}
              columnSpacing={{ xs: 3, md: 5 }}
              sx={{
                alignItems: 'center',
              }}
            >
              <Grid
                sx={{
                  textAlign: 'center',
                  order: { md: 1 },
                }}
                size={{
                  xs: 12,
                  md: 6,
                  lg: 7,
                }}
              >
                <Image
                  src={{
                    light: illustration12,
                    dark: illustration12dark,
                  }}
                  alt="order-confirmed-illustration"
                  sx={{ width: 1, objectFit: 'contain' }}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                  lg: 5,
                }}
              >
                <OrderConfirmationPreview />
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
      <Grid size={12}>
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <SuggestedProducts
            title="Recommendations based on your order"
            products={suggestedProducts}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrderConfirmation;
