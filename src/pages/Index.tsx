import { useEffect, useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import AuthPage from '@/components/AuthPage';
import AppLayout from '@/components/AppLayout';

const AppContent = () => {
  return <AppLayout />;
};

const Index = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default Index;
