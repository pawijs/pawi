import { build, settings } from '@pawi/build'
import { Drag } from '@pawi/dragdrop'
import { locale } from '@pawi/locale'
import { shortcuts } from '@pawi/shortcuts'
import { TStories } from '@pawi/story'
import { styled as styledBlock, StyledSettings } from '@pawi/styled'
import { theme, ThemeSettings } from '@pawi/theme'
import { mutate } from 'overmind'
import { createHook } from 'overmind-react'
import * as React from 'react'
import { editor, EditorSettings, newComposition, ParagraphProps } from '..'
import { Comp, styled } from '../app'
import { rangeSelection } from '../lib/utils/rangeSelection'
import {
  makeComposition,
  mockComposition,
  mockRef,
} from '../lib/utils/testUtils'
import { editor_titleExtra } from '../types'

export { makeComposition } from '../lib/utils/testUtils'

// We need to put this here as the base composition created for testing uses
// makeRef and we do not want paragraph ids to change in snapshot on every
// test run...
mockRef()

const useOvermind = createHook<Config>()

export interface MyParaProps extends ParagraphProps {}

export const wrapper: Comp = ({ children }) => (
  <div>
    <Drag />
    {children}
  </div>
)

const CustomDiv = styled.div`
  padding: 5px;
`

const CustomSlider = styled.input`
  display: block;
`

export const MyPara: Comp<MyParaProps> = ({ data, holder }) => {
  const app = useOvermind()
  const change = app.actions.editor.dataChange
  return (
    <CustomDiv>
      {data.value}
      <CustomSlider
        type="range"
        min={0}
        max={1}
        onInput={e => e.stopPropagation()}
        onChange={e => {
          e.preventDefault()
          e.stopPropagation()
          const target = e.target as HTMLInputElement
          change({ holder, data, values: { value: target.value } })
        }}
        step={0.01}
        value={data.value}
      />
    </CustomDiv>
  )
}

function makeComposition2(type: 'selection' | 'emptyParagraph' | 'paragraph') {
  const composition = newComposition({ title: 'Hop' })
  composition.g['para2'] = typeObject(composition.g['para2'], {
    i: 'Some text here.',
    p: 1,
    t: 'P',
    s: rangeSelection(['para2'], 5, ['para2'], 9),
  })
  composition.spath = 'para2'
  composition.toolbox = { type, position: { top: 0, left: 60 } }
  return composition
}

const createComposition = mutate(({ state }: { state: any }, value: string) => {
  state.test[value] = newComposition({ title: true })
})

export interface TestChildProps {
  className?: string
}

const TWrapper = styled.div`
  padding: 20px;
`

export const TestChild: Comp<TestChildProps> = ({ className }) => {
  const ctx = useOvermind()
  if (!ctx.state.test.showTitleChildren) {
    return null
  }
  return <TWrapper className={className}>Some stuff in title</TWrapper>
}

