declare module 'random-paragraph' {
  interface Options {
    sentences?: number
    min?: number
    max?: number
  }
  interface RandomParagraph {
    (opts?: Options): string
  }
  const fn: RandomParagraph
  export default fn
}
