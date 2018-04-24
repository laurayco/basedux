/*
	The purpose of this module is to synchronize the state between server / client.
*/

import { SagaStore } from "./sagastore";
import { takeEvery } from "redux-saga/effects";

class SynchronizedState extends SagaStore {
	constructor(initial_state,endpoint) {
		super(initial_state);
		this.ws = this.create_websocket(this.endpoint = endpoint);
		this.ws.addEventListener('message',this.on_ws_message.bind(this));
		this.ws.addEventListener('close',this.on_ws_close.bind(this));
		this.run_saga(this.send_actions_saga.bind(this));
	}

	*send_actions_saga() {
		yield takeEvery(action=>(true),this.send_action.bind(this));
	}

	send_action(action) {
		this.ws.send(JSON.stringify(action));
	}

	reduce(state,action) {
		if(action.type==='SET_STATE') {
			return action.state;
		}
		return state;
	}

	on_ws_message(message) {
		this.store.dispatch({
			type: 'SET_STATE',
			state: JSON.parse(message)
		});
	}

	create_websocket(endpoint) {
		const proto = ({'http:':'ws:','https:':'wss:'})[location.protocol];
		if(!endpoint.startsWith("/")) endpoint = `/${endpoint}`;
		return new WebSocket(`${proto}//${location.host}${endpoint}`);
	}

	on_ws_close() {
		console.info("Websocket closed!");
	}
}

export default {
	SynchronizedState
};