import {Tree} from "../_snowpack/pkg/@forten/tree-view.js";
import * as React from "../_snowpack/pkg/react.js";
import {styled, useOvermind} from "../app.js";
const Wrapper = styled.div`
  border-radius: 3px;
  background: #444;
  padding: 5px;
  &&& .CodeMirror {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;
export const TreeParagraph = ({data, holder}) => {
  useOvermind();
  return /* @__PURE__ */ React.createElement(Wrapper, null, /* @__PURE__ */ React.createElement(Tree, {
    tree: data,
    extraProps: {holder}
  }));
};
