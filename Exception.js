var GollumJS = GollumJS || {};

console.log (this);

/**
 *  Class exception générique
 *
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Exception = new GollumJS.Class ({
	
	Extends: Error,
	
	Static : {
		parse: function (ex) {
			if (ex.Exception) {
				if (console && console.error) {
					console.error ('type : ', ex.ExceptionType);
					var args = {};
					for (var i in ex.args) {
						if (i == 0) {
							console.error ('message : ', ex.args[i]);
							continue;
						}
						args[i] = ex.args[i];
					}
					console.error ('arguments : ', args);
					console.error ('pile : ', ex.pile);
				}
			}
			throw ex;
		}
	},
	
	ExceptionType: 'Exception',

	initialize: function () {
		this.init (arguments);
	},

	/**
	 * Initialise l'exception
	 * @param args
	 */
	init: function (args) {
		this.args = args;

		try {
			throw new Error ('backtrace');
		} catch (e) {
			if (e.stack) {
				var lines = e.stack.split("\n");
				this.pile = {};
				var j = 0;
				for (var i in lines) {
					switch (i) {
						case '0':
						case '1':
						case '2':
						case '3':
						case '4':
							break;

						default:
							var func = lines[i].split ('@'); func = func[0];
							lines[i] = lines[i].substr (func.length + 1);
							var numLine = lines[i].split (':'); numLine = numLine[numLine.length-1];
							lines[i] = lines[i].substr (0, lines[i].length - (numLine.length + 1));

							if (lines[i].indexOf('core/Class.js') == -1) { // Evite de parasiter la pile avec Class
								this.pile[j++] = {
									'call': func+'()',
									'file':lines[i],
									'line':numLine
								}
							}
							break;
					}
				}
			}
		}

	}
});
