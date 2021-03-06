import { darken, desaturate, lighten, transparentize } from 'polished'
import { css, styled } from '../app'
import {
  backColor,
  high_front,
  indices,
  lsbo,
  pfill,
  wboxlColor,
} from '../helpers'

export const TreeSVG = styled.svg`
  text {
    pointer-events: none;
    user-select: none;
    /* must match uilayout.ts tsizer */
    font-size: 10pt;
    font-family: 'Avenir Next';
    fill: #111;

    &.main {
      fill: #a2a2a2;
    }
  }
  g:focus {
    outline: none;
  }

  path {
    cursor: pointer;
    stroke-width: 1px;

    &.invalidMark {
      fill: #ff4444;
    }

    &.main {
      stroke: ${darken(0.7, '#302c2c')};
      cursor: default;

      fill: ${lighten(0.1, backColor)};
    }
  }

  .slot {
    fill: none;
    stroke: ${wboxlColor};
    stroke-width: ${lsbo};

    &.detached,
    &.incompatible {
      /* @extend ._detachedFx; */
      stroke-width: calc(3 * ${lsbo});
      stroke: red;
      transform: translateY(-1px);
    }
    &.incompatible {
      stroke-width: calc(2 * ${lsbo});
      transform: translateY(-2px) rotate(45deg);
    }
  }

  .sclick {
    transition: opacity 0.8s;
    opacity: 0;
    cursor: pointer;

    &:hover,
    &.active {
      opacity: 0.7;
    }
  }

  .click {
    stroke: none;
    fill: #000;
  }

  .plus {
    fill: none;
    pointer-events: none;
    stroke: ${high_front};
  }

  .arrow {
    fill: none;
    stroke-width: ${lsbo};
    stroke: ${transparentize(0.5, wboxlColor)};

    &.open {
    }

    &.closed {
    }
  }

  .arrowclick {
    stroke: none;
    cursor: pointer;
    fill: rgba(0, 0, 0, 0);
  }

  path.invalid {
    mask: url(#mask-stripe);
  }

  ${indices
    .map(
      paletteIdx => css`
        & path.box${paletteIdx} {
          stroke: ${darken(0.25, '#302c2c')};
          fill: ${pfill(paletteIdx)};
          &:hover {
            fill: ${lighten(0.1, pfill(paletteIdx))};
          }

          &.invalid {
            fill: ${darken(0.1, desaturate(0.2, pfill(paletteIdx)))};
          }

          &.selected {
            fill: ${lighten(0.2, pfill(paletteIdx))};
          }

          &.closed {
            stroke-dasharray: 2px;
          }
        }

        li.box${paletteIdx} {
          background: ${pfill(paletteIdx)};
        }
      `
    )
    .join('\n')};
`
