// src/lib/context/web3-context.tsx
"use client"

import {createContext, useContext, useEffect, useState, ReactNode, useCallback} from "react"
import { ethers } from "ethers"
import { YiDengToken, YiDengToken__factory } from "@/typechain-types"
import { useAccount } from "wagmi"

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
const Web3Context = createContext<Web3ContextType>({
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

  // 初始化 Web3 连接和合约
  useEffect(() => {
    const initialize = async () => {
      console.log('🍎🍎🍎1111')
      // 检查环境和连接状态
      if (typeof window === 'undefined' || !window.ethereum || !address || !isConnected) {
        setIsInitialized(true) // 即使没有初始化也设置为 true，表示已尝试初始化
        return
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
        await fetchBalances(web3Provider, tokenContract, address)

        setIsInitialized(true)
        console.log("Web3 初始化成功")
      } catch (error) {
        console.error("Web3 初始化失败:", error)
        setIsInitialized(true) // 即使出错也设置为已初始化
      }
    }

    initialize()
  }, [address, isConnected])

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
  return useContext(Web3Context)
}