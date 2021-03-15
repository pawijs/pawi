import { run } from 'pawi'
import * as three from 'three'
import { Context } from '../lib/types'

// We ensure the initial context we are passing respects our
// Context definition.
run<Context>('.', { THREE: three })
