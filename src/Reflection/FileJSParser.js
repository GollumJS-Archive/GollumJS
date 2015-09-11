GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.FileJSParser = new GollumJS.Class ({

	/**
	 * @var [GollumJS.Reflection.ReflectionClass]
	 */
	classList: null,

	initialize: function () {
		
		var cache = GollumJS.get("cache");
		var datas = cache.get("app.classList");

		if (datas) {
			this.classList = {};
			for (var i in datas) {
				var clazz = new GollumJS.Reflection.ReflectionClass();
				clazz.unserialiseInfos(datas[i]);
				this.classList[i] = clazz;
			}
		}
		if (!this.classList) {
			this.classList = {};
			this.parseSources ();
			datas = {};
			for (var i in this.classList) {
				datas[i] = this.classList[i].serialiseInfos();
			}
			cache.set("app.classList", datas);
		}
	},

	parseSources: function () {

		for (var i = 0; i < GollumJS.config.fileJSParser.srcPath.length; i++) {
			var path = GollumJS.config.fileJSParser.srcPath[i];
			this.parseFiles (this.getFiles (path, GollumJS.config.fileJSParser.excludes));
		}

	},

	getFiles: function (dir, excludes, files_){

		files_ = files_ || [];
		excludes = excludes || [];
		
		var fs = require('fs');
		var files = fs.readdirSync(dir);

		for (var i in files){
			var name = dir + '/' + files[i];
			if (excludes.indexOf(files[i]) == -1) {

				if (fs.statSync(name).isDirectory()) {
						this.getFiles(name, excludes, files_);
					
				} else {
					files_.push(name);
				}
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

				try {
					var parser = new GollumJS.Reflection.ClassParser(content);
					for(var j = 0; j < parser.classList.length; j++) {
						if (typeof this.classList[parser.classList[j].getName()] == 'undefined') {
 							this.classList[parser.classList[j].getName()] = parser.classList[j];
 						}
					}
				} catch (e) {
				}

			}
			
		}
	}

});