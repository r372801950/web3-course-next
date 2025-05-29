// Add TypeScript declarations for window.ethereum
type EthereumRequestMethod =
  | 'eth_requestAccounts'
  | 'eth_accounts'
  | 'eth_chainId'
  | 'eth_getBalance'
  | 'eth_sendTransaction'
  | 'eth_sign'
  | 'personal_sign'
  | 'eth_signTypedData'
  | 'wallet_switchEthereumChain'
  | 'wallet_addEthereumChain';

type EthereumEventName =
  | 'accountsChanged'
  | 'chainChanged'
  | 'connect'
  | 'disconnect';

interface EthereumRequest {
  method: EthereumRequestMethod;
  params?: unknown[];
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: EthereumRequest) => Promise<unknown>;
    on: (eventName: EthereumEventName, callback: (...args: unknown[]) => void) => void;
    removeAllListeners: (eventName: EthereumEventName) => void;
  }
}
