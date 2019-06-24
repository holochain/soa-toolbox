# soa-toolbox

> Tools for using an Acorn State of Affairs on Miro

## Background

The architecture here is that we serve an HTML file which has the realtime board SDK in it, plus our own custom JS that uses that.

This HTML gets loaded as an iframe into any realtime board for the Holo team.

The plugins currently present these functionalities:
* Calculate subtree size — updates selected widget and children with calculations.
* Set node status — change nodes to uncertain, incomplete, or complete
* Create GitHub issue — create a GitHub issue out of the selected node in a repository of choice

This is meant for the purposes of being able to better track our work and progress.

The data must be structured in a particular way for this to work.

There are certain colors that must be used:
- This red #f24726 as a background as "Uncertain"
- This orange #fac710 as a background as "Incomplete"
- This light green #8fd14f as a background as "Complete"
- This darker green as #0ca789 as a border for a "Small"

An uncertain is something which hasn't been broken down into smalls yet, thus it is unknown how long it will take.
A small is a thing which is discrete and in itself attainable, and shouldn't represent more than 1 days worth of work (otherwise it's not a small).

In theory, nodes higher in the tree should be able to have their color set automatically, while only the leaves/smalls should have to be updated manually.

Additionally, **and this is important**, edges must be drawn FROM the child, TO the parent, as this is how RTB stores the data. The direction of the arrow of a line is not available as data, and definitely not available to indicate the directionality of the relationship. If we are to be able to accurately measure our work, and have this tool be useful, all edges must be drawn in the correct direction, that is, you must literally click and drag the line from the child node to the parent node.

## Set up

### Dependencies

* [ngrok](https://ngrok.com/) (for development)
* [nodejs](https://nodejs.org)

You will need admin access to your Miro team.

1. #### **Set up ngrok** (for development)
   1. Start ngrok on port 8088 to open a tunnel from the web to your local server: `ngrok http 8088` or `./ngrok http 8088`
   2. Copy the public https address, like `https://958648dd.ngrok.io` to your clipboard.
2. #### **Set up Miro**
   1. Open Miro settings: Miro > [Your organization] > Settings > Profile settings > Your apps [Beta].
   2. For each web plugin, create a new app.
   3. Give it `boards_content:read` and `board_content:write` scopes
   4. In the Iframe url box, combine the ngrok url with the path to the html file for that plugin. For example, for the set-complete plugin, the url would look like `https﻿://958648dd.ngrok.io/set-complete.html`.
   5. Click Install app and get OAuth Token. Select your Miro team. You won't need the OAuth token you receive.
3. #### **Create config file**
   1. *You'll need a config file for the create-issue plugin to know about and have access to your GitHub repos.* A sample config file to copy and edit is provided.
   2. For each repo you'd like to add issues to, create an entry in the config file.
   3. The key should be the unique path to your GitHub repo. This is usually a username or organization followed by a slash and then the repo name. For example: `holochain/soa-toolbox`
   4. Under accessToken, enter a [GitHub Personal Access Token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with repo permissions.
  [comment]: # (Watch out! There are non-breaking zero-width space characters in some URLs above)

## Usage

In a new terminal, start the nodejs server, which has API endpoints, and also serves static files:
`npm run start`

You should see plugins on your Miro board.

Make changes to the code and live test your work in Miro. You don't have to restart the nodejs server as long as you don't make changes to `simpleserver.js`, run the command `reloadSandbox()` in the developer console on Miro.

**When you're done**
Commit and push to the server

Switch the URL of the web plugin back to the production server HTML endpoint that it was before.

Stop the ngrok server and the nodejs server

## Documentation for RTB API

[https://developers.realtimeboard.com/docs/sdk](https://developers.miro.com/docs/sdk-doc)
