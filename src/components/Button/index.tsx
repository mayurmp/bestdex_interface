import useTheme from 'hooks/useTheme'
import { darken } from 'polished'
import { Check, ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps as ButtonPropsOriginal } from 'rebass/styled-components'
import styled from 'styled-components/macro'

import { RowBetween } from '../Row'

type ButtonProps = Omit<ButtonPropsOriginal, 'css'>

export const BaseButton = styled(RebassButton)<
  {
    padding?: string
    width?: string
    $borderRadius?: string
    altDisabledStyle?: boolean
  } & ButtonProps
>`
  padding: ${({ padding }) => padding ?? '16px'};
  width: ${({ width }) => width ?? '100%'};
  font-weight: 500;
  text-align: center;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '20px'};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`

export const ButtonPrimary = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bydefault};
  color: white;
  &:focus {
    background-color: ${({ theme }) => theme.bydefault};
  }
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  &:active {
    box-shadow: 0px 0px 0px 4px rgba(90, 99, 255, 0.2), 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    background-color: ${({ theme }) => theme.bydefault};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.primary1 : theme.bg2) : theme.disabled};
    color: ${({ altDisabledStyle, disabled, theme }) =>
      altDisabledStyle ? (disabled ? theme.white : theme.text2) : theme.disabledFontColor};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ theme }) => (theme.darkMode ? 0.4 : 0.7)};
  }
`

export const ButtonLight = styled(BaseButton)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonGray = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
  }
`

export const ButtonSecondary = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.secondary1};
  color: ${({ theme }) => theme.primaryText2};
  background-color: ${({ theme }) => theme.secondary1};
  font-size: 16px;
  border-radius: 18px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.secondary1)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.secondary1)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.secondary1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonOutlined = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonYellow = styled(BaseButton)`
  background-color: ${({ theme }) => theme.yellow3};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.yellow3)};
    background-color: ${({ theme }) => darken(0.05, theme.yellow3)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.yellow3)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.yellow3)};
    background-color: ${({ theme }) => darken(0.1, theme.yellow3)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.yellow3};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(BaseButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonText = styled(BaseButton)`
  padding: 0;
  width: fit-content;
  background: none;
  text-decoration: none;
  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text-decoration: underline;
  }
  &:hover {
    // text-decoration: underline;
    opacity: 0.9;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text1};
  /* border: 1px solid ${({ theme }) => theme.green1}; */

  &:disabled {
    /* opacity: 50%; */
    background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text2};
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(BaseButton)`
  background-color: ${({ theme }) => theme.red1};
  // border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    // box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => theme.red1};
  }
  &:hover {
    background-color: ${({ theme }) => theme.redHover};
  }
  &:active {
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    background-color: ${({ theme }) => theme.red1};
    border: 2px solid rgba(254, 228, 226, 0.5);
  }
  &:disabled {
    // opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.redDisabled};
    border: 1px solid ${({ theme }) => theme.redDisabled};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export const PrimaryBlueButton = styled(ButtonSecondary)`
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  background-color: ${({ theme }) => theme.bydefault};
  border: none;
  font-weight: 500;
  :hover {
    background-color: ${({ theme }) => theme.hover};
  }
  :focus {
    outline: none;
    color: ${({ theme }) => theme.primaryText2};
    background-color: ${({ theme }) => theme.bydefault};
  }
  :active {
    background-color: ${({ theme }) => theme.bydefault};
    box-shadow: 0px 0px 0px 4px rgba(90, 99, 255, 0.2), 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  }
`
const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary1};
`

const Circle = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary1};
  display: flex;
  align-items: center;
  justify-content: center;
`

const CheckboxWrapper = styled.div`
  width: 20px;
  padding: 0 10px;
  position: absolute;
  top: 11px;
  right: 15px;
`

const ResponsiveCheck = styled(Check)`
  size: 13px;
`

export enum ButtonSize {
  small,
  medium,
  large,
}

export function ButtonRadioChecked({ active = false, children, ...rest }: { active?: boolean } & ButtonProps) {
  const theme = useTheme()

  if (!active) {
    return (
      <ButtonOutlined $borderRadius="12px" padding="12px 8px" {...rest}>
        {<RowBetween>{children}</RowBetween>}
      </ButtonOutlined>
    )
  } else {
    return (
      <ActiveOutlined {...rest} padding="12px 8px" $borderRadius="12px">
        {
          <RowBetween>
            {children}
            <CheckboxWrapper>
              <Circle>
                <ResponsiveCheck size={13} stroke={theme.white} />
              </Circle>
            </CheckboxWrapper>
          </RowBetween>
        }
      </ActiveOutlined>
    )
  }
}
