require('dotenv').config()
var express = require('express')
var cors = require('cors')
var serveStatic = require('serve-static')
var app = express()
const config = require('./config.json')
const request = require('request');

let threeData = {
  nodes: [],
  links: []
}

// id, name, data, children []
let spaceTreeData = {}

// JSON parsing
app.use(express.json({limit: '50mb'}))

// necessary CORS headers
app.use(cors({
    origin: 'https://miro.com'
}))

// static file server
app.use(serveStatic('public'))

// send out issue information to GitHub API
app.post('/create-issue', function (req, res) {
  // console.log(`REQ: ${req}`)
  // req should contain information about the issue (title, body, labels), and
  // the repo it should be created in
  var url = 'https://api.github.com/repos/' + req.body.issueRepoPath + '/issues'
  // add acorn to the other labels
  req.body.issueLabels.push("acorn")

  // set up the issue JSON with the desired information
  var issue = {
    "title": req.body.issueTitle,
    "body": req.body.issueBody,
    "labels": req.body.issueLabels
  }

  request({
    url:url,
    method:"POST",
    json: true,
    body: issue,
    headers:  {
      'Authorization': 'Bearer ' + config.repos[req.body.issueRepoPath].accessToken,  // look up access token
      'Content-Type': 'application/json', 
      'User-Agent': 'soa-toolbox-server'
    }
  }, function (err, res, body) {
  // console.log(`RES: ${res}`)
  })

})

// share the list of repos from config file with Miro so we can display them in the modal pop-up
app.get('/get-config-repos', function (req, res) {
  // extract repo names from config file
  var repos = Object.keys(config.repos)
  // console.log(repos)
  res.send(repos)
})


app.get('/get-3d-data', function (req, res) {
  res.send(threeData)
})

app.get('/get-spacetree-data', function (req, res) {
  res.send(spaceTreeData)
})

app.post('/update-soa-tree-data', function (req, res) {

  // reset and build the threeData
  threeData.nodes = []
  threeData.links = []
  req.body.forEach(widget => {
    switch (widget.type) {
      case 'LINE':
       if (widget.startWidgetId && widget.endWidgetId) {
          threeData.links.push({
            source: widget.startWidgetId,
            target: widget.endWidgetId,
            id: widget.id
          })
        }
      default:
        threeData.nodes.push({
          id: widget.id,
          name: widget.text || widget.title || "",
          val: 5,
          color: widget.style ? widget.style.backgroundColor || widget.style.stickerBackgroundColor : ''
        })
    }
  })

  // build the data for the spacetree
    // gets the Holochain root node
  var rootId = '3074457346387129258'

  var closedAlphaRootNode = '3074457346342611504'
  var root = req.body.find(i => i.id === closedAlphaRootNode)
  spaceTreeData = {
    id: root.id,
    name: root.text,
    data: {
      $color: root.style ? root.style.backgroundColor || root.style.stickerBackgroundColor : 'red'
    },
    children: []
  }
  let collectedLinks = {}
  function addChildren(node) {
    threeData.links
      // get all the links that haven't been collected yet, and that are either from or to the node of interest
      .filter(link => (link.source === node.id || link.target === node.id) && !collectedLinks[link.id] && link.id !== '3074457346469683813')
      // add them to collected links, and to the children of the node of interest, and recurse
      .forEach(link => {
        collectedLinks[link.id] = link
        let connectedNodeId = link.source === node.id ? link.target : link.source
        let connectedNode = req.body.find(i => i.id === connectedNodeId)
        let childNode = {
          id: connectedNode.id,
          name: connectedNode.text,
          data: {
            $color: connectedNode.style ? connectedNode.style.backgroundColor || connectedNode.style.stickerBackgroundColor : 'red',
            small: connectedNode.style ? connectedNode.style.borderColor === "#0ca789" : false
          },
          children: []
        }
        addChildren(childNode)
        node.children.push(childNode)
      })
  }
  addChildren(spaceTreeData)

  res.sendStatus(200)
})

app.listen(process.env.PORT || 8088, function () {
  console.log('CORS-enabled web server listening on port ' + (process.env.PORT || 8088))
})
