import React, { Component } from "react";
import { RenderDOM } from "react-dom";
import { Provider, connect } from "react-redux";

class BaseApplication extends Component {
	render() {
		return (<h1>ROOT</h1>);
	}
}

const Application = connect((props,state)=>{
	return Object.assign({},props,state);
})(BaseApplication);

export const build_root = function(store) {
	return (<Provider store={store}>
		<Application />
	</Provider>);
}

export default {
	Application,
	build_root
};