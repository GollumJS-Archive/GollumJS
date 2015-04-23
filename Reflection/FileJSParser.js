GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.FileJSParser = new GollumJS.Class ({

	/**
	 * @var [GollumJS.Reflection.ReflectionClass]
	 */
	classList: [],

	Static: {

		instance: null,

		getInstance: function () {
			if (!this.instance) {
				this.instance = new this ();
			}
			return this.instance;
		}

	},

	initialize: function () {
		this.parseSources ();
	},

	parseSources: function () {

 		this.parseFiles (this.getFiles ('src'             , ['.git', '.svn']));
 		this.parseFiles (this.getFiles ('vendors/GollumJS', ['.git', '.svn']));

	},

	getFiles: function (dir, excludes, files_){

		files_ = files_ || [];
		excludes = excludes || [];
		
		var fs = require('fs');
		var files = fs.readdirSync(dir);

		for (var i in files){
			var name = dir + '/' + files[i];
			if (fs.statSync(name).isDirectory()) {
				if (excludes.indexOf(files[i]) == -1) {
					this.getFiles(name, excludes, files_);
				}
			} else {
				files_.push(name);
			}
		}
		return files_;
	},

	parseFiles: function (files) {

 		var fs = require('fs');
		var _this = this;

		for (var i = 0; i < files.length; i++) {
			
			var file = files[i];
			
			if (file.substr (-3) == '.js') {

				content = fs.readFileSync(file, {encoding: 'utf-8'});

				var parser = new GollumJS.Reflection.ClassParser(content);
				for(var j = 0; j < parser.classList.length; j++) {
					this.classList.push (parser.classList[j]);
				}

			}
			
		}
	}

});