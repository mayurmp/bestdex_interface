import React, { useMemo } from 'react'
import { Text, TextProps as TextPropsOriginal } from 'rebass'
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components/macro'

import { useIsDarkMode } from '../state/user/hooks'
import { Colors } from './styled'

export * from './components'

type TextProps = Omit<TextPropsOriginal, 'css'>

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

// Migrating to a standard z-index system https://getbootstrap.com/docs/5.0/layout/z-index/
// Please avoid using deprecated numbers
export enum Z_INDEX {
  deprecated_zero = 0,
  deprecated_content = 1,
  dropdown = 1000,
  sticky = 1020,
  fixed = 1030,
  modalBackdrop = 1040,
  offcanvas = 1050,
  modal = 1060,
  popover = 1070,
  tooltip = 1080,
}

export const BREAKPOINTS = {
  xs: 396,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'
const bydefault = '#757DFF'
const hover = '#5A63FF'
const disabled = '#eaecf5'
const disabledFontColor = '#98a2b3'
const redHover = '#B42318'
const redDisabled = '#FECDCA'

function colors(darkMode: boolean): Colors {
  return {
    darkMode,
    // base
    white,
    black,
    bydefault,
    hover,
    disabled,
    disabledFontColor,
    redHover,
    redDisabled,

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#8F96AC' : '#6E727D',
    text4: darkMode ? '#B2B9D2' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',
    text6: darkMode ? '#5a63ff' : '#000000',
    text7: darkMode ? '#5a63ff' : '#FFFFFF',
    text8: darkMode ? '#FFFFFF' : '#565A69',

    // backgrounds / greys
    bg0: darkMode ? '#000000' : '#FFF',
    bg1: darkMode ? '#444444' : '#F1f1f1',
    bg2: darkMode ? '#2C2F36' : '#EDEEF2',
    bg3: darkMode ? '#40444F' : '#CED0D9',
    bg4: darkMode ? '#565A69' : '#888D9B',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? '#1A2028' : '#6C7284',
    bg7: darkMode ? '#222222' : '#FFF',
    bg8: darkMode ? 'rgba(90, 99, 255, 0.10)' : '#FFF',
    bg9: darkMode ? 'rgba(90, 99, 255, 0.10)' : '#F1f1f1',
    bg10: darkMode ? '#222222' : '#F1f1f1',
    bg11: darkMode ? '#E6E7F6' : '#FFFFFF',
    bg12: darkMode ? '#444444' : '#a7a7a7',
    bg13: darkMode ? '#5a63ff' : '#F1f1f1',
    bg14: darkMode ? '#f04438' : '#5a63ff',

    // new Swap BGs
    swapBg1: darkMode ? '#191B1F' : '#5a63ff',
    swapBg2: darkMode ? '#191B1F' : '#5a63ff',
    swapBgDisabled: darkMode ? '#191B1F' : '#5a63ff4f',
    swapPrimary: darkMode ? '#191B1F' : '#5a63ff',
    swapSecondary: darkMode ? '#a9a9a9' : '#555555',
    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',
    primaryBg1: darkMode ? '#2172E5' : '#5a63ff',
    //primary colors
    primary1: darkMode ? '#2172E5' : '#5a63ff', //'#ff7c0a',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? '#153d6f70' : '#FFFFFF',
    primary6: darkMode ? '#153d6f70' : '#E2F1FA',
    primary7: darkMode ? 'rgba(90, 99, 255, 0.10)' : '#5a63ff',

    // color text
    primaryText1: darkMode ? '#5090ea' : '#5a63ff',
    primaryText2: darkMode ? '#5090ea' : '#FFFFFF',
    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#F1f1f1',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    // red1: darkMode ? '#FF4343' : '#FF1763',
    red1: '#D92D20',
    red2: darkMode ? '#F82D3A' : '#DF1F38',
    red3: '#D60000',
    red4: darkMode ? '#F04438' : '#565A69',
    red5: '#F04438',
    green1: darkMode ? '#27AE60' : '#2DBB2D',
    yellow1: '#E3A507',
    yellow2: '#FF8F00',
    yellow3: '#F3B71E',
    blue1: darkMode ? '#2172E5' : '#0068FC',
    blue2: darkMode ? '#5199FF' : '#0068FC',
    error: darkMode ? '#FD4040' : '#FF1763',
    success: darkMode ? '#27AE60' : '#2DBB2D',
    warning: '#555555',
    destructive: '#FF1763',
    // dont wanna forget these blue yet
    blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    blue5: '#5a63ff',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
    border: darkMode ? '#5a63ff' : 'none',
  }
}

function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

/**
 * Preset styles of the Rebass Text component
 */
export const ThemedText = {
  Main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  Link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  Label(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },
  Black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  White(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  Body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  LargeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  MediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  SubHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  Small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  Blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  Yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />
  },
  DarkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  Gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  Italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  Error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
  Red(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'red4'} {...props} />
  },
}

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg0} !important;
}

a {
 color: ${({ theme }) => theme.blue1}; 
}
`
