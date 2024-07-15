import { useState } from 'react'
import { ImageProps } from 'rebass'
import styled from 'styled-components/macro'

// import useTheme from '../../hooks/useTheme'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

const DefaultImg = styled.div<{ textLength: number }>`
  --size: 28px;
  border-radius: 100px;
  color: rgb(255, 255, 255);
  background-color: ${({ theme }) => theme.primary1} !important;
  font-size: ${({ theme, textLength }) => 28 / textLength}px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, style, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  // const theme = useTheme()
  const logoName = alt?.replace(' logo', '')
  const src: string | undefined = srcs.find((src) => !BAD_SRCS[src])

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        style={style}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }
  return (
    <DefaultImg {...rest} style={{ ...style }} textLength={logoName?.length ?? 3}>
      <span>{logoName}</span>
    </DefaultImg>
  )
  // return <Slash {...rest} style={{ ...style, color: theme.bg4 }} />
}
