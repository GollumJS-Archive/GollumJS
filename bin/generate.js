
var exec = require('child_process').exec;
var rmdir = require('rimraf').sync;


var generate = function () {
	var GollumJS = require(__dirname+'/../index.js');

	console.log ("Clear file : "+GollumJS.config.cache.path);
	rmdir (GollumJS.config.cache.path);

	GollumJS.get("fileJSParser");

	GollumJS.get("cache").writeJS();
};

if (process.argv.indexOf('--build') != -1) {

	console.log ('Before rebuild :');

	exec('node '+__dirname+'/build.js', function (error, stdout, stderr) {
		console.log(stdout);
		console.error(stderr);
		if (error !== null) {
			console.error('exec error: ' + error);
		}
		generate();
	});
} else {
	generate();
}
