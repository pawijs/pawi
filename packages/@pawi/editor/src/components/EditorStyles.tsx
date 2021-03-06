import styled from 'styled-components'
import { theme } from '../app'

export const EditorStyles = styled.div`
  /** Do not use padding or margin inside .Composition or selection calculations
 are wrong. */
  margin: 0;
  padding: 0;

  /** All font sizes are in **em** and we set a root size here (or as a style property)
   * to enable font zooming and pagination / free flow modes.
   */
  font-size: 16px;

  & *:focus,
  &:focus {
    outline: none;
  }

  & .em {
    font-style: italic;
  }

  & .strong {
    font-weight: bold;
  }

  & p.Group,
  & p,
  & .Custom,
  & .Columns,
  & h1,
  & h2,
  & h3 {
    position: relative; /* needed for dragbar */
    line-height: ${theme.editorParagraphsLineHeight};
    margin: ${theme.editorParagraphsVMargin} ${theme.editorParagraphsHMargin};
    margin-bottom: 0;
  }
  /* d = default */
  & .align_j {
    text-align: justify;
  }
  & .align_l {
    text-align: left;
  }
  & .align_c {
    text-align: center;
  }
  & .align_r {
    text-align: right;
  }
  & .align_l > div {
    display: table;
    margin: auto;
    margin-left: 0;
  }
  & .align_c > div {
    display: table;
    margin: auto;
  }
  & .align_r > div {
    display: table;
    margin: auto;
    margin-right: 0;
  }
  & .PageBreak {
    font-size: ${theme.editorPFontSize};
    position: absolute;
    top: ${theme.editorPBreakTop};
    left: ${theme.editorPBreakLeft};
    color: ${theme.editorPBreakColor};
  }

  & h1 {
    font-weight: ${theme.editorH1Weight};
    font-size: ${theme.editorH1FontSize};
    line-height: ${theme.editorH1LineHeight};
    margin: ${theme.editorH1VMargin} ${theme.editorParagraphsHMargin};
  }

  & h1.Title {
    margin: ${theme.editorH1TitleMargin};
  }

  & h2 {
    font-weight: ${theme.editorH2Weight};
    font-size: ${theme.editorH2FontSize};
    line-height: ${theme.editorH2FontSize};
    margin: ${theme.editorH2VMargin} ${theme.editorParagraphsHMargin};
  }

  & h3 {
    font-weight: ${theme.editorH3Weight};
    font-size: ${theme.editorH3FontSize};
    line-height: ${theme.editorH3FontSize};
    margin: ${theme.editorH3VMargin} ${theme.editorParagraphsHMargin};
  }

  & h3 .em,
  & h2 .em,
  & h1 .em {
    font-style: inherit;
    border-bottom: ${theme.editorHeaderEmBorderBottom};
  }

  & h1.Title {
    font-size: ${theme.editorTitleFontSize};
    line-height: ${theme.editorTitleFontSize};
    color: ${theme.editorTitleColor};
    padding: ${theme.editorTitlePadding};
    border-bottom: ${theme.editorTitleBorderBottom};
  }

  & p {
    font-size: ${theme.editorPFontSize};
    text-align: ${theme.editorPTextAlign};
  }

  & ol,
  & ul {
    /* Margin is set through 'LI' tag (used to compute pagination). */
    margin-top: 0;
    margin-bottom: 0;
    margin-left: ${theme.editorListMarginLeft};
    .DragBar {
      display: none;
    }
  }

  & li.Group,
  & ol.Group {
    position: relative;
  }

  & li:first-child {
    margin-top: ${theme.editorListMarginTop};
  }

  & .Empty {
    position: relative;
  }

  & p.Empty {
    border-left: ${theme.editorEmptyBorderLeft};
    .PageBreak {
      left: -41px;
    }
  }

  /* Bottom margin not counted to build pages.
 * Top margin IS USED.
 */
  & .Group:last-child,
  & .Custom:last-child,
  & .Columns:last-child,
  & p:last-child,
  & li:last-child,
  & h1:last-child,
  & h2:last-child,
  & h3:last-child {
    margin-bottom: 0;
  }

  @media print {
    & .Empty {
      opacity: 0;
    }
    & .PageBreak {
      display: none;
    }
  }

  & .Empty:before {
    content: ${theme.editorEmptyBefore};
    opacity: ${theme.editorEmptyBeforeOpacity};
    position: absolute;
  }

  & .Column .Empty:first-child:before {
    content: '|';
    opacity: ${theme.editorEmptyBeforeOpacity};
    position: absolute;
  }

  & .Columns {
    display: flex;
    flex-direction: row;
    & .Handle {
      visibility: hidden;
    }
    &:hover .Handle {
      visibility: visible;
    }
  }

  & .Column {
    width: 50%;
    &.sized {
      flex-shrink: 0;
      flex-grow: 0;
    }
    & ol,
    & ul {
      margin-left: -1em;
    }
  }

  & .Column > p,
  .Column > h1,
  .Column > h2 {
    margin-left: 0;
    margin-right: 0;
    padding: 0;
  }
`
