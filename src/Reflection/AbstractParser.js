GollumJS.Reflection = GollumJS.Reflection || {};

/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.AbstractParser = new GollumJS.Class ({
	
	tokens: null,

	getPosClose: function (i, searchOpen, searchClose) {

		var t = this.tokens[i];

		if (!t) {
			return i;
		}

		if (t.type == "Punctuator" && t.value == searchClose) {
			return i+1;
		}
		if (t.type == "Punctuator" && t.value == searchOpen) {
			i = this.getPosClose (i+1, searchOpen, searchClose)-1;
		}

		return this.getPosClose (i+1, searchOpen, searchClose);
	}
});
