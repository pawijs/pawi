import { testStories } from '@pawi/story'

Date.now = () => 1539949294308
const stories = require('./all')

testStories({}, stories)
