import React from 'react'
import styled from 'styled-components/macro'
interface TextParagraphProps {
  fontSize: string
  fontWeight: number
  color: string
  children: any
}
const Paragraph = styled.p<{ fontSize: string; fontWeight: number; color: string }>`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ color }) => color};

  @media screen and (max-width: 1000px) {
    font-size: 15px;
    text-align: center;
  }
  @media screen and (max-width: 765px) {
    font-size: 15px;
    text-align: center;
  }
  @media screen and (max-width: 400px) {
    text-align: center;
    font-size: 13px;
  }
  @media screen and (max-width: 350px) {
    text-align: center;
    font-size: 10px;
  }
`
const ParagraphText = ({ children, fontSize, fontWeight, color, ...props }: TextParagraphProps) => {
  return (
    <Paragraph fontSize={fontSize} fontWeight={fontWeight} color={color} {...props}>
      {children}
    </Paragraph>
  )
}
export default ParagraphText
