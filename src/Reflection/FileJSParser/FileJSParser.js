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

	isExclude: function (filePath) {
		
		var fs   = require('fs');
		var path = require('path');

		console.log ("aa"+filePath, this._excludesFiles.indexOf(path.basename(filePath)) != -1, !fs.existsSync(filePath));

		if (
			!fs.existsSync(filePath) || 
			this._excludesFiles.indexOf(path.basename(filePath)) != -1
		) {
			return true;
		}
		for (var i = 0; i < this._excludesPath.length; i++) {
			
			console.log ("bb", fs.realpathSync(this._excludesPath[i]), fs.realpathSync(filePath), fs.realpathSync(this._excludesPath[i]) == fs.realpathSync(filePath));

			if (fs.realpathSync(this._excludesPath[i]) == fs.realpathSync(filePath)) {
				return true;
			}
		}
		return false;
	},

	getFiles: function (source, files) {

		files = files || [];
		var fs = require('fs');

		if (
			fs.existsSync(source) &&
			!this.isExclude(source)
		) {
			if (fs.statSync(source).isDirectory()) {
				var subFiles = fs.readdirSync(source);
				for (var i in subFiles) {
					this.getFiles(source + '/' + subFiles[i], files);
				}
			} else {
				files.push(source + '/' + subFiles[i]);
				console.log(files, this.isExclude(source));
			}
		}
		return files;
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