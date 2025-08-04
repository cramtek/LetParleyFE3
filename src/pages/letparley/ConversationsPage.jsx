import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { conversations } from '../../data/letparley/chat';
import ChatProvider from '../../providers/ChatProvider';
import LoadingScreen from '../../components/letparley/common/LoadingScreen';
import ChatLayout from '../../components/letparley/chat/ChatLayout';

const ConversationsPage = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChatProvider conversations={conversations}>
        <Suspense fallback={<LoadingScreen />}>
          <ChatLayout />
        </Suspense>
      </ChatProvider>
    </Box>
  );
};

export default ConversationsPage;