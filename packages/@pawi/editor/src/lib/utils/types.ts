import * as React from 'react'
import { ApplyOpArgs } from '../../actions'
import { Comp } from '../../app'
import { OperationsKey } from '../doOperation'

// ============== Composition definition

export type PathType = string[]

export interface ElementsType {
  [key: string]: ElementType
}

// Used during page preview

export interface ElementSize {
  // Content with padding.
  // content
  c: number
  // top margin
  t: number
  // bottom margin
  b: number
}

export interface LegacySize {
  // Legacy format
  content?: number
  topMargin?: number
  bottomMargin?: number
}

export interface ElementSizes {
  [key: string]: ElementSize
}

export interface PositionedElementType {
  p: number
}

export interface PositionedElementsType {
  [key: string]: PositionedElementType
}

export interface ElementOptionsType {
  // custom type name (used to get other options such as className, etc)
  t?: string
  // heading level
  h?: number
  // column attibution
  u?: 'l' | 'r'
  // column width
  uw?: number
  // list type
  l?: 'ol' | 'ul'
  href?: string
  // When true: export this paragraph.
  e?: boolean
  // When true: new page before this paragraph
  n?: boolean
  // align (justify, left, center, right)
  a?: 'j' | 'l' | 'c' | 'r'
  // When this is set, special behavior apply like
  // - cannot remove
  // - cannot change paragraph
  // - cannot set bold/etc (no toolbox)
  title?: boolean
  // For custom elements: open popup on selection
  open?: boolean
}

export interface ParagraphOptions {
  // Custom tag
  c?: string
  // Options to display paragraphs
  o?: ElementOptionsType
}

export interface GroupElementRefTypeById {
  [key: string]: GroupElementRefType
}

export interface GroupElementRefType {
  path: PathType
  elem: GroupElementType
}

export type Type = 'P' | 'A' | 'E' | 'T' | 'B' | 'I' | 'B+I'

export interface ElementType extends ParagraphOptions {
  // Type
  t: Type
  // Position
  p: number
  // Inner content (string)
  i?: string
  // Selection
  s?: SelectionType
  // Group
  g?: ElementsType
}

export interface StringElementType extends ElementType {
  i: string
}

export interface GroupElementType extends ElementType {
  g: ElementsType
}

export interface CustomElementType extends ElementType {
  c: string
}

export interface TitleElementType extends ElementType {
  o: { h: number }
}

export interface ListElementType extends ElementType {
  o: { l: 'ol' | 'ul' }
}

export function isStringElement(elem: ElementType): elem is StringElementType {
  return typeof elem.i === 'string'
}

export function isGroupElement(elem: ElementType): elem is GroupElementType {
  return typeof elem.g === 'object'
}

export function isCustomElement(elem: ElementType): elem is CustomElementType {
  return typeof elem.c === 'string'
}

export function isDocumentTitle(elem: ElementType): elem is TitleElementType {
  return (elem.o && elem.o.title) || false
}

export function isListItem(elem: ElementType): elem is ListElementType {
  const { o } = elem
  return o ? o.l === 'ol' || o.l === 'ul' : false
}

// Main document title
export function isTitle(elem: ElementType): elem is TitleElementType {
  const { t, o } = elem
  return (t === 'P' && o && o.title && true) || false
}

// Any heading
export function isHeading(elem: ElementType): elem is TitleElementType {
  const { t, o } = elem
  return (t === 'P' && o && o.h && true) || false
}

export const isSpecialElement = isCustomElement

export function isRangeSelection(
  selection: SelectionType
): selection is RangeSelectionType {
  return selection.type === 'Range'
}

export interface ElementRefType {
  path: PathType
  elem: ElementType
}

export interface ChangeType {
  op: 'noop' | 'update' | 'delete' | 'create'
  selected?: boolean
  path: PathType
  pathId: string
  elem: ElementType
  resized?: boolean
}

export interface ElementRefTypeById {
  [key: string]: ElementRefType
}

export interface StringElementRefType {
  path: PathType
  elem: StringElementType
}

export interface ElementNamedType {
  ref: string
  elem: ElementType
}

export interface CompositionType {
  sz?: ElementSizes

  toolbox?: ToolboxOperationValueType
  // Data for custom components.
  data?: { [key: string]: any }
  g: ElementsType
  // Path to object containing selection encoded as 'key.subKey.subsubKey'
  spath?: string
  // selection min paragraph position
  smin?: number
  // selection max paragraph position
  smax?: number
  // Title of the composition (when there is one)
  title?: string
}

// ============== Selections

export interface SelectionPositionType {
  top: number
  left: number
}

