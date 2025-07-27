import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { meetingSchedules, stats } from 'data/e-commerce/greetings';
import Greeting from 'components/sections/dashboards/e-commerce/Greeting';
import Promo from 'components/sections/dashboards/e-commerce/Promo';
import ClientsLocations from 'components/sections/dashboards/e-commerce/clients-locations/ClientsLocations';
import GeneratedRevenue from 'components/sections/dashboards/e-commerce/generated-revenue/GeneratedRevenue';
import MarketShare from 'components/sections/dashboards/e-commerce/market-share/MarketShare';
import MonthlyProfit from 'components/sections/dashboards/e-commerce/monthly-profit/MonthlyProfit';
import RecentActivities from 'components/sections/dashboards/e-commerce/recent-activities/RecentActivities';
import StorageUsage from 'components/sections/dashboards/e-commerce/storage-usage/StorageUsage';
import TopProducts from 'components/sections/dashboards/e-commerce/top-products/TopProducts';
import VisitorRevenue from 'components/sections/dashboards/e-commerce/visitor-revenue/VisitorRevenue';

const ECommerce = () => {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(3, auto)',
        }}
      >
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 5', xl: 'span 3' },
            gridRow: 'span 3',
          }}
        >
          <Greeting stats={stats} meetingSchedules={meetingSchedules} />
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 7', xl: 'span 5' },
            gridRow: { md: 'span 2' },
            order: { xl: 1 },
          }}
        >
          <Promo title="Boost your USD balance" subtitle="by 2.5%" />
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', lg: 'span 7', xl: 'span 4' },
            gridRow: { md: 'span 1', xl: 'span 2' },
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} sx={{ height: 1 }}>
            <MonthlyProfit />
            <VisitorRevenue />
          </Stack>
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', xl: 'span 9' },
            gridRow: { lg: 'span 1' },
            order: 1,
          }}
        >
          <GeneratedRevenue />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(3, auto)',
        }}
      >
        <Box
          sx={{
            gridColumn: { xs: 'span 12', xl: 'span 8' },
            gridRow: 'span 1',
          }}
        >
          <TopProducts />
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', xl: 'span 6' },
            gridRow: 'span 1',
            order: { xl: 1 },
          }}
        >
          <StorageUsage />
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6', xl: 'span 4' },
            gridRow: 'span 1',
          }}
        >
          <MarketShare />
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 6' },
            gridRow: 'span 1',
            order: { xl: 1 },
          }}
        >
          <RecentActivities />
        </Box>
        <Box
          sx={{
            gridColumn: { xs: 'span 12', xl: 'span 6' },
            gridRow: 'span 2',
          }}
        >
          <ClientsLocations />
        </Box>
      </Box>
    </>
  );
};

export default ECommerce;
