export const branch = `{
  "type": "pawi",
  "id": "1",
  "version": "1",
  "entry": "main",
  "blocks": {
    "main": {
      "id": "main",
      "name": "main",
      "content": {
        "file": "./main.js"
      },
      "children": [
        "child1",
        "child2"
      ]
    },
    "child1": {
      "id": "child1",
      "name": "child.1",
      "content": {
        "file": "./child1.js"
      },
      "children": []
    },
    "child2": {
      "id": "child2",
      "name": "child.2",
      "content": {
        "file": "./child2.js"
      },
      "children": []
    }
  }
}`
