GollumJS.Parser = GollumJS.Parser || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Parser.ArgumentsParser = new GollumJS.Class ({
	
	Static: {
		_findConfigValue: function (search, str, rtn) {
			if (!search.length) {
				return rtn;
			}
			rtn = rtn !== undefined ? rtn : GollumJS.config;
			if (rtn[search[0]] !== undefined) {
				rtn = rtn[search[0]];
				search.shift(); 
				return this._findConfigValue(search, str, rtn);
			}
			return null;
		},

		parseConfig: function (arg) {

			var _this = this;
			var rtn = arg

			switch (typeof arg) {

				case 'string':
					if (arg[0] == '@') {
						rtn = GollumJS.get(arg.substr(1));
					} else {
						var hasReplaced = false;
						arg.replace(new RegExp('\%[a-zA-Z0-9._]+\%', 'i'), function (match, start) {
							if (match == arg) {
								rtn = _this._findConfigValue(match.substr(0, match.length-1).substr(1).split('.'), arg);
							} else {
								rtn = 
									arg.substr(0, start) +
									_this._findConfigValue(match.substr(0, match.length-1).substr(1).split('.'), arg) +
									arg.substr(match.length+start)
								;
							}
							hasReplaced = true;
						});
						if (hasReplaced || typeof rtn != "string") {
							rtn = this.parseConfig(rtn);
						}
					}
					break;
				case 'object':
					if (Object.prototype.toString.call(arg) === '[object Array]') {
						rtn = [];
						for (var i = 0; i < arg.length; i++) {
							rtn.push(this.parseConfig(arg[i]));
						}
					} else {
						rtn = {};
						for (var i in arg) {
							rtn[i] = this.parseConfig(arg[i]);
						}
					}
					break;
				default:
					break;
			}
			return rtn;
		}
	},
	
	_args : [],

	/**
	 * Contructor
	 * @param Array args
	 */
	initialize: function (args) {
		this._args = typeof args !== 'undefined' ? args: [];
	},

	parse: function () {
		var parsed = [];

		for (var i = 0; i < this._args.length; i++) {
			parsed.push (this.self.parseConfig(this._args[i]));
		}

		return parsed;
	}

});