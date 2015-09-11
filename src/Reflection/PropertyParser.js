GollumJS.Reflection = GollumJS.Reflection || {};

/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.PropertyParser = new GollumJS.Class ({
	
	Extends: GollumJS.Reflection.AbstractParser,
	
	reflectionProperty: null,
	begin: 0,
	end: 0,

	initialize: function (tokens, begin, reflectionClass, name) {
		
		this.tokens = tokens;
		this.begin  = begin;
		this.end    = begin;

		this.reflectionProperty = new GollumJS.Reflection.ReflectionProperty (reflectionClass, name);
		
		this.parse ();
	},

	parse: function () {

		var t = this.tokens[this.begin];
		
		if (t.type == 'Identifier') {
			
			var i = this.begin+1;
			t = this.tokens[i];

			while (t && t.type == 'Punctuator' && t.value == '.') {
				i++; t = this.tokens[i];
				if (t.type != 'Identifier') {
					break;
				}
				i++; t = this.tokens[i];
			}

			this.end = i;
			
		} else

		if (
			t.type == 'Punctuator' && (
				t.value == '[' ||
				t.value == '{'
			)
		) {
			this.end = this.getPosClose (this.begin+1, t.value, t.value == '[' ? ']' : '}');
		} else {
			this.end = this.begin+1;
		}
	}

});
