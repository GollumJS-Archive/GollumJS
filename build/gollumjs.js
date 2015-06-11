GollumJS = typeof GollumJS != 'undefined' ? GollumJS : {};
GollumJS.__init = true;

GollumJS.Utils = {

	clone: function (value) {

		if (value === null) {
			return null;
		}
		var target = null;
		
		if (typeof (value) == 'object') {
			if (Object.prototype.toString.call( value ) === '[object Array]') {
				target = [];
				for (var k = 0; k < value.length; k++) {
					target[k] = GollumJS.Utils.clone (value[k]);
				}
			} else {
				target = {};
				GollumJS.Utils.extend (target, value);
			}

		} else {
			target = value;
		}
		return target;
	},

	extend: function(destination, source) {
		for (var property in source) {

			if (source[property] == null) {
				if (typeof destination[property] == 'undefined') {
					destination[property] = null;
				}
			} else
			if (typeof (source[property]) == 'object' && Object.prototype.toString.call( source[property] ) !== '[object Array]') {
				if (typeof destination[property] == 'undefined') {
					destination[property] = {};
				}
				GollumJS.Utils.extend (destination[property], source[property]);
			} else {
				destination[property] = GollumJS.Utils.clone(source[property]);
			}
			
		}
		return destination;
	}

};

(function () {

	var config = {

		fileJSParser: {
			srcPath: [ './' ],
			excludes: ['.git', '.svn', 'gollumjs.js', 'gollumjs-min.js', 'index.js']
		},
		cache: {
			path: './tmp/cache',
		},

		services: {

			fileJSParser: 'GollumJS.Reflection.FileJSParser',
			cache       : 'GollumJS.Cache.Cache'

		}

	};

	if (GollumJS.config != 'undefined') {
		GollumJS.Utils.extend (config, GollumJS.config);
	}
	GollumJS.config = config;
	GollumJS.cache = {};

	var _instances = {};

	GollumJS.get = function (name) {

		if (!_instances[name] && GollumJS.config.services[name]) {

			var service = GollumJS.Reflection.ReflectionClass.getClassByIdentifers (GollumJS.config.services[name].split('.'));
			if (service) {
				_instances[name] = new service ();
			}
		}

		return _instances[name];
	};

}) ();

/**
 * Objet permettant d'implémenter un system objet avec héritage simple
 * 
 *  initialize : Implémente une methode constructeur avec la methode initialize ()
 * 	Extends    : Implémente l'héritage simple par l'attribut this.Extends
 *               Appel au methode parente par ce même attribut this.parent
 *  Static   : insertion de variable Static dans l'objet 
 *             Si dans Static domReady existe elle sera appelé automatiquement à la fin du cahrgement de la page
 *  this.parent : Dans une methode this.parent permet d'accéder à la Class mère de l'objet
 *  this.self : self exist toujours dans l'objet et permet d'accéder au constructeur de l'objet
 *  @namespace	
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
 
 /**
  * Objet Class permettant de créer une otion objet avancé
  * @param {} implementation
  */
