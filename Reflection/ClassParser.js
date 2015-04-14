GollumJS.Reflection = GollumJS.Reflection || {};

/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ClassParser = new GollumJS.Class ({
	
	tokens: null,
	classList: [],

	ruleDetector: [
		{
			type: "Identifier",
			value: null 
		},
		{
			type: "Punctuator",
			value: "="
		},
		{
			type: "Keyword",
			value: "new"
		},
		{
			type: "Identifier",
			value: "GollumJS"
		},
		{
			type: "Punctuator",
			value: "."
		},
		{
			type: "Identifier",
			value: "Class"
		},
		{
			type: "Punctuator",
			value: "("
		}
	],

	initialize: function (content) {

		var esprima = require('esprima');
		this.tokens = esprima.tokenize(content);
		this.parse();
	},

	parse: function () {

		for (var i = 0; i < this.tokens.length; i++) {

			if (this.match (i)) {
				try {

					var identifiers = this.getFullIdentifierToken (i);
					var rClass = (new GollumJS.Reflection.ReflectionClass ()).createByIdentifiers (identifiers);
					console.log (identifiers);
					console.log (rClass);

				} catch (e) {
				}
			}

		}
	},

	getFullIdentifierToken: function (i, identifiers) {

		identifiers = identifiers || [];
		var cToken = this.tokens[i];

		if (cToken) {
			if (cToken.type == "Identifier") {
				identifiers.unshift (cToken.value);
			}
			if (this.tokens[i-1] && this.tokens[i-1].type == "Punctuator" && this.tokens[i-1].value == ".") {
				identifiers = this.getFullIdentifierToken (i-2, identifiers);
			}
		}

		return identifiers;
	},

	match: function (i, step) {
		step = step | 0;

		var token = this.tokens[i];

		if (step >= this.ruleDetector.length) {
			return true;
		}

		var ruleStep = this.ruleDetector[step];

		if (
			(ruleStep.type  === null || token.type  == ruleStep.type ) &&
			(ruleStep.value === null || token.value == ruleStep.value) 
		) {
			return this.match(i+1, step+1);
		}
		return false;
	}

});
