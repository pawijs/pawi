import classnames from 'classnames'
import * as React from 'react'
import { Comp, styled, theme } from '../app'
import { Message } from './Message'

export interface ErrorMessageProps {
  // Styling
  className?: string
  // Error name (translated)
  errorKey?: string
  // Error (not translated)
  error?: string
  // Show an icon in the error
  icon?: string | boolean
  // Replace
  replace?: { [key: string]: string }
}

const Err: Comp<ErrorMessageProps> = ({
  className,
  error,
  errorKey,
  icon,
  replace,
}) => {
  if (!errorKey && !error) {
    return null
  }
  return (
    <Message
      className={classnames({ error: true }, className)}
      icon={icon}
      textKey={errorKey}
      text={error}
      replace={replace}
    />
  )
}

export const ErrorMessage = styled(Err)`
  background: ${theme.errorMessageBackground};
  color: ${theme.errorMessageColor};
  border: ${theme.errorMessageBorder};
  padding: ${theme.errorMessagePadding};
  border-radius: ${theme.errorMessageBorderRadius};
`
