import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './trpc';
import { httpBatchLink } from '@trpc/client';
import { MantineProvider, createEmotionCache } from '@mantine/core';

function App({ children }: React.PropsWithChildren<unknown>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    })
  );

  const myCache = createEmotionCache({
    key: 'mantine',
    prepend: false,
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider emotionCache={myCache}>{children}</MantineProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
