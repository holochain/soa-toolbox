miro.onReady(() => {
  const climbingHarnessIcon = `
  <circle cx="12" cy="12" r="10" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2.5"/>
  <path fill="#619319" d="M13.9,9.4c-0.4-0.2-0.3-0.8-0.7-1.5c-0.4-0.7-1.1-0.9-1.4-1c-1.3-0.5-3.1-0.1-3.9,1C7.8,8,7.3,8.8,7.5,9.6
  	c0.1,0.6,0.4,0.9,0.6,1.1c0.5,0.6,2.7,3.9,5.2,6.2c0.2,0.2,0.6,0.5,1.1,0.6c0.7,0,1.3-0.5,1.4-0.6c0.1-0.1,0.5-0.5,0.5-1
  	c0.1-1-0.7-1.7-0.8-1.8c0.5-0.3,0.9-0.3,1.3-0.6c0.2,0.3,0.6,0.6,0.8,1.3c0.1,0.3,0.3,1,0,1.9c-0.4,1.4-1.7,2-1.8,2.1
  	c-1.4,0.6-2.6,0.2-2.9-0.1c-0.4-0.2-4.2-5-6.4-7.6c-0.1-0.2-0.4-0.9-0.4-1C5.9,9.7,5.8,9.2,5.8,8.9c0-1.3,1.6-2.5,1.7-2.6
  	c1.3-1,2.7-1.1,3.3-1.1c0.8,0,1.8,0.1,2.8,0.7c1.3,1,1.6,2.6,1.6,2.7c0,0.1,0,0.3,0,0.3C14.5,9.5,14.1,9.5,13.9,9.4z"/>
  <rect x="10.7" y="11.5" transform="matrix(0.7912 0.6116 -0.6116 0.7912 10.4305 -6.0004)" fill="#8E8E8E" width="6.6" height="1.6"/>
  <rect x="12.4" y="11.4" transform="matrix(0.7912 0.6116 -0.6116 0.7912 10.5819 -6.1004)" fill="#5B5B5B" width="3.6" height="2.2"/>
  <circle fill="#8E8E8E" cx="16.6" cy="14.2" r="0.8"/>
`
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'ᴀᴄᴏʀɴ: Explore parents and children of selected node',
        svgIcon: climbingHarnessIcon,
        positionPriority: 994,
        onClick: () => {
          miro.board.ui.openLeftSidebar('climbing-harness-sidebar.html')
        }
      }
    }
  })
})
