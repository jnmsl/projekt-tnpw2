import { ReactNode, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
} from '@mantine/core';
import { trpc } from '../trpc';

export function CurrentUser() {
  const { data, error, isLoading } = trpc.user.getCurrentUser.useQuery();
  const logout = trpc.user.logout.useMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // tell to log in if not logged in
  if (!data) {
    return (
      <div>
        <p>You are not logged in.</p>
      </div>
    );
  }

  if (data) {
    return (
      <div>
        <p>Username: {data.username}</p>
        <Button onClick={() => logout.mutate()}>Logout</Button>
      </div>
    );
  }

  return null;
}

interface WrapperProps {
  children: ReactNode;
}

export function Wrapper({ children }: WrapperProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      navbar={
        <Navbar
          p='md'
          hiddenBreakpoint='sm'
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Text>Notes</Text>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
          <Aside p='md' hiddenBreakpoint='sm' width={{ sm: 200, lg: 300 }}>
            <Text>Notes</Text>
          </Aside>
        </MediaQuery>
      }
      footer={
        <Footer height={60} p='md'>
          Studentský zápočtový projekt – Jan Musil
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} className='px-20'>
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size='sm'
                color={theme.colors.gray[6]}
                mr='xl'
              />
            </MediaQuery>

            <CurrentUser />

            {/* align a login button right */}
            <div className='ml-auto'>
              <Button variant='outline' size='md'>
                Login
              </Button>
            </div>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
