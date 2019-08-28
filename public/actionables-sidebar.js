miro.onReady(() => {
  // subscribe on user selected widgets
  miro.addListener(miro.enums.event.SELECTION_UPDATED, updateSidebar)
  // update the sidebar once when it first opens
  updateSidebar()
})

const MAX_NODES = 9999999

// get the entire text of a node without any of the characters phloem adds
function getFullTextFromNode(node) {
  html = node.text
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '')
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '')
  html = html.replace(/<\/div>/ig, '\n')
  html = html.replace(/<\/li>/ig, '\n')
  html = html.replace(/<li>/ig, '  *  ')
  html = html.replace(/<\/ul>/ig, '\n')
  html = html.replace(/<\/p>/ig, '\n')
  html = html.replace(/<br\s*[\/]?>/gi, "\n")
  html = html.replace(/<[^>]+>/ig, '')
  text = html.replace(/⋅/g,'') // remove newline markers if there are any
  return text
}

// calculate the issue title from a node's text
function getTitleFromNode(node) {
  const titleLength = 13

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
  // trim list of nodes to max length
  nodeArrayTrimmed = nodeArray.slice(0, MAX_NODES)
  nodeArrayTrimmed.forEach(node => {
    if (node == undefined) {
      return
    }
    nodeList[node.id] = [getTitleFromNode(node), getFullTextFromNode(node)]
  })
  return nodeList
}

// remove all items from the lists
function clearList() {
  while (listElement.firstChild) {
    listElement.removeChild(listElement.firstChild)
  }
}

// zoom out a bit and select the node when a list item is clicked on
async function doOnclick(id) {
  // clear both lists so the sidebar is empty when the viewport is animating
  clearList()
  let zoomLevel = await miro.board.viewport.getZoom()  // store current zoom level
  await miro.board.viewport.setZoom(zoomLevel * 1.10)  // zoom in just a bit
  await miro.board.selection.selectWidgets(id) // then select the current widget
}
// when a list item is moused over, zoom to that widget after a quick pause.
// once looking at it, zoom out a bunch to show the context (where in the tree)
// the node is.
function doOnMouseover(id) {
  // delay between mousing over a list item and zooming over to preview it (ms)
  const delayBeforePreviewZoom = 250
  // delay between starting to zoom to a widget and zooming out for context (ms)
  const delayBeforeShowContextZoom = 600
  // how much to zoom out to show context
  const showContextZoomFactor = .30

  function previewZoom() {
    async function showContextZoom() {
      let zoomLevel = await miro.board.viewport.getZoom()
      await miro.board.viewport.setZoom(zoomLevel * showContextZoomFactor)
    }
    miro.board.viewport.zoomToObject(id)
    showContextZoomTimer = window.setTimeout(showContextZoom, delayBeforeShowContextZoom)
  }

  previewZoomTimer = window.setTimeout(previewZoom, delayBeforePreviewZoom)
}
// when the mouse stops hovering over a list item, return to the viewport we
// saved when updateSidebar was called (usually when the node was selected)
function doOnMouseout(id) {
  miro.board.viewport.setViewportWithAnimation(viewport)
  window.clearTimeout(showContextZoomTimer)
  window.clearTimeout(previewZoomTimer)
}

// returns the style object of the element with the given ID so the list item in
// the sidebar can match its background color, font weight, border color, and
// border width.
async function getNodeStyle(id) {
  let nodes = await miro.board.widgets.get({id: id})
  let node = nodes[0] // there can only be one node with a given ID
  return node.style
}

async function getNodeX(id) {
  let nodes = await miro.board.widgets.get({id: id})
  let node = nodes[0] // there can only be one node with a given ID
  return node.x
}

// Get html elements for tip and lists
const tipElement = document.getElementById('tip')
const listElement = document.getElementById('list')
const nodeTitleElement = document.getElementById('node-title')

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

  // don't do anything if the listener was triggered by an unresolved promise
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
    nodeTitleElement.style.opacity = '1'
    nodeTitleElement.textContent = title
  }
  // show tip, clear node title, and clear parents/children
  function clearSidebar() {
    tipElement.style.opacity = '1'
    nodeTitleElement.style.opacity = '0'
    nodeTitleElement.textContent = '-'
    clearList()
  }

  async function updateList(list) {
    // update the list of each relation (parents/children)

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
    elementList.forEach(o => listElement.appendChild(o))
  }

  // walk the tree recursively to generate a list of all leaf nodes
  // then filter the list by background color to delete all complete nodes
  function getAllLeafNodes(node) {
    // get children of given node:
    // filter for the edges where the node of interest is the 'endWidgetId',
    // meaning it is the parent, and the 'startWidgetId' is the child
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

    // if the node has no children, it's a leaf so return it
    if (childNodes.length == 0) {
      return [node]
    } else {
      // otherwise the node has children, so recurse:
      // return an array of the result of this function run on all the children
      // nodes
      let out = []
      childNodes.forEach(c => {
        // RECURSIVE STEP!
        // for each child node, recurse
        subChildren = getActionableNodes(c)
        // and combine the results into one array
        out = out.concat(subChildren)
      })
      return out
    }
  }

  // filter for nodes that aren't complete or purple
  function getActionableNodes(node) {
    const unactionableColors = ['#8fd14f', '#9510ac']

    leaves = getAllLeafNodes(node)
    return leaves.filter(l => {
      b = l.style.backgroundColor
      return !unactionableColors.includes(b)
    })
  }
  ///// //// /// // / END FUNCTIONS / // /// //// /////

  // Get selected widgets
  let widgets = await miro.board.selection.get()
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

  // set up variables that updateList implicitly needs
  var title = getTitleFromNode(widgets[0])
  var allObjects = await miro.board.getAllObjects()
  viewport = await miro.board.viewport.getViewport()
  var showContextZoomTimer
  var previewZoomTimer

  // set up updateList parameters
  var nodeList = makeNodeList(getActionableNodes(widget))

  hideTipShowText() // show current node text
  updateList(nodeList)
}
