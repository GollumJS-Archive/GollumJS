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

			fileJSParser: 'GollumJS.Reflection.FileJSParser',
			cache       : 'GollumJS.Cache.Cache'

		}

	};

	if (GollumJS.config != 'undefined') {
		GollumJS.Utils.extend (config, GollumJS.config);
	}
	GollumJS.config = config;
	GollumJS.cache = {};

	var _instances = {};

	GollumJS.get = function (name) {

		if (!_instances[name] && GollumJS.config.services[name]) {

			var service = GollumJS.Reflection.ReflectionClass.getClassByIdentifers (GollumJS.config.services[name].split('.'));
			if (service) {
				_instances[name] = new service ();
			}
		}

		return _instances[name];
	};

}) ();