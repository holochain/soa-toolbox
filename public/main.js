rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'State of Affairs Tree',
        svgIcon: '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: () => {
          rtb.board.getAllObjects().then(results => {
            //let allWidgets = results.filter(x => x.type != "FRAME")

            fetch('https://a65ecbed.ngrok.io/update-soa-tree-data', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(results)
            }).then(() => {
              rtb.showNotification('Data was saved. Check out https://f5f8dd0b.ngrok.io for visualizations of the tree.')
            })
          })          
        }
      }
    }
  })