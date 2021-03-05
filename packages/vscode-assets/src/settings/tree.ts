import { TreeDefinitions } from '@tuist/tree'
import { Context } from '../app'
import { BranchContent } from '../types'

export const tree: TreeDefinitions<BranchContent> = {
  tuist: {
    newBlock() {
      return {
        name: 'new',
        content: { file: '' },
      }
    },
    treeChanged({ state }: { state: Context['state'] }, { tree }) {
      console.log(JSON.stringify(state.tuist.tree, null, 2))
    },
    // contentComponent: NodeEditor,
  },
}