GollumJS.Class = function (implementation) {

	var parentInScope = function () {
		throw new Error ('L\'objet n\'a pas de Class parente', this);
	};
	if (implementation.Extends) {
		parentInScope = function () {
			implementation.Extends.apply(this, arguments);
		};
		for (var i in implementation.Extends.prototype) {
			(
				function (name, called) {
					if (typeof (called) == 'function') {
						parentInScope[name] = function () {
							return called.apply(this.__this__, arguments);
						};
					}
				}(i, implementation.Extends.prototype[i])
			);
		}
	}
	
	var gjsObject = function () {
		
		for (var i in this) {
			this[i] = GollumJS.Utils.clone(this[i]);
		}
		
		if (implementation.initialize) {
			var oldParent = null;
			if (this.parent) {
				oldParent = this.parent;
			}
			this.parent = parentInScope;
			this.parent.__this__ = this;
			
			implementation.initialize.apply(this, arguments);
			
			if (oldParent) {
				this.parent = oldParent;
			} else {
				delete (this.parent);
			}
			
		} else if (implementation.Extends) {
			implementation.Extends.apply(this, arguments);
		}
	};
	
	if (implementation.Extends) {
		for (var i in implementation.Extends.prototype) {
			gjsObject.prototype[i] = GollumJS.Utils.clone(implementation.Extends.prototype[i]);
		}
		
		// Recopie des Static
		for (var i in implementation.Extends) {
			if (i != 'prototype') {
				(
					function (name, called) {
						gjsObject[name] = GollumJS.Utils.clone(called);
					} (i, implementation.Extends[i])
				);
			}
		}
	}
	
	
	if (implementation.Static) {
		for (var i in implementation.Static) {
			gjsObject[i] = GollumJS.Utils.clone(implementation.Static[i]);
		}
	}
	
	if (implementation) {
		for (var i in implementation) {
		
			switch (i) {
				
				case 'initialize' : // Déjà traité
				case 'Extends' :     // Déjà traité
				case 'Static' :   // Déjà traité
					break;
				
				default : // Toute les functions et attribut
					(
						function (name, called) {
							if (typeof (called) == 'function') {
								gjsObject.prototype[name] = function () {
									var oldParent = null;
									if (this.parent) {
										oldParent = this.parent;
									}
									this.parent = parentInScope;
									this.parent.__this__ = this;
								
									var value = called.apply (this, arguments);
								
									if (oldParent) {
										this.parent = oldParent;
									} else {
										delete (this.parent);
									}
								
									return value;
								};
							} else {
								gjsObject.prototype[name] = GollumJS.Utils.clone (called);
								
							}
						} (i,  implementation[i])
					);
					break;
			}
		}
	}
	
	var addEvent = function (el, eventType, handler) {
		if (el.addEventListener) { // DOM Level 2 browsers
			el.addEventListener(eventType, handler, false);
		} else if (el.attachEvent) { // IE <= 8
			el.attachEvent('on' + eventType, handler);
		} else { // ancient browsers
			el['on' + eventType] = handler;
		}
	}

	if (typeof window != 'undefined' && window) {
		(function (gjsObject) {
			addEvent (window, "load", function () {
				if (gjsObject.domReady !== undefined && typeof (gjsObject.domReady) == 'function') {
					gjsObject.domReady.call (gjsObject);
				}
			});
		}) (gjsObject);
	}
	
	gjsObject.prototype.self = gjsObject; // Racourcis
	
	(function () {

		var _reflectionClass = null;

		gjsObject.getReflectionClass = function () {

			if (!_reflectionClass) {

				var parser = GollumJS.get('fileJSParser');
				
				for (var i = 0; i < parser.classList.length; i++) {
					if (gjsObject == parser.classList[i].constructor) {
						_reflectionClass = parser.classList[i];
					}
				}
			}

			return _reflectionClass;
		};
	})();

	return gjsObject;
};


