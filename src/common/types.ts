import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { DateTime } from 'luxon'

import Emitter from './emitter'

export type ButtonType = 'PRIMARY' | 'SECONDARY' | 'NAKED' | 'DESTRUCTIVE' | 'CONTENT_ONLY' | 'HERO'
export type EmitterCommand =
  | 'OPEN_NOTIFICATION_MENU'
  | 'CLOSE_NOTIFICATION_MENU'
  | 'OPEN_NAVIGATION_MENU'
  | 'CLOSE_NAVIGATION_MENU'
  | 'OPEN_ACCOUNT_MENU'
  | 'CLOSE_ACCOUNT_MENU'
  | 'OPEN_BASKET_MENU'
  | 'CLOSE_BASKET_MENU'
  | 'SIDE_MENU_OPENED'
export type PaginatorModes = 'DOTS' | 'ARROWS'

export interface FilterValue {
  id: string
  value: string
}
export interface EmitterCallback {
  id: string
}

export interface BaseProps {
  showToast: (args: ToastArguments) => void
  emitter: Emitter
}

export interface ButtonArg {
  type: ButtonType
  icon: IconProp
  text: string
  onClick: () => void
}

export interface ToastArguments {
  text: string
  type: 'INFORMATION' | 'SUCCESS' | 'ERROR' | 'TOAST' | 'FULLWIDTH'
  icon?: IconProp | 'NONE'
  displayTime?: number
  buttonText?: string
  buttonIcon?: IconProp
  buttonOnClick?: () => void
  onClose?: () => void
  margin?: number[]
}

export interface Profile {
  type: 'USER' | 'PUBLISHER'
  name: string
  avatar: string
  banner: string
  username: string
  description: string
  followers: number
}

export interface NFT {
  id: string
  address: string
  image: string
  collectionName: string
  supply: number
  owners: number
  totalVolume: number
  floorPrice: number
}
export interface SaleNFT extends NFT {
  saleType: 'AUCTION' | 'BUY_NOW'
  salePrice: number
}

export interface Collection {
  address: string
  name: string
  image: string
  description: string
  rank: number
  owners: number
  nftsSold: number
  totalSales: number
}
export interface GameCollection extends Collection {
  players: number
  earnings: number
}
export interface Notification {
  image: string
  type: 'AUCTION_ENDING' | 'NEW_FOLLOWER' | 'NEW_OFFER' | 'OUTBID' | 'AUCTION_WON'
  id: string // Id of the object the notification relates to, eg: username or nft token id
  name: string // Name of the object this notification relates to, eg; username or nft name
  price?: string
  timestamp: DateTime
  actionByDate: DateTime
}

export interface CheckListItem {
  group: string
  value: string
  count?: number
  checked?: boolean
}

export interface RadioListItem {
  id: string
  value: string
  selected?: boolean
}

export interface CarouselItem {
  image: string
  title: string
  stats: Array<{
    name: string
    value: string | number
  }>
}

export interface NewsItem {
  time: DateTime
  agency: string
  relatedTokens: Array<{
    name: string
    image: string
  }>
  title: string
}
