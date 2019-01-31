var express = require('express')
var cors = require('cors')
var serveStatic = require('serve-static')
var app = express()

let soaTreeData = {
  nodes: [],
  links: []
}

// JSON parsing
app.use(express.json({limit: '50mb'}))

// necessary CORS headers
app.use(cors({
    origin: 'https://realtimeboard.com'
}))

// static file server
app.use(serveStatic('public'))

app.get('/get-soa-tree-data', function (req, res) {
  res.send(soaTreeData)
})

app.post('/update-soa-tree-data', function (req, res) {
  soaTreeData.nodes = []
  soaTreeData.links = []
  req.body.forEach(widget => {
    switch (widget.type) {
      case 'LINE':
       if (widget.startWidgetId && widget.endWidgetId) {
          soaTreeData.links.push({
            source: widget.startWidgetId,
            target: widget.endWidgetId
          })
        }
      default:
        soaTreeData.nodes.push({
          id: widget.id,
          name: widget.text || widget.title || "",
          val: 5,
          color: widget.style ? widget.style.backgroundColor || widget.style.stickerBackgroundColor : ''
        })
    }
  })
  res.sendStatus(200)
})

app.listen(process.env.PORT || 80, function () {
  console.log('CORS-enabled web server listening on port ' + (process.env.PORT || 80))
})