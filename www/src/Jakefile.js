/*
Leaflet building, testing and linting scripts.

To use, install Node, then run the following commands in the project root:

    npm install -g jake
    npm install

To check the code for errors and build Leaflet from source, run "jake".
To run the tests, run "jake test".

*/

var build = require("./build/build.js");
var translate = require("./build/translate.js");
var resource = require("./build/resource.js");
var utils = require("./build/utils.js")

utils.createDirIfNotExist(utils.tmp);


function buildCSS(env){	
	build.buildCSS(env,buildUnderScoreTemplate);
}

function buildUnderScoreTemplate(env){	
	build.buildTemplate(env,complete);
}

desc("Combine and compress source files");
task("build", {async: true}, function () {
	console.log("--------------------------------------");
	console.log("---------- BUILDING  -------------");
	console.log("--------------------------------------");
	build.buildJS('',buildCSS);
});


desc("Translate")
task("translate", {async: true}, function () {
	console.log("\n----------------------------------------");
	console.log("---------- Translating ---------");
	console.log("----------------------------------------");
	translate.translate("",complete,false);
});


desc("Translate debug")
task("translate-debug", {async: true}, function () {
	console.log("\n----------------------------------------");
	console.log("---------- Translating DEBUG ---------");
	console.log("----------------------------------------");
	translate.translate("",complete,true);
});

desc("Generate resources")
task("resource", {async: true}, function () {
	console.log("\n-----------------------------------------------");
	console.log("---------- BUILDING RESOURCES ---------");
	console.log("-----------------------------------------------");
	resource.create("",complete,false);
});

desc("Generate resourcesdebug")
task("resource-debug", {async: true}, function () {
	console.log("\n-----------------------------------------------");
	console.log("---------- BUILDING  RESOURCES ---------");
	console.log("-----------------------------------------------");
	resource.create("",complete,true);
});

desc("Production builder")
task("default", ["build","translate","resource"],function(){
	console.log("\n\nBUILD COMPLETE SUCCESSFULLY\n\n");
});

desc("Debug builder")
task("debug", ["build","translate-debug","resource-debug"],function(){
	console.log("\n\nDEBUG BUILD COMPLETE SUCCESSFULLY\n\n");
});


jake.addListener("complete", function () {
  process.exit();
});
