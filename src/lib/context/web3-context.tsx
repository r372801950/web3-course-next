// src/lib/context/web3-context.tsx
"use client"

import {createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo} from "react"
import { ethers } from "ethers"
import { YiDengToken, YiDengToken__factory } from "@/typechain-types"
import { useAccount } from "wagmi"
import {usePathname} from "next/navigation";

// 环境变量
const YIDENG_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_YIDENG_TOKEN_ADDRESS || ''

// 代币类型定义
export type TokenId = string;

// 余额类型
export interface TokenBalances {
  [tokenId: TokenId]: string;
}

// 定义上下文类型
type Web3ContextType = {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  ydContract: YiDengToken | null;
  balances: TokenBalances;
  isInitialized: boolean;
  refreshBalances: () => Promise<void>;
}

// 创建上下文
const Web3Context = createContext<Web3ContextType | undefined>({
// const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  ydContract: null,
  balances: { eth: "0", yd: "0" },
  isInitialized: false,
  refreshBalances: async () => {}
})

// 创建提供者组件
export function Web3Provider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [ydContract, setYdContract] = useState<YiDengToken | null>(null)
  const [balances, setBalances] = useState<TokenBalances>({ eth: "0", yd: "0" })
  const [isInitialized, setIsInitialized] = useState(false)
  const pathname = usePathname();

  // 首先确定当前页面是否需要Web3功能
  const needsWeb3Functionality = useMemo(() => {
    // 需要Web3的路径关键词
    const web3PathKeywords = ['swap']; // 添加任何需要Web3的路径关键词

    // 将路径分段并去除空字符串
    const segments = pathname.split('/').filter(Boolean);

    // 检查任何路径段是否匹配关键词
    return web3PathKeywords.some(keyword =>
      segments.some(segment => segment === keyword)
    );
  }, [pathname]);

  // 初始化 Web3 连接和合约
  useEffect(() => {
    // 在代码关键位置添加性能标记
    performance.mark('web3-init-start');

    const initialize = async () => {
      // 检查环境和连接状态
      if (typeof window === 'undefined' || !window.ethereum || !address || !isConnected || !needsWeb3Functionality) {
        setIsInitialized(true); // 即使没有初始化也设置为 true，表示已尝试初始化
        console.log('pass initial web3 provider');
        return;
      }

      try {
        // 初始化提供者
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)
        setProvider(web3Provider)

        // 获取签名者
        const web3Signer = web3Provider.getSigner()
        setSigner(web3Signer)

        // 初始化合约
        const tokenContract = YiDengToken__factory.connect(
          YIDENG_TOKEN_ADDRESS,
          web3Signer
        )
        setYdContract(tokenContract)

        // 获取初始余额
        console.log(address, isConnected, needsWeb3Functionality,'123')
        await fetchBalances(web3Provider, tokenContract, address)

        setIsInitialized(true)
        // 初始化代码...
        performance.mark('web3-init-end');
        performance.measure('Web3 initialization', 'web3-init-start', 'web3-init-end');
        console.log(performance.getEntriesByName('Web3 initialization')[0].duration + 'ms');
      } catch (error) {
        console.error("Web3 初始化失败:", error)
        setIsInitialized(true) // 即使出错也设置为已初始化
      }
    }

    initialize()
  }, [address, isConnected, needsWeb3Functionality])

  // 获取余额的函数
  const fetchBalances = async (
    web3Provider: ethers.providers.Web3Provider,
    tokenContract: YiDengToken,
    userAddress: string
  ) => {
    try {
      const [tokenBalanceResult, ethBalanceResult] = await Promise.all([
        tokenContract.balanceOf(userAddress),
        web3Provider.getBalance(userAddress)
      ])

      // 获取代币小数位数
      const decimals = await tokenContract.decimals();

      const newBalances = {
        yd: ethers.utils.formatUnits(tokenBalanceResult, decimals),
        eth: ethers.utils.formatEther(ethBalanceResult)
      }

      setBalances(newBalances)
      console.log('余额已更新:', newBalances)
    } catch (error) {
      console.error("获取余额失败:", error)
    }
  }

  // 刷新余额的公共方法
  const refreshBalances = useCallback(async () => {
    if (!provider || !ydContract || !address) return
    await fetchBalances(provider, ydContract, address)
  },[provider, ydContract, address])

  // 监听钱包连接和断开事件
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // 用户断开连接，重置状态
        setProvider(null)
        setSigner(null)
        setYdContract(null)
        setBalances({ eth: "0", yd: "0" })
      } else {
        // 账户变更，重新初始化
        initialize()
      }
    }

    const initialize = async () => {
      if (!window.ethereum || !isConnected) return
      // 实现如上述 initialize 函数
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)

    return () => {
      if (window.ethereum && window.ethereum.removeAllListeners) {
        // removeAllListeners会移除指定事件的所有监听器，而不仅仅是一个特定的监听器。
        // 如果您有多个处理程序监听相同的事件，这可能会导致问题
        window.ethereum.removeAllListeners('accountsChanged');
      }
    }
  }, [isConnected])

  // 在 Web3Provider 组件中添加事件监听
  useEffect(() => {
    // 确保必要的依赖项存在
    if (!ydContract || !address || !isConnected) return;

    console.log('设置余额监听器');

    // 创建过滤器来监听 转账事件    1
    // 监听发送到当前地址的转账 (收到代币)
    const incomingFilter = ydContract.filters.Transfer(null, address);
    // 监听从当前地址发出的转账 (发送代币)
    const outgoingFilter = ydContract.filters.Transfer(address, null);

    // 收到代币时更新余额
    const handleTransfer = async () => {
      console.log('检测到转账事件，更新余额');
      await refreshBalances();
    };

    // 监听两种转账事件         2
    ydContract.on(incomingFilter, handleTransfer);
    ydContract.on(outgoingFilter, handleTransfer);

    // 同样监听ETH余额变化（这个比较复杂，因为ETH没有Transfer事件）
    // 我们可以监听区块，然后在每个区块上检查余额变化
    if (provider) {

      // 添加节流逻辑的例子
      let lastBlockChecked = 0;
      provider.on('block', async (blockNumber) => {
        // 每 10 个区块检查一次余额
        if (blockNumber - lastBlockChecked > 10) {
          lastBlockChecked = blockNumber;
          await refreshBalances();
        }
      });

      // provider.on('block', async () => {
      //   // 由于每个区块都会触发，可以考虑添加节流逻辑
      //   // 这里简单实现，实际应用中应该添加节流以减少请求
      //   await refreshBalances();
      // });
    }

    // 清理函数
    return () => {
      console.log('移除余额监听器');
      if (ydContract) {
        ydContract.removeAllListeners(incomingFilter);
        ydContract.removeAllListeners(outgoingFilter);
      }
      if (provider) {
        provider.removeAllListeners('block');
      }
    };
  }, [ydContract, address, isConnected, provider, refreshBalances]);

  // 提供上下文值
  const contextValue: Web3ContextType = {
    provider,
    signer,
    ydContract,
    balances,
    isInitialized,
    refreshBalances
  }

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}

// 创建自定义钩子以便在组件中使用
export function useWeb3() {
  const web3 =  useContext(Web3Context)
  if(!web3) {
    throw new Error('useWeb3() must be used within Web3')
  }
  return web3;
}