const test = {
  name: 'test',
  settings: settings<EditorSettings & ThemeSettings & StyledSettings>({
    styled: {
      family: {
        [editor_titleExtra]: {
          testChild: TestChild,
        },
      },
    },
    editor: {
      paragraphs: {
        X: {
          toolboxComponent: 'X',
          // On paragraph create
          init: () => ({
            value: Math.random(),
            data: {},
          }),
          component: MyPara,
        },
      },
    },
    theme: {
      default: {
        pageWidth: '500px',
      },
    },
  }),
  state: {
    test: {
      showTitleChildren: false,
      e1: {
        title: 'Hello Editor',
        composition: makeComposition({ title: 'Hello Editor' })
          .addParagraph('foo', {
            p: 1,
            t: 'P',
            g: {
              one: { p: 0, t: 'T', i: 'One ' },
              two: { p: 1, t: 'B', i: 'more' },
              three: { p: 2, t: 'T', i: ' time.' },
            },
          })
          .addParagraph('bar', { p: 2, t: 'P', c: 'X' })
          .setData('bar', { value: 0.5 })
          .addParagraph('baz', { p: 3, t: 'P', i: '' })
          .done(),
      },
      e2: { composition: newComposition({ title: true }) },
      e3: { composition: newComposition() },
      e4: {
        title: 'Many Pages',
        composition: newComposition({
          title: 'Many Pages',
          paragraphs: [
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu metus quis nunc commodo pharetra. Pellentesque accumsan tellus vitae tortor elementum, imperdiet lacinia metus facilisis.`,
            `Aliquam sollicitudin felis at finibus placerat. Cras sed maximus ligula, a mattis sem.`,
            `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean elit nulla, fermentum nec rutrum vitae, placerat ut nibh. Nam ornare at nunc vel porta. Fusce sed porta nibh. Phasellus at leo tortor.`,
            `Morbi in placerat nisl. Aenean non metus malesuada, pulvinar nunc vitae, rhoncus ex. Suspendisse tincidunt posuere cursus. Curabitur laoreet aliquam velit vitae faucibus. Vestibulum pretium euismod tortor. Aenean hendrerit neque nibh, et posuere nisl feugiat vel.`,
            `In hac habitasse platea dictumst. Morbi sagittis neque eget facilisis viverra. Suspendisse elit ex, cursus at odio at, tempor vestibulum lectus.`,
            `Cras diam lorem, sollicitudin ut velit sed, congue semper felis. Donec accumsan elit nec vestibulum sollicitudin. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ex nibh, vestibulum eget lacus id, commodo maximus dui. Duis facilisis, lorem eget euismod finibus, sem erat vestibulum nunc, malesuada porttitor massa mauris non arcu. Nulla dictum justo ac dui venenatis ullamcorper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent nec ante nibh. Duis id maximus nibh. In at sagittis ipsum. Vestibulum urna felis, dapibus sed nulla in, efficitur tristique dolor.`,
          ],
        }),
      },
      e5: { title: 'Just a title' },
      e6: {},
      e7: { composition: mockComposition() },
      t1: { composition: makeComposition2('selection') },
      t2: { composition: makeComposition2('paragraph') },
      t3: { composition: makeComposition2('emptyParagraph') },
      c1: {
        title: 'Columns',
        composition: newComposition({
          title: 'Columns',
          paragraphs: [
            `Lorem ipsum dolor sit amet.`,
            {
              o: { u: 'l' },
              i: `Aliquam sollicit.`,
            },
            {
              o: { u: 'l', l: 'ol' },
              i: `Foo bar.`,
            },
            {
              o: { u: 'l', l: 'ol' },
              i: `Baz bom.`,
            },
            {
              o: { u: 'r', a: 'l' },
              i: `Felis at finibus placerat. Cras sed maximus ligula, a mattis sem.`,
            },
            {
              o: { u: 'r', a: 'l' },
              i: `Proin euismod.`,
            },
            `Vestibulum ante ipsum primis in.`,
            `Morbi in placerat nisl. Aenean non metus malesuada, pulvinar nunc vitae, rhoncus ex. Suspendisse tincidunt posuere cursus. Curabitur laoreet aliquam velit vitae faucibus. Vestibulum pretium euismod tortor. Aenean hendrerit neque nibh, et posuere nisl feugiat vel.`,
            { o: { u: 'l' }, i: `In hac habitasse platea dictumst.` },
            `Cras diam lorem, sollicitudin ut velit sed, congue semper felis. Donec accumsan elit nec vestibulum sollicitudin. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ex nibh, vestibulum eget lacus id, commodo maximus dui. Duis facilisis, lorem eget euismod finibus, sem erat vestibulum nunc, malesuada porttitor massa mauris non arcu. Nulla dictum justo ac dui venenatis ullamcorper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent nec ante nibh. Duis id maximus nibh. In at sagittis ipsum. Vestibulum urna felis, dapibus sed nulla in, efficitur tristique dolor.`,
          ],
        }),
      },
    },
  },
  actions: {
    test: {
      createComposition,
    },
  },
}

export const config = build(test)
  .using(editor)
  .using(locale)
  .using(styledBlock)
  .using(shortcuts)
  .using(theme)
  .config()

export type Config = typeof config
export type Stories<Props = any> = TStories<Config, Props>

// Helper to set a deep path in state while ensuring type is
// correct.
export function setPath<T>(ref: T, elem: Partial<T>): any {
  const tag = ref as any
  const paths: string[] = tag.getPath({}).split('.') // no vars here
  const last = paths.pop()
  if (!last) {
    throw new Error(`Invalid reference path (too short): '${paths.join('.')}'.`)
  }
  const base: any = {}
  const obj = paths.reduce((curr, key) => (curr[key] = {}), base)
  obj[last] = elem
  return base
}

// Helper to ensure path of a given element
export function typeObject<T>(ref: T, elem: Partial<T>): T {
  return elem as T
}
