import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../../app'
import { Icon } from '../Icon'

// import { Markdown } from 'styled/Markdown'

export const TitleText = styled.div`
  flex-grow: 1;
  margin: ${theme.titleTextMargin};
`
TitleText.displayName = 'Text'

const TheIcon = styled(Icon)`
  margin-left: 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.cardTitleBackground};
  border: ${theme.cardBorder};
  &:not(.single) {
    border-bottom: none;
  }
  &.single {
    border-radius: ${theme.cardBorderRadius};
  }
  &.error {
    background: ${theme.cardTitleErrorBackground};
  }
  &.hasClick {
    cursor: pointer;
  }
  border-top-left-radius: ${theme.cardBorderRadius};
  border-top-right-radius: ${theme.cardBorderRadius};
  color: ${theme.cardTitleColor};
  position: relative;
  text-align: left;
`

export interface CardTitleProps {
  className?: string
  onClick?: () => void
  // Title (not translated).
  title?: string
  // Title (translated).
  titleKey?: string
  // type?: string
  icon?: string
  spin?: boolean
  // Title without card (round all borders)
  single?: boolean
  // Add .error class and colors
  isError?: boolean
}

export const CardTitle: Comp<CardTitleProps> = ({
  children,
  className,
  icon,
  onClick,
  single,
  spin,
  title,
  titleKey,
  isError,
}) => {
  const { state } = useOvermind()
  let theText = titleKey ? state.locale.translate(titleKey) : title
  return (
    <Wrapper
      className={classnames(
        { single, hasClick: onClick !== undefined, error: isError },
        className
      )}
      onClick={onClick}
    >
      <TitleText>
        {icon ? <TheIcon spin={spin} icon={icon} /> : null}
        {theText}
        {children}
      </TitleText>
    </Wrapper>
  )
}