export interface CaretSelectionType {
  anchorPath: PathType
  anchorOffset: number
  anchorValue?: string
  position: SelectionPositionType
  stringPath?: string // Only used by setSelection
  type: 'Caret'
}

export interface RangeSelectionType {
  anchorPath: PathType
  anchorOffset: number
  anchorValue?: string
  focusPath: PathType
  focusOffset: number
  position: SelectionPositionType
  stringPath?: string // Only used by setSelection
  type: 'Range'
}

export type SelectionType = CaretSelectionType | RangeSelectionType

export interface ChangesType {
  // Initial data for custom elements (further changes do not go through
  // editor).
  data?: { [elemId: string]: any }
  // Full elements.
  elements: { [elemPath: string]: ChangeType }
  start: ChangeType
  end: ChangeType
  // Special cases where we need to prepare selection/toolbox during op eval.
  selection?: SelectionType
}

export function filterChanges(
  elements: ChangesType['elements'],
  types: ChangeType['op'] | ChangeType['op'][] | 'selected'
): ChangeType[] {
  if (types === 'selected') {
    return Object.keys(elements)
      .map(k => elements[k])
      .filter(el => el.selected)
  }

  const filter =
    typeof types === 'string'
      ? ({ op }: ChangeType) => op === types
      : ({ op }: ChangeType) => types.includes(op)
  return Object.keys(elements)
    .map(k => elements[k])
    .filter(filter)
}

// ============== Operations

export interface SelectOperationType {
  op: 'select'
  value: SelectionType
}

export interface UpdateOperationType {
  op: 'update'
  path: PathType
  value: ElementType
}

export interface UpdateOptsOperationType {
  op: 'updateOpts'
  path: PathType
  opts: ParagraphOptions
}

export interface DataOperationType {
  op: 'data'
  path: PathType
  data: any
}

export interface DeleteOperationType {
  op: 'delete'
  path: PathType
}

export interface ResizedOperationType {
  op: 'resized'
  id: string
}

export interface ToolboxOpType {
  type: 'emptyParagraph' | 'paragraph' | 'selection'
  position: SelectionPositionType
}

interface ToolboxNoneType {
  type: 'none'
}

export type ToolboxOperationValueType = ToolboxOpType | ToolboxNoneType

export interface ToolboxOperationType {
  op: 'toolbox'
  value?: ToolboxOperationValueType
}

export type OperationType =
  | SelectOperationType
  | UpdateOperationType
  | UpdateOptsOperationType
  | DataOperationType
  | DeleteOperationType
  | ResizedOperationType
  | ToolboxOperationType

export type OperationsType = OperationType[]

export interface DoOperationType {
  // Not sure about these definitions
  ref: string
  elem: ElementType
}

// =========== Editor Options

export interface TextMarkup {
  (text: string): React.ReactElement<any> | undefined
}

export interface ParagraphProps<Data = any, CProps = any> {
  // Extra tag props passed from Editor.
  customTagProps: CProps
  id: string
  // paragraph
  paragraph: CustomElementType
  // custom data
  data: Data
  holder: CompositionHolder
}

type CustomTag = Comp<ParagraphProps>

export interface SimpleParagraphOption extends BaseParagraphOption {
  // Current paragraph changes
  o: ElementOptionsType
}

// Internal for now
export interface SelectParagraphOption extends BaseParagraphOption {
  op: 'B' | 'I'
}

interface AnyData {
  [key: string]: any
}

export interface InitData<T = AnyData> {
  data: T
  o?: ElementOptionsType
  // Multiple toolbox entries can create the same type of paragraph
  // so this is to overwrite 'toolbox entry key => c' mapping.
  c?: string
}

interface BaseContext {
  state: any
}

export interface InitFunction<
  Context extends BaseContext = { state: any },
  T = AnyData
> {
  (ctx: { state: Context['state'] }, value: ApplyOpArgs): InitData<T>
}

export type InitParagraph = InitData | InitFunction<any, any>

export interface ShowOn {
  paragraph?: boolean
  emptyParagraph?: boolean
  selection?: boolean
}

export interface BaseParagraphOption {
  // as 'cmd+i', 'cmd+shift+I', etc
  // DOES THIS WORK ?
  accel?: string
  // Icon to display in toolbox and when dragging this paragraph...
  icon?: string
  // Icon to display next to text (read during display using o.t type)
  paragraphIcon?: string
  // Custom class name (read during display using o.t type)
  className?: string
  toolboxComponent?: React.ReactNode
  // operation to trigger ('B', 'I', 'A', 'P', etc)
  op?: OperationsKey
  showOn?: ShowOn
  startText?: string
}

