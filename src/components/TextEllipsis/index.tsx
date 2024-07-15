import styled from 'styled-components/macro'
interface TextEllipsisProps {
  maxWidth: string
  children: any
}

const FixedWidthDiv = styled.div<{ maxWidth: string }>`
  text-overflow: ellipsis;
  max-width: ${({ maxWidth }) => maxWidth};
  overflow: hidden;
  text-align: right;
`
const TextEllipsis = ({ children, maxWidth }: TextEllipsisProps) => {
  return <FixedWidthDiv maxWidth={maxWidth}>{children}</FixedWidthDiv>
}
export default TextEllipsis
