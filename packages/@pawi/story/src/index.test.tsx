import * as React from 'react'
import renderer from 'react-test-renderer'
import simple from 'simple-mock'
import { describe, expect, it } from 'test'

import { makeApp } from './'
import { StoryDisplay } from './components/StoryDisplay'
import { Stories, Story } from './types'

const component = ({ name }: { name: string }) => <div>This is {name}</div>

const NoProps: Story = {
  name: 'NoProps',
  component,
  titleClick() {},
}

const SimpleProps: Story = {
  name: 'Simple',
  component,
  props: { name: 'foo' },
}

const WithClick: Story = {
  name: 'withClick',
  component,
  titleClick() {},
  props: { name: 'foo' },
}

const stories: Stories = {
  name: 'Foo',
  stories: [NoProps, SimpleProps, WithClick],
}

describe('stories', () => {
  it('should render stories without error', () => {
    const App = makeApp({}, { stories })
    const tree = renderer.create(<App />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

interface ErrorProps {
  errors: string[]
}

class ErrorCatcher extends React.Component<ErrorProps> {
  constructor(props: ErrorProps) {
    super(props)
  }

  componentDidCatch(error: Error) {
    this.props.errors.push(error.message)
  }

  render() {
    return this.props.children
  }
}

it('should throw on missing component', () => {
  const bang: Story = {
    name: 'Bang',
  }
  const stories: Stories = {
    name: 'Fail stories',
    stories: [],
  }
  const errors: string[] = []
  simple.mock(console, 'error').callFn(() => {})
  renderer.create(
    <ErrorCatcher errors={errors}>
      <StoryDisplay stories={stories} story={bang} />
    </ErrorCatcher>
  )
  expect(errors).toEqual([
    "Invalid story 'Bang' in 'Fail stories': missing component.",
  ])
  simple.restore()
})
