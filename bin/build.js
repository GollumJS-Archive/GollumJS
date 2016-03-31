

console.log ("=== Build GollumJSClass ===");

fs = require('fs');

fs.readFile(__dirname+"/../include.json", "utf8", function(err, data) {
	if (err) throw err;
	
	var files = JSON.parse (data);
	
	fs.readFile(__dirname+"/../package.json", "utf8", function(err, data) {
		if (err) throw err;
		
		var package = JSON.parse (data);
		var content = "";
		
		for (var i = 0; i < files.length; i++) {


			var buf = fs.readFileSync(__dirname+"/../"+files[i], "utf8");
			
			content += buf+"\n\n";
		}

		fs.writeFile(__dirname+"/../build/"+package.name+".js", content, function(err) {
			if(err) {
				return console.error(err);
			}
			console.log (__dirname+"/../build/"+package.name+".js"+" => OK");
		});
		fs.writeFile(__dirname+"/../build/"+package.name+"-min.js", content, function(err) {
			if(err) {
				return console.error(err);
			}
			console.log (__dirname+"/../build/"+package.name+"-min.js"+" => OK");
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
});
