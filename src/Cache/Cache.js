GollumJS.Cache = GollumJS.Cache || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Cache.Cache = new GollumJS.Class ({

	pathDirectory: "",
	fs:  null,

	/**
	 * Constructeur
	 * @param string pathDirectory Repertoire du fichier de cache
	 */
	initialize: function (pathDirectory) {
		this.pathDirectory = pathDirectory;
		if (GollumJS.Utils.isNodeContext()) {
			this.fs = require('node-fs');
			this.read();
		}
	},

	/**
	 * Récupère une clef du cache
	 * @param string key
	 * @param mixed defaultValue
	 * @return mixed 
	 */
	get: function (key, defaultValue) {
		if (typeof GollumJS.cache[key] == 'undefined') {
			return defaultValue ? defaultValue : null;
		}
		return GollumJS.cache[key];
	},

	/**
	 * Affecte une clef au cache
	 * @param string key
	 * @param mixed value
	 * @return GollumJS.Cache.Cache
	 */
	set: function (key, value) {
		GollumJS.cache[key] = value;
		if (!GollumJS.Utils.isNodeContext()) {
			console.warn("You are not in nodejs mode. The value set in cache don't persist.");
		}
		this.write (GollumJS.cache);
	},

	/**
	 * Lit le cache depuis le fichier
	 * @return boolean
	 */
	read : function () {
		if (this.fs) {
			var path = this.pathDirectory+"/datas.json";
			console.log ("Read cache file : ", path);
			if (this.fs.existsSync(path)) {
				GollumJS.cache = JSON.parse(this.fs.readFileSync(path));
				return true;
			} else {
				console.error ("Cache file not found : ", path);
			}
		}
		return false;
	},

	/**
     * Création du dossier de cache
	 * @return boolean
     */
	_createCacheDir: function () {
		if (this.fs) {
			if (!this.fs.existsSync(this.pathDirectory)) {
				this.fs.mkdirSync(this.pathDirectory, 0777, true);
			}
			return true;
		}
		return false;
	},

	/**
	 * Ecrit le fichier json du cache
	 * (async method)
	 * @param function callback
	 */
	write : function (callback) {

		callback = typeof callback === 'function' ? callback : function() {};

		if (this.fs) {
			if(this._createCacheDir()) {
				
				var path = this.pathDirectory+"/datas.json";
				this.fs.writeFile(path, JSON.stringify(GollumJS.cache), function(err) {
					if(err) {
						console.error(err);		
					}
					callback (err);
				});

			} else {
				callback ("Can't create cache directory: "+this.pathDirectory);
			}
		} else {
			callback ("For write cache you must be in mode NodeJS.");
		}
	},

	/**
	 * Ecrit le fichier js du cache
	 * (async method)
	 * @param function callback
	 */
	writeJS: function (callback) {

		callback = typeof callback === 'function' ? callback : function() {};

		if (this.fs) {
			if(this._createCacheDir()) {
			
				var path = this.pathDirectory+"/datas.js";
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
						callback (err);
					}
				);

			} else {
				callback ("Can't create cache directory: "+this.pathDirectory);
			}
		} else {
			callback ("For write cache you must be in mode NodeJS.");
		}
	}

});