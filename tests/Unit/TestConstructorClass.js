GT.create({

	name: "TestContructorClass",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleConstructor (a) {
		
		var simpleObject = new ClassSimple();
		
		a.assertCompare (
			ClassSimple,
			{
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				prototype: ClassSimple.prototype
			}
		);
		
		a.assertCompare (
			simpleObject,
			{
				self: ClassSimple,
				__proto__: simpleObject.__proto__,

				initialize: function(){}
			}
		);
	},

	/**
	 * Test si un constructeur sans initialize en récupère un
	 */
	testWithoutInitializeConstructor (a) {
		var simpleObject = new ClassSimple();
		a.assertTrue (typeof simpleObject.initialize == 'function');
	}

});