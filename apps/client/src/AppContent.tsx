import { NoteForm } from './components/NoteForm';
import { NotesList } from './components/NotesList';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { useState } from 'react';
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
} from '@mantine/core';

import { trpc } from "./trpc";

export function CurrentUser() {
  const { data, error, isLoading } = trpc.user.getCurrentUser.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data) {
    return (
      <div>
        <p>Current User:</p>
        <p>ID: {data.id}</p>
        <p>Username: {data.username}</p>
      </div>
    );
  }

  return null;
}

export function AppContent() {
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
        <Header height={{ base: 50, md: 70 }} p='md'>
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

            <Text>
              {/* <CurrentUser /> */}
            </Text>
          </div>
        </Header>
      }
    >
      <div className='max-w-xl m-auto h-screen py-40'>
        <h1 className='text-5xl font-bold text-center py-5'>Notes</h1>
        <LoginForm />
        <RegisterForm />
        <NoteForm />
        <NotesList />
      </div>
    </AppShell>
  );
}
