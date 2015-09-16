if (typeof global.GollumJS == 'undefined' || typeof global.GollumJS.__init == 'undefined') {

var GollumJS = typeof GollumJS != 'undefined' ? GollumJS : {};
GollumJS.__init__ = true;
GollumJS.__running__ = "GollumJS_"+new Date().getTime()+"_"+parseInt(Math.random()*100000, 10);


"use strict";

GollumJS.Utils = {

	ENGINE_GECKO : "gecko",
	ENGINE_WEBKIT: "webkit",
	ENGINE_MSIE  : "ie",
	ENGINE_OTHER : "other",
	
	isGollumJsClass: function (clazz) {
		return clazz && clazz.__gollumjs__ === GollumJS.__running__;
	},

	isGollumJsObject: function (obj) {
		return obj && obj.self !== undefined && GollumJS.Utils.isGollumJsClass(obj.self);
	},

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
	},

	addDOMEvent: function (el, eventType, handler) {
		if (el.addEventListener) { // DOM Level 2 browsers
			el.addEventListener(eventType, handler, false);
		} else if (el.attachEvent) { // IE <= 8
			el.attachEvent('on' + eventType, handler);
		} else { // ancient browsers
			el['on' + eventType] = handler;
		}
	},

	global: function () {
		return typeof window === undefined ? window : global; 
	},

	engine: function () {
		
		if (typeof module !== 'undefined' && module.exports) {
			return this.ENGINE_WEBKIT;
		}

		if (
			typeof navigator           != "undefined" &&
			typeof navigator.userAgent != "undefined"
		) {

			var ua = navigator.userAgent.toLowerCase();
			var match =
				/(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				/(trident)[ \/]([\w.]+)/.exec(ua)||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || []
			;
			var browser = match[1] || "";
			
			switch (browser) {
				case 'msie':
				case 'trident':
					return this.ENGINE_MSIE;
				case 'mozilla':
					return this.ENGINE_GECKO;
				case 'webkit':
				case 'chrome':
					return this.ENGINE_WEBKIT;
				default:
					break;
			}
		}
 
		return this.ENGINE_OTHER;
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
 *  initialize : Implémente une methode constructeur avec la methode initialize()
 * 	Extends    : Implémente l'héritage simple par l'attribut Extends
 *               Appel au methode parente par ce même attribut grâce à this.parent()
 *  Static   : insertion de variable Static dans l'objet 
 *             Si dans Static domReady existe elle sera appelé automatiquement à la fin du cahrgement de la page
 *  this.parent() : Dans une methode this.parent() permet d'accéder à la Class mère de l'objet
 *  this.self : self exist toujours dans l'objet et permet d'accéder au constructeur de l'objet
 *  @namespace	
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */

(function () {

	var __countClass__ = 0;

	/**
	 * Objet Class permettant de créer une otion objet avancé
	 * @param {} implementation
	 */
	GollumJS.Class = function (implementation) {

		if (typeof(implementation.initialize) != 'function') {
			implementation.initialize = function () {};
			
			if (implementation.Extends) {
				if (GollumJS.Utils.isGollumJsClass (implementation.Extends)) {
					implementation.initialize = implementation.Extends.prototype.initialize;
				} else {
					implementation.initialize = function () {
						implementation.Extends.apply(this, arguments)
					};
				}
			}
		}

		var gjsObject = function () {
			implementation.initialize.apply(this, arguments);
			return this;
		};
		
		/////////////////////
		// Generate exends //
		/////////////////////

		var __extends__ = [];
		var __reflectionClass__ = null;
		var __idClass__ = ++__countClass__;
		var __parent__ = null;

		if (implementation.Extends) {
			gjsObject.prototype = Object.create(implementation.Extends.prototype);

			__extends__.push (implementation.Extends);
			if (GollumJS.Utils.isGollumJsClass (implementation.Extends)) {
				__extends__ = __extends__.concat(implementation.Extends.getExtendsClass());
			}

		} else {
			gjsObject.prototype = Object.create(Object.prototype);
		}
		if (
			typeof(implementation.Uses) == 'object' && 
			Object.prototype.toString.call(implementation.Uses) === '[object Array]'
		) {
			for (var i = implementation.Uses.length-1; i >= 0 ; i--) {
				// Ajoute a la liste des extends
				__extends__.push (implementation.Uses[i]);
				if (GollumJS.Utils.isGollumJsClass (implementation.Uses[i])) {
					__extends__ = __extends__.concat(implementation.Uses[i].getExtendsClass());
				}
			}
		}

		__extends__ = __extends__.reverse();
		for (var i = 0; i < __extends__.length; i++) {
			// Recopie des Statics
			if (GollumJS.Utils.isGollumJsClass (__extends__[i])) {
				for (var j in __extends__[i]) {
					if (j != 'prototype') {
						(
							function (name, called) {
								gjsObject[name] = GollumJS.Utils.clone(called);
							} (j, __extends__[i][j])
						);
					}
				}
			}
			
			// Recopie des methode depuis les extends
			for (var j in __extends__[i].prototype) {
				(function (name, called) {
					if (typeof (called) == 'function') {
						gjsObject.prototype[name] = called;
					} else {
						gjsObject.prototype[name] = GollumJS.Utils.clone (called);
					}
				})(j,  __extends__[i].prototype[j]);
			}
		}
		__extends__ = __extends__.reverse();
		
		/////////////////////////////
		// Generate Object Methods //
		/////////////////////////////

		gjsObject.getExtendsClass = function () {
			return __extends__;
		};

		gjsObject.getIdClass = function () {
			return __idClass__;
		};

		gjsObject.getReflectionClass = function () {

			if (!__reflectionClass__) {

				var parser = GollumJS.get('fileJSParser');
				
				for (var i = 0; i < parser.classList.length; i++) {
					if (gjsObject == parser.classList[i].constructor) {
						__reflectionClass__ = parser.classList[i];
					}
				}
			}

			return __reflectionClass__;
		};

		gjsObject.isInstance = function (obj) {
			return (
				(obj instanceof this) || (
					GollumJS.Utils.isGollumJsObject(obj) &&
					obj.self.getExtendsClass().indexOf(this) != -1
				)
			);
		};

		/////////////////////
		// Generate Static //
		/////////////////////

		if (implementation.Static) {
			for (var i in implementation.Static) {
				gjsObject[i] = GollumJS.Utils.clone(implementation.Static[i]);
			}
		}

		/////////////////////////////////////
		// Generate Methods and Properties //
		/////////////////////////////////////

		for (var i in implementation) {
			
			switch (i) {
				
				case 'Extends': // Déjà traité
				case 'Uses':    // Déjà traité
				case 'Static':  // Déjà traité
					break;

				default : // Toute les functions et attribut
					(function (name, called) {
						if (typeof (called) == 'function') {
							gjsObject.prototype[name] = called;
						} else {
							gjsObject.prototype[name] = GollumJS.Utils.clone (called);
						}
					}) (i,  implementation[i]);
					break;
			}
		}

		////////////////////////////
		// Generate parent method //
		////////////////////////////

		gjsObject.prototype.parent = function (scope) {

			var __this__ = this;

			if (__parent__ === null) {

				__parent__ = function () {

					var target = __parent__.__scope__ !== undefined ? __parent__.__scope__ : __parent__.__extends__[0];
					
					if (GollumJS.Utils.isGollumJsClass (target)) {
						if (target) {
							var __oldExtends__ = __parent__.__extends__;
							__parent__.__extends__ = target.getExtendsClass();
							var __rtn__ = target.prototype.initialize.apply(__this__, arguments);
							__parent__.__extends__ = __oldExtends__;
							return __rtn__;
						}
					}
				};
				
				__parent__.__extends__ = __extends__;

				for (var i = 0; i < __parent__.__extends__.length; i++) {
					for (var j in __parent__.__extends__[i].prototype) {
						if (
							typeof __parent__.__extends__[i].prototype[j] == 'function' &&
							 typeof __parent__[j] == 'undefined'
						) {
							(function (i, j) {
								__parent__[j] = function () {
									var target = __parent__.__scope__ !== undefined ? __parent__.__scope__ : __parent__.__extends__[i];
									
									if (GollumJS.Utils.isGollumJsClass (target)) {
										if (target) {
											var __oldExtends__ = __parent__.__extends__;
											__parent__.__extends__ = target.getExtendsClass();
											var __rtn__ = target.prototype[j].apply(__this__, arguments);
											__parent__.__extends__ = __oldExtends__;
											return __rtn__;
										}
									}
								}
							})(i, j);
						}
					}
				}


			}
			__parent__.__scope__ = scope;
			return __parent__;
		};

		///////////////////////////////
		// Generate Class Properties //
		///////////////////////////////

		gjsObject.__gollumjs__ = GollumJS.__running__;	

		gjsObject.prototype.self = gjsObject; // Racourcis

		return gjsObject;
	};

})();

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
		this.message     = err.message  !== undefined ? err.message  : message;
		
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
					stack.unshift(this.name+": "+this.message);
					this.stack = stack.join("\n");
					if (stack[1]) {
						var file = stack[1].substr(stack[1].lastIndexOf("(")+1);
						file = file.substr(0, file.indexOf(")")).split(":");
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
		this.fileName     = fileName     !== null      ? fileName     : (err.fileName     !== undefined ? err.fileName     : null);
		this.lineNumber   = lineNumber   !== null      ? lineNumber   : (err.lineNumber   !== undefined ? err.lineNumber   : null);
		this.columnNumber = columnNumber !== null      ? columnNumber : (err.columnNumber !== undefined ? err.columnNumber : null);
		this.code         = code         !== undefined ? code         : this.code;
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
						
						var parser = new GollumJS.Annotation.Parser (rClass.comment);
						rClass.annotations = parser.annotions;

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

							var parser = new GollumJS.Annotation.Parser (rClass.properties[name].comment);
							rClass.properties[name].annotations = parser.annotions;

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
							
							var parser = new GollumJS.Annotation.Parser (rClass.methods[name].comment);
							rClass.methods[name].annotations = parser.annotions;
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

	annotations: [],

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

	annotations: [],
	

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
	
	annotations: [],
	
	
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


GollumJS.Annotation = GollumJS.Annotation ? GollumJS.Annotation : {};

GollumJS.Annotation.Parser = new GollumJS.Class ({

	comment: null,
	annotions: [],

	initialize: function (comment) {
		this.comment = comment;
		this.parse();
	},

	parse : function () {
		console.log (this.comment);
	}
});

GollumJS.Annotation = GollumJS.Annotation ? GollumJS.Annotation : {};

GollumJS.Annotation.AbstractAnnotation = new GollumJS.Class ({

	Static: {

		ANNOTATION_CLASS   : 0x1,
		ANNOTATION_METHOD  : 0x2,
		ANNOTATION_PROPERTY: 0x4,

		getClassWhichUse: function (target) {
			target = target ? target : (this.ANNOTATION_CLASS | this.ANNOTATION_METHOD | this.ANNOTATION_PROPERTY);

			// TODO not implement

			console.log (target);
		}

	},

	initialize: function (values) {

		if (typeof values == 'object') {
			for (var i in values) {
				if (typeof this[i] != 'undefined') {
					this[i] = values[i];
				}
			}
		}

	}

});


global.GollumJS = GollumJS; 
} module.exports = global.GollumJS; 