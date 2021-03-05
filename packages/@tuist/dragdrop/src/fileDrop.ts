import * as React from 'react'
import { FileDroppableHooks, FileDroppableOptions } from './types'

function acceptFile({ kind }: { kind: string }) {
  return kind === 'file'
}

export function fileDrop(settings: FileDroppableOptions): FileDroppableHooks {
  const ref = settings.ref

  const accept = settings.accept || acceptFile

  // TODO: detect a drag operation in window and add
  // 'dropZone' style.
  // set to noDrop on bad file

  async function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const data = e.dataTransfer.items
    if (data) {
      const files: File[] = []
      const strings: string[] = []
      for (let idx = 0; idx < data.length; ++idx) {
        const item = data[idx]
        if (accept(item)) {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              files.push(file)
            }
          } else {
            strings.push(await new Promise(res => item.getAsString(res)))
          }
        }
      }
      if (files.length || strings.length) {
        settings.onDrop(
          Object.assign({}, settings.payload || {}, { files, strings })
        )
      }
    }
    if (ref.current) {
      ref.current.classList.remove('fileDrop')
    }
  }

  function onDragEnter(e: React.DragEvent) {
    // We have no way to test file before drop as this is a security feature to avoid
    // divs passed over on drag operation to eavesdrop on the dragged content.
    if (ref.current) {
      ref.current.classList.add('fileDrop')
    }
    e.stopPropagation()
    e.preventDefault()
  }

  function onDragOver(e: React.DragEvent) {
    // We need this if the hover goes on a child and comes back
    if (ref.current && !ref.current.classList.contains('fileDrop')) {
      ref.current.classList.add('fileDrop')
    }
    e.stopPropagation()
    e.preventDefault()
  }

  function onDragLeave() {
    if (ref.current) {
      ref.current.classList.remove('fileDrop')
    }
  }

  return {
    ref,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
