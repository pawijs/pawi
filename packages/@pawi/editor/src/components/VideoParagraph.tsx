import { Field } from '@pawi/styled'
import * as React from 'react'
import { Comp, styled, useOvermind } from '../app'
import { ParagraphProps } from '../lib'
import { doPasteText } from '../settings/editor/paste/pasteText'
import { VideoData } from '../settings/editor/videoParagraph'

export type VideoParagraphProps = ParagraphProps<VideoData>

export const VideoParagraph: Comp<VideoParagraphProps> = ({ data }) => {
  useOvermind()

  const { videoId, type } = data
  // rel=0 to not show related videos
  const iframeSrc =
    type === 'Vimeo'
      ? `//player.vimeo.com/video/${videoId}`
      : `//www.youtube.com/embed/${videoId}?rel=0${
          data.start ? `&start=${data.start}` : ''
        }`

  return (
    <iframe
      width="560"
      height="315"
      src={iframeSrc}
      frameBorder="0"
      allowFullScreen
    />
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 400px;
`
export const VideoParagraphPopup: Comp<VideoParagraphProps> = ({
  data,
  holder,
}) => {
  const ctx = useOvermind()
  function changed() {
    doPasteText(ctx, { holder, text: data.src })
  }

  return (
    <Wrapper>
      <Field
        icon="Video"
        form={data}
        name="src"
        submit={() => changed()}
        onBlur={() => changed()}
      />
    </Wrapper>
  )
}
