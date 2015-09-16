/**
 *  Class exception générique
 *
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Exception = new GollumJS.Class ({
	
	Extends: Error,
	name: "GollumJS.Exception",
	code: 0,

	initialize: function (message, code) {

		var err          = Error.prototype.constructor.apply(this, arguments);
		var fileName     = null;
		var lineNumber   = null;
		var columnNumber = null;
		this.stack       = err.stack ? err.stack : "";

		if (err.stack) {
			// remove one stack level:
			switch (GollumJS.Utils.engine()) {
				case GollumJS.Utils.ENGINE_GECKO:
					var stack = err.stack.split("\n");
					stack.shift();
					stack.shift();
					this.stack = stack.join("\n");
					if (stack[0]) {
						var caller = stack[0].split("@");
						var file = ["", null, null];
						if (caller[1]) {
							file = caller[1].split(":");
						}
						columnNumber = file[file.length-1] && file[file.length-1] == parseInt(file[file.length-1], 10) ? parseInt(file[file.length-1], 10) : null;
						lineNumber   = file[file.length-2] && file[file.length-2] == parseInt(file[file.length-2], 10) ? parseInt(file[file.length-2], 10) : null;
						file.pop();
						file.pop();
						fileName = file.join(':');
					}
					break;
				case GollumJS.Utils.ENGINE_WEBKIT:
					var stack = err.stack.split("\n");
					stack.shift();
					stack.shift();
					stack.shift();
					stack.shift();
					this.stack = stack.join("\n");
					if (stack[0]) {
						var scope = stack[0].substr(stack[0].indexOf('at ')+3);
						var file = scope.substr(scope.indexOf("(")+1);
						file = file.substr(0, file.lastIndexOf(")")).split(":");
						columnNumber = file[file.length-1] && file[file.length-1] == parseInt(file[file.length-1], 10) ? parseInt(file[file.length-1], 10) : null;
						lineNumber   = file[file.length-2] && file[file.length-2] == parseInt(file[file.length-2], 10) ? parseInt(file[file.length-2], 10) : null;
						file.pop();
						file.pop();
						fileName = file.join(':');
					}
					break;
				default:
					break;
			}
		}
		this.message      = err.message  !== undefined ? err.message  : message;
		this.fileName     = fileName     !== null      ? fileName     : (err.fileName     !== undefined ? err.fileName     : null);
		this.lineNumber   = lineNumber   !== null      ? lineNumber   : (err.lineNumber   !== undefined ? err.lineNumber   : null);
		this.columnNumber = columnNumber !== null      ? columnNumber : (err.columnNumber !== undefined ? err.columnNumber : null);
		this.code         = code         !== undefined ? code         : this.code;
	}
});