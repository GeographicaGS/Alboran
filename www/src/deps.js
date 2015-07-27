var deps = {}
deps.templateFolder = "js/template";

deps.JS = {
	ThirdParty:{
		src: [
			"js/lib/jquery-2.0.3.min.js",
			"js/lib/jquery-ui-1.10.4.custom.min.js",
			"js/lib/underscore-min.js",
			"js/lib/backbone-min.js",
			"js/lib/backbone-validation-min.js",
			"js/lib/leaflet/leaflet.js",
		],
		desc: "Third party library"
	}
	,Core: {
		src: [
			"js/lib/async.backbone.validation.js",
			"js/lib/jquery-ui.datepicker-es.js",
			"js/lib/fancybox/jquery.fancybox.js",
			// Namespace
			"js/namespace.js",
			// Config file
			"js/config.js",

			// --------------------
			// ------ Models ------
			// --------------------
			"js/model/layer.js",
			"js/model/category.js",
			"js/model/history.js",
			"js/model/user.js",

			// --------------------
			// ---- Collections ---
			// --------------------
			"js/collection/layers.js",
			"js/collection/categories.js",
			"js/collection/histories.js",

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
			"js/view/history-create_view.js",
			"js/view/history_view.js",
			"js/view/signup_view.js",
			"js/view/map-pointselector_view.js",


			// router
			"js/router.js",
			// app
			"js/app.js",
			//"js/catalog.js",
			"js/catalog_dev.js",
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
		       "js/lib/ui-lightness/jquery-ui-1.10.3.custom.min.css",
		]
	},
	Core: {
		src: [
			"js/lib/fancybox/jquery.fancybox.css",
			"css/lib/WWW-Styles/reset.css",
			"css/lib/WWW-Styles/base.css",
			"css/reset.css",
			"css/base.css",
			"css/styles.css",
			"css/home.css",
			"css/catalogue.css",
			"css/join.css",
			"css/about.css",
		]
	}
};


if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
