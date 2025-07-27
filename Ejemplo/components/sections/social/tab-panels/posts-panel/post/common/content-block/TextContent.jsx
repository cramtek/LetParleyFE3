import { useState } from 'react';
import { ButtonBase, Typography } from '@mui/material';

const TextContent = ({ content }) => {
  const [showMore, setShowMore] = useState(content.length < 250);

  return (
    <Typography variant="body2" sx={{ textWrap: 'pretty', color: 'text.secondary' }}>
      {content.slice(0, showMore ? content.length : 250)}
      {!showMore && '... '}
      {!showMore && (
        <ButtonBase
          onClick={() => setShowMore(true)}
          sx={{ color: 'primary.main', fontWeight: 700 }}
        >
          Show more
        </ButtonBase>
      )}
    </Typography>
  );
};

export default TextContent;
