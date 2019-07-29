rtb.onReady(() => {
  // subscribe on user selected widgets
  rtb.addListener(rtb.enums.event.SELECTION_UPDATED, updateSidebar)
  // update the sidebar once when it first opens
  updateSidebar()
})

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
// later we use this hash to build the list of the parent and children nodes.
// The title is required to display in the box, and the id is required so that
// we can zoom the viewport to that node onclick.
function makeNodeList(nodeArray) {
  nodeList = {}
  // console.log("nodearray:")
  // console.log(nodeArray)
  nodeArray.forEach(node => {
    if (node == undefined) {
      return
    }
    nodeList[node.id] = [getTitleFromNode(node), getFullTextFromNode(node)]
  })
  return nodeList
}

// remove all items from both lists
function clearLists() {
  while (parentListElement.firstChild) {
    parentListElement.removeChild(parentListElement.firstChild)
  }
  while (childListElement.firstChild) { // refactor?
    childListElement.removeChild(childListElement.firstChild)
  }
}

// zoom out a bit and select the node when a list item is clicked on
async function doOnclick(id) {
  // clear both lists so the sidebar is empty when the viewport is animating
  clearLists()
  let zoomLevel = await rtb.board.viewport.getZoom()  // store current zoom level
  await rtb.board.viewport.setZoom(zoomLevel * 1.10)  // zoom in just a bit
  await rtb.board.selection.selectWidgets(id) // then select the current widget
}
// when a list item is moused over, zoom to that widget after a quick pause.
// once looking at it, zoom out a bunch to show the context (where in the tree)
// the node is.
function doOnMouseover(id) {
  // delay between mousing over a list item and zooming over to preview it (ms)
  let delayBeforePreviewZoom = 250
  // delay between starting to zoom to a widget and zooming out for context (ms)
  let delayBeforeShowContextZoom = 600
  // how much to zoom out to show context
  let showContextZoomFactor = .30

  function previewZoom() {
    async function showContextZoom() {
      let zoomLevel = await rtb.board.viewport.getZoom()
      await rtb.board.viewport.setZoom(zoomLevel * showContextZoomFactor)
    }
    rtb.board.viewport.zoomToObject(id)
    showContextZoomTimer = window.setTimeout(showContextZoom, delayBeforeShowContextZoom)
  }

  previewZoomTimer = window.setTimeout(previewZoom, delayBeforePreviewZoom)
}
// when the mouse stops hovering over a list item, return to the viewport we
// saved when updateSidebar was called (usually when the node was selected)
function doOnMouseout(id) {
  rtb.board.viewport.setViewportWithAnimation(viewport)
  window.clearTimeout(showContextZoomTimer)
  window.clearTimeout(previewZoomTimer)
}

// returns the style object of the element with the given ID so the list item in
// the sidebar can match its background color, font weight, border color, and
// border width.
async function getNodeStyle(id) {
  let nodes = await rtb.board.widgets.get({id: id})
  let node = nodes[0] // there can only be one node with a given ID
  return node.style
}

async function getNodeX(id) {
  let nodes = await rtb.board.widgets.get({id: id})
  let node = nodes[0] // there can only be one node with a given ID
  return node.x
}

// Get html elements for tip and lists
const tipElement = document.getElementById('tip')
const nodeElement = document.getElementById('node')
const nodeTitleElement = nodeElement.children['node-title']
const parentListElement = document.getElementById('parent-list')
const childListElement = document.getElementById('child-list')

// called each time the selection changes.
// Takes 1 param: the triggering event which is sneakily passed in by the
// listener. We check this event to make sure it has data because the listener
// can be triggered by unresolved promises, which we want to ignore. trigger
// defaults to a fake event with data so that if the function is called with no
// parameters, it runs.
async function updateSidebar(trigger = {data: ["go"]}) {

  // clear sidebar every time selection is updates so we don't build up more and
  // more list items
  clearSidebar()

  // don't do anything if the lisntener was triggered by an unresolved promise
  // this happens when deselecting
  if (trigger.data[0] == undefined) {
    console.log("Sidebar update without data!")
    return
  }

  ///// //// /// // / FUNCTIONS / // /// //// /////
  // hide tip and show current node in sidebar
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
    // update the list of each relation (parents/children)
    [[parentList,parentListElement], [childList,childListElement]].forEach(async relation => {
      var list = relation[0]
      var element = relation[1]

      // generate a list of html li elements from the list of relations
      var elementList = []
      for (var key in list) {
        // for each key, get the title and id
        let title = list[key][0]
        let id = key

        var o = document.createElement('li') // create the new html element 'o'
        o.classList.add("nav-link")
        o.onclick = function() { doOnclick(id) }
        o.onmouseover = function() { doOnMouseover(id) }
        o.onmouseout = function() { doOnMouseout(id) }
        o.appendChild(document.createTextNode(title)) // label with node title

        // give the element style to match the node it corresponds to
        let nodeStyle = await getNodeStyle(id)
        o.style.backgroundColor = nodeStyle.backgroundColor
        o.style.borderColor = nodeStyle.borderColor
        o.style.borderWidth = nodeStyle.borderWidth / 2 + "px"
        o.style.color = nodeStyle.textColor
        o.style.fontWeight = nodeStyle.bold == 1 ? "bold" : "inherit"

        // store the node's x coordinate as data-* attribute on the html element
        let nodeX = await getNodeX(id)
        o["data-x"] = nodeX

        elementList.push(o) // append the li element to the list
      }

      // sort the list of li elements by x coordinate
      elementList.sort((a, b) => a["data-x"] - b["data-x"])

      // append all the elements to the correct parent element (a ul) in order
      elementList.forEach(o => element.appendChild(o))
    })
  }

  function getChildNodes(node) {
    // filter for the edges where the node of interest
    // is the 'endWidgetId', meaning it is the parent, and the 'startWidgetId' is the child
    var edges = allObjects.filter(i => i.type === 'LINE')
    let childNodes = []
    let childrenEdges = edges.filter(l => l.endWidgetId === node.id)
    childrenEdges.forEach(edge => {
        let childNode = allObjects.find(o => o.id === edge.startWidgetId)
        // only add valid nodes to the list
        if (typeof childNode.text !== 'string' || childNode.type != "SHAPE") {
          return
        }
        childNodes.push(childNode)
      })
    return childNodes
  }
  function getParentNodes(node) { // FIXME refactor
    var edges = allObjects.filter(i => i.type === 'LINE')
    let parentNodes = []
    let parentEdges = edges.filter(l => l.startWidgetId === node.id)
    parentEdges.forEach(edge => {
        let parentNode = allObjects.find(o => o.id === edge.endWidgetId)
        if (typeof parentNode.text !== 'string' || parentNode.type != "SHAPE") {
          return
        }
        parentNodes.push(parentNode)
      })
    return parentNodes
  }
  ///// //// /// // / END FUNCTIONS / // /// //// /////

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
    console.log("Valid node must be selected!")
    return
  }

  // set up variables that updateLists implicitly needs
  var title = getTitleFromNode(widgets[0])
  var allObjects = await rtb.board.getAllObjects()
  viewport = await rtb.board.viewport.getViewport()
  var showContextZoomTimer
  var previewZoomTimer

  // set up updateList parameters
  var parentNodeList = makeNodeList(getParentNodes(widget))
  var childNodeList = makeNodeList(getChildNodes(widget))

  hideTipShowText() // show current node text
  updateLists(parentNodeList, childNodeList)
}
