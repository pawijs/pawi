import {
  VideoParagraphPopup,
  VideoParagraph as component,
} from '../../components'

import { CustomParagraphOption } from '../../lib/utils/types'
import { InitFunction } from '../../lib'

const VIDEO_REGEXPS: {
  re: RegExp
  data: (match: string[], src: string) => VideoData
}[] = [
  {
    re: /^https?:\/\/.*(?:youtu.be|youtube.com)\/(?:embed|watch)\?v=([^#&?]+)(&[^\n]+)?$/,
    data(match: string[], src) {
      return { videoId: match[1], type: 'Youtube', src }
    },
  },
  {
    re: /^https?:\/\/.*(?:youtu.be|youtube.com)\/([^#?]+)(\?t=(\d+)|)(&[^\n]+)?$/,
    data(match: string[], src) {
      return {
        videoId: match[1],
        type: 'Youtube',
        start: parseInt(match[3]),
        src,
      }
    },
  },
  {
    re: /^https?:\/\/.*(?:vimeo.com)\/(\d+)$/,
    data(match: string[], src) {
      return { videoId: match[1], type: 'Vimeo', src }
    },
  },
]

export interface VideoData {
  videoId: string
  start?: number
  type: 'Youtube' | 'Vimeo'
  src: string
}

const init: InitFunction<any, VideoData> = function init(ctx, value) {
  const { opts } = value
  return { data: { videoId: opts.i || '', type: 'Youtube', src: '', start: 0 } }
}

function markup(text: string): VideoData | undefined {
  for (const videoRe of VIDEO_REGEXPS) {
    const match = text.match(videoRe.re)
    if (match) {
      return videoRe.data(match, text)
    }
  }
  return undefined
}

export const video: CustomParagraphOption<VideoData> = {
  icon: 'Video',
  init,
  component,
  markup,
  popup: VideoParagraphPopup,
  startText: 'v.',
}
