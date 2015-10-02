GT.create({

	name: "TestClassConstructor",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleConstructor: function (a) {
		
		var simpleObject = new DataTest.ClassSimple();
		
		a.assertCompare (
			DataTest.ClassSimple,
			{
				__gollumjs__: GollumJS.__running__,
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: DataTest.ClassSimple.prototype
			}
		);

		a.assertArraysEquals (DataTest.ClassSimple.getExtendsClass(), []);
		a.assertTrue (typeof DataTest.ClassParentA.getIdClass() == 'number');
		a.assertTrue (DataTest.ClassParentA.getIdClass() > 0);

		a.assertCompare (
			simpleObject,
			{
				self: DataTest.ClassSimple,

				initialize: function(){},
				parent: function(){}
			}
		);
	},

	testIsIntance: function (a) {

		var cNull = new DataTest.ClassParentNoGollumJS();
		var simpleObject = new DataTest.ClassSimple();

		a.assertTrue (simpleObject instanceof Object);
		a.assertTrue (simpleObject instanceof DataTest.ClassSimple);
		a.assertTrue (DataTest.ClassSimple.isInstance (simpleObject));
		a.assertTrue (!DataTest.ClassSimple.isInstance (cNull));
	},

	testGollumJSObjectIdentifier: function (a) {
		var simpleObject     = new DataTest.ClassSimple();
		var noGollumJsObject = new DataTest.NoGollumJsClass();

		a.assertTrue (GollumJS.Utils.isGollumJsClass (DataTest.ClassSimple));
		a.assertTrue (GollumJS.Utils.isGollumJsObject (simpleObject));
		a.assertTrue (!GollumJS.Utils.isGollumJsClass (DataTest.NoGollumJsClass));
		a.assertTrue (!GollumJS.Utils.isGollumJsObject (DataTest.noGollumJsObject));

	},

	/**
	 * Test si un constructeur sans initialize en récupère un
	 */
	testWithoutInitializeConstructor: function (a) {
		var simpleObject = new DataTest.ClassSimple();
		a.assertTrue (typeof simpleObject.initialize == 'function');
	},

	/**
	 * Test les propriétés et méthodes
	 */
	testPropertiesAndMethods: function (a) {

		var parent = new DataTest.ClassParentA();

		// Parent is good
		a.assertCompare (
			DataTest.ClassParentA,
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
				prototype: DataTest.ClassParentA.prototype
			}
		);
		
		a.assertTrue (DataTest.ClassParentA.staticFunc1() == 'staticFunc1');
		a.assertTrue (DataTest.ClassParentA.staticFunc2() == 'staticFunc2');

		a.assertCompare (
			parent,
			{
				prop1: 4,
				prop2: "a",
				prop3: [1 , 12 ,"3"],
				propNull1 : "null",
				propNull2 : null,

				self: DataTest.ClassParentA,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
				func2: function(){}
			}
		);
		a.assertTrue (parent.func1() == 'func1');
		a.assertTrue (parent.func2() == 'func2');
		a.assertTrue (parent.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (parent.func2 === DataTest.ClassParentA.prototype.func2);
		a.assertTrue (parent.initialize === DataTest.ClassParentA.prototype.initialize);
	},

	/**
	 * Test les propriétés et méthodes
	 */
	testPropertyNull: function (a) {

		var cNull = new DataTest.ClassNull();
		
		a.assertCompare (
			DataTest.ClassNull,
			{
				__gollumjs__: GollumJS.__running__,
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: DataTest.ClassNull.prototype
			}
		);

		a.assertCompare (
			cNull,
			{
				prop1: null,
				prop2: 0,
				self: DataTest.ClassNull,
				
				initialize: function(){},
				parent: function(){}
			}
		);
	}

});