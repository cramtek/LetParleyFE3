import { useState } from 'react';
import { Paper, ToggleButton, ToggleButtonGroup, toggleButtonClasses } from '@mui/material';
import SectionHeader from 'components/common/SectionHeader';
import UserByCountryTable from './UserByCountryTable';

const UserByCountry = ({ data }) => {
  const [period, setPeriod] = useState('weekly');

  const handleChange = (event, newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <SectionHeader
        title="Users by Country"
        subTitle="Detail informations of users"
        actionComponent={
          <ToggleButtonGroup
            color="primary"
            value={period}
            exclusive
            onChange={handleChange}
            aria-label="Period"
            sx={{
              [`& .${toggleButtonClasses.root}`]: {
                fontWeight: 600,
                color: 'neutral.dark',
                borderRadius: 2,
                padding: '9px 16px',
              },
            }}
          >
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="yearly">Yearly</ToggleButton>
          </ToggleButtonGroup>
        }
        sx={{ mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}
      />

      <UserByCountryTable data={data} />
    </Paper>
  );
};

export default UserByCountry;
