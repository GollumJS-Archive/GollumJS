GollumJS.Cache = GollumJS.Cache || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Cache.Cache = new GollumJS.Class ({

	fs:  null,

	initialize: function () {
		if (typeof module !== 'undefined' && module.exports) {
			this.fs = require('node-fs');
			this.read();
		}
	},

	get: function (key, defaultValue) {
		if (typeof GollumJS.cache[key] == 'undefined') {
			return defaultValue ? defaultValue : null;
		}
		return GollumJS.cache[key];
	},

	set: function (key, value) {
		GollumJS.cache[key] = value;
		this.write (GollumJS.cache);
	},

	read : function () {
		if (this.fs) {
			var path = GollumJS.config.cache.path+"/datas.json";
			console.log ("Read cache file : ", path);
			if (!this.fs || this.fs.existsSync(path)) {
				GollumJS.cache = JSON.parse(this.fs.readFileSync(path));
			}
		}
	},

	_createCacheDir: function () {
		if (this.fs) {
			if (!this.fs.existsSync(GollumJS.config.cache.path)) {
				this.fs.mkdirSync(GollumJS.config.cache.path, 0777, true);
			}
		}
	},

	write : function () {
		if (this.fs) {
			this._createCacheDir();
			var path = GollumJS.config.cache.path+"/datas.json";

			this.fs.writeFile(path, JSON.stringify(GollumJS.cache), function(err) {
				if(err) {
					return console.error(err);
				}
			});
		}
	},

	writeJS: function () {
		if (this.fs) {
			this._createCacheDir();
			
			var path = GollumJS.config.cache.path+"/datas.js";
			this.fs.writeFile(
				path,
				"GollumJS = typeof GollumJS != undefined ? GollumJS : {};\n" +
				"GollumJS.cache = " +
				JSON.stringify(GollumJS.cache) + 
				";"
				, 
				function(err) {
					if(err) {
						return console.error(err);
					}
				}
			);
		}
	}

});