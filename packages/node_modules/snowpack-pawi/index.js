const HMR_INIT = `

export const pawi = {}
if (import.meta.hot) {
  import.meta.hot.accept(module => {
    if (pawi.reload) {
      pawi.reload(module)
    }
  })
}
`

module.exports = function () {
  return {
    name: 'snowpack-pawi',
    transform({ fileExt, contents }) {
      if (fileExt === '.js') {
        return contents + HMR_INIT
      }
    },
  }
}
