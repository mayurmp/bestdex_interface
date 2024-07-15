import { ethers } from 'ethers'

function formatFee(fee) {
  let hexFee = ethers.utils.hexlify(fee)
  const length = ethers.utils.hexDataLength(hexFee)
  if (length < 3) {
    hexFee = ethers.utils.hexZeroPad(hexFee, 3)
    return hexFee
  }
  if (length === 3) {
    return hexFee
  }
}

export function buildPath(addressArray, feeArray) {
  let concatPath = addressArray[0]
  for (let i = 0; i <= addressArray.length - 2; i = i + 1) {
    const hexFee = formatFee(feeArray[i])
    concatPath = ethers.utils.hexConcat([concatPath, hexFee, addressArray[i + 1]])
  }
  console.log(concatPath)
  return concatPath
}

//   buildPath(['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82','0x55d398326f99059fF775485246999027B3197955'],[2500])