///////////////////////////
// Exemple d'utilisation //
///////////////////////////
/*
// Test recopie des attributs type object lors d'un héritage

var ClassA = new Class ({
	
	tata: {},
	
});

var ClassB = new Class ({
	Extends: ClassA
});

var b1 = new ClassB ();
b1.tata[0] = 'tutu';
var b2 = new ClassB ();
b2.tata[1] = 'toto';

console.log ('ClassB : ', ClassB);
console.log ('b1 : ', b1);
console.log ('b2 : ', b2);

console.log ('============================================');
console.log ('============================================');
console.log ('============================================');
console.log ('============================================');
console.log ('============================================');

/*
var ClassA = new Class ({
	
	attribut1 : 1,
	
	TYPE:'A',
	
	A:function (){},
	
	initialize: function (param1, param2) {
		console.log ('construction A this : ', this);
		console.log ('construction A : ', param1);
		console.log ('construction A : ', param2);
		
		this.attribut1 = 2;
	},
	
	afficher: function (text) {
		console.log ('je suis A : ',text );
	},
	
	afficher2: function (text) {
		console.log ('je suis A pour la 2eme fois: ',text );
	},
	
	retourn10: function () {
		return 10;
	}
});

console.log ('ClassA',ClassA);

var ClassB = new Class ({
	
	Extends:ClassA,
	
	TYPE:'B',
	
	B:function (){},
	
	initialize: function (param1, param2) {
		
		console.log ('construction B : initialise 2');
		
		this.parent(param1, param2);
		
	},
	
	afficher: function (text) {
		console.log ('Afficher B surcharger', text);
		this.parent.afficher (text+' hhhola');
	}
	
	
});

console.log ('ClassB',ClassB);

var ClassC = new Class ({

	Extends:ClassB,
	
	TYPE:'C',
	
	C:function (){},
	
	afficher: function (text) {
		console.log ('Afficher C surcharger', text);
		this.parent.afficher (text+' whawha');
	},
	
	retourn10: function () {
		return this.parent.retourn10 () + 0.10;
	}
	
});


console.log ('ClassC',ClassC);

var ClassD = new Class ({

	Extends:ClassC,
	
	TYPE:'D',
	
	D:function (){},
	
	afficher: function (text) {
		console.log ('Afficher D surcharger', text);
		this.parent.afficher (text+' MUUUU');
	}
	
});

console.log ('ClassD',ClassD);

console.log ('===============================================================');


var a = new ClassA('parametre 1', 'parametre 2');
console.log ('a',a);
//a.afficher('HA ha ha!');
//a.afficher2('HA ha ha!');



console.log ('===============================================================');
var b = new ClassB('parametreB 1', 'parametreB 2');
b.afficher('HB hb hb!');
b.afficher2('HB hb hb!');
console.log ('b',b);




console.log ('===============================================================');
var c = new ClassC('parametreC 1', 'parametreC 2');
c.afficher('HC hc hc!');
console.log ('c',c);



console.log ('===============================================================');
var d = new ClassD('parametreD 1', 'parametreD 2');
d.afficher('HD hd hd!');
console.log(d.retourn10());
console.log ('d',d);

*/




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


