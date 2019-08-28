miro.onReady(() => {
  const actionablesIcon = `
  <circle cx="12" cy="12" r="10" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2.5"/>
  <text transform="matrix(1 5.886198e-04 -5.886198e-04 1 5.7983 17.3127)" fill="#619319" font-family="'Futura'" font-size="16.3442px">A</text>
`
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'ᴀᴄᴏʀɴ: Explore actionable smalls for selected node',
        svgIcon: actionablesIcon,
        positionPriority: 993,
        onClick: () => {
          miro.board.ui.openLeftSidebar('actionables-sidebar.html')
        }
      }
    }
  })
})
