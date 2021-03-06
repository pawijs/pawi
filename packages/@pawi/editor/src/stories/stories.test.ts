import { testStories } from '@pawi/story'
import { restore } from 'test'
import { mockRef } from '../lib/utils/testUtils'
import * as stories from './all'

testStories(
  {
    beforeEach: mockRef,
    afterEach: restore,
  },
  stories
)
