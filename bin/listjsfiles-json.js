
var fs   = require('fs');
var path = require('path');

var getJSFiles = function (dir, excludes, files_){
	files_ = files_ || [];
	excludes = excludes || [];

	var files = fs.readdirSync(dir);

	for (var i in files){
		var name = path.resolve(dir + '/' + files[i]);
		if (
			excludes.indexOf(files[i]) == -1 &&
			excludes.indexOf(name) == -1
		) {
			if (fs.statSync(name).isDirectory()) {
				getJSFiles(name, excludes, files_);
			} else {
				if (name.substr(-3) == '.js') {
					files_.push(name);
				}
			}
		}
	}
	return files_;
}


process.stdout.write(
	JSON.stringify(
		getJSFiles('..', [ path.resolve('.'), '.git' ])
	)
);