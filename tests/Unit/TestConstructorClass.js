GT.create({

	name: "TestContructorClass",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleConstructor (a) {
		
		var simpleObject = new ClassSimple();

		a.assertCompare (
			simpleObject,
			{
				self: ClassSimple,                 // Non pertinent pour le test
				__proto__: simpleObject.__proto__,  // Non pertinent pour le test

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