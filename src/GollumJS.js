(function () {
	
	var config = {

		fileJSParser: {
			srcPath: [ './' ],
			excludes: ['.git', '.svn', 'gollumjs.js', 'gollumjs-min.js', 'index.js']
		},
		cache: {
			path: './tmp/cache',
		},

		services: {

			fileJSParser: {
				class: 'GollumJS.Reflection.FileJSParser',
				args: [
					"%fileJSParser.srcPath%",
					"%fileJSParser.excludes%"
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
			
			var service = GollumJS.Reflection.ReflectionClass.getClassByIdentifers (GollumJS.config.services[name].class.split('.'));
			if (service) {
				_instances[name] = new (Function.prototype.bind.apply(
					service,
					(new GollumJS.Parser.ArgumentsParser(GollumJS.config.services[name].args ? GollumJS.config.services[name].args : [] )).parse()
				));
			}
		}

		return _instances[name];
	};

}) ();