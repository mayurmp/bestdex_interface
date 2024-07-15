import { Interface } from '@ethersproject/abi'
import { computePairAddress as computePairAddressUniswap } from '@uniswap/v2-sdk'
import { Currency, CurrencyAmount } from '@tech-alchemy/best-dex/sdk-core'
import { abi as IUniswapV2PairABI } from '@tech-alchemy/best-dex/v2-core/build/IUniswapV2Pair.json'
import { computePairAddress, Pair } from '@tech-alchemy/best-dex/v2-sdk'
import { useMemo } from 'react'
// import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@tech-alchemy/best-dex/v2-sdk'
// import { FACTORY_ADDRESS as V3_FACTORY_ADDRESS } from '@tech-alchemy/best-dex/v3-sdk'
// import { FACTORY_ADDRESS as UNISWAP_V2_FACTORY } from '@uniswap/v2-sdk'
import { UNISWAP_V2_FACTORY_ADDRESSES, V2_FACTORY_ADDRESSES } from '../constants/addresses'
import { useMultipleContractSingleData } from '../state/multicall/hooks'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useV2Pairs(
  currencies: [Currency | undefined, Currency | undefined][],
  contractNumber?: number
): [PairState, Pair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses0 = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          V2_FACTORY_ADDRESSES[tokenA.chainId]
          ? computePairAddress({ factoryAddress: V2_FACTORY_ADDRESSES[tokenA.chainId], tokenA, tokenB })
          : undefined
      }),
    [tokens]
  )

  const pairAddresses1 = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          UNISWAP_V2_FACTORY_ADDRESSES[tokenA.chainId]
          ? computePairAddressUniswap({ factoryAddress: UNISWAP_V2_FACTORY_ADDRESSES[tokenA.chainId], tokenA, tokenB })
          : undefined
      }),
    [tokens]
  )

  // console.log('address 1', V2_FACTORY_ADDRESSES)
  // console.log('address 2', UNISWAP_V2_FACTORY_ADDRESSES)
  const results0 = useMultipleContractSingleData(pairAddresses0, PAIR_INTERFACE, 'getReserves') //LE
  const results1 = useMultipleContractSingleData(pairAddresses1, PAIR_INTERFACE, 'getReserves') //UNISWAP
  let results = results0

  if (contractNumber === 1) {
    results = results1
  }
  // console.log('results 0', results0)
  // console.log('results 1', results1)
  // const checkValidResult = (results: Array<any>) => {
  //   // return results.find((pairData: any) => {
  //   //   return pairData.result && pairData.result.length > 0
  //   // })

  //   return results[0]?.result && results[0]?.result?.length > 0
  // }
  // const checkValidResult = (results: Array<any>, results2: Array<any>) => {
  //   // return results.find((pairData: any) => {
  //   //   return pairData.result && pairData.result.length > 0
  //   // })
  //   const maxPairs1 = results.reduce((acc, mapData) => (mapData.error ? acc : acc + 1), 0)
  //   const maxPairs2 = results2.reduce((acc, mapData) => (mapData.error ? acc : acc + 1), 0)
  //   console.log('maxpairs1', maxPairs1)
  //   console.log('maxpairs2', maxPairs2)

  //   return maxPairs1 < maxPairs2
  // }
  // if (checkValidResult(results, results2)) {
  //   results = results2
  //   factoryContract = Factory_Type.UNISWAP
  //   // console.log('modified results 1', results)
  // }

  // console.log('unmapped pair data', results)

  // return useMemo(() => {
  //   return results.map((result, i) => {
  //     const { result: reserves, loading } = result
  //     const tokenA = tokens[i][0]
  //     const tokenB = tokens[i][1]

  //     if (loading) return [PairState.LOADING, null]
  //     if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
  //     if (!reserves) {
  //       results2.map((result2, i) => {
  //         // let var1: any = []
  //         const { result: reserves2, loading } = result2
  //         const tokenC = tokens[i][0]
  //         const tokenD = tokens[i][1]
  //         if (loading) return [PairState.LOADING, null]
  //         if (!tokenC || !tokenD || tokenC.equals(tokenD)) return [PairState.INVALID, null]
  //         if (!reserves2) return [PairState.NOT_EXISTS, null]
  //         const { reserve0, reserve1 } = reserves2
  //         const [token0, token1] = tokenC.sortsBefore(tokenD) ? [tokenC, tokenD] : [tokenD, tokenC]
  //         return [
  //           PairState.EXISTS,
  //           new Pair(
  //             CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
  //             CurrencyAmount.fromRawAmount(token1, reserve1.toString())
  //           ),
  //         ]
  //       })

  //         // return var1
  //       })
  //     }
  //     const { reserve0, reserve1 } = reserves
  //     const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  //     return [
  //       PairState.EXISTS,
  //       new Pair(
  //         CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
  //         CurrencyAmount.fromRawAmount(token1, reserve1.toString())
  //       ),
  //     ]
  //   })
  // }, [results, tokens])

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) {
        return [PairState.NOT_EXISTS, null]
      }
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
      ]
    })
  }, [results, tokens])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}

// export function whichFactoryContract() {
//   return factoryContract
// }
