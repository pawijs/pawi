import { Branch } from 'tuist'

export const branch: Branch = {
  main: {
    file: 'main.js',
    children: ['anim'],
  },
  anim: {
    file: 'lib/anim.Loop.js',
    children: ['renderer'],
  },
  renderer: {
    file: 'lib/three.WebGLRenderer.js',
    children: ['scene'],
  },
  scene: {
    file: 'lib/three.Scene.js',
    children: ['mesh', 'lights'],
  },
  mesh: {
    file: 'lib/three.Mesh.js',
    children: ['route'],
  },
  lights: {
    file: 'lib/three.Lights.js',
  },
  route: {
    file: 'route.js',
    children: ['now', 'sliders'],
  },
  now: {
    file: 'lib/three.Rotation.js',
    children: ['nowX', 'nowY', 'nowZ'],
  },
  nowX: { file: 'nowX.js' },
  nowY: { file: 'nowY.js' },
  nowZ: { file: 'nowZ.js' },
  sliders: {
    file: 'lib/three.Rotation.js',
    children: ['sliderX', 'sliderY', 'sliderZ'],
  },
  sliderX: { file: 'sliderX.js' },
  sliderY: { file: 'sliderY.js' },
  sliderZ: { file: 'sliderZ.js' },
}
