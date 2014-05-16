var deps = {}
deps.JS = {
	ThirdParty:{
		src: [
			"js/lib/jquery-2.0.3.min.js",
			"js/lib/underscore-min.js",
			"js/lib/backbone-min.js",
		],
		desc: "Third party library"
	}
	,Core: {
		src: [
			// Namespace
			"js/namespace.js",
			// Config file
			"js/config.js",
			
			// --------------------
			// ------  Views ------
			// --------------------
			"js/view/error_view.js",
			"js/view/notfound_view.js",
			"js/view/home_view.js",

			// router
			"js/router.js",
			// app
			"js/app.js",
		],
		desc: "Core library."
	}
};

deps.CSS = {
	ThirdParty:{
		src : [
			
		]
	},
	Core: {
		src: [
			"css/reset.css",
			"css/base.css",
			"css/styles.css",
			"css/home.css",
		]
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}

