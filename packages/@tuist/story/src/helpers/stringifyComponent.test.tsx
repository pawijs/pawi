import * as React from 'react'

import { IS_PROXY, ProxyStateTree } from 'proxy-state-tree'
import { expect, it } from 'test'

import { build } from '@tuist/build'
import { stringifyComponent } from './stringifyComponent'

const app = build({
  name: 'app',
  state: { foo: { bar: { baz: 'baz value' } } },
}).app()

function MyThing(props: any) {
  return null
}

function OtherThing(props: any) {
  return null
}

class MyClass extends React.Component<any> {
  reder() {
    return null
  }
}

it('should check proxy', () => {
  const tree = new ProxyStateTree({ foo: { bar: { baz: 'hop' } } })
  const s = tree.state as any
  expect(s.foo.bar[IS_PROXY]).toBe(true)
})

it('should show component name', () => {
  expect(stringifyComponent(MyThing)).toBe(`<MyThing />`)
})

it('should show component props', () => {
  expect(stringifyComponent(MyThing, { foo: 'hello' })).toBe(
    `<MyThing foo="hello" />`
  )
})

it('should handle quote', () => {
  expect(stringifyComponent(MyThing, { foo: '5"' })).toBe(
    `<MyThing foo="5\\"" />`
  )
})

it('should show number', () => {
  expect(stringifyComponent(MyThing, { foo: 5 })).toBe(`<MyThing foo={5} />`)
})

it('should show null', () => {
  expect(stringifyComponent(MyThing, { foo: null })).toBe(
    `<MyThing foo={null} />`
  )
})

it('should show undefined', () => {
  expect(stringifyComponent(MyThing, { foo: undefined })).toBe(
    `<MyThing foo={undefined} />`
  )
})

it('should show function', () => {
  expect(stringifyComponent(MyThing, { foo: function bar() {} })).toBe(
    `<MyThing foo={function bar} />`
  )
})

it('should show tag', () => {
  expect(stringifyComponent(MyThing, { foo: app.state.foo.bar })).toBe(
    `<MyThing foo={app.state.foo.bar} />`
  )
})

it('should show children', () => {
  expect(
    stringifyComponent(MyThing, {
      foo: app.state.foo.bar,
      children: (
        <div>
          hop
          <span>x</span>
        </div>
      ),
    })
  ).toBe(`<MyThing foo={app.state.foo.bar}>
  <div>
    hop
    <span>x</span>
  </div>
</MyThing>`)
})

it('should show complex children with props', () => {
  expect(
    stringifyComponent(MyThing, {
      foo: app.state.foo.bar,
      children: (
        <OtherThing name="bong" icon>
          <MyClass foo="bar">
            <span>x</span>
          </MyClass>
        </OtherThing>
      ),
    })
  ).toBe(`<MyThing foo={app.state.foo.bar}>
  <OtherThing name="bong" icon>
    <MyClass foo="bar">
      <span>x</span>
    </MyClass>
  </OtherThing>
</MyThing>`)
})
