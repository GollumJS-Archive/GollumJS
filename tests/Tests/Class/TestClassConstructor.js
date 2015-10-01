GT.create({

	name: "TestClassConstructor",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleConstructor: function (a) {
		
		var simpleObject = new ClassSimple();
		
		a.assertCompare (
			ClassSimple,
			{
				__gollumjs__: GollumJS.__running__,
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
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

				initialize: function(){},
				parent: function(){}
			}
		);
	},

	testIsIntance: function (a) {

		var cNull = new ClassParentNoGollumJS();
		var simpleObject = new ClassSimple();

		a.assertTrue (simpleObject instanceof Object);
		a.assertTrue (simpleObject instanceof ClassSimple);
		a.assertTrue (ClassSimple.isInstance (simpleObject));
		a.assertTrue (!ClassSimple.isInstance (cNull));
	},

	testGollumJSObjectIdentifier: function (a) {
		var simpleObject     = new ClassSimple();
		var noGollumJsObject = new NoGollumJsClass();

		a.assertTrue (GollumJS.Utils.isGollumJsClass (ClassSimple));
		a.assertTrue (GollumJS.Utils.isGollumJsObject (simpleObject));
		a.assertTrue (!GollumJS.Utils.isGollumJsClass (NoGollumJsClass));
		a.assertTrue (!GollumJS.Utils.isGollumJsObject (noGollumJsObject));

	},

	/**
	 * Test si un constructeur sans initialize en récupère un
	 */
	testWithoutInitializeConstructor: function (a) {
		var simpleObject = new ClassSimple();
		a.assertTrue (typeof simpleObject.initialize == 'function');
	},

	/**
	 * Test les propriétés et méthodes
	 */
	testPropertiesAndMethods: function (a) {

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
				__gollumjs__: GollumJS.__running__,
				staticFunc1: function() {},
				staticFunc2: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
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
				propNull1 : "null",
				propNull2 : null,

				self: ClassParentA,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
				func2: function(){}
			}
		);
		a.assertTrue (parent.func1() == 'func1');
		a.assertTrue (parent.func2() == 'func2');
		a.assertTrue (parent.func1 === ClassParentA.prototype.func1);
		a.assertTrue (parent.func2 === ClassParentA.prototype.func2);
		a.assertTrue (parent.initialize === ClassParentA.prototype.initialize);
	},

	/**
	 * Test les propriétés et méthodes
	 */
	testPropertyNull: function (a) {

		var cNull = new ClassNull();
		
		a.assertCompare (
			ClassNull,
			{
				__gollumjs__: GollumJS.__running__,
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassNull.prototype
			}
		);

		a.assertCompare (
			cNull,
			{
				prop1: null,
				prop2: 0,
				self: ClassNull,
				
				initialize: function(){},
				parent: function(){}
			}
		);
	}

});