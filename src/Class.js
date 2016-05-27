/**
 * Objet permettant d'implémenter un system objet avec héritage simple
 * 
 *  initialize : Implémente une methode constructeur avec la methode initialize()
 * 	Extends    : Implémente l'héritage simple par l'attribut Extends
 *               Appel au methode parente par ce même attribut grâce à this.parent()
 *  Static   : insertion de variable Static dans l'objet 
 *             Si dans Static contextReady existe elle sera appelé automatiquement à la fin du cahrgement de la page
 *  this.parent() : Dans une methode this.parent() permet d'accéder à la Class mère de l'objet
 *  this.self : self exist toujours dans l'objet et permet d'accéder au constructeur de l'objet
 *  @namespace	
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */

GollumJS.NS(GollumJS, function() {

	var __countClass__ = 0;
	var __domLoaded__ = false;

	/**
	 * Objet Class permettant de créer une otion objet avancé
	 * @param {} implementation
	 */
	this.Class = function (implementation) {

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
			for (var i in this) {
				this[i] = GollumJS.Utils.clone(this[i]);
			} 
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
				try {
					(function (name, called) {
						if (typeof (called) == 'function') {
							gjsObject.prototype[name] = called;
						} else {
							gjsObject.prototype[name] = GollumJS.Utils.clone (called);
						}
					})(j,  __extends__[i].prototype[j]);
				} catch (e) {
				}
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
						try {
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
						} catch (e) {
						}
					}
				}


			}
			__parent__.__scope__ = scope;
			return __parent__;
		};
		
		///////////////
		// DOM Ready //
		///////////////
		
		if (GollumJS.Utils.isDOMContext()) {
			GollumJS.Utils.addDOMEvent(window, 'load', function () {
				__domLoaded__ = true;
				if (typeof gjsObject.contextReady == 'function') {
					gjsObject.contextReady();
				}
			});
			if (__domLoaded__ && typeof gjsObject.contextReady == 'function') {
				gjsObject.contextReady();
			}
		}

		///////////////////////////////
		// Generate Class Properties //
		///////////////////////////////

		gjsObject.__gollumjs__ = GollumJS.__running__;	

		gjsObject.prototype.self = gjsObject; // Racourcis

		return gjsObject;
	};

});