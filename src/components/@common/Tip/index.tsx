import { Box } from 'rebass'
import styled from 'styled-components/macro'
interface props {
  children: React.ReactNode
}
const TipBox = styled(Box)`
  background-color: #e2f1fa;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 95%;
  max-width: 420px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
`
export default function Tip({ children, ...propsData }: props) {
  return <TipBox {...propsData}>{children}</TipBox>
}
