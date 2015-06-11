
var exec = require('child_process').exec;


var generate = function () {
	var GollumJS = require('../index.js');

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
