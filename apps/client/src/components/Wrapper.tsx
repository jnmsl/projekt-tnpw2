import { ReactNode, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
} from '@mantine/core';
import { trpc } from '../trpc';
import { useQueryClient } from '@tanstack/react-query';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { UserList } from './UserList';

export function CurrentUser() {
  const { data, error, isLoading } = trpc.user.getCurrentUser.useQuery();
  const logout = trpc.user.logout.useMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      <div className='inline-flex space-x-4 items-center'>
        <p>User: {data.username}</p>
        <Button
          variant='filled'
          size='md'
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => {
                queryClient.clear();
                navigate('/');
              },
            })
          }
        >
          Logout
        </Button>
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
      className='bg-gray-100 xl:px-32'
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      navbar={
        <Navbar
          p='md'
          hiddenBreakpoint='sm'
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <div className='mx-auto'>
            <CurrentUser />
          </div>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
          <Aside p='md' hiddenBreakpoint='sm' width={{ sm: 200, lg: 300 }}>
            <div>
              <UserList />
            </div>
          </Aside>
        </MediaQuery>
      }
      footer={
        <Footer height={60} p='md' className='text-center'>
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

            <Link to='/' className='flex items-center mx-4'>
              Microblog
              <ChatBubbleOvalLeftEllipsisIcon className='h-8 w-8 text-blue-500 m-2' />
            </Link>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
