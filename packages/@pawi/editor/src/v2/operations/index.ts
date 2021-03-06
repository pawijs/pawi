// Operations do part of the job, triggering other operations if needed. They do
// not execute 'cleanup' tasks such as sortedId update or selection updtae.
// They are the ones triggering hooks.
export * from './addDepth'
export * from './applyStyle'
export * from './applyToRange'
export * from './changeText'
export * from './clearSelection'
export * from './deleteParagraph'
export * from './newElement'
export * from './newParagraph'
export * from './removeRange'
export * from './setSelection'
export * from './simplify'
export * from './splitParagraph'
