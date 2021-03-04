import * as React from 'react'

import { SelectParagraphOption } from '../lib/utils/types'

export const B: SelectParagraphOption = {
  op: 'B',
  accel: 'cmd+b',
  toolboxComponent: <i className="strong">B</i>,
  showOn: { selection: true },
}

export const I: SelectParagraphOption = {
  op: 'I',
  accel: 'cmd+i',
  toolboxComponent: <i className="em">I</i>,
  showOn: { selection: true },
}

/*
export const A: SelectParagraphOption = {
  op: 'A',
  toolTag: <i className="em">link</i>,
  showOn: { selection: true },
}
*/
