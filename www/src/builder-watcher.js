var watch = require('node-watch');
var exec = require('child_process').exec;

var param = (process.argv.length == 3 && process.argv[2]=="debug") ? "debug" : "",
    mode = " - [ Mode " + (param ? param : "production") + " ]";
    
console.log("Watching "+ mode );

watch(["js","css"], function(filename) {
    exec("node build.js debug " + param,function (error, stdout, stderr){
        if (error) {
            console.log(error);
            console.log(stderr);
        }
        else{
            console.log(stdout);    
        }   
    });
});





