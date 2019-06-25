rtb.onReady(() => {
  // subscribe on user selected widgets
  rtb.addListener(rtb.enums.event.SELECTION_UPDATED, getWidget)
  getWidget()
})

// get the entire text of a node without any of the characters phloem adds
function getFullTextFromNode(node) {
  return node.text.replace(/⋅/g,'') // remove newline markers if there are any
}

// calculate the issue title from a node's text
function getTitleFromNode(node) {
  let titleLength = 10

  var fullText = getFullTextFromNode(node)
  // get the first x words to use as the title
  if (fullText.split(' ').length <= titleLength) {
    return fullText
  } else {
    // add ... if the text is longer than 10 words
    return fullText.split(' ').slice(0,titleLength).join(' ') + "..."
  }
}

// Get html elements for tip and text container
const tipElement = document.getElementById('tip')
const nodeElement = document.getElementById('node')
const nodeTitleElement = nodeElement.children["node-title"]

async function getWidget() {
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
  }

  // Get selected widgets
  let widgets = await rtb.board.selection.get()

  // If there's no selection, don't do anything
  if (widgets[0] == undefined) {
    clearSidebar()
    return
  }

  // Get first widget from selected widgets
  var widget = widgets[0]
  var text = widget.text
  var type = widget.type

  // Check that widget is a valid node with a title
  if (typeof text === 'string' && type == "SHAPE") {
    title = getTitleFromNode(widgets[0])
    hideTipShowText()
  } else {
    clearSidebar()
  }
}
