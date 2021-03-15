import { Block, Context } from './types'
const MIDI_INPUT = 'IAC Driver Bus 1'

const MIDI = {
  SONGPOSITION: 0xf2,
  CLOCK: 0xf8,
}

function setupMidi() {
  const midi: Context['midi'] = { songPosition: 0 }

  function receiveMidi(msg: Event) {
    const { data } = msg as WebMidi.MIDIMessageEvent
    const [status, lsb, msb] = data
    if (status === MIDI.SONGPOSITION) {
      midi.songPosition = ((msb << 7) + lsb) * 6
    } else if (status === MIDI.CLOCK) {
      midi.songPosition += 1
    }
  }

  return { midi, receiveMidi }
}

export async function init({ cache }: Context): Block {
  if (!navigator.requestMIDIAccess) {
    return { error: 'Navigator does not support WebMIDI.' }
  }

  const midiAccess = await navigator.requestMIDIAccess()

  const { midi, receiveMidi } = cache('midi', setupMidi)

  const input = cache(
    'midiInput',
    () => {
      for (const input of midiAccess.inputs.values()) {
        if (input.name === MIDI_INPUT) {
          input.addEventListener('midimessage', receiveMidi)
          return input
        }
      }
      return undefined
    },
    input => {
      if (input) {
        input.removeEventListener('midimessage', receiveMidi)
      }
    }
  )

  if (!input) {
    return { error: `Could not find MIDI input '${MIDI_INPUT}'.` }
  }

  return { midi }
}
