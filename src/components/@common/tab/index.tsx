import { IconProp } from '@fortawesome/fontawesome-svg-core'
import React, { useEffect, useState } from 'react'

import Common from '../../../common/common'
import Button from '../button'
import styles from './index.module.scss'

interface Props {
  size?: 'LARGE' | 'MEDIUM' | 'SMALL'
  options: Array<{
    id: string | number
    content: IconProp | string
  }>
  margin?: number[]
  initialSelectedId?: string | number
  onSelectionChange: (id: string | number) => void
}

export default function Tab(props: Props): JSX.Element {
  const [_selectedId, setSelectedId] = useState<string | number>(0)

  useEffect(() => {
    let selectedId: string | number = ''

    // Check we have some options available
    if (props.options.length > 0) {
      // Check if we've been given an initial selectedId
      if (props.initialSelectedId !== undefined) {
        const item = props.options.find((i) => i.id === props.initialSelectedId)
        if (item !== undefined) {
          selectedId = item.id
        }
      }

      // Check if selectedId is null still - if it is then we'll pre-select the first item
      if (selectedId === '') {
        selectedId = props.options[0].id
      }
    }

    setSelectedId(selectedId)
  }, [])

  const onButtonClick = (
    option: {
      id: string | number
      content: IconProp | string
    },
    index: number
  ): void => {
    if (option.id !== _selectedId) {
      setSelectedId(option.id)

      if (props.onSelectionChange != null) {
        props.onSelectionChange(option.id)
      }
    }
  }

  return (
    <div
      className={`${styles.container} ${props.size === 'LARGE' ? styles.large : styles.medium}
      ${Common.calculateMarginStyles(props.margin)}`}
    >
      {props.options.map((option, index, array) => (
        <Button
          key={index}
          size={props.size}
          type={option.id === _selectedId ? 'PRIMARY' : 'NAKED'}
          on={'LIGHT'}
          icon={typeof option.content === 'string' ? undefined : option.content}
          text={typeof option.content === 'string' ? option.content : undefined}
          noElevation={true}
          noWrap={true}
          margin={index === array.length - 1 ? [0] : [0, 1, 0, 0]}
          onClick={() => {
            onButtonClick(option, index)
          }}
        />
      ))}
    </div>
  )
}
