import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from 'redux'

export class SagaStore {
	constructor(initial_state) {
		this.saga = createSagaMiddleware();
		this.store = createStore(
			this.reduce,
			initial_state,
			applyMiddleware(this.saga)
		);
	}

	run_saga() {
		this.saga.run.apply(this.saga,arguments);
	}

	reduce(state,action) {
		return state;
	}
}