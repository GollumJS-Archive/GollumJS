(function () {
	
	var config = {

		node: {
			gollumjs_path: typeof __dirname__ !== 'undefined' ? __dirname__ : "" // Fonctionne uniquement en context nodejs
		},

		fileJSParser: {
			srcPath: [ './src', '%node.gollumjs_path%/index.js' ],
			excludesPath: ["%node.gollumjs_path%/src"],
			excludesFiles: ['.git', '.svn']
		},
		cache: {
			path: './tmp/cache',
		},

		services: {

			fileJSParser: {
				class: 'GollumJS.Reflection.FileJSParser.FileJSParser',
				args: [
					"@cache",
					"%fileJSParser.srcPath%",
					"%fileJSParser.excludesPath%",
					"%fileJSParser.excludesFiles%"
				]
			},
			cache       : {
				class: 'GollumJS.Cache.Cache',
				args: [ 
					"%cache.path%"
				]
			}

		}

	};

	if (GollumJS.config != 'undefined') {
		GollumJS.Utils.extend (config, GollumJS.config);
	}
	GollumJS.config = config;
	GollumJS.cache = {};

	var _instances = {};

	GollumJS.get = function (name) {

		if (!_instances[name] && GollumJS.config.services[name] && GollumJS.config.services[name].class) {
			var __service__ = GollumJS.Reflection.ReflectionClass.getClassByIdentifers (GollumJS.config.services[name].class.split('.'));
			var __args__    = (new GollumJS.Parser.ArgumentsParser(
				GollumJS.config.services[name].args ? GollumJS.config.services[name].args : [] 
			)).parse();
			__args__.unshift(null);

			if (__service__) {
				_instances[name] = new (Function.prototype.bind.apply(__service__, __args__));
			}
		}

		return _instances[name];
	};

}) ();