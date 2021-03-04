import * as React from 'react'

import { Comp, useOvermind } from '../app'

export interface PreloadProps {}

/** This component is used for complex editor components that
 * we do not want to load/unload completely but simply
 * hide them.
 */
export const Preload: Comp<PreloadProps> = function Preload() {
  const app = useOvermind()
  const editor = app.state.editor.options()
  const { preload } = editor
  return (
    <div>
      {preload.map((Tag, idx) => (
        <Tag key={idx} />
      ))}
    </div>
  )
}
