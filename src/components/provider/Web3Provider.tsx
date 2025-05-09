'use client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import {mainnet, sepolia} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReactNode } from 'react';
import {ConnectKitProvider} from "connectkit";

const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})


const queryClient = new QueryClient();

export const Web3ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
