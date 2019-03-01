# Acorn Helper

The architecture here is that we serve an HTML file which has the realtime board SDK in it, plus our own custom JS that uses that.

This HTML gets loaded as an iframe into any realtime board for the Holo team. 

This plugin is currently capable of a 'click-to-update-selected' functionality, that updates widgets with custom info that is calculated. 

This is meant for the purposes of being able to better track our work and progress.

The data must be structured in a particular way for this to work.

There are certain colors that must be used:
This red #f24726 as a backgroun as "Uncertain"
This orange #fac710 as a background as "Incomplete"
This light green #8fd14f as a background as "Complete"
This darker green as #0ca789 as a border for a "Small"

An uncertain is something which hasn't been broken down into smalls yet, thus it is unknown how long it will take.
A small is a thing which is discrete and in itself attainable, and shouldn't represent more than 1 days worth of work (otherwise it's not a small).

In theory, nodes higher in the tree should be able to have their color set automatically, while only the leaves/smalls should have to be updated manually.

Additionally, **and this is important**, edges must be drawn FROM the child, TO the parent, as this is how RTB stores the data. The direction of the arrow of a line is not available as data, and definitely not available to indicate the directionality of the relationship. If we are to be able to accurately measure our work, and have this tool be useful, all edges must be drawn in the correct direction, that is, you must literally click and drag the line from the child node to the parent node.

## Set up

Install [ngrok](https://ngrok.com/), for development purposes

You will need admin access to the Holo realtime board team.

You will need [nodejs](https://nodejs.org).

## To develop

Open `public/main.js`
Switch `devMode` to `true`

Run `./ngrok http 80` to open a tunnel from the web to your local server
Copy the public https address, like `https://958628dd.ngrok.io` to your clipboard
Replace the value in the following line in `public/main.js` with the copied url.
`const devUrl = 'https://958628dd.ngrok.io'`

Load the [admin page for the app](https://realtimeboard.com/app/account/profile/apps/), called SoA Scraper.
Combine the ngrok url with the path `rtb.html`:
`https://958628dd.ngrok.io/rtb.html`
Copy or type that URL into the 'iframe url' form field for the Web-plugin and click 'save'. Keep the original production server URL available as you'll need to replace it later.

In a new terminal, start the nodejs server, which has API endpoints, and also serves static files:
`npm run start`

Access it on [localhost](http://localhost) and the [SoA tree realtime board](https://realtimeboard.com/app/board/o9J_kyiXmFs=/)

Make changes to the code and do live development work.

**When you're done**
Switch `devMode` to `false`
Commit and push to the server

Switch the URL of the web plugin back to the production server HTML endpoint that it was before.

Stop the ngrok server and the nodejs server

## Documentation for RTB API

[https://developers.realtimeboard.com/docs/sdk](https://developers.realtimeboard.com/docs/sdk)
