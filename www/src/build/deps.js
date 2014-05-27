var deps = {}
deps.JS = {
	ThirdParty:{
		src: [
			"js/lib/jquery-2.0.3.min.js",
			"js/lib/jquery-ui-1.10.3.custom.min.js",
			"js/lib/underscore-min.js",
			"js/lib/backbone-min.js",
			"js/lib/leaflet/leaflet.js",
			"js/lib/fancybox/jquery.fancybox.js"
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
			// ------ Models ------
			// --------------------
			"js/model/layer.js",
			"js/model/category.js",
			
			// --------------------
			// ---- Collections ---
			// --------------------
			"js/collection/layers.js",
			"js/collection/categories.js",

			// --------------------
			// ------  Views ------
			// --------------------
			"js/view/layer_view.js",
			"js/view/layergroup_view.js",
			"js/view/catalogue_view.js",
			"js/view/error_view.js",
			"js/view/notfound_view.js",
			"js/view/home_view.js",
			"js/view/about_view.js",
			"js/view/alboran_view.js",
			"js/view/howto_view.js",
			"js/view/join_view.js",
			"js/view/contact_view.js",
			"js/view/legal_view.js",
			"js/view/privacy_view.js",
			"js/view/oldbrowser_view.js",
			

			// router
			"js/router.js",
			// app
			"js/app.js",
			"js/catalog.js",
			"js/gSLayerWMS.js",
			"js/map.js",
			"js/global.js",
			"js/view/map_view.js",
			"js/view/groupLayer_view.js",
		],
		desc: "Core library."
	}
};

deps.CSS = {
	ThirdParty:{
		src : [
		       "js/lib/leaflet/leaflet.css",
		       "js/lib/fancybox/jquery.fancybox.css",
		]
	},
	Core: {
		src: [
			"css/reset.css",
			"css/base.css",
			"css/styles.css",
			"css/home.css",
			"css/catalogue.css",
		]
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}

