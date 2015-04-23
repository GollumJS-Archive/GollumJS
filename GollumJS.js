GollumJS.config = {

	fileJSParser: {
		srcPath: [ './' ],
		excludes: ['.git', '.svn']
	},

	services: {

		fileJSParser: GollumJS.Reflection.FileJSParser

	}

};

(function () {

	var _instances = {};

	GollumJS.get = function (name) {
		if (!_instances[name] && GollumJS.config.services[name]) {
			_instances[name] = new (GollumJS.config.services[name]) ();
		}

		return _instances[name];
	};

}) ();