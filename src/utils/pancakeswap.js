import { ethers } from 'ethers'
import { buildPath } from './utils/pathbuilderPancakeswap'
import pancakeSwapQuoterABI from './abi/abiPancakeswap.json'

const routerAddressPancake = '0x1b81D678ffb9C0263b24A97847620C99d213eB14'

export async function swapFromPancake(
  tokenArray,
  feeArray,
  recipient,
  deadline,
  amountIn,
  amountOutMinimum,
  provider, // the provider will be injected from the frontend
  walletAddress
) {
  const path = buildPath(tokenArray, feeArray)
  const localProvider = new ethers.providers.JsonRpcProvider(
    'https://icy-shy-violet.bsc.quiknode.pro/e8951961034e14e936ab8745c7f351656e51f9ac/'
  )
  const timestamp = (await localProvider.getBlock('latest')).timestamp
  deadline = deadline + timestamp

  console.log('PROVIDER', provider)

  const wallet = new ethers.Wallet(walletAddress, localProvider)
  const exactInputParams = {
    path,
    recipient,
    deadline,
    //   amountIn: fromReadableAmount(0.1, 18).toString(),
    amountIn: Number(amountIn).toString(),
    amountOutMinimum,
  }

  const routerContracPancake = new ethers.Contract(routerAddressPancake, pancakeSwapQuoterABI, localProvider)

  const routerContracPancakeWithWallet = routerContracPancake.connect(wallet)

  const tx = await routerContracPancakeWithWallet.call.exactInput(exactInputParams)
  const receipt = await tx.wait()
  console.log('receipt', receipt)
}

// main(tokenArray, feeArray, recipient, deadline, amountIn, amountOutMinimum);
