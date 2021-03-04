import * as React from 'react'
import { Comp, useOvermind } from '../app'

export interface DirectThemeProviderProps {
  scopeName?: string
  theme: {
    [key: string]: string
  }
  children?: React.ReactNode
}

export class DirectThemeProvider extends React.Component<
  DirectThemeProviderProps
> {
  private tag: HTMLStyleElement | undefined

  constructor(props: any) {
    super(props)
  }

  render() {
    // istanbul ignore else
    if (!this.tag) {
      this.tag = document.createElement('style')
      // istanbul ignore else
      if (document.head) {
        document.head.appendChild(this.tag)
      } else {
        throw new Error(`Cannot add CSS to document.head (head is null).`)
      }
    } else {
      this.tag.childNodes[0].remove()
    }
    const { children, scopeName, theme } = this.props
    const className = `theme-${scopeName || 'app'}`
    const css = Object.keys(theme)
      .sort()
      .map(key => `--${key}: ${theme[key]};`)
      .join('\n')
    this.tag.appendChild(document.createTextNode(`.${className} {\n${css}\n}`))
    return <div className={className}>{children}</div>
  }
}

export interface ThemeProviderProps {
  scopeName?: string
}

export const ThemeProvider: Comp<ThemeProviderProps> = ({
  children,
  scopeName,
}) => {
  const { state } = useOvermind()
  return (
    <DirectThemeProvider
      scopeName={scopeName}
      theme={state.theme.selectedTheme}
    >
      {children}
    </DirectThemeProvider>
  )
}
