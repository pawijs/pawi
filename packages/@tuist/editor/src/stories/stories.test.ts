import * as stories from './all'

import { mockRef } from '../lib/utils/testUtils'
import { restore } from 'test'
import { testStories } from '@tuist/story'

testStories(
  {
    beforeEach: mockRef,
    afterEach: restore,
  },
  stories
)
