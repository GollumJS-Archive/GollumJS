GollumJS.Reflection = GollumJS.Reflection || {};

/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.MethodParser = new GollumJS.Class ({
	
	Extends: GollumJS.Reflection.AbstractParser,
	
	reflectionProperty: null,
	begin: 0,
	end: 0,

	initialize: function (tokens, begin, reflectionClass, name) {
		
		this.tokens = tokens;
		this.begin  = begin;
		this.end    = begin;

		this.reflectionProperty = new GollumJS.Reflection.ReflectionMethod (reflectionClass, name);
		
		this.parse ();
	},

	parse: function () {

		var i = this.begin;
		var t = this.tokens[i];

		if (t.type != "Keyword" || t.value != 'function') {
			this.end = i+1;
			return;
		}
		
		i++; t = this.tokens[i];
		if (t.type != "Punctuator" || t.value != '(') {
			this.end = i+1;
			return;
		}

		i++; t = this.tokens[i];
		while (t && !(t.type == "Punctuator" && t.value == ')')) {
			// TODO PARAMETER
			i++; t = this.tokens[i];
		}
		if (!t) {
			this.end = i+1;
			return;
		}
		i++; t = this.tokens[i];

		if (t.type == "Punctuator" && t.value == '{') {
			this.end = this.getPosClose (i+1, '{', '}');
		} else {
			this.end = i+1;
		}
	}
});
