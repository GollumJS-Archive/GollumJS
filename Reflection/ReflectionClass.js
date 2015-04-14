GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ReflectionClass = new GollumJS.Class ({
	
	constructor: null,

	createByName: function (name) {
		return this.createByIdentifiers (name.split('.'));
	},

	createByIdentifiers: function (identifers) {
		return this.createByConstructor (this.getContructorByIdentifers (identifers, window));
	},

	createByConstructor: function (constructor) {
		if (!constructor) {
			throw new GollumJS.Exception ("ReflectionClass on null element");
		}
		this.constructor = constructor;
		return this;
	},


	getContructorByIdentifers: function (identifiers, target, i) {
		i = i || 0;

		if (i >= identifiers.length) {
			return target;
		}

		if (typeof target[identifiers[i]] !== 'undefined') {
			return this.getContructorByIdentifers (identifiers, target[identifiers[i]], i+1);
		}

		return null;
	}



});
