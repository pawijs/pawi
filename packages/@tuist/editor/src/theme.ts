// Margin and values should be specified in pixels to avoid rounding errors when
// querying element sizes with getComputedStyle.
// Wrong values lead to accumulated delta and overflowing pagination.
export const editorTheme = {
  editorBarDraggingBg: '#bdb29d88',
  editorBarTop: '0', // a little less then 1/2 of para margin for continuous
  editorBarBottom: '0', // a little less then 1/2 of para margin
  editorBarBackground: '#d6d7d8',
  editorBarColor: '#b1b1b1',
  editorBarHoverColor: '#444',
  editorBarHoverBackground: '#afc7e0',
  editorMargin: '1.125em',
  editorParagraphsLineHeight: '1.125em',
  editorParagraphsVMargin: '1.125em',
  editorParagraphsVMarginNeg: '-1.125em', // negative value used by dragbar (cannot use calc)
  // This margin must be in 'rem', same for all left margins and right margins.
  editorParagraphsHMargin: '2rem',
  editorNoPaginationHMargin: '1.1em',
  editorPBreakTop: '-0.6em',
  editorPBreakLeft: '-3em',
  editorPBreakColor: '#89c79a',
  editorH1Weight: 'bold',
  // Changing this => update margins (expressed in em)
  editorH1FontSize: '1.5em',
  editorH1VMargin: '2em',
  editorH1TitleMargin: '0.5em 0 2em 2em',
  editorH1LineHeight: '1.5',
  editorH2Weight: 'bold',
  // Changing this => update margins (expressed in em)
  editorH2FontSize: '1.125em',
  editorH2VMargin: '2em',
  editorH3Weight: 'bold',
  editorH3FontSize: '1em',
  editorH3VMargin: '1em',
  editorListMarginLeft: '1em',
  editorListMarginTop: '1.125em',
  editorPFontSize: '1em',
  editorPTextAlign: 'justify',
  editorHeaderEmBorderBottom: '1px solid #777',
  // This must be in px because it is parsed as int
  editorPreviewWidth: '200px',
  editorPopupBg: '#444',
  editorPopupWidth: '450px',
  editorLargePopupWidth: '800px',
  editorTitleFontSize: '2em',
  editorTitleColor: '#333',
  editorTitlePadding: '0.625em 0',
  editorTitleBorderBottom: '1px solid #eee',
  editorTitleExtraBg: 'var(--inspectorBackground)',
  editorTitleExtraShadow: 'inset 0 0 6px #000',
  editorEmptyBorderLeft: '3px solid #e5e5e5',
  editorEmptyBefore: 'attr(data-placeholder)',
  editorEmptyBeforeOpacity: '0.3',
}
