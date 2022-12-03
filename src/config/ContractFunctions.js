import { encodedID } from "../utils";
import ReactGA from "react-ga4";
import { DEPLOYED_CONTRACT_ADDRESS } from "../screens/App";
const ethers = require("ethers");
const gameTokenContract = require("./abis/usdc.json");
const nftContract = require("./abis/nft.json");
const gameQuestionContract = require("./abis/GameQuestion.json");
const factoryContract = require("./abis/Factory.json");
const { gameToken, network } = require("./Constants");

export const expandDecimals = (amount, decimals = "18") => {
  return ethers.utils.parseUnits(String(amount), decimals);
};

export const formatDecimals = (amount, decimals = "18") => {
  return ethers.utils.formatUnits(String(amount), decimals);
};

//const rpcProvider = new ethers.providers.JsonRpcProvider(network.rpc);

export const getApproval = async ({
  userAddress,
  spenderAddress,
  rpcProvider,
  gameTokenAddress,
  gameTokenDecimal,
}) => {
  try {
    const erc20Instance = new ethers.Contract(
      gameTokenAddress,
      gameTokenContract.abi,
      rpcProvider
    );
    const result = await erc20Instance.allowance(userAddress, spenderAddress);
    return formatDecimals(result.toString(), gameTokenDecimal);
  } catch (error) {
    console.log("Error", error);
  }
};

export const getGameTokenBalance = async ({
  accountAddress,
  rpcProvider,
  gameTokenAddress,
  gameTokenDecimal,
}) => {
  try {
    const erc20Instance = new ethers.Contract(
      gameTokenAddress,
      gameTokenContract.abi,
      rpcProvider
    );
    const result = await erc20Instance.balanceOf(accountAddress);
    return ethers.utils.formatUnits(result.toString(), gameTokenDecimal);
  } catch (error) {
    console.log("Error ", error);
  }
};

export const getNftBalance = async ({ accountAddress }) => {
  const rpcProvider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/KTThKitCO6ribBk4VbChTxiCKZLNjVPy"
  );
  try {
    const nftInstance = new ethers.Contract(
      DEPLOYED_CONTRACT_ADDRESS,
      nftContract,
      rpcProvider
    );
    const result = await nftInstance.balanceOf(accountAddress);
    return result.toString();
  } catch (error) {
    console.log("Error ", error);
  }
};

export const setApproval = async ({ spender, gameTokenAddress }) => {
  try {
    let ans = false;
    const signer = window.web3Provider.getSigner();
    const erc20Instance = new ethers.Contract(
      gameTokenAddress,
      gameTokenContract.abi,
      signer
    );
    const tx = await erc20Instance.approve(
      spender,
      ethers.constants.MaxUint256
    );

    let result = await window.web3Provider.waitForTransaction(tx.hash);

    if (result.status == 1) {
      ans = true;
    }
    return ans;
  } catch (error) {
    console.log("Error", error);
  }
};

export const placeBetQuestion = async ({
  contractAddress,
  amount,
  option,
  questionID,
}) => {
  try {
    let ans = false;
    const signer = window.web3Provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      factoryContract.abi,
      signer
    );

    let expandedAmount = expandDecimals(amount, gameToken.decimals);

    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint8"],
      [expandedAmount, option]
    );

    const tx = await contractInstance.placeTheBet(encodedID(questionID), data);

    let result = await window.web3Provider.waitForTransaction(tx.hash);

    if (result.status == 1) {
      ans = true;
    }
    return ans;
  } catch (error) {
    console.log("Error", error);
  }
};

export const claimBetRewards = async ({ questionID, contractAddress }) => {
  try {
    let ans = false;
    const signer = window.web3Provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      factoryContract.abi,
      signer
    );

    const tx = await contractInstance.claimBet(encodedID(questionID));

    let result = await window.web3Provider.waitForTransaction(tx.hash);

    if (result.status == 1) {
      ans = true;
    }
    return ans;
  } catch (error) {
    console.log("Error", error);
  }
};

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" },
];

