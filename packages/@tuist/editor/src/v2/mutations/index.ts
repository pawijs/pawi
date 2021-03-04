// Mutations trigger operations and correspond to one event (aka action). A
// mutation does all the job, including changing selection.
export {
  deleteParagraph,
  removeRange,
  setSelection,
  applyStyle,
} from '../operations'
export * from './collapseUp'
export * from './newParagraph'
export * from './removePreviousChar'
export * from './textChanged'
