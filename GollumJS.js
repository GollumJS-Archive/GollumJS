(function () {

	var clone = function (value) {

		if (value === null) {
			return null;
		}
		var target = null;
		
		if (typeof (value) == 'object') {
			if (Object.prototype.toString.call( value ) === '[object Array]') {
				target = [];
				for (var k = 0; k < value.length; k++) {
					target[k] = clone (value[k]);
				}
			} else {
				target = {};
				extend (target, value);
			}

		} else {
			target = value;
		}
		return target;
	};

	var extend = function(destination, source) {
		for (var property in source) {
			destination[property] = clone(source[property]);
		}
		return destination;
	};

	var config = {

		fileJSParser: {
			srcPath: [ './' ],
			excludes: ['.git', '.svn']
		},

		services: {

			fileJSParser: GollumJS.Reflection.FileJSParser

		}

	};

	if (GollumJS.config != 'undefined') {
		extend (config, GollumJS.config);
	}
	GollumJS.config = config;

	var _instances = {};

	GollumJS.get = function (name) {
		if (!_instances[name] && GollumJS.config.services[name]) {
			_instances[name] = new (GollumJS.config.services[name]) ();
		}

		return _instances[name];
	};

}) ();