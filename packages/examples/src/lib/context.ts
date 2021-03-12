import { ThreeContext } from 'examples/src/lib/node_modules/examples/src/lib/node_modules/@pawi/three'

export interface ContextTypes extends ThreeContext {
  // The song position in seconds (provided by midi sync). Value can jump.
  midi: {
    // Position in song in pulses per quarter note (24 / quarter)
    songPosition: number
  }
}
