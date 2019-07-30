rtb.onReady(() => {
  const actionablesIcon = `
  <circle cx="12" cy="12" r="10" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2.5"/>
  <circle fill="#8E8E8E" cx="16.6" cy="14.2" r="0.8"/>
`
  rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'ᴀᴄᴏʀɴ: Actionables',
        svgIcon: actionablesIcon,
        positionPriority: 2,
        onClick: () => {
          rtb.board.ui.openLeftSidebar('actionables-sidebar.html')
        }
      }
    }
  })
})
