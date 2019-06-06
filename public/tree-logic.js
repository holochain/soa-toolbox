rtb.onReady(() => {
  const treeLogicIcon = `
  <svg>
  <line x1="5.0" y1="8" x2="5.0" y2=16 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="5.5" y1="8.0" x2="5.5" y2=16.0 stroke="hsl(8, 81%, 53%)" stroke-width="1"/>
  <line x1="6.0" y1="7.5" x2="6.0" y2=16.5 stroke="hsl(8, 81%, 53%)" stroke-width="1"/>
  <line x1="6.5" y1="7.0" x2="6.5" y2=17.0 stroke="hsl(9, 81%, 53%)" stroke-width="1"/>
  <line x1="7.0" y1="5.0" x2="7.0" y2=19.0 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="7.5" y1="5.0" x2="7.5" y2=19.0 stroke="hsl(14.2, 81%, 53%)" stroke-width="1"/>
  <line x1="8.0" y1="4.5" x2="8.0" y2=19.5 stroke="hsl(18.4, 81%, 53%)" stroke-width="1"/>
  <line x1="8.5" y1="4.5" x2="8.5" y2=19.5 stroke="hsl(22.6, 81%, 53%)" stroke-width="1"/>
  <line x1="9.0" y1="4.5" x2="9.0" y2=19.5 stroke="hsl(26.8, 81%, 53%)" stroke-width="1"/>
  <line x1="9.5" y1="4.5" x2="9.5" y2=19.5 stroke="hsl(31.0, 81%, 53%)" stroke-width="1"/>
  <line x1="10.0" y1="4.0" x2="10.0" y2=20.0 stroke="hsl(35.2, 81%, 53%)" stroke-width="1"/>
  <line x1="10.5" y1="3.75" x2="10.5" y2=20.25 stroke="hsl(39.4, 81%, 53%)" stroke-width="1"/>
  <line x1="11.0" y1="3.75" x2="11.0" y2=20.25 stroke="hsl(43.6, 81%, 53%)" stroke-width="1"/>
  <line x1="11.5" y1="3.75" x2="11.5" y2=20.25 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="12.0" y1="3.75" x2="12.0" y2=20.25 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="12.5" y1="3.75" x2="12.5" y2=20.25 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="13.0" y1="3.75" x2="13.0" y2=20.25 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="13.5" y1="3.75" x2="13.5" y2=20.25 stroke="hsl(51.7, 81%, 53%)" stroke-width="1"/>
  <line x1="14.0" y1="3.75" x2="14.0" y2=20.25 stroke="hsl(56.4, 81%, 53%)" stroke-width="1"/>
  <line x1="14.5" y1="4.0" x2="14.5" y2=20.0 stroke="hsl(61.1, 81%, 53%)" stroke-width="1"/>
  <line x1="15.0" y1="4.5" x2="15.0" y2=19.5 stroke="hsl(65.8, 81%, 53%)" stroke-width="1"/>
  <line x1="15.5" y1="4.5" x2="15.5" y2=19.5 stroke="hsl(70.5, 81%, 53%)" stroke-width="1"/>
  <line x1="16.0" y1="4.5" x2="16.0" y2=19.5 stroke="hsl(75.2, 81%, 53%)" stroke-width="1"/>
  <line x1="16.5" y1="4.5" x2="16.5" y2=19.5 stroke="hsl(79.9, 81%, 53%)" stroke-width="1"/>
  <line x1="17.0" y1="5.0" x2="17.0" y2=19.0 stroke="hsl(84.6, 81%, 53%)" stroke-width="1"/>
  <line x1="17.5" y1="5.0" x2="17.5" y2=19.0 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="18.0" y1="7.0" x2="18.0" y2=17.0 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="18.5" y1="7.5" x2="18.5" y2=16.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="19.0" y1="8.0" x2="19.0" y2=16.0 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="19.5" y1="8.0" x2="19.5" y2=16.0 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="#000000" stroke-width="3" stroke-dasharray="2,2.3"/>
  <circle cx="12" cy="12" r="8.25" fill="none" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
  </svg> `

  rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'ᴀᴄᴏʀɴ: Calculate subtree sizes for selected', // note: gets turned to lowercase by Miro
        svgIcon: treeLogicIcon,
        positionPriority: 2,
        onClick: updateDataForSelected
      }
    }
  })
})


