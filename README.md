# Acorn Helper


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