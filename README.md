# basedux
React + Redux + Redux-Saga + Express + Web Sockets + Server Side Rendering

# how to use
## setup
`npm install`

## Develop client changes
`npm run build`

## Develop server changes
`npm run dev`

## Run
`npm start`

# Idea

I created this project as a way to integrate all of those awesome technologies into a project template
without having to deal with bootstrapping in the future. The server runs / maintains your redux state,
react renders it (either on the server or on the client.) Since everything is ran on the server, there
is no need to write an API, and the redux app can manage the state with all the resources available to
the server (thanks to redux saga.)

# Considerations

The code may need to be modified slightly so that the server is not responsible for holding the client
redux state in-memory (and the client simply sends the redux state with any actions to the server).
Maybe this is a fundamentally bad idea or it isn't - it will ultimately come down to depending on how
complex your application state is. At any rate, the code that communicates with the server redux app is
extremely simple and easily modified without breaking things so that if you need to run the redux app
on the client, you can do so while still having the websocket connection for live updates from the server.
