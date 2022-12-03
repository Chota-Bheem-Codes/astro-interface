const { ethereum } = window;

const isMainnet = process.env.REACT_APP_MAINNET


let params: any;
 
const ethIndiaChains = [
  {
    chainId: "0x" + (338).toString(16),
    chainName: "Cronos Testnet",
    rpcUrls: ["https://evm-t3.cronos.org"],
    iconUrls: ["https://cryptologos.cc/logos/cronos-cro-logo.png?v=023"],
    blockExplorerUrls: ["https://testnet.cronoscan.com"],
    nativeCurrency: {
      name: "Test CRO",
      symbol: "TCRO",
      decimals: 18,
    },
  },
  {
    chainId: "0x" + (8080).toString(16),
    chainName: "Shardeum Liberty Testnet",
    rpcUrls: ["https://liberty10.shardeum.org/"],
    iconUrls: [
      "https://img.api.cryptorank.io/coins/150x150.shardeum1665056595732.png",
    ],
    blockExplorerUrls: ["https://explorer-liberty10.shardeum.org/"],
    nativeCurrency: {
      name: "SHM",
      symbol: "SHM",
      decimals: 18,
    },
  },
];

const paramsTestnet = [
  {
    chainId: "0x13881",
    chainName: "Matic Mumbai Testnet",
    rpcUrls: ["https://rpc-mumbai.matic.today"],
    iconUrls: ["https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"],
    blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
    nativeCurrency: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
    },
  },
];

const paramsMainnet = [
  {
    chainId: "0x89",
    chainName: "Matic Network",
    rpcUrls: ["https://polygon-rpc.com"],
    iconUrls: ["https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
    },
  },
];

params = ethIndiaChains;

export const switchNetworkInMetamask = async (id: number) => {
    if (ethereum) {
      // @ts-ignore
      return new Promise((resolve, reject) => {
        ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params[Number(id)]], // you must have access to the specified account
        })
          .then((result:any) => {
            resolve(true)
          })
          .catch((error:any) => {
            reject(false)
            if (error.code === 4001) {
              // EIP-1193 userRejectedRequest error
              console.log('We can encrypt anything without the key.');
            } else {
              console.error(error);
            }
          });
      })
    }

  }

export const addTokenToMetamask = async(address: string, symbol:string, decimals: any, url:string) =>{
    
    if(!ethereum) return

    const res = 
    await ethereum
    .request({
      method: 'wallet_watchAsset',
      params: {
        //@ts-ignore
        type: 'ERC20',
        options: {
          address: address,
          symbol: symbol,
          decimals: decimals,
          image: url,
        },
      },
    })

    return res
}