export interface CustomParagraphOption<T = any> extends BaseParagraphOption {
  // Initial state for the paragraph's data (if any). Should
  // be an object.
  init: InitParagraph
  // Component to use for the paragraph.
  component: CustomTag
  // Popup to display when custom paragraph is selected (overlay)
  popup?: CustomTag
  // Global widgets that need to be preloaded. These can be heavy UI elements used in a single
  // custom paragraph at a time that we cannot afford to create for every paragraph.
  preload?: Comp<any>
  // On paste, test custom para and creates element (replaces 'markup')
  markup?: (text: string) => T | undefined
  // Provide a function to return a paragraph info (used in paragraph sharing, extraction, etc)
  getInfo?: (ctx: any, data: any) => { title: string; icon: string } | undefined
  // If true, treat this as a special text paragraph with content editing enabled.
  // (this requires managing edits before they reach the editor event handlers: onSelect, onChange).
  noCursor?: boolean
}

export type ParagraphOption =
  | SimpleParagraphOption
  | CustomParagraphOption
  | SelectParagraphOption

export function isSimpleParagraphOption(
  para: ParagraphOption
): para is SimpleParagraphOption {
  return (para as any).o !== undefined
}

export function isCustomParagraphOption(
  para: ParagraphOption
): para is CustomParagraphOption {
  return (para as any).init !== undefined
}

export function isSelectParagraphOption(
  para: ParagraphOption
): para is SelectParagraphOption {
  return (para as any).op !== undefined
}

export interface Paragraphs {
  [key: string]: ParagraphOption
}

export interface EditorOptions {
  paragraphs?: Paragraphs
  // Set this to true to avoid editor default paragraphs.
  noDefaults?: boolean
  paste?: { [type: string]: PasteOperation }
}

// PRIVATE
export interface ParagraphPayload {
  // Initial state for the paragraph's data (if any).
  c?: string
  // On initial paragraph, 'data' is not set in signal props
  data?: AnyData
  o?: ElementOptionsType
  i?: string
}

export interface InternalParagraphOption<T = any> extends BaseParagraphOption {
  // The paragraph key
  key: string
  op: OperationsKey
  // Custom paragraph key
  c?: string
  // This must be set to true for sub-compositions
  isComposition?: boolean
  // JSON.stringify ( ParagraphPayload )
  payload: string
  preload?: ComponentType<any>
  getInfo?: (ctx: any, data: any) => { title: string; icon: string } | undefined
  init?: InitParagraph
  // Component to use for custom paragraphs.
  component?: ComponentType<ParagraphProps>
  popup?: ComponentType<ParagraphProps>
  markup?: (text: string) => T | undefined
  showOn: ShowOn
  // If true, do not insert cursor input (this means we handle cursor selection).
  noCursor?: boolean
}

type ComponentType<P = any> =
  | React.StatelessComponent<P>
  | React.ComponentClass<P>

export type GetMarkup = (
  text: string
) =>
  | {
      // Information to create new custom paragraph.
      c: string
      data: any
    }
  | undefined

export interface EditorProvider {
  preload: ComponentType<any>[]
  paragraphs: { [key: string]: InternalParagraphOption }
  getMenuChoices(type: string): InternalParagraphOption[]
  getMarkup: GetMarkup
  paragraphList: InternalParagraphOption[]
  paste: {
    [type: string]: PasteOperation
  }
  startText: {
    [startString: string]: InternalParagraphOption // simple or custom para ref
  }
}

// ACTIONS AND COMPONENT ARGS

// This is the type passed to the Editor
export interface CompositionHolder {
  id?: string
  title?: string
  $changed?: boolean
  composition?: CompositionType
}

export interface CompositionWrapper {
  composition: CompositionType
}

export interface CompositionArgs {
  holder: CompositionHolder
}

export interface ProcessOpsArgs extends CompositionArgs {
  ops?: OperationType[] | undefined
}

export interface CompositionCaretSelectionArgs extends CompositionArgs {
  selection: CaretSelectionType
}

export interface CompositionSelectionArgs extends CompositionArgs {
  selection: SelectionType
}

export interface InputChangeArgs extends CompositionArgs {
  selection: SelectionType
  value: string | null
}

// ============== Paste types

export interface PasteArgs {
  holder: CompositionHolder
  selection: SelectionType
  event: React.ClipboardEvent<HTMLDivElement>
}

export interface PasteOperation<C = any> {
  // Should return true if the paste is done and false if the content
  // is not useable.
  (ctx: C, type: string, value: PasteArgs): Promise<boolean>
}

export const PASTE_EDITOR = 'pawi/editor'
export const PASTE_HTML = 'text/html'
export const PASTE_TEXT = 'text/plain'
