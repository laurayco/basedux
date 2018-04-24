import express from "express";
import ws from "express-ws";
import path from "path";
import mustacheExpress from "mustache-express";
import { renderToString } from "react-dom/server";

import {takeEvery} from "redux-saga/effects";

import { SagaStore } from "./sagastore";
import { build_root } from "./client";

class ServerSaga extends SagaStore {
	constructor() {
		super({});
		this.router = this.create_router();
	}

	create_router() {
		let router = express.Router();
		const self = this;

		router.ws("/ws",(req,ws)=>{
			self.store.dispatch({
				type: "CLIENT_CONNECTED",
				request: req,
				socket: ws
			});
		});

		router.use("*",(req,res,next)=>{
			req.saga_store = self.create_store();
			self.prepare_store(req,req.saga_store).then(()=>{
				next();
			});
		});

		return router;
	}

	create_store() {
		return new SagaStore({});
	}

	initialize(app,mount) {
		return this.saga.run(this.server_initialization_saga.bind(this,app)).done;
	}

	*server_initialization_saga(app) {
		const self = this;
		yield takeEvery("CLIENT_CONNECTED",self.setup_client.bind(self));
	}

	*setup_client(action) {
		const self = this;
		const {request,socket} = action;

		socket.on("message",message=>{
			message = JSON.parse(message);
			request.saga_store.store.dispatch(message);
		});

		socket.on("close",message=>{
			self.store.dispatch({
				type: "CLIENT_DISCONNECTED",
				request
			});
		});
	}

	reduce(state,action) {
		return state;
	}

	prepare_store(req,saga_store) {
		return new Promise((resolve,reject)=>{
			resolve();
		});
	}
}

const app = express();
ws(app);

const server_saga = new ServerSaga();

app.engine('mustache', mustacheExpress());
app.set('view engine','mustache');
app.set('views',`${__dirname}/views`);

app.use("/app",server_saga.router);
app.use("/public",express.static(`${__dirname}/public`));

app.get("/",(req,res)=>{res.redirect("/app/");});

app.get("/app/*",(req,res)=>{
	const DEFAULT_TITLE = "Basedux";

	const initial_state = req.saga_store.store.getState();
	const application = build_root(req.saga_store.store);
	const content = renderToString(application);
	const title= initial_state.title || DEFAULT_TITLE;

	res.render("index",{
		scripts: [
			"//unpkg.com/react@16/umd/react.development.js",
			"//unpkg.com/react-dom@16/umd/react-dom.development.js",
			"//cdnjs.cloudflare.com/ajax/libs/redux/4.0.0/redux.js",
			"//cdnjs.cloudflare.com/ajax/libs/redux-saga/0.16.0/redux-saga.js",
			"/public/js/App.bundle.js",
			"/public/js/Bootstrap.bundle.js"
		],
		styles: [],
		content,
		title,
		initial_state: JSON.stringify(initial_state)
	});
});

const get_port = ()=> (process.env.PORT || 8080);

server_saga.initialize(app,'/app').then(function(){
	console.log("DONE???")
});
app.listen(get_port(),()=>
	server_saga.store.dispatch({
		type:"SERVER_LISTENING"
	})
);