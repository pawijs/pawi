import * as React from 'react'

import { Table as component, TableRow } from '../..'
import { config, Stories } from '../helpers'
import { styled, Comp } from '../../app'
import { BottomTable } from '../../components'

const wrapper = styled.div`
  height: 200px;
  width: 200px;
`

export const tableStories: Stories<{}> = {
  component,
  config,
  wrapper,
  name: 'Table',
  stories: [
    {
      name: 'simple',
      children: Array.from({ length: 3 })
        .map((_, idx) => idx)
        .map(idx => (
          <TableRow key={idx}>
            Element
            {idx}
          </TableRow>
        )),
    },

    {
      name: 'BottomTable',
      component: BottomTable,
      children: Array.from({ length: 100 })
        .map((_, idx) => idx)
        .map(idx => (
          <TableRow key={idx}>
            Element
            {idx}
          </TableRow>
        )),
    },
  ],
}
