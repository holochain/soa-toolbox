rtb.onReady(() => {
  rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Acorn: alculate Subtree Sizes for Selected',
        svgIcon: '<circle cx="12" cy="12" r="9" fill="solid" fill-rule="evenodd" stroke="currentColor" stroke-width="1"/>',
        positionPriority: 2,
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
const timeTeal = "#12cdd4"

const countPrefix = "##"
const historySeparator = "--"

function getAndSetCountsForNode(node, allObjects, edges) {
  // initialize the counts for this node
    let counts = {
        uncertain: {},
        completedSmall: {},
        uncompletedSmall:{}
    }
  // increase the counts for this node to include the counts of its children
  // filter for the edges where the node of interest
  // is the 'endWidgetId', meaning it is the parent, and the 'startWidgetId' is the child
  let childrenEdges = edges.filter(l => l.endWidgetId === node.id)
  childrenEdges.forEach(edge => {
      let childNode = allObjects.find(o => o.id === edge.startWidgetId)
      let childCounts = getAndSetCountsForNode(childNode, allObjects, edges)
      counts = {uncertain:{...childCounts.uncertain,...counts.uncertain},
                completedSmall:{...childCounts.completedSmall,...counts.completedSmall},
                uncompletedSmall:{...childCounts.uncompletedSmall,...counts.uncompletedSmall}
               }
  })

    const completedSmallCount = Object.keys(counts.completedSmall).length
    const uncompletedSmallCount = Object.keys(counts.uncompletedSmall).length
    const totalSmallCount = completedSmallCount + uncompletedSmallCount
    const uncertainCount = Object.keys(counts.uncertain).length
  // at this point, the counts only include the totals of its children
  // use this moment to update the label for this node
  let countText = `S: ${uncompletedSmallCount}/${totalSmallCount} U: ${uncertainCount}`

  // get the main text from the current node
    const orig_text = node.text.split(" "+countPrefix+" ")
    const main_text = orig_text[0]
    const old_counts = orig_text[1]

  // get the background color and border color, since that's representing completion and node-type
  let backgroundColor = node.style && (node.style.backgroundColor || node.style.stickerBackgroundColor)
  let borderColor = node.style && node.style.borderColor

    if (backgroundColor === timeTeal && old_counts != undefined) {
        const count_parts = old_counts.split(" "+historySeparator+" ") // spaces because thats what the brs show up as
        const history = count_parts[1] === undefined ? [] : parseHistory(count_parts[1])
        const prediction = predict(history)
        const d = new Date();
        if (history.length == 0 || !isToday(history[0].date)) {
            const todays_date = dateStr(d)
            var today = `${todays_date}: ${uncompletedSmallCount}/${totalSmallCount}`;
            countText = `${countText}%${prediction}<br/>${historySeparator}<br/>${today};<br/>${historyToString(history)}`
        } else {
            countText = `${countText}%${prediction}<br/>${historySeparator}<br/>${historyToString(history)}`
        }
    }

  // now determine what this node itself is

  // uncertain or small?
    if (backgroundColor === uncertainRed) counts.uncertain[node.id] = true
    else if (borderColor === smallGreen) {
        if (backgroundColor === completeGreen) {
            counts.completedSmall[node.id] = true
        } else {
            counts.uncompletedSmall[node.id] = true
        }
    }

    // now update the text for the node
    const newText = `${main_text}<br>${countPrefix} ${countText}`
    rtb.board.widgets.shapes.update(node.id, { text: newText })


  // return counts so that recursion can happen
  return counts
}

function parseDate(date_str) {
    const parts = date_str.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function dateStr(d) {
    return d.getFullYear()  + "-" + ("0"+(d.getMonth()+1)).slice(-2)+ "-"+ ("0" + d.getDate()).slice(-2)
}

function predict(history) {
    const points = history.map(x=>{const date = Date.parse(x.date); return [parseInt(x.uncomplete),date]})
    if (points.length <3) {return ""}
    const r = new regression("linear",points.reverse())

    // the slope of the result has to be negative otherwise it means
    // we'll never finish
    if (r.string.startsWith("y = -")) {
        const zeroPoint = r.equation[1]
        return dateStr(new Date(zeroPoint))
    } else {
        return "NEVER!";
    }
}

function isToday(date_str) {
    const first = parseDate(date_str);
    const second = new Date();
    return first.getYear() == second.getYear() && first.getDate() == second.getDate() && first.getMonth() == second.getMonth()
}

function historyToString(history) {
    return history.map(x => {
        return `${x.date}: ${x.uncomplete}/${x.total}`
    }).join(";<br/>")
}

function parseHistory(historyStr) {
    const h = historyStr.split("; ");
    return h.map(x => {
        const y= x.split(": ")
        const z = y[1].split("/")
        return {
            date: y[0],
            uncomplete: z[0],
            total: z[1]
    }})
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
