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

			var __entends__ = [];
			var __reflectionClass__ = null;
			var __idClass__ = ++__countClass__;
			var __parent__ = null;

			//////////////////////////////
			// Generate Extends Methods //
			//////////////////////////////

			if (implementation.Extends) {
				if (
					typeof(implementation.Extends) == 'object' && 
					Object.prototype.toString.call(implementation.Extends) === '[object Array]'
				) {
					for (var i = implementation.Extends.length-1; i >= 0 ; i--) {
						// Ajoute a la liste des extends
						__entends__.push (implementation.Extends[i]);
						if (GollumJS.Utils.isGollumJsClass (implementation.Extends[i])) {
							__entends__ = __entends__.concat(implementation.Extends[i].getExtendsClass());
						}
					}
				} else {
					// Ajoute a la liste des extends
					__entends__.push (implementation.Extends);
					if (GollumJS.Utils.isGollumJsClass (implementation.Extends)) {
						__entends__ = __entends__.concat(implementation.Extends.getExtendsClass());
					}
				}
			}
			__entends__ = __entends__.reverse();
			for (var i = 0; i < __entends__.length; i++) {
				// Recopie des Statics
				for (var j in __entends__[i]) {
					if (j != 'prototype') {
						(
							function (name, called) {
								gjsObject[name] = GollumJS.Utils.clone(called);
							} (j, __entends__[i][j])
						);
					}
				}
				
				// Recopie des methode depuis les extends					
				for (var j in __entends__[i].prototype) {
					(function (name, called) {
						if (typeof (called) == 'function') {
							gjsObject.prototype[name] = called;
						} else {
							gjsObject.prototype[name] = GollumJS.Utils.clone (called);
						}
					})(j,  __entends__[i].prototype[j]);
				}
			}
			__entends__ = __entends__.reverse();

			/////////////////////////////
			// Generate Object Methods //
			/////////////////////////////

			gjsObject.getExtendsClass = function () {
				return __entends__;
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


			////////////////////////////
			// Generate parent method //
			////////////////////////////

			gjsObject.prototype.parent = function (scope) {

				var __this__ = this;

				if (__parent__ === null) {

					__parent__ = function () {
						
						var target = __parent__.__scope__ !== undefined ? __parent__.__scope__ : __entends__[0];
						
						console.log (target);
						console.log (__entends__);
						console.log (__entends__.indexOf(target));

						if (__entends__.indexOf(target) == -1) {
							throw new Error("Class scopped not is parent on object when call method initialize");
						}
						if (GollumJS.Utils.isGollumJsClass (target)) {
							if (target) {
								return target.prototype.initialize.apply(__this__, arguments);
							}
						}
					};
					for (var i = 0; i < __entends__.length; i++) {
						for (var j in __entends__[i].prototype) {
							if (
								typeof __entends__[i].prototype[j] == 'function' &&
								 typeof __parent__[j] == 'undefined'
							) {
								(function (i, j) {
									__parent__[j] = function () {
										var target = __parent__.__scope__ !== undefined ? __parent__.__scope__ : __entends__[i];
										if (__entends__.indexOf(target) == -1) {
											throw new Error("Class scopped not is parent on object when call method "+j);
										}

										if (GollumJS.Utils.isGollumJsClass (target)) {
											if (target) {
												return target.prototype[j].apply(__this__, arguments);
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