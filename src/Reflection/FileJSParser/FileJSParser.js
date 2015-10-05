GollumJS.Reflection = GollumJS.Reflection || {};
GollumJS.Reflection.FileJSParser = GollumJS.Reflection.FileJSParser || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.FileJSParser.FileJSParser = new GollumJS.Class ({

	Static: {
		CACHE_KEY: "fileJSParser.classList"
	},

	/**
	 * @var [GollumJS.Reflection.ReflectionClass]
	 */
	classList: null,
	_cache: null,
	_srcPath: null,
	_excludesPath: null,
	_excludesFiles: null,

	initialize: function (cache, srcPath, excludesPath, excludesFiles) {

		this._srcPath       = srcPath;
		this._excludesPath  = excludesPath;
		this._excludesFiles = excludesFiles;
		var datas = cache.get(this.self.CACHE_KEY);

		console.log (arguments);return;

		if (datas) {
			this.classList = {};
			for (var i in datas) {
				var clazz = new GollumJS.Reflection.ReflectionClass();
				clazz.unserialiseInfos(datas[i]);
				this.classList[i] = clazz;
			}
		}
		if (!this.classList) {

			if (!GollumJS.Utils.isNodeContext()) {
				throw new GollumJS.Reflection.FileJSParser.FileJSParserNodeJSContextException("Your are not in nodejs context. FileJSParser must be work only in nodejs context. You must run cache generator \"./bin/generate.js\" in nodejs then load cache/datas.js");
			}

			this.classList = {};
			this.parseSources ();
			datas = {};
			for (var i in this.classList) {
				datas[i] = this.classList[i].serialiseInfos();
			}
			cache.set(this.self.CACHE_KEY, datas);
		}
	},

	parseSources: function () {

		for (var i = 0; i < this._srcPath.length; i++) {
			this.parseFiles (this.getFiles (this._srcPath[i]));
		}

	},

	getFiles: function (dir, files_){

		files_ = files_ || [];
		
		var fs = require('fs');
		var files = fs.readdirSync(dir);

		for (var i in files){
			var name = dir + '/' + files[i];
			if (
				this._excludesFiles.indexOf(files[i]) == -1 &&
				this._excludesPath.indexOf(files[i]) != 0
			) {

				if (fs.statSync(name).isDirectory()) {
						this.getFiles(name, files_);
					
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