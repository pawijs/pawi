import * as ts from 'typescript'
const SCRUB = 'tui'

const transformer = (_: ts.Program) => (
  transformationContext: ts.TransformationContext
) => (sourceFile: ts.SourceFile) => {
  let scrub = 0
  const obj = ts.factory.createIdentifier(SCRUB)
  function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isNumericLiteral(node)) {
      const index = ts.factory.createNumericLiteral(scrub++)
      ts.factory.createElementAccessExpression(obj, index)
    }

    return ts.visitEachChild(node, visitNode, transformationContext)
  }

  return ts.visitNode(sourceFile, visitNode)
}

export default transformer
