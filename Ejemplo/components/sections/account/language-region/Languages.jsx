import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Stack } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import LanguageDialog from './LanguageDialog';
import LanguageItem from './LanguageItem';

const Languages = () => {
  const [open, setOpen] = useState(false);
  const { watch } = useFormContext();
  const checkedLanguages = watch('languages');

  return (
    <>
      <Stack direction="column" spacing={1}>
        {checkedLanguages.map((checkedLanguage, index) => (
          <LanguageItem
            key={checkedLanguage.id}
            name={checkedLanguage.name}
            label={checkedLanguage.label}
            isPrimary={index === 0}
          />
        ))}
      </Stack>
      <Button
        variant="soft"
        color="neutral"
        startIcon={<IconifyIcon icon="material-symbols:add" sx={{ fontSize: 20 }} />}
        onClick={() => setOpen(true)}
      >
        Add Another
      </Button>
      <LanguageDialog open={open} handleDialogClose={() => setOpen(false)} />
    </>
  );
};

export default Languages;
