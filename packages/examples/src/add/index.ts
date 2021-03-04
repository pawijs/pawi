import { Branch } from 'tuist'

export const branch: Branch = {
  main: {
    file: 'main.js',
    children: ['child1', 'child2'],
  },
  child1: {
    file: 'child1.js',
  },
  child2: {
    file: 'child2.js',
  },
}
