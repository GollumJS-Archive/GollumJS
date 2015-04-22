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
	staticProperties: {},
	staticMethods: {},

	Static: {

		getClassByName: function (name, target) {

			target = target || window;

			return this.getClassByIdentifers (name.split ('.'), target);
		},

		getClassByIdentifers: function (identifiers, target, i) {

			target = target || window;
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
		this.identifiers  = identifiers;
		this.constructor = this.self.getClassByIdentifers (identifiers);
	},

	getName: function () {
		return this.identifiers.join ('.');
	}



});
