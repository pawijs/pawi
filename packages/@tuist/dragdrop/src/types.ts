import { IContext } from 'overmind'
import * as actions from './actions'

export type DragdropComponentType =
  | React.ComponentClass<any>
  | React.FunctionComponent<any>

export interface DragdropDefinitions {
  types: {
    [type: string]: {
      hooks?: Partial<DragdropHooks>
      component: DragdropComponentType
      // Extra props to pass to component on drag. This will not be part of the
      // payload. Used to alter behavior or visual of dragged element for example.
      dragProps?: any
      // Fixed dragging position in component
      anchor?: Position
    }
  }
  // This changes the drag type on drag start.
  dragTransform: Transforms
  // This changes a drag type on drop (hover).
  dropTransform: Transforms
}

export interface DragTransform<
  Context = IContext<any>,
  SourcePayload = any,
  TargetPayload = any
> {
  (ctx: Context, dragData: DragData<SourcePayload>):
    | DragData<TargetPayload>
    | undefined
}

export interface Transforms {
  [sourceType: string]: {
    [targetType: string]: DragTransform
  }
}

export interface DragdropSettings {
  // Dragdrop components where we show the rest of the app.
  dragdrop?: Partial<DragdropDefinitions>
}

export interface DragData<Payload = any> {
  // Anchor in dragged object
  anchor: Position
  // When a drag is happening, this is set with the type of dragged element.
  // Drop zones react to this type by changing style to show if they accept it.
  type: string
  // Any kind of information related to the given type that helps the drop zone
  // know what to do with it.
  payload: Payload
}

export interface DropData<Payload = any> {
  // Type of drop zone (used to transform on release).
  type: string
  // When the drag ends, this is called (set when hovering above a Drop element). The
  // call is async and will behave as if it was called from the Drop target.
  // No need for the extra function wrapping to avoid Derive because type is optional.
  callback: OnDropFunction
  // Information on drop added.
  payload: Payload
}

export interface Position {
  x: number
  y: number
}

// Hooks triggered in dragdrop actions

// UI hooks inserted in html component
export interface DraggableHooks {
  className?: string
  onClick(e: any): any
  // This is for very small draggable items (we cannot start drag before being outside of element).
  onMouseLeave(e: any): any
  onMouseUp(e: any): any
  onMouseDown(e: any): any
  onMouseMove(e: any): any
}

export interface DraggableOptions {
  onClick?: () => void
  // When this flag is set to true, dragging is disabled.
  noDrag?: boolean
}

// UI hooks inserted in html component
export interface DroppableHooks {
  // Detect mouse enter, also on initial drag zone if drag starts there.
  onMouseMove(e: any): any
  onMouseLeave(e: any): any
  className: string
}

export interface FileDroppableHooks {
  // Just to make sure it is inserted in the HTML element.
  ref: React.RefObject<any>
  onDrop(e: any): any
  onDragEnter(e: any): any
  onDragOver(e: any): any
  onDragLeave(e: any): any
}

export interface DroppableSettings<T = any> {
  className?: string
  // Is the drop enabled ? If the value is a `string`, this is used as
  // extra className to explain why it is disabled.
  enable?: boolean | string
  // Type of draggable item to accept. If we want to accept more types, we can
  // create a wrapper type and use dropTransform to transform incoming types to our
  // wrapper type.
  drop: string
  onDrop: (dragPayload: any) => void
  // Extra payload to add to draggable payload (can provide context).
  payload?: T
}

export interface FileDroppableOptions {
  // We need to use a ref as the drag operations do not touch
  // overmind and we need to update the div.
  ref: React.RefObject<HTMLElement>
  className?: string
  onDrop: (args: { files: File[], strings: [] }) => void
  accept?: (arg: { kind: string, type: string}) => boolean
  // Extra payload to add
  payload?: any
}

export interface DragdropState {}

export type OnDropFunction = (dragPayload: any) => void

// Action hooks of each draggable type
export interface DragdropHooks {
  // If 'true' is returned, normal action is ignored (run considered done)
  enter: (ctx: any, value: actions.EnterArg) => boolean | void
  leave: (ctx: any) => boolean | void
  move: (ctx: any, value: actions.MoveArg) => boolean | void
  release: (ctx: any) => boolean | void
  start: (ctx: any, value: actions.StartArg) => boolean | void
}

export interface DragdropConfig {
  state: {
    dragdrop: {
      // This can be set during a drag operation to disable all drop
      // zones.
      disableDrop?: boolean
      // Dragged data
      drag?: DragData
      // Mouse position
      position: Position
      drop?: DropData
      definitions: () => DragdropDefinitions
    }
  }

  actions: {
    dragdrop: typeof actions
  }
}
