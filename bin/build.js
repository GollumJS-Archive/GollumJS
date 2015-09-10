

console.log ("=== Build GollumJSClass ===");

fs = require('fs');

fs.readFile(__dirname+"/../includes.json", "utf8", function(err, data) {
	if (err) throw err;
	
	var json = JSON.parse (data);

	var content = "";

	for (var i = 0; i < json.length; i++) {


		var buf = fs.readFileSync(__dirname+"/../"+json[i], "utf8");

		content += buf+"\n\n";
	}

	fs.writeFile(__dirname+"/../build/gollumjs.js", content, function(err) {
		if(err) {
			return console.error(err);
		}
		console.log (__dirname+"/../build/gollumjs.js => OK");
	});
	fs.writeFile(__dirname+"/../build/gollumjs-min.js", content, function(err) {
		if(err) {
			return console.error(err);
		}
		console.log (__dirname+"/../build/gollumjs-min.js => OK");
	});
	fs.writeFile(
		__dirname+"/../index.js", 
		"if (typeof global.GollumJS == 'undefined' || typeof global.GollumJS.__init == 'undefined') {\n\n"+
		content+
		"\nglobal.GollumJS = GollumJS; \n} module.exports = global.GollumJS; ",
		function(err) {
		if(err) {
			return console.error(err);
		}
		console.log (__dirname+"/../index.js => OK");
	});
});
