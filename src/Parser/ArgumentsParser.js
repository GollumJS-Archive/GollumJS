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

	_findFinalString: function (str) {

		var _this = this;

		switch (typeof str) {

			case 'string':
				// TODO no implement
				str = str.replace(new RegExp('\%[a-zA-Z0-9.]+\%', 'g'), function (match, start) {
					return _this._findConfigValue(match.substr(0, match.length-1).substr(1).split('.'));
				});
				break;
			default:
				break;
		}
		return str;
	},

	parse: function () {

		var parsed= [];

		for (var i = 0; i < this._args.length; i++) {
			if (this._args[i][0] == '@') {
				parsed.push (GollumJS.get(this._args[i].substr(1)));
			} else {
				parsed.push (this._findFinalString(this._args[i]));
			}
		}

		return parsed;
	}

});