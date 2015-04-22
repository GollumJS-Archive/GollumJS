GollumJS.Reflection = GollumJS.Reflection || {};

/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ClassParser = new GollumJS.Class ({
	
	Extends: GollumJS.Reflection.AbstractParser,

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
		this.tokens = esprima.tokenize(content, { loc: true, comment: true });
		this.parse();
	},

	parse: function () {

		for (var i = 0; i < this.tokens.length; i++) {

			if (this.match (i)) {
				try {

					var identifiers = this.getFullIdentifierToken (i);
					if (GollumJS.Reflection.ReflectionClass.getClassByIdentifers(identifiers)) {
						
						var rClass = new GollumJS.Reflection.ReflectionClass (identifiers);
						rClass.comment = this.getComment(this.getPosOfStartIdentifierDeclaration(i));
						
						i = this.setImplementation (rClass, i+1);
						
						console.log (rClass);

						this.classList.push (rClass);
					}

				} catch (e) {
				}
			}

		}
	},

	setImplementation: function (rClass, i) {

		var t = this.tokens[i];
		if (t.type != "Punctuator" || t.value != "="       ) { return i; } i++; t = this.tokens[i];
		if (t.type != "Keyword"    || t.value != "new"     ) { return i; } i++; t = this.tokens[i];
		if (t.type != "Identifier" || t.value != "GollumJS") { return i; } i++; t = this.tokens[i];
		if (t.type != "Punctuator" || t.value != "."       ) { return i; } i++; t = this.tokens[i];
		if (t.type != "Identifier" || t.value != "Class"   ) { return i; } i++; t = this.tokens[i];
		if (t.type != "Punctuator" || t.value != "("       ) { return i; } i++; t = this.tokens[i];
		if (t.type != "Punctuator" || t.value != "{"       ) { return i; } i++;

		while (true) {

			t = this.tokens[i];

			if (
				t.type == "Identifier" ||
				t.type == "String"     ||
				t.type == "Numeric"    
			) {

				var name = (t.type == "String") ? JSON.parse(t.value) : t.value;

				i++; t = this.tokens[i];
				if (t.type != "Punctuator" || t.value != ":" ) { i++; continue; } i++; t = this.tokens[i];

				if (
					t.type == "Null"       ||
					t.type == "String"     ||
					t.type == "Identifier" ||
					t.type == "Numeric"    ||
					t.type == "Boolean"    ||
					t.type == "Punctuator" && (
						t.value == "[" ||
						t.value == "{"
					)
				) {

					var parser = new GollumJS.Reflection.PropertyParser(this.tokens, i, rClass, name);

					rClass.properties[name] = parser.reflectionProperty;
					rClass.properties[name].comment = this.getComment(this.getPosOfStartNameDeclaration(i-1));

					i = parser.end;

				} else

				if (t.type == "Keyword" && t.value == "function") {

					var parser = new GollumJS.Reflection.MethodParser(this.tokens, i, rClass, name);

					rClass.methods[name] = parser.reflectionMethod;
					rClass.methods[name].comment = this.getComment(this.getPosOfStartNameDeclaration(i-1));
					i = parser.end;
				} 

				else {
					i++;
					continue;
				}

				t = this.tokens[i];

				if (t.type != "Punctuator" || t.value == "}" ) { break; }
				if (t.type != "Punctuator" || t.value != "," ) { continue; }

			} else {
				break;
			}

			i++;
		}

		t = this.tokens[i];

		if (t.type != "Punctuator" || t.value != "}"       ) { return i; } i++; t = this.tokens[i];
		if (t.type != "Punctuator" || t.value != ")"       ) { return i; } i++;

		return i;
	},
	
	getPosOfStartNameDeclaration: function (i) {

		t = this.tokens[i];
		
		if (t.type != "Punctuator" || t.value != ":") { return i; } i++; t = this.tokens[i];
		if (
			t.type != "Identifier" &&
			t.type != "String"     &&
			t.type != "Numeric"    
		) {
			return i;
		}

		return i-1;
	},

	getPosOfStartIdentifierDeclaration: function (i) {

		var t  = this.tokens[i];
		if (
			t && (
				t.type == "Identifier" ||
				t.type == "Punctuator" && t.value == "." ||
				t.type == "Keyword" && (
					t.value == "var" ||
					t.value == "let"
				)
			)
		) {
			return this.getPosOfStartIdentifierDeclaration (i-1);
		}

		return i+1;
	},

	getComment: function (i) {

		var begin     = this.tokens[i];
		var before    = this.tokens[i-1];
		var lineStart = before ? before.loc['end'].line  : 1;
		var lineEnd   = begin  ? begin.loc['start'].line : 1;

		return this.findCommentByLine(lineStart, lineEnd);
	},

	findCommentByLine: function (lineStart, lineEnd) {
		if (lineStart >= lineEnd) {
			return null;
		}

		for (var i = 0; i < this.tokens.comments.length; i++) {
			var comment = this.tokens.comments[i];

			if (comment.loc['start'].line > lineStart) {
				break;
			}

			if (comment.loc['start'].line == lineStart && comment.value[0] == '*') {
				return comment.value;
			}
		}

		return this.findCommentByLine (lineStart+1, lineEnd);
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
