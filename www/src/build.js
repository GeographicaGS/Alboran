var make = require("./js/lib/WWW-Builder/build/make.js"),
	deps = require("./deps.js").deps;

var debug = (process.argv.length == 3 && process.argv[2]=="debug") ? true : false;
    
make.make({
	"debug" : debug,
	"deps" : deps,
	"cdnPath" : "../cdn"
});