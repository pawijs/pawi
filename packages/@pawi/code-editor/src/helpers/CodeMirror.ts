import CodeMirror = require('codemirror')
// JS mode
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/stex/stex'
// Addons, extentions
import 'codemirror/keymap/vim'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/runmode/runmode'
// Modes
// TODO: Could use webgl.js (smaller file, easier to tune for WebGL).
// import './mode/webgl'
import 'codemirror/mode/clike/clike'

export { CodeMirror }
