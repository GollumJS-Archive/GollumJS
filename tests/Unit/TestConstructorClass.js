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

		a.assertArraysEquals (ClassSimple.getExtendsClass(), []);
		a.assertTrue (typeof ClassParentA.getIdClass() == 'number');
		a.assertTrue (ClassParentA.getIdClass() > 0);
		
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
	},

	/**
	 * Test les propriétés et méthodes
	 */
	testPropertiesAndMethodsConstructor (a) {

		var parent = new ClassParentA();

		// Parent is good
		a.assertCompare (
			ClassParentA,
			{
				staticProp1: 1,
				staticProp2: "42a",
				staticPropNull1 : null,
				staticPropNull2 : "null",
				staticPropNull2 : "null",
				staticPropArray1 : [ "a", 1],
				staticFunc1: function() {},
				staticFunc2: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				prototype: ClassParentA.prototype
			}
		);
		
		a.assertTrue (ClassParentA.staticFunc1() == 'staticFunc1');
		a.assertTrue (ClassParentA.staticFunc2() == 'staticFunc2');
		
		a.assertCompare (
			parent,
			{
				prop1: 4,
				prop2: "a",
				prop3: [1 , 12 ,"3"],
				propNull1 : "null", //TODO devrait cracher
				propNull2 : null,

				self: ClassParentA,           // Non pertinent pour le test
				
				initialize: function(){},
				func1: function(){},
				func2: function(){}
			}
		);
		a.assertTrue (parent.func1() == 'func1');
		a.assertTrue (parent.func2() == 'func2');
	}

});