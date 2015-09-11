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


