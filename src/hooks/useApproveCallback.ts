import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount, Percent, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Trade as V2Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { Trade as V3Trade } from '@tech-alchemy/best-dex/v3-sdk'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'

import {
  SWAP_ROUTER_ADDRESSES,
  UNISWAP_SWAP_ROUTER_ADDRESSES,
  UNISWAP_V2_ROUTER_ADDRESSES,
  V2_ROUTER_ADDRESS,
  PANCAKESWAP_V3_ROUTER_ADDRESS,
} from '../constants/addresses'
import { TransactionType } from '../state/transactions/actions'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { useTokenContract } from './useContract'
import { useTokenAllowance } from './useTokenAllowance'
import { useActiveWeb3React } from './web3'
export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>, boolean, Dispatch<SetStateAction<boolean>>] {
  const { account, chainId } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  const [pendingApprovalState, setPendingApprovalState] = useState<boolean>(false)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }
    setPendingApprovalState(true)
    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })
    return tokenContract
      .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, { type: TransactionType.APPROVAL, tokenAddress: token.address, spender })
        setPendingApprovalState(false)
      })
      .catch((error: Error) => {
        setPendingApprovalState(false)
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction, chainId])

  return [approvalState, approve, pendingApprovalState, setPendingApprovalState]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  contractNumber: number
) {
  const { chainId } = useActiveWeb3React()
  let v3SwapRouterAddress = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined
  if (contractNumber === 1) {
    v3SwapRouterAddress = chainId ? UNISWAP_SWAP_ROUTER_ADDRESSES[chainId] : undefined
  }
  const amountToApprove = useMemo(
    () => (trade && trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined),
    [trade, allowedSlippage]
  )
  let router = V2_ROUTER_ADDRESS
  if (contractNumber === 1) {
    router = UNISWAP_V2_ROUTER_ADDRESSES
  }
  if (contractNumber === 2) {
    v3SwapRouterAddress = chainId ? PANCAKESWAP_V3_ROUTER_ADDRESS[chainId] : undefined
  }
  // console.log('UNISWAP_SWAP_ROUTER_ADDRESSES', router)
  return useApproveCallback(
    amountToApprove,
    chainId
      ? trade instanceof V2Trade
        ? router[chainId]
        : trade instanceof V3Trade
        ? v3SwapRouterAddress
        : undefined
      : undefined
  )
}
