import * as React from 'react'
import { Comp, styled } from '../../app'
import { VListContext } from './VTable'

export interface VRowProps<T = any> {
  className?: string
  item: T
  component: Comp<{ item: T }>
  index: number
  height: number
  style: React.CSSProperties
}

/*
.message {
  white-space: pre-line;
  grid-area: message;
  display: inline-block;
  position: relative;
  padding: 6px;
  background-color: yellow;
  border: 2px #fff solid;
  box-sizing: border-box;
  border-radius: 6px;
  margin: 6px;
  font-size: 16px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  line-height: 1.375;
  font-weight: normal;
  word-break: normal;
}
*/
const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

export const VRow: Comp<VRowProps> = ({
  item,
  index,
  component: Comp,
  height,
}) => {
  const { setHeight, width } = React.useContext(VListContext)
  const ref = React.useRef<HTMLDivElement>()
  React.useEffect(() => {
    if (ref.current) {
      const h = ref.current.getBoundingClientRect().height
      if (h !== height) {
        console.log('SET', h)
        setHeight(index, h)
      }
    }
  }, [width])
  return (
    <Wrapper ref={ref as any}>
      <Comp item={item} />
    </Wrapper>
  )
}
