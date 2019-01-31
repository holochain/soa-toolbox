rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Update SoA Tree Data',
        svgIcon: '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: () => {
          rtb.board.getAllObjects().then(results => {
            //let allWidgets = results.filter(x => x.type != "FRAME")
            rtb.showNotification('Data is being saved to https://soa-tree.herokuapp.com')
            fetch('https://a65ecbed.ngrok.io/update-soa-tree-data', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(results)
            }).then(() => {
              rtb.showNotification('Data was saved. Check out https://soa-tree.herokuapp.com for visualizations of the tree.')
            })
          })          
        }
      }
    }
  })