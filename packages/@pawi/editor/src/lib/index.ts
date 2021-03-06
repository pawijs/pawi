export {
  isCustomElement,
  isGroupElement,
  isStringElement,
  isDocumentTitle,
  isTitle,
  ChangesType,
  CompositionType,
  CompositionHolder,
  ParagraphProps,
  ElementSizes,
  ElementType,
  ElementsType,
  ElementOptionsType,
  EditorOptions,
  InitFunction,
  EditorProvider,
  OperationType,
  OperationsType,
  PasteArgs,
  PasteOperation,
  Paragraphs,
  ParagraphOption,
  SelectionType,
  TextMarkup,
  ToolboxOpType,
  ToolboxOperationValueType,
} from './utils/types'

export { newComposition, NewCompositionOptions } from './newComposition'
export { getTitle } from './getTitle'
export { caretSelection } from './utils/caretSelection'
export { makeRef } from './utils/makeRef'
export * from './undoRedo'
