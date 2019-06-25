rtb.onReady(() => {
  const climbingHarnessIcon = `<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"></circle>`
  rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'ᴀᴄᴏʀɴ: Climbing Harness',
        svgIcon: climbingHarnessIcon,
        positionPriority: 2,
        onClick: () => {
          rtb.board.ui.openLeftSidebar('climbing-harness-sidebar.html')
        }
      }
    }
  })
})
