'use client';
import '@rainbow-me/rainbowkit/styles.css';
import {RainbowKitProvider, getDefaultConfig, darkTheme} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Web3Provider} from "@/lib/context/web3-context";

// 创建配置使用新的 getDefaultConfig API
const config = getDefaultConfig({
  appName: 'Web3 Client App', // 更改为您的应用名称
  projectId: 'YOUR_PROJECT_ID', // 替换为您的 WalletConnect projectId
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

// 创建 QueryClient 实例
const queryClient = new QueryClient();

export const Web3ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#980ffa',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          <Web3Provider>
            {children}
          </Web3Provider>
          <ReactQueryDevtools />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};