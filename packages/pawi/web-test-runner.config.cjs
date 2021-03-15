//import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin'
const {
  visualRegressionPlugin,
} = require('@web/test-runner-visual-regression/plugin')
// NODE_ENV=test - Needed by "@snowpack/web-test-runner-plugin"
process.env.NODE_ENV = 'test'

//export default {
module.exports = {
  plugins: [
    require('@snowpack/web-test-runner-plugin')(),
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
    }),
  ],
}
