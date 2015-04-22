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
	}

});
