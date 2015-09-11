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

(function () {

	var __countClass__ = 0;

	/**
	 * Objet Class permettant de créer une otion objet avancé
	 * @param {} implementation
	 */
	GollumJS.Class = function (implementation) {

		
		var gjsObject = function () {

			//////////////////////////
			// Generate Constructor //
			//////////////////////////

			if (typeof(implementation.initialize) == 'function') {

				implementation.initialize.apply(this, arguments);

			} else {

				if (implementation.Extends) {

					if (
						typeof(implementation.Extends) == 'object' && 
						Object.prototype.toString.call(implementation.Extends) === '[object Array]'
					) {
						for (var i = 0; i < implementation.Extends.length; i++) {
							if (typeof(implementation.Extends[i]) == 'function') {
								implementation.Extends[i].apply(this, arguments);
							}
						}
					} else {
						implementation.Extends.apply(this, arguments);
					}
				}
				
				this.initialize = function () {};
			}
		};

		(function () {

			/////////////////////////////
			// Generate Extends Methods //
			/////////////////////////////

			var __entends__ = [];
			if (implementation.Extends) {
				if (
					typeof(implementation.Extends) == 'object' && 
					Object.prototype.toString.call(implementation.Extends) === '[object Array]'
				) {
					for (var i = 0; i < implementation.Extends.length; i++) {
						
					}
				} else {
					
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
					
					// Recopie des methode depuis les extends					
					for (var i in implementation.Extends.prototype) {
						(function (name, called) {
							if (typeof (called) == 'function') {
								gjsObject.prototype[name] = called;
							} else {
								gjsObject.prototype[name] = GollumJS.Utils.clone (called);
							}
						})(i,  implementation.Extends.prototype[i]);
					}

					// Ajoute a la liste des extends
					__entends__.push (implementation.Extends);
					if (typeof(implementation.Extends.getExtendsClass) == 'function') {
						__entends__ = __entends__.concat(implementation.Extends.getExtendsClass());
					}
				}
			}

			/////////////////////
			// Generate Static //
			/////////////////////

			if (implementation.Static) {
				for (var i in implementation.Static) {
					gjsObject[i] = GollumJS.Utils.clone(implementation.Static[i]);
				}
			}

			//////////////////////
			// Generate Methods //
			//////////////////////

			for (var i in implementation) {
				
				switch (i) {
					
					case 'Extends' :     // Déjà traité
					case 'Static' :   // Déjà traité
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

			////////////////////////////////
			// Generate Object Properties //
			////////////////////////////////

			gjsObject.__gollumjs__ = GollumJS.__running__;	

			/////////////////////////////
			// Generate Object Methods //
			/////////////////////////////

			gjsObject.getExtendsClass = function () {
				return __entends__;
			};

			var __idClass__ = ++__countClass__;
			gjsObject.getIdClass = function () {
				return __idClass__;
			};

			var __reflectionClass__ = null;
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

			if (typeof(implementation.Extends) == 'function') {

				// __entends__[implementation.Extends.getIdClass()] = {};

				// for (var i in implementation.Extends.prototype) {
				// 	(
				// 		function (name, called) {
				// 			if (typeof (called) == 'function') {
				// 				__entends__[implementation.Extends.getIdClass()][name] = function () {
				// 					return called.apply(gjsObject, arguments);
				// 				};
				// 			}
				// 		}
				// 	)(i, implementation.Extends.prototype[i]);
				// }

				// gjsObject.prototype.parent = function (classTarget) {

				// 	if (
				// 		classTarget === undefined ||
				// 		classTarget === null
				// 	) {
				// 		for (var i) {

				// 		}
				// 	} else {

				// 	}
				// }

				// console.log("__entends__", __entends__);

			// } else if (
			// 	typeof(implementation.Extends) == 'object' && 
			// 	Object.prototype.toString.call(implementation.Extends) === '[object Array]'
			// ) {
			// 	for (var i = 0; i < implementation.Extends.length; i++) {
			// 		//if (typeof(implementation.Extends[i]) == 'function') {
			// 			//implementation.Extends[i].apply(this, arguments);
			// 		//}
			// 	}
			}

			// gjsObject.prototype.parent = function (classTarget) {


			// 	function () {
			// 		var foundClassTarget = function (classTarget) {

			// 			if (
			// 				classTarget === undefined ||
			// 				classTarget === null
			// 			) {

			// 			}

			// 		};

			// 		classTarget = foundClassTarget(classTarget);
			// 	)();
				
			// 	if (typeof(implementation.Extends) == 'function') {
			// 		if (
			// 			classTarget === undefined ||
			// 			classTarget === null ||
			// 			classTarget === implementation.Extends
			// 		) {
			// 			implementation.Extends.apply(this, arguments);
			// 		} else {
			// 			gjsObject.prototype.parent.call(this, arguments);
			// 		}
					
			// 	// } else if (
			// 	// 	typeof(implementation.Extends) == 'object' && 
			// 	// 	Object.prototype.toString.call(implementation.Extends) === '[object Array]'
			// 	// ) {
			// 	// 	for (var i = 0; i < implementation.Extends.length; i++) {
			// 	// 		//if (typeof(implementation.Extends[i]) == 'function') {
			// 	// 			//implementation.Extends[i].apply(this, arguments);
			// 	// 		//}
			// 	// 	}
			// 	}

			// };

		})();

		if (typeof window != 'undefined' && window) {
			(function (gjsObject) {
				GollumJS.Utils.addDOMEvent (window, "load", function () {
					if (gjsObject.domReady !== undefined && typeof (gjsObject.domReady) == 'function') {
						gjsObject.domReady.call (gjsObject);
					}
				});
			}) (gjsObject);
		}

		gjsObject.prototype.self = gjsObject; // Racourcis

		return gjsObject;
	};

})();

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


