const path = require("path");

module.exports = {
	entry: {
		App: "./client.js",
		Bootstrap: "./bootstrap.js"
	},
	output: {
		path: path.resolve(__dirname,'public/js'),
		filename: '[name].bundle.js',
		library: '[name]',
		libraryExport: "default"
	},
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
		"redux": "Redux",
		"redux-saga": "ReduxSaga"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: [
					"/node_modules/"
				]
			}
		]
	},
	mode: 'development',
	devtool: "source-map",
	watch: true,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	}
}