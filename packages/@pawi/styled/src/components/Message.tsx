import * as React from 'react'
import { Comp, styled, theme, useOvermind } from '../app'
import { Icon } from './Icon'

// import { Markdown } from 'styled/Markdown'

const GrowDiv = styled.div`
  flex-grow: 1;
`

const TheIcon = styled(Icon)`
  margin-left: 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export interface TextProps {
  className?: string
  replace?: { [key: string]: string }
  // Text (not translated).
  text?: string
  // Text (translated).
  textKey?: string
}

export interface MessageProps extends TextProps {
  icon?: string | boolean
  spin?: boolean
}

export const Text: Comp<TextProps> = ({
  className,
  replace,
  text,
  textKey,
}) => {
  const { state } = useOvermind()
  const translate = state.locale.translate
  const theText = textKey ? translate(textKey, replace) : text
  return <span className={className}>{theText}</span>
}

const MessageComponent: Comp<MessageProps> = ({
  children,
  className,
  icon,
  spin,
  ...props
}) => {
  useOvermind()
  return (
    <Wrapper className={className}>
      <GrowDiv>
        {typeof icon === 'string' ? (
          <TheIcon spin={spin} icon={icon} />
        ) : icon && props.textKey ? (
          <TheIcon spin={spin} icon={props.textKey} />
        ) : null}
        <Text {...props} />
        {children}
      </GrowDiv>
    </Wrapper>
  )
}

export const Message = styled(MessageComponent)`
  text-align: left;
  line-height: 1.5rem;
  margin: ${theme.messageMargin};
  margin-bottom: 0;
`
