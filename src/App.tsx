import { useEffect } from 'react';
// @ts-ignore
import { AppShell, AppShellMain, rem } from '@mantine/core';
import Login from '@/pages/Login';
import { useConfig, useGlobalStateActions } from '@/Store/Global';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Main from '@/pages/Main';

const App = () => {
  const config = useConfig();
  const { setConfig } = useGlobalStateActions();

  const queryClient = new QueryClient();

  const storedConfig = JSON.parse(localStorage.getItem('appConfig') || '{}');
  const isConfigSaved = Object.keys(storedConfig).length > 0;

  useEffect(() => {
    if (isConfigSaved) setConfig({ ...storedConfig });
  }, []);

  console.log('config', config);

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell padding="md">
        <AppShellMain pt={`calc(${rem(50)} + var(--mantine-spacing-md))`}>
          {config.ghToken ? <Main /> : <Login />}
        </AppShellMain>
      </AppShell>
    </QueryClientProvider>
  );
};

export default App;
