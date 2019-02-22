
const devMode = false
const liveUrl = 'https://soa-tree.herokuapp.com'
const devUrl = 'https://f3c1fd60.ngrok.io'

rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Update SoA Tree Data',
        svgIcon: '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: () => {
          rtb.board.getAllObjects().then(results => {
            //let allWidgets = results.filter(x => x.type != "FRAME")
            rtb.showNotification('Data is being saved to ' + (devMode ? devUrl : liveUrl))
            fetch((devMode ? devUrl : liveUrl) + '/update-soa-tree-data', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(results)
            }).then(() => {
              rtb.showNotification('Data was saved. Check out ' + (devMode ? devUrl : liveUrl) + ' for visualizations of the tree.')
            })
          })
        }
      }
    }
  })