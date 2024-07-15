import React, { useState } from 'react'

import icon_user from '../../../assets/images/icon_user_512.png'
import Common from '../../../common/common'
import styles from './index.module.scss'

interface Props {
  image?: string
  size: number | 'FILL'
  noElevation?: boolean
  hoverEffect?: boolean
  margin?: number[]
  border?: boolean
  circle?: boolean
}
export default function Avatar(props: Props): JSX.Element {
  const [_imageLoadError, setImageLoadError] = useState<boolean>(false)

  const onImageLoadError = (): void => {
    setImageLoadError(true)
  }

  return (
    <span
      className={`
                    ${styles.container} 
                    ${props.size === 'FILL' ? styles.fill : ''}
                    ${props.noElevation === true ? styles.no_elevation : styles.elevation}
                    ${props.hoverEffect === true ? styles.hover_effect : ''}
                    ${props.circle === true ? styles.circle : ''}
                    ${Common.calculateMarginStyles(props.margin)}
                `}
      style={
        props.size !== 'FILL'
          ? {
              width: `${props.size}px`,
              height: `${props.size}px`,
              maxWidth: `${props.size}px`,
              maxHeight: `${props.size}px`,
              minWidth: `${props.size}px`,
              minHeight: `${props.size}px`,
            }
          : {}
      }
    >
      <span className={`${styles.border_container} ${props.border == null ? styles.no_border : ''}`}>
        <span
          className={`
                        ${styles.inner_container}
                        ${props.image != null && _imageLoadError === false ? styles.image_fill : styles.image_pad}
                    `}
        >
          <img
            src={props.image != null && _imageLoadError === false ? props.image : icon_user}
            onError={onImageLoadError}
            alt="avatar"
          />
        </span>
      </span>
    </span>
  )
}