GollumJS.Cache = GollumJS.Cache || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Cache.Cache = new GollumJS.Class ({

	fs:  null,

	initialize: function () {
		if (typeof module !== 'undefined' && module.exports) {
			this.fs = require('node-fs');
			this.read();
		}
	},

	get: function (key, defaultValue) {
		if (typeof GollumJS.cache[key] == 'undefined') {
			return defaultValue ? defaultValue : null;
		}
		return GollumJS.cache[key];
	},

	set: function (key, value) {
		GollumJS.cache[key] = value;
		this.write (GollumJS.cache);
	},

	read : function () {
		if (this.fs) {
			var path = GollumJS.config.cache.path+"/datas.json";
			console.log ("Read cache file : ", path);
			if (!this.fs || this.fs.existsSync(path)) {
				GollumJS.cache = JSON.parse(this.fs.readFileSync(path));
			}
		}
	},

	_createCacheDir: function () {
		if (this.fs) {
			if (!this.fs.existsSync(GollumJS.config.cache.path)) {
				this.fs.mkdirSync(GollumJS.config.cache.path, 0777, true);
			}
		}
	},

	write : function () {
		if (this.fs) {
			this._createCacheDir();
			var path = GollumJS.config.cache.path+"/datas.json";

			this.fs.writeFile(path, JSON.stringify(GollumJS.cache), function(err) {
				if(err) {
					return console.error(err);
				}
			});
		}
	},

	writeJS: function () {
		if (this.fs) {
			this._createCacheDir();
			
			var path = GollumJS.config.cache.path+"/datas.js";
			this.fs.writeFile(
				path,
				"GollumJS = typeof GollumJS != undefined ? GollumJS : {};\n" +
				"GollumJS.cache = " +
				JSON.stringify(GollumJS.cache) + 
				";"
				, 
				function(err) {
					if(err) {
						return console.error(err);
					}
				}
			);
		}
	}

});

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

					try {

						var parser = new GollumJS.Reflection.PropertyParser(this.tokens, i, rClass, name);

						if (parser.reflectionProperty) {
							rClass.properties[name] = parser.reflectionProperty;
							rClass.properties[name].comment = this.getComment(this.getPosOfStartNameDeclaration(i-1));
						} else {
							throw "Error parse property "+name;
						}
						i = parser.end;

					} catch (e) {
						console.log (e);
					}
				} else

				if (t.type == "Keyword" && t.value == "function") {

					try {

						var parser = new GollumJS.Reflection.MethodParser(this.tokens, i, rClass, name);

						if (parser.reflectionMethod) {
							rClass.methods[name] = parser.reflectionMethod;
							rClass.methods[name].comment = this.getComment(this.getPosOfStartNameDeclaration(i-1));
						} else {
							throw "Error parse method "+name;
						}
						i = parser.end;

					} catch (e) {
						console.log (e);
					}
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
		
		if (t.type != "Punctuator" || t.value != ":") { return i; }
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


GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.FileJSParser = new GollumJS.Class ({

	/**
	 * @var [GollumJS.Reflection.ReflectionClass]
	 */
	classList: null,

	initialize: function () {
		
		var cache = GollumJS.get("cache");
		var datas = cache.get("app.classList");

		if (datas) {
			this.classList = {};
			for (var i in datas) {
				var clazz = new GollumJS.Reflection.ReflectionClass();
				clazz.unserialiseInfos(datas[i]);
				this.classList[i] = clazz;
			}
		}
		if (!this.classList) {
			this.classList = {};
			this.parseSources ();
			datas = {};
			for (var i in this.classList) {
				datas[i] = this.classList[i].serialiseInfos();
			}
			cache.set("app.classList", datas);
		}
	},

	parseSources: function () {

		for (var i = 0; i < GollumJS.config.fileJSParser.srcPath.length; i++) {
			var path = GollumJS.config.fileJSParser.srcPath[i];
			this.parseFiles (this.getFiles (path, GollumJS.config.fileJSParser.excludes));
		}

	},

	getFiles: function (dir, excludes, files_){

		files_ = files_ || [];
		excludes = excludes || [];
		
		var fs = require('fs');
		var files = fs.readdirSync(dir);

		for (var i in files){
			var name = dir + '/' + files[i];
			if (excludes.indexOf(files[i]) == -1) {

				if (fs.statSync(name).isDirectory()) {
						this.getFiles(name, excludes, files_);
					
				} else {
					files_.push(name);
				}
			}
		}
		return files_;
	},

	parseFiles: function (files) {

 		var fs = require('fs');
		var _this = this;

		for (var i = 0; i < files.length; i++) {
			
			var file = files[i];
			
			if (file.substr (-3) == '.js') {

				content = fs.readFileSync(file, {encoding: 'utf-8'});

				try {
					var parser = new GollumJS.Reflection.ClassParser(content);
					for(var j = 0; j < parser.classList.length; j++) {
						if (typeof this.classList[parser.classList[j].getName()] == 'undefined') {
 							this.classList[parser.classList[j].getName()] = parser.classList[j];
 						}
					}
				} catch (e) {
				}

			}
			
		}
	}

});

GollumJS.Reflection = GollumJS.Reflection || {};

/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.MethodParser = new GollumJS.Class ({
	
	Extends: GollumJS.Reflection.AbstractParser,
	
	reflectionMethod: null,
	begin: 0,
	end: 0,

	initialize: function (tokens, begin, reflectionClass, name) {
		
		this.tokens = tokens;
		this.begin  = begin;
		this.end    = begin;

		this.reflectionMethod = new GollumJS.Reflection.ReflectionMethod (reflectionClass, name);
		
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


GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ReflectionClass = new GollumJS.Class ({
	
	identifiers: null,
	constructor: null,
	comment: null,
	methods: {},
	properties: {},
	staticMethods: {},
	staticProperties: {},

	_annotations: null,

	Static: {

		getClassByName: function (name, target) {

			target = target || window;

			return this.getClassByIdentifers (name.split ('.'), target);
		},

		getClassByIdentifers: function (identifiers, target, i) {

			if (!target) {
				if (typeof module !== 'undefined' && module.exports) {
					target = global;
				} else {
					target = window;
				}
			}
			
			i = i || 0;

			if (i >= identifiers.length) {
				return target;
			}
			
			if (typeof target[identifiers[i]] !== 'undefined') {
				return this.getClassByIdentifers (identifiers, target[identifiers[i]], i+1);
			}

			return null;
		},

	},

	initialize: function (identifiers) {
		if (identifiers) {
			this.identifiers  = identifiers;
			this.constructor = this.self.getClassByIdentifers (identifiers);
		}
	},

	getName: function () {
		return this.identifiers.join ('.');
	},

	getAnnotations: function () {
		if (this._annotations === null) {
			var  parser = new GollumJS.AnnotationParser (this.comment);
			this._annotations = parser.annotions;
		}
		return this._annotations;
	},

	serialiseInfos: function () {

		var serialiseInfosObject = function (o) {
			var datas = {};
			for (var i in o) {
				datas[i] = o[i].serialiseInfos();
			}
			return datas;
		} 

		return {
			identifiers     : this.identifiers,
			comment         : this.comment,
			methods         : serialiseInfosObject(this.methods),
			properties      : serialiseInfosObject(this.properties),
			staticMethods   : serialiseInfosObject(this.staticMethods),
			staticProperties: serialiseInfosObject(this.staticProperties),
		};
	},

	unserialiseInfos: function (infos) {
		
		var _this = this;
		var unserialiseInfosObject = function (datas, clazz) {
			var os = {};
			for (var i in datas) {
				os[i] = new clazz (_this);
				os[i].unserialiseInfos(datas[i]);
			}
			return os;
		} 

		this.identifiers      = infos.identifiers;
		this.constructor      = this.self.getClassByIdentifers (infos.identifiers);
		this.comment          = infos.comment;
		this.methods          = unserialiseInfosObject(infos.methods         , GollumJS.Reflection.ReflectionMethod);
		this.properties       = unserialiseInfosObject(infos.properties      , GollumJS.Reflection.ReflectionProperty);
		this.staticMethods    = unserialiseInfosObject(infos.staticMethods   , GollumJS.Reflection.ReflectionMethod);
		this.staticProperties = unserialiseInfosObject(infos.staticProperties, GollumJS.Reflection.ReflectionProperty);
	}

});


GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ReflectionMethod = new GollumJS.Class ({
	
	name: null,
	reflectionClass: null,
	comment: null,
	

	initialize: function (reflectionClass, name) {
		this.reflectionClass = reflectionClass;
		this.name            = name;
	},

	getDefaultValue: function () {
		return this.reflectionClass.constructor.prototype[this.name];
	},

	serialiseInfos: function () {
		return {
			name   : this.name,
			comment: this.comment
		};
	},

	unserialiseInfos: function (infos) {
		this.name    = infos.name;
		this.comment = infos.comment;
	}

});


GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ReflectionProperty = new GollumJS.Class ({
	
	name: null,
	reflectionClass: null,
	comment: null,
	

	initialize: function (reflectionClass, name) {
		this.reflectionClass = reflectionClass;
		this.name            = name;
	},

	getDefaultValue: function () {
		return this.reflectionClass.constructor.prototype[this.name];
	},

	serialiseInfos: function () {
		return {
			name   : this.name,
			comment: this.comment
		};
	},

	unserialiseInfos: function (infos) {
		this.name    = infos.name;
		this.comment = infos.comment;
	}
});


