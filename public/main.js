
const devMode = false
const liveUrl = 'https://soa-tree.herokuapp.com'
const devUrl = 'https://958628dd.ngrok.io'

rtb.onReady(() => {
  rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Calculate Subtree Sizes for Selected',
        svgIcon: '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: updateDataForSelected
      }
    }
  })
})


async function updateDataForSelected() {
  // gets the selected widgets on the board, returns an array
  let selection = await rtb.board.getSelection()

  // validate that we can proceed with the selected item
  if (!validateSelection(selection)) return

  rtb.showNotification('Calculating subtree sizes')

  // root is the widget that things will be calculated starting from and in relation to
  let root = selection[0]

  // get the entire list of objects on the board as an array
  let allObjects = await rtb.board.getAllObjects()

  // collect the full list of edges
  let edges = allObjects.filter(i => i.type === 'LINE')

  // starting with the root and recursing, calculate all the sizes of the subtrees, and update the nodes
  getAndSetCountsForNode(root, allObjects, edges)
  rtb.showNotification('Successfully set subtree sizes')
}

const uncertainRed = "#f24726"
const incompleteYellow = "#fac710"
const completeGreen = "#8fd14f"
const smallGreen = "#0ca789"

const countPrefix = "##"

function getAndSetCountsForNode(node, allObjects, edges) {
  // initialize the counts for this node
  let counts = {
    totalSmallCount: 0,
    completeSmallCount: 0,
    uncertainCount: 0
  }
  // increase the counts for this node to include the counts of its children
  // filter for the edges where the node of interest
  // is the 'endWidgetId', meaning it is the parent, and the 'startWidgetId' is the child
  let childrenEdges = edges.filter(l => l.endWidgetId === node.id)
  childrenEdges.forEach(edge => {
    let childNode = allObjects.find(o => o.id === edge.startWidgetId)
    let childCounts = getAndSetCountsForNode(childNode, allObjects, edges)
    counts.totalSmallCount += childCounts.totalSmallCount
    counts.completeSmallCount += childCounts.completeSmallCount
    counts.uncertainCount += childCounts.uncertainCount
  })

  // at this point, the counts only include the totals of its children
  // use this moment to update the label for this node
  const countText = `${countPrefix} S: ${counts.completeSmallCount}/${counts.totalSmallCount} U: ${counts.uncertainCount}`
  const newText = `${stripOfCounts(node.text)}<br>${countText}`
  rtb.board.widgets.shapes.update(node.id, { text: newText })

  // now determine what this node itself is

  // get the background color and border color, since that's representing completion
  let backgroundColor = node.style && (node.style.backgroundColor || node.style.stickerBackgroundColor)
  let borderColor = node.style && node.style.borderColor

  // uncertain or small?
  if (backgroundColor === uncertainRed) counts.uncertainCount++
  else if (borderColor === smallGreen) counts.totalSmallCount++

  // if a small, complete?
  console.log(borderColor, smallGreen)
  console.log(backgroundColor, completeGreen)
  if (borderColor === smallGreen && backgroundColor === completeGreen) counts.completeSmallCount++
  
  // return counts so that recursion can happen
  return counts
}

function stripOfCounts(text) {
  const index = text.indexOf(countPrefix)
  // trim off the counts info if its there already, leave as is otherwise
  return index > -1 ? text.slice(0, index).trim() : text.trim()
}

function validateSelection(selection) {
  // validate only one selection
  if (selection.length > 1) {
    rtb.showNotification('You must only have one node selected')
    return false
  } else if (selection.length === 0) {
    rtb.showNotification('You must have at least one node selected')
    return false
  } else if (selection[0].type !== "SHAPE") {
    rtb.showNotification('The selected element must be a node')
    return false
  } else {
    return true
  }
}