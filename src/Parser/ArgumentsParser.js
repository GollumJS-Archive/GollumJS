GollumJS.Parser = GollumJS.Parser || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Parser.ArgumentsParser = new GollumJS.Class ({

	_args : [],

	/**
	 * Contructor
	 * @param Array args
	 */
	initialize: function (args) {
		this._args = typeof args !== 'undefined' ? args: [];
	},

	_findConfigValue: function (search, rtn) {
		if (!search.length) {
			return rtn;
		}
		rtn = rtn !== undefined ? rtn : GollumJS.config;
		if (rtn[search[0]] !== undefined) {
			rtn = rtn[search[0]];
			search.shift(); 
			return this._findConfigValue(search, rtn);
		}
		return null;
	},

	_findFinalArgument: function (arg) {

		var _this = this;
		var rtn = null;

		switch (typeof arg) {

			case 'string':
				if (arg[0] == '@') {
					rtn = GollumJS.get(arg.substr(1));
				} else {
					rtn = arg.replace(new RegExp('\%[a-zA-Z0-9.]+\%', 'g'), function (match, start) {
						return _this._findConfigValue(match.substr(0, match.length-1).substr(1).split('.'));
					});
				}
				break;
			case 'object':
				if (Object.prototype.toString.call(arg) === '[object Array]') {
					rtn = [];
					for (var i = 0; i < arg.length; i++) {
						rtn.push(this._findFinalArgument(arg[i]));
					}
				} else {
					rtn= {};
					for (var i in arg) {
						rtn[i] = this._findFinalArgument(arg[i]);
					}
				}
				break;
			default:
				rtn = arg
				break;
		}
		return rtn;
	},

	parse: function () {
		var parsed = [];

		for (var i = 0; i < this._args.length; i++) {
			parsed.push (this._findFinalArgument(this._args[i]));
		}

		return parsed;
	}

});