export const biconomyApprove = async ({
  accountAddress,
  spender,
  gameTokenAddress,
}) => {
  let ans = false;
  try {
    console.log("Sending meta transaction");
    let userAddress = accountAddress;
    const contract = new window.biconomyWeb3USDC.eth.Contract(
      gameTokenContract.abi,
      gameTokenAddress
    );
    let nonce = await contract.methods.nonces(userAddress).call();
    console.log(nonce);
    let functionSignature = contract.methods
      .approve(spender, ethers.constants.MaxUint256)
      .encodeABI();
    let name = await contract.methods.name().call();
    console.log(name);
    let domainData = {
      name,
      version: "1",
      verifyingContract: gameTokenAddress,
      salt: "0x" + parseInt(network.networkId).toString(16).padStart(64, "0"),
    };
    let message = {};
    message.nonce = parseInt(nonce);
    message.from = userAddress;
    message.functionSignature = functionSignature;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType,
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message,
    });
    console.log(domainData);
    console.log();
    await window.provider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign],
      },
      async function (error, response) {
        console.info(`User signature is ${response.result}`);
        if (error || (response && response.error)) {
          console.log("Could not get user signature");
          ans = false;
        } else if (response && response.result) {
          let { r, s, v } = getSignatureParameters(response.result);
          console.log(userAddress);
          console.log(JSON.stringify(message));
          console.log(message);
          console.log(getSignatureParameters(response.result));

          const receipt = await sendSignedTransaction(
            userAddress,
            functionSignature,
            r,
            s,
            v,
            contract,
            null
          );
          ans = receipt.transactionHash;
        }
      }
    );
    return ans;
  } catch (e) {
    console.log("Bicoonomy approve error - ", e);
    ReactGA.event({
      category: "Approve Bet Biconomy ",
      action: "ERROR",
    });
    return ans;
  }
};

export const biconomyPlaceBet = async ({
  accountAddress,
  contractAddress,
  amount,
  option,
  questionID,
}) => {
  let ans = false;
  try {
    console.log("Sending meta transaction");
    let userAddress = accountAddress;
    const contract = new window.biconomyWeb3.eth.Contract(
      factoryContract.abi,
      contractAddress
    );
    let nonce = await contract.methods.getNonce(userAddress).call();
    console.log(nonce);
    let expandedAmount = expandDecimals(amount, gameToken.decimals);
    const data = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint8"],
      [expandedAmount, option]
    );
    let functionSignature = contract.methods
      .placeTheBet(encodedID(questionID), data)
      .encodeABI();
    // let name = await contract.methods.name().call();
    // console.log(name);
    let domainData = {
      name: "Prediction-Market",
      version: "1",
      verifyingContract: contractAddress,
      salt: "0x" + parseInt(network.networkId).toString(16).padStart(64, "0"),
    };
    let message = {};
    message.nonce = parseInt(nonce);
    message.from = userAddress;
    message.functionSignature = functionSignature;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType,
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message,
    });
    console.log(domainData);
    await window.provider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign],
      },
      async function (error, response) {
        console.info(`User signature is ${response.result}`);
        if (error || (response && response.error)) {
          console.log("Could not get user signature");
          ans = false;
        } else if (response && response.result) {
          let { r, s, v } = getSignatureParameters(response.result);
          console.log(userAddress);
          console.log(JSON.stringify(message));
          console.log(message);
          console.log(getSignatureParameters(response.result));

          const receipt = await sendSignedTransaction(
            userAddress,
            functionSignature,
            r,
            s,
            v,
            contract
          );
          ans = receipt.transactionHash;
        }
      }
    );
    return ans;
  } catch (e) {
    console.log("Biconomy Place Bet error - ", e);
    console.log(ReactGA);
    ReactGA.event({
      category: "Place Bet Biconomy ",
      action: "ERROR",
    });
    return ans;
  }
};

export const biconomyClaimRewards = async ({
  questionID,
  contractAddress,
  accountAddress,
}) => {
  try {
    let ans;
    console.log("Sending meta transaction");
    let userAddress = accountAddress;
    const contract = new window.biconomyWeb3.eth.Contract(
      factoryContract.abi,
      contractAddress
    );
    let nonce = await contract.methods.getNonce(userAddress).call();
    console.log(nonce);
    let functionSignature = contract.methods
      .claimBet(encodedID(questionID))
      .encodeABI();
    // let name = await contract.methods.name().call();
    // console.log(name);
    let domainData = {
      name: "Prediction-Market",
      version: "1",
      verifyingContract: contractAddress,
      salt: "0x" + parseInt(network.networkId).toString(16).padStart(64, "0"),
    };
    let message = {};
    message.nonce = parseInt(nonce);
    message.from = userAddress;
    message.functionSignature = functionSignature;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType,
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message,
    });
    console.log(domainData);
    await window.provider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign],
      },
      async function (error, response) {
        console.info(`User signature is ${response.result}`);
        if (error || (response && response.error)) {
          console.log("Could not get user signature");
          ans = false;
        } else if (response && response.result) {
          let { r, s, v } = getSignatureParameters(response.result);
          console.log(userAddress);
          console.log(JSON.stringify(message));
          console.log(message);
          console.log(getSignatureParameters(response.result));

          const receipt = await sendSignedTransaction(
            userAddress,
            functionSignature,
            r,
            s,
            v,
            contract
          );
          ans = receipt.transactionHash;
        }
      }
    );
    return ans;
  } catch (e) {
    console.log("Claim Reward error - ", e);
    ReactGA.event({
      category: "Claim Biconomy ",
      action: "ERROR",
    });
  }
};

const getSignatureParameters = (signature) => {
  console.log("getSignatureParameters");
  if (!window.biconomyWeb3.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  var r = signature.slice(0, 66);
  var s = "0x".concat(signature.slice(66, 130));
  var v = "0x".concat(signature.slice(130, 132));
  v = window.biconomyWeb3.utils.hexToNumber(v);
  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
};

const sendSignedTransaction = async (
  userAddress,
  functionData,
  r,
  s,
  v,
  contract
) => {
  try {
    console.log("sendSignedTransaction");
    // let gasLimit = await contract.methods
    //   .executeMetaTransaction(userAddress, functionData, r, s, v)
    //   .estimateGas({ from: userAddress });
    // let gasPrice = await window.biconomyWeb3.eth.getGasPrice();
    // console.log("gasLimit", gasLimit);
    // console.log("gasLimit", gasPrice);
    let tx = contract.methods
      .executeMetaTransaction(userAddress, functionData, r, s, v)
      .send({
        from: userAddress,
        // gasPrice: gasPrice,
        // gasLimit: gasLimit,
      });

    return new Promise((resolve, reject) =>
      tx
        .on("transactionHash", function (hash) {
          console.log(`Transaction hash is ${hash}`);
        })
        .once("confirmation", function (confirmationNumber, receipt) {
          console.log(receipt, " ", confirmationNumber);
          resolve(receipt);
        })
        .on("error", reject)
    );
  } catch (error) {
    console.log(error);
  }
};

export const userSetApproval = ({
  accountAddress,
  spender,
  gasLess,
  gameTokenAddress,
}) => {
  const ans = gasLess
    ? biconomyApprove({
        accountAddress: accountAddress,
        spender: spender,
        gameTokenAddress,
      })
    : setApproval({ spender: spender, gameTokenAddress });

  return ans;
};

export const userPlaceBet = ({
  accountAddress,
  contractAddress,
  amount,
  option,
  questionID,
  gasLess,
}) => {
  const ans = gasLess
    ? biconomyPlaceBet({
        accountAddress: accountAddress,
        contractAddress: contractAddress,
        amount: amount,
        option: option,
        questionID: questionID,
      })
    : placeBetQuestion({
        contractAddress: contractAddress,
        amount: amount,
        option: option,
        questionID: questionID,
      });
  return ans;
};

export const userClaimRewards = ({
  questionID,
  contractAddress,
  accountAddress,
  gasLess,
}) => {
  const ans = gasLess
    ? biconomyClaimRewards({
        questionID: questionID,
        contractAddress: contractAddress,
        accountAddress: accountAddress,
      })
    : claimBetRewards({
        questionID: questionID,
        contractAddress: contractAddress,
      });
  return ans;
};
