import * as React from 'react'
import { VariableSizeList as List } from 'react-window'
import { Comp, styled } from '../../app'
import { VRow } from './VRow'
// https://codesandbox.io/s/dynamic-size-of-react-window-list-items-64o9p
export interface VTableProps<T> {
  className?: string
  component: Comp<{ item: T }>
  list: T[]
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

export const VListContext = React.createContext({
  setHeight(index: number, height: number) {},
  width: 100,
})

export function VTable<T>({ className, list, component }: VTableProps<T>) {
  // useRef because the mutation is triggered from outside this
  // component ?
  const listRef = React.useRef<List>(null)
  const sizeMap = React.useRef<{ [key: number]: number }>({})
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ width: 100, height: 100 })
  const setHeight = React.useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size }
  }, [])
  const getHeight = React.useCallback(
    (index: number) => sizeMap.current![index] || 50,
    []
  )
  React.useEffect(() => {
    if (ref.current) {
      const obs = new ResizeObserver(entries => {
        const rect = entries[0].contentRect
        setSize({ width: rect.width, height: rect.height })
      })
      obs.observe(ref.current)
      if (listRef.current) {
        listRef.current.resetAfterIndex(0)
        listRef.current.scrollToItem(list.length - 1, 'end')
      }
      return () => {
        obs.disconnect()
      }
    }
    return () => {}
  })

  /*

  handleScroll = () => {
    const { chatHistory } = this.state;
    this.listRef.current.resetAfterIndex(0);
    this.listRef.current.scrollToItem(chatHistory.length - 1, "end");
  };
  */
  return (
    <VListContext.Provider value={{ setHeight, width: size.width }}>
      <Wrapper ref={ref as any} className={className}>
        {list.length > 0 && (
          <List
            height={size.height}
            itemCount={list.length}
            itemSize={getHeight}
            width="100%"
            ref={listRef}
          >
            {({ index, style }) => (
              <VRow
                style={style}
                height={getHeight(index)}
                index={index}
                item={list[index]}
                component={component}
              />
            )}
          </List>
        )}
      </Wrapper>
    </VListContext.Provider>
  )
}
