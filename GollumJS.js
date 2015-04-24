(function () {

	var config = {

		fileJSParser: {
			srcPath: [ './' ],
			excludes: ['.git', '.svn']
		},

		services: {

			fileJSParser: 'GollumJS.Reflection.FileJSParser'

		}

	};

	if (GollumJS.config != 'undefined') {
		GollumJS.Utils.extend (config, GollumJS.config);
	}
	GollumJS.config = config;

	var _instances = {};

	GollumJS.get = function (name) {

		if (!_instances[name] && GollumJS.config.services[name]) {

			var service = eval (GollumJS.config.services[name]);
			if (service) {
				_instances[name] = new service ();
			}
		}

		return _instances[name];
	};

}) ();