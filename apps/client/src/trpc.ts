import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../server/src/app";

export const trpc = createTRPCReact<AppRouter>()

// export const trpcClient = trpc.createClient({    
//   links: [
//     httpBatchLink({
//       url: 'http://localhost:3000/trpc',
//       fetch(url, options) {
//         return fetch(url, {
//           ...options,
//           credentials: 'include',
//         });
//       },
//     }),
//   ],
// });
