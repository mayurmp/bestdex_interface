import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'

import Common from '../../../common/common'
import { ButtonType } from '../../../common/types'
import Avatar from '../avatar'
import styles from './index.module.scss'

interface Props {
  id?: string
  icon?: IconProp | number
  iconPosition?: 'LEFT' | 'RIGHT'
  iconColor?: string
  avatar?: string
  image?: string
  text?: string | ReactElement
  type?: ButtonType
  on?: 'LIGHT' | 'DARK' | 'IMAGE'
  size?: 'XLARGE' | 'LARGE' | 'MEDIUM' | 'SMALL'
  disabled?: boolean
  loading?: boolean
  noElevation?: boolean
  center?: boolean
  fillWidth?: boolean
  noWrap?: boolean
  margin?: number[]
  fontColor?: string
  borderRadius?: string
  children?: React.ReactNode
  onClick?: (id: null | string) => void
  onMouseDown?: (id: null | string) => void
  fontWeight?: any
  backgroundColor?: any
  border?: string
}
export default function Button(props: Props): JSX.Element {
  const onClick = (): void => {
    if (props.disabled !== true && props.onClick !== undefined) {
      props.onClick(props.id != null ? props.id : null)
    }
  }

  const onMouseDown = (): void => {
    if (props.disabled !== true && props.onMouseDown !== undefined) {
      props.onMouseDown(props.id != null ? props.id : null)
    }
  }

  const renderIcon = () => {
    return props.icon !== undefined && props.loading === true ? (
      <span
        className={`${styles.icon_container} ${styles.loading}`}
        style={props.iconColor !== undefined ? { color: props.iconColor } : {}}
      >
        <FontAwesomeIcon icon={faSpinner} />
      </span>
    ) : props.icon != null && typeof props.icon === 'number' ? (
      <span
        className={`${styles.icon_container} ${styles.numeric} notification_count`}
        style={props.iconColor !== undefined ? { color: props.iconColor } : {}}
      >
        {props.icon}
      </span>
    ) : props.icon !== undefined && typeof props.icon !== 'number' ? (
      <span
        className={`${styles.icon_container}`}
        style={props.iconColor !== undefined ? { color: props.iconColor } : {}}
      >
        <FontAwesomeIcon icon={props.icon} />
      </span>
    ) : props.avatar != null ? (
      <span className={`${styles.avatar_container}`}>
        <Avatar
          image={props.avatar}
          noElevation={true}
          hoverEffect={false}
          size={props.size === 'XLARGE' ? 48 : props.size === 'LARGE' ? 40 : props.size === 'SMALL' ? 24 : 32}
        />
      </span>
    ) : (
      props.image != null && (
        <span className={`${styles.avatar_container}`}>
          <Avatar
            image={props.image}
            noElevation={true}
            hoverEffect={false}
            size={props.size === 'XLARGE' ? 48 : props.size === 'LARGE' ? 40 : props.size === 'SMALL' ? 24 : 32}
            circle={true}
          />
        </span>
      )
    )
  }

  return (
    <button
      type={'button'}
      style={
        props.borderRadius
          ? { borderRadius: props.borderRadius }
          : {} || props.backgroundColor
          ? { backgroundColor: props.backgroundColor }
          : {} || props.border
          ? { border: props.border }
          : {}
      }
      className={`
          ${styles.container}
          ${props.text === undefined && props.children === undefined ? styles.no_text : ''}
          ${props.noElevation === true ? styles.no_elevation : ''}
          ${props.iconPosition === 'RIGHT' ? styles.right_icon : ''}
          ${
            props.size === 'XLARGE'
              ? styles.xl
              : props.size === 'LARGE'
              ? styles.l
              : props.size === 'SMALL'
              ? styles.s
              : styles.m
          }
          ${
            props.type === 'DESTRUCTIVE'
              ? styles.type_destructive
              : props.type === 'NAKED'
              ? styles.type_naked
              : props.type === 'SECONDARY'
              ? styles.type_secondary
              : props.type === 'CONTENT_ONLY'
              ? styles.type_content_only
              : props.type === 'HERO'
              ? styles.type_hero
              : styles.type_primary
          }
          ${props.on === 'IMAGE' ? styles.on_image : props.on === 'DARK' ? styles.on_dark : styles.on_light}
          ${props.center === true ? styles.center : ''}
          ${props.fillWidth === true ? styles.fill_width : ''}
          ${props.disabled === true ? styles.disabled : ''}
          ${Common.calculateMarginStyles(props.margin)}
      `}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {props.children ? (
        <span className={styles.inner_container}>
          <span
            className={`${styles.text_container} ${styles.no_icon} ${props.noWrap}`}
            style={{ color: props.fontColor, fontWeight: props.fontWeight }}
          >
            {props.children}
          </span>
        </span>
      ) : (
        <span style={props.borderRadius ? { borderRadius: props.borderRadius } : {}} className={styles.inner_container}>
          {props.iconPosition !== 'RIGHT' && renderIcon()}
          {props.text != null && (
            <span
              role="presentation"
              style={
                props.fontWeight && props.fontColor
                  ? { color: props.fontColor, fontWeight: props.fontWeight }
                  : props.fontColor
                  ? { color: props.fontColor }
                  : props.fontWeight
                  ? { fontWeight: props.fontWeight }
                  : {}
              }
              className={`
              ${styles.text_container} 
              ${props.icon == null ? styles.no_icon : ''}
              ${props.noWrap != null ? styles.no_wrap : ''}
            `}
            >
              {props.text}
            </span>
          )}
          {props.iconPosition === 'RIGHT' && renderIcon()}
        </span>
      )}
    </button>
  )
}
