import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import * as React from 'react'
import { styled } from '../app'
import { makeEditor, sourceChanged } from '../helpers'

export interface CodeEditorProps {
  source: string
  lang: string
  id: string
  className?: string
  focus?: boolean
  keyMap?: 'vim'
  tab?: string
  onChange: (source: string) => void
  // typecheck: (arg: { filename: string; source: string }) => void
  onBlur?: () => void
}

const Wrapper = styled.div`
  .scrubbing {
    background: yellow;
  }

  .cm-number {
    border: 1px dashed rgba(0, 0, 0, 0);
    &.scrub {
      border: 1px dashed yellow;
      border-radius: 4px;
      cursor: move;
    }
  }

  .CodeMirror-overlayscroll-horizontal div,
  .CodeMirror-overlayscroll-vertical div {
    background: #333;
  }

  .CodeMirror {
    padding: 10px;
    min-height: 1rem;
    height: auto;
  }

  .CodeMirror-code {
    font-size: 1rem;
  }

  .CodeMirror-linewidget {
    background: #353030;
    border-top: 1px dashed #899266;
    color: #959663;
    left: -1px;
    margin-top: 4px;
    padding: 4px;
    padding-left: 0px;
    width: 460px;
  }
`

export class CodeEditor extends React.Component<CodeEditorProps> {
  private cm: any

  create(el: any) {
    const { props } = this
    if (this.cm === undefined) {
      const onSave = (filename: string, source: string) => {
        this.props.onChange(source)
      }

      const typecheck = (filename: string, source: string) => {
        // not used for now
        // this.props.typecheck({ filename, source })
      }

      const id = props.id
      this.cm = false
      setTimeout(() => {
        this.cm = makeEditor(
          el,
          props.source || '',
          props.lang || 'ts',
          {
            onSave,
            onBlur: props.onBlur,
            typecheck,
          },
          { autofocus: props.focus, keyMap: props.keyMap }
        )
        // FIXME: source changed (compile)
        sourceChanged(this.cm, props.lang, props.source, {
          id,
        } as any)
        // FIXME: focus...
      }, 100)
    }
  }

  render() {
    const { props } = this

    if (this.cm) {
      /*
        const errors = this.props.errors
        this.cm.operation
        ( () => {
            const doc = cm.getDoc ()
            for ( const v of ederror ) {
              doc.removeLineWidget ( v )
            }
            ederror.length = 0
            showErrors ( errors )
          }
        )
        */
    }

    if (this.cm) {
      const id = props.id
      sourceChanged(this.cm, props.lang, props.source, { id } as any)
    }

    return (
      <Wrapper
        className={this.props.className}
        onClick={e => e.stopPropagation()}
      >
        <div className="codeholder" ref={el => this.create(el)} />
      </Wrapper>
    )
  }
}
