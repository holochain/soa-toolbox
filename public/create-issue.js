rtb.onReady(() => {
  const createIssueIcon = `
  <line x1="3.5" y1="8" x2="3.5" y2=16 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="4" y1="8" x2="4" y2=16 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="4.5" y1="6.5" x2="4.5" y2=17.5 stroke="hsl(9, 81%, 53%)" stroke-width="1"/>
  <line x1="5.0" y1="6.5" x2="5.0" y2=17.5 stroke="hsl(9, 81%, 53%)" stroke-width="1"/>
  <line x1="5.5" y1="6.0" x2="5.5" y2=18.0 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="6.0" y1="4.0" x2="6.0" y2=20.0 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="6.5" y1="3.5" x2="6.5" y2=20.5 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="7.0" y1="3.5" x2="7.0" y2=20.5 stroke="hsl(10, 81%, 53%)" stroke-width="1"/>
  <line x1="7.5" y1="3.5" x2="7.5" y2=20.5 stroke="hsl(14.2, 81%, 53%)" stroke-width="1"/>
  <line x1="8.0" y1="3.0" x2="8.0" y2=21.0 stroke="hsl(18.4, 81%, 53%)" stroke-width="1"/>
  <line x1="8.5" y1="3.0" x2="8.5" y2=21.0 stroke="hsl(22.6, 81%, 53%)" stroke-width="1"/>
  <line x1="9.0" y1="3.0" x2="9.0" y2=21.0 stroke="hsl(26.8, 81%, 53%)" stroke-width="1"/>
  <line x1="9.5" y1="2.5" x2="9.5" y2=21.5 stroke="hsl(31.0, 81%, 53%)" stroke-width="1"/>
  <line x1="10.0" y1="2.25" x2="10.0" y2=21.75 stroke="hsl(35.2, 81%, 53%)" stroke-width="1"/>
  <line x1="10.5" y1="2.25" x2="10.5" y2=21.75 stroke="hsl(39.4, 81%, 53%)" stroke-width="1"/>
  <line x1="11.0" y1="2.25" x2="11.0" y2=21.75 stroke="hsl(43.6, 81%, 53%)" stroke-width="1"/>
  <line x1="11.5" y1="2.25" x2="11.5" y2=21.75 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="12.0" y1="2.25" x2="12.0" y2=21.75 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="12.5" y1="2.25" x2="12.5" y2=21.75 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="13.0" y1="2.25" x2="13.0" y2=21.75 stroke="hsl(47, 81%, 53%)" stroke-width="1"/>
  <line x1="13.5" y1="2.25" x2="13.5" y2=21.75 stroke="hsl(51.7, 81%, 53%)" stroke-width="1"/>
  <line x1="14.0" y1="2.5" x2="14.0" y2=21.5 stroke="hsl(56.4, 81%, 53%)" stroke-width="1"/>
  <line x1="14.5" y1="3.0" x2="14.5" y2=21.0 stroke="hsl(61.1, 81%, 53%)" stroke-width="1"/>
  <line x1="15.0" y1="3.0" x2="15.0" y2=21.0 stroke="hsl(65.8, 81%, 53%)" stroke-width="1"/>
  <line x1="15.5" y1="3.0" x2="15.5" y2=21.0 stroke="hsl(70.5, 81%, 53%)" stroke-width="1"/>
  <line x1="16.0" y1="3.0" x2="16.0" y2=21.0 stroke="hsl(75.2, 81%, 53%)" stroke-width="1"/>
  <line x1="16.5" y1="3.0" x2="16.5" y2=21.0 stroke="hsl(79.9, 81%, 53%)" stroke-width="1"/>
  <line x1="17.0" y1="3.5" x2="17.0" y2=20.5 stroke="hsl(84.6, 81%, 53%)" stroke-width="1"/>
  <line x1="17.5" y1="3.5" x2="17.5" y2=20.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="18.0" y1="3.5" x2="18.0" y2=20.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="18.5" y1="5.5" x2="18.5" y2=18.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="19.0" y1="6.0" x2="19.0" y2=18.0 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="19.5" y1="6.5" x2="19.5" y2=17.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="20" y1="6.5" x2="20" y2=17.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>
  <line x1="20.5" y1="6.5" x2="20.5" y2=17.5 stroke="hsl(90, 81%, 53%)" stroke-width="1"/>

  <circle cx="12" cy="12" r="10" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2.5"/>
  <line x1="12" y1="6" x2="12" y2="14" stroke="currentColor" stroke-width="2.5"/>
  <line x1="12" y1="15.5" x2="12" y2="18" stroke="currentColor" stroke-width="2.5"/>
  `

  rtb.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'ᴀᴄᴏʀɴ: Create a GitHub issue for selected node', // note: gets turned to lowercase by Miro
        svgIcon: createIssueIcon,
        positionPriority: 2,
        onClick: createIssueForSelected
      }
    }
  })
})

// get the entire text of a node without any of the characters phloem adds
function getFullTextFromNode(root) {
  return root.text.replace(/⋅/g,'') // remove newline markers if there are any
}

// calculate the issue title from a node's text
function getTitleFromNode(root) {
  let titleLength = 10

  var fullText = getFullTextFromNode(root)
  // get the first x words to use as the title
  if (fullText.split(' ').length <= titleLength) {
    return fullText
  } else {
    return fullText.split(' ').slice(0,titleLength).join(' ') + "..."
  }
}

// calculate the issue body text from a node. This is the entire text plus a
// link back to the node. Takes board info object because this has to be gotten
// inside an async function.
function getTextFromNode(root, boardInfo) {
  var fullText = getFullTextFromNode(root)
  return fullText + '</br></br><a href="https://miro.com/app/board/'+boardInfo.id+'/?moveToWidget='+root.id+'">See card in SoA Tree</a>'
}

async function createIssueForSelected() {
  // gets the selected widgets on the board, returns an array
  let selection = await rtb.board.selection.get()

  // gets the board info
  let boardInfo = await rtb.board.info.get()

  // validate that we can proceed with the selected item
  if (!validateSelection(selection)) return

  rtb.showNotification('Creating issue')

  // root is the widget that the issue is being created from
  let root = selection[0]

  var title = getTitleFromNode(root)
  var text = getTextFromNode(root, boardInfo)

  // create the issue
  createIssue(title, text)

  rtb.showNotification('Successfully created issue')
}

const uncertainRed = "#f24726"
const incompleteYellow = "#fac710"
const completeGreen = "#8fd14f"
const smallGreen = "#0ca789"
const timeTeal = "#12cdd4"

const ACCESS_TOKEN = 'fakeaccesstokenfakeaccesstokenfakeaccesstoken'
const REPO_OWNER = 'h-be'
const REPO_NAME = 'phloem'

function createIssue(title, body, assignee = null, milestone = null, labels = null) {

  var url = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/issues'

  var xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  xhr.setRequestHeader("Authorization", "BEARER " + ACCESS_TOKEN)

  // set up the issue JSON with the desired information
  var issue = JSON.stringify({
    "title": title,
    "body": body,
    "labels": [
      "acorn"
    ]
  })

  // send issue
  xhr.send(issue)

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