async function updateDataForSelected() {
  // gets the selected widgets on the board, returns an array
  let selection = await rtb.board.selection.get()

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
    var countText

  // get the main text from the current node
    const orig_text = node.text.split(" "+countPrefix+" ")
    const main_text = orig_text[0]
    const old_counts = orig_text[1]

  // get the background color and border color, since that's representing completion and node-type
  let backgroundColor = node.style && (node.style.backgroundColor || node.style.stickerBackgroundColor)
  let borderColor = node.style && node.style.borderColor

    // update the history for time nodes.  We only need to do this if there was an old_counts value,
    // i.e. we can skip this if this is the very time the tree is being calculated.
    if (backgroundColor === timeTeal && old_counts != undefined) {
        const count_parts = old_counts.split(" "+historySeparator+" ") // spaces because thats what the brs show up as
        const history_str =  count_parts[1] === undefined ? "" : count_parts[1] ;
        countText = makeCountsWithHistoryStr(uncompletedSmallCount,totalSmallCount,uncertainCount,history_str)
    } else {
        // This is for non-time nodes, just use the plain counts string
        countText = makeCountsStr(uncompletedSmallCount,totalSmallCount,uncertainCount)
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

function makeCountsStr(uncompletedSmallCount,totalSmallCount,uncertainCount,prediction) {
    const base = `S: ${uncompletedSmallCount}/${totalSmallCount} U: ${uncertainCount}`
    return (!prediction) ? base : `${base} P: ${prediction}`
}

function makeCountsWithHistoryStr(uncompletedSmallCount,totalSmallCount,uncertainCount,history_str) {
    const history = history_str === "" ? [] : parseHistory(history_str)
    const prediction = predict(history)
    var countText = makeCountsStr(uncompletedSmallCount,totalSmallCount,uncertainCount,prediction)
    const d = new Date();

    // if there is no history at all, or if we are recalculating for the first time in a day
    // then add todays count to the top of the history.
    if (history.length == 0 || !isToday(history[0].date)) {
        const todays_date = dateStr(d)
        var today = `${todays_date}~ ${countText}`
        countText = `${countText}<br/>${historySeparator}<br/>${today}`
        if (history_str) {
            countText = `${countText};<br/>${historyToString(history)}`
        }
    } else {
        countText = `${countText}<br/>${historySeparator}<br/>${historyToString(history)}`
    }
    return countText
}


function parseDate(date_str) {
    const parts = date_str.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function dateStr(d) {
    return d.getFullYear()  + "-" + ("0"+(d.getMonth()+1)).slice(-2)+ "-"+ ("0" + d.getDate()).slice(-2)
}

function isToday(date_str) {
    const first = parseDate(date_str);
    const second = new Date();
    return first.getYear() == second.getYear() && first.getDate() == second.getDate() && first.getMonth() == second.getMonth()
}

function historyToString(history) {
    return history.map(x => {
        return `${x.date}~ ${makeCountsStr(x.uncomplete,x.total,x.unknown,x.prediction)}`
    }).join(";<br/>")
}

function parseHistory(historyStr) {
    const h = historyStr.split(/; */).filter(x=> x!="");

    const re = /([^~]+)~ S: (.*?)\/(.*?) U: (.*)( P: (.*?))*/;
    const old_re = /(.*?): (.*)\/(.*)/;
    return h.map(x => {
        let m = re.exec(x)
        if (m) {
            return {
                date: m[1],
                uncomplete: m[2],
                total: m[3],
                unknown: !m[4]?"?":m[4],
                prediction: m[6],
            }
        }
        m = old_re.exec(x)
        if (m) {
            return {
                date: m[1],
                uncomplete: m[2],
                total: m[3],
                unknown: "?"
            }
        }
    })
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
