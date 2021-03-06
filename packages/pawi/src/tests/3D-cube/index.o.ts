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
        "anim"
      ]
    },
    "anim": {
      "id": "anim",
      "name": "anim.Loop",
      "content": {
        "file": "@pawi/base/dist/anim.Loop.o.js"
      },
      "children": [
        "renderer"
      ]
    },
    "renderer": {
      "id": "renderer",
      "name": "three.Renderer",
      "content": {
        "file": "@pawi/three/dist/three.WebGLRenderer.o.js"
      },
      "children": [
        "scene"
      ]
    },
    "scene": {
      "id": "scene",
      "name": "three.Scene",
      "content": {
        "file": "@pawi/three/dist/three.Scene.o.js"
      },
      "children": [
        "mesh",
        "lights"
      ]
    },
    "mesh": {
      "id": "mesh",
      "name": "three.Mesh",
      "content": {
        "file": "@pawi/three/dist/three.Mesh.o.js"
      },
      "children": [
        "route"
      ]
    },
    "lights": {
      "id": "lights",
      "name": "three.Lights",
      "content": {
        "file": "@pawi/three/dist/three.Lights.o.js"
      },
      "children": []
    },
    "route": {
      "id": "route",
      "name": "route",
      "content": {
        "file": "./route.js"
      },
      "children": [
        "now",
        "sliders"
      ]
    },
    "now": {
      "id": "now",
      "name": "now",
      "content": {
        "file": "@pawi/three/dist/three.Rotation.o.js"
      },
      "children": [
        "nowX",
        "nowY",
        "nowZ"
      ]
    },
    "nowX": {
      "id": "nowX",
      "name": "now.x",
      "children": [],
      "content": {
        "file": "./nowX.js"
      }
    },
    "nowY": {
      "id": "nowY",
      "name": "now.y",
      "children": [],
      "content": {
        "file": "./nowY.js"
      }
    },
    "nowZ": {
      "id": "nowZ",
      "name": "now.z",
      "children": [],
      "content": {
        "file": "./nowZ.js"
      }
    },
    "sliders": {
      "id": "sliders",
      "name": "sliders",
      "content": {
        "file": "@pawi/three/dist/three.Rotation.o.js"
      },
      "children": [
        "sliderX",
        "sliderY",
        "sliderZ"
      ]
    },
    "sliderX": {
      "id": "sliderX",
      "name": "slider.x",
      "children": [],
      "content": {
        "file": "./sliderX.js"
      }
    },
    "sliderY": {
      "id": "sliderY",
      "name": "slider.y",
      "children": [],
      "content": {
        "file": "./sliderY.js"
      }
    },
    "sliderZ": {
      "id": "sliderZ",
      "name": "slider.z",
      "children": [],
      "content": {
        "file": "./sliderZ.js"
      }
    }
  }
}`
