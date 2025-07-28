import { useEffect, useState } from 'react';
import { UserProvider, useUser } from '@/contexts/UserContext';
import AuthPage from '@/components/AuthPage';
import AppLayout from '@/components/AppLayout';

const AppContent = () => {
  const { user, loading } = useUser();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <AuthPage onAuth={() => {}} />;
  }

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
