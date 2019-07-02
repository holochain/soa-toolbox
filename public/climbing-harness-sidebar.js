rtb.onReady(() => {
  // subscribe on user selected widgets
  rtb.addListener(rtb.enums.event.SELECTION_UPDATED, updateSidebarWrapper)
  updateSidebar()
})

function updateSidebarWrapper() {
  updateSidebar()
  console.log("calling updateSidebar from selection update listener!")
}

// get the entire text of a node without any of the characters phloem adds
function getFullTextFromNode(node) {
  return node.text.replace(/⋅/g,'') // remove newline markers if there are any
}

// calculate the issue title from a node's text
function getTitleFromNode(node) {
  let titleLength = 13

  var fullText = getFullTextFromNode(node)

  // remove metadata (stuff after ##)
  var textWithoutMetadata
  if (fullText.includes('##')) {
    textWithoutMetadata = fullText.split('##').slice(0, -1).join(' ')
  } else {
    textWithoutMetadata = fullText
  }

  // get the first x words to use as the title
  if (textWithoutMetadata.split(' ').length <= titleLength) {
    return textWithoutMetadata
  } else {
    // add ... if the text is longer than 10 words
    return textWithoutMetadata.split(' ').slice(0,titleLength).join(' ') + "..."
  }
}

// returns a hash of the ID and short and long text of each node in the given array.
// Example: { 84759034802: ['This is...', 'This is a test node.'], 9879: ['Another...', 'Another one.'] }
function makeNodeList(nodeArray) {
  nodeList = {}
  // console.log("nodearray:")
  // console.log(nodeArray)
  nodeArray.forEach(node => {
    if (node == undefined) {
      return
    } else {
      nodeList[node.id] = [getTitleFromNode(node), getFullTextFromNode(node)]
    }
  })
  return nodeList
}

function clearLists() {
  while (parentListElement.firstChild) {
    parentListElement.removeChild(parentListElement.firstChild)
  }
  while (childListElement.firstChild) { // FIXME refactor
    childListElement.removeChild(childListElement.firstChild)
  }
}

async function doOnclick(id) {
  clearLists()
  // console.log(await rtb.board.viewport.getZoom())
  let zoom = await rtb.board.viewport.getZoom()
  await rtb.board.viewport.setZoom(zoom * .60)
  console.log("SELECTION ABOUT TO BE SET BY ONCLICK FUNCTION!")
  selected = await rtb.board.selection.selectWidgets(id)
  console.log("selected widgets:")
  console.log(selected)
}
function doOnMouseover(id) {
  rtb.board.viewport.zoomToObject(id)
}
function doOnMouseout(id) {
  rtb.board.viewport.setViewportWithAnimation(viewport)
}

async function getViewport() {
  let viewport = await rtb.board.viewport.getViewport()
  return viewport
}

// generates a style string from the given node
// should have in the sidebar so they show up the right color
async function getNodeStyle(id) {
  let ns = await rtb.board.widgets.get({id: id})
  let n = ns[0]

  return n.style
}

// Get html elements for tip and text container
const tipElement = document.getElementById('tip')
const nodeElement = document.getElementById('node')
const nodeTitleElement = nodeElement.children['node-title']
const parentListElement = document.getElementById('parent-list')
const childListElement = document.getElementById('child-list')

async function updateSidebar() {
  console.log("updateSidebar WAS RUN!")
  // hide tip and show node in sidebar
  // requires title to be defined
  function hideTipShowText() {
    tipElement.style.opacity = '0'
    nodeElement.style.opacity = '1'
    nodeTitleElement.textContent = title
  }
  // show tip, clear node title, and clear parents/children
  function clearSidebar() {
    tipElement.style.opacity = '1'
    nodeElement.style.opacity = '0'
    nodeTitleElement.textContent = '&nbsp;'
    clearLists()
  }
  async function updateLists(parentList, childList) {
    l = {1: [parentList, parentListElement], 2: [childList, childListElement]}
    //console.log(l)
    // do the updating list process once for parents and once for children
    for (var entry in l) {
      list = l[entry][0]
      element = l[entry][1]

      //////
      for (var key in list) {
        let title = list[key][0]
        let fullText = list[key][1]
        let id = key

        var o = document.createElement('li')
        o.classList.add("nav-link")
        // o.title = fullText
        o.onclick = function() { doOnclick(id) }
        o.onmouseover = function() { doOnMouseover(id) }
        o.onmouseout = function() { doOnMouseout(id) }
        o.appendChild(document.createTextNode(title))

        let nodeStyle = await getNodeStyle(id)
        o.style.backgroundColor = nodeStyle.backgroundColor
        o.style.borderColor = nodeStyle.borderColor
        o.style.borderWidth = nodeStyle.borderWidth / 2 + "px"
        o.style.color = nodeStyle.textColor
        o.style.fontWeight = nodeStyle.bold == 1 ? "bold" : "inherit"

        element.appendChild(o)
      }
      //////

    }
  }
  function getChildNodes(node) {
    // filter for the edges where the node of interest
    // is the 'endWidgetId', meaning it is the parent, and the 'startWidgetId' is the child
    var edges = allObjects.filter(i => i.type === 'LINE')
    let childNodes = []
    let childrenEdges = edges.filter(l => l.endWidgetId === node.id)
    childrenEdges.forEach(edge => {
        let childNode = allObjects.find(o => o.id === edge.startWidgetId)
        childNodes.push(childNode)
      })
    return childNodes
  }
  function getParentNodes(node) { // FIXME refactor?
    // filter for the edges where the node of interest
    // is the 'startWidgetId', meaning it is the child, and the 'endWidgetId' is the parent
    var edges = allObjects.filter(i => i.type === 'LINE')
    let parentNodes = []
    let parentEdges = edges.filter(l => l.startWidgetId === node.id)
    parentEdges.forEach(edge => {
        let parentNode = allObjects.find(o => o.id === edge.endWidgetId)
        parentNodes.push(parentNode)
      })
    return parentNodes
  }

  clearSidebar()

  // Get selected widgets
  let widgets = await rtb.board.selection.get()
  // If there's no selection, don't do anything
  if (widgets[0] == undefined) {
    return
  }

  // Get first widget from selected widgets
  var widget = widgets[0]
  var text = widget.text
  var type = widget.type

  // Check that widget is a valid node with a title. If it's not, stop.
  if (typeof text !== 'string' || type != "SHAPE") {
    console.log("valid node must be selected!")
    return
  }

  var title = getTitleFromNode(widgets[0])
  var allObjects = await rtb.board.getAllObjects()
  hideTipShowText()

  parentNodeList = makeNodeList(getParentNodes(widget))
  childNodeList = makeNodeList(getChildNodes(widget))
  console.log(`parentNodeList:`)
  console.log(parentNodeList)
  console.log(`childNodeList:`)
  console.log(childNodeList)
  viewport = await rtb.board.viewport.getViewport()
  console.log("Updating Lists!")
  updateLists(parentNodeList, childNodeList)
}
