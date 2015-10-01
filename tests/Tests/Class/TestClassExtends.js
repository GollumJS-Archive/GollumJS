GT.create({

	name: "TestClassExtends",

	/**
	 * Test si un heritage direct créer une class identique
	 */
	testDirectExtend: function (a) {
		var parent = new ClassParentA();
		var child  = new ClassChildA1();

		a.assertTrue (child instanceof ClassChildA1);
		a.assertTrue (child instanceof ClassParentA);
		a.assertTrue (ClassChildA1.isInstance (child));
		a.assertTrue (ClassParentA.isInstance (child));
		
		// Child is good
		a.assertCompare (
			ClassChildA1,
			{
				staticProp1: 1,
				staticProp2: "42a",
				staticPropNull1 : null,
				staticPropNull2 : "null",
				staticPropArray1 : [ "a", 1],
				__gollumjs__: GollumJS.__running__,
				staticFunc1: function() {},
				staticFunc2: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassChildA1.prototype
			}
		);
		a.assertArraysEquals (ClassChildA1.getExtendsClass(), [ClassParentA]);
		
		a.assertTrue (ClassParentA.staticFunc1() == 'staticFunc1');
		a.assertTrue (ClassParentA.staticFunc2() == 'staticFunc2');

		a.assertCompare (parent, child);
		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func2() == 'func2');

		a.assertTrue (ClassChildA1.prototype.func1 === ClassParentA.prototype.func1);
		a.assertTrue (ClassChildA1.prototype.func2 === ClassParentA.prototype.func2);

		a.assertTrue (ClassChildA1.prototype.prop1 === ClassParentA.prototype.prop1);
		a.assertTrue (ClassChildA1.prototype.prop2 === ClassParentA.prototype.prop2);
		a.assertArraysEquals (ClassChildA1.prototype.prop3, ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === ClassParentA.prototype.func1);
		a.assertTrue (child.func2 === ClassParentA.prototype.func2);

		a.assertTrue (child.prop1 === ClassParentA.prototype.prop1);
		a.assertTrue (child.prop2 === ClassParentA.prototype.prop2);
		a.assertArraysEquals (child.prop3, ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === ClassParentA.prototype.func1);
		a.assertTrue (child.func2 === ClassParentA.prototype.func2);

		ClassChildA1.staticPropArray1.push ("cool");
		a.assertArraysEquals (ClassParentA.staticPropArray1, [ "a", 1]);
		a.assertArraysEquals (ClassChildA1.staticPropArray1, [ "a", 1, "cool"]);

	},

	/**
	 * Test la surcharge
	 */
	testDirectExtendMethodAndProperty: function (a) {
		var parent = new ClassParentA();
		var child  = new ClassChildA2();

		a.assertTrue (child instanceof ClassChildA2);
		a.assertTrue (child instanceof ClassParentA);
		a.assertTrue (ClassChildA2.isInstance (child));
		a.assertTrue (ClassParentA.isInstance (child));
		
		a.assertCompare (
			ClassChildA2,
			{
				staticProp1: 1,
				staticProp2: -42,
				staticPropNull1 : "null",
				staticPropNull2 : null,
				staticPropArray1 : [ "b", 2],
				__gollumjs__: GollumJS.__running__,
				staticFunc1: function() {},
				staticFunc2: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassChildA2.prototype
			}
		);
		a.assertArraysEquals (ClassChildA2.getExtendsClass(), [ClassParentA]);
		
		a.assertTrue (ClassChildA2.staticFunc1() == 'staticFunc1');
		a.assertTrue (ClassChildA2.staticFunc2() == 'staticFunc2|extends');
		a.assertTrue (ClassChildA2.staticFunc1 === ClassParentA.staticFunc1);
		
		a.assertCompare (
			child,
			{
				prop1: 4,
				prop2: 42,
				prop3: [1 , 12 ,"3"],
				propNull1 : null,
				propNull2 : "null",

				self: ClassChildA2,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
				func2: function(){}
			}
		);

		a.assertTrue (child.func2() != 'func2');
		a.assertTrue (child.func2() == 'func2|extend');


		a.assertTrue (ClassChildA2.prototype.func1 === ClassParentA.prototype.func1);
		a.assertTrue (ClassChildA2.prototype.func2 !== ClassParentA.prototype.func2);
		
		a.assertTrue (ClassChildA2.prototype.prop1 === ClassParentA.prototype.prop1);
		a.assertTrue (ClassChildA2.prototype.prop2 !== ClassParentA.prototype.prop2);
		a.assertArraysEquals (ClassChildA2.prototype.prop3, ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === ClassParentA.prototype.func1);
		a.assertTrue (child.func2 !== ClassParentA.prototype.func2);

		a.assertTrue (child.prop1 === ClassParentA.prototype.prop1);
		a.assertTrue (child.prop2 !== ClassParentA.prototype.prop2);
		a.assertTrue (child.prop2 === ClassChildA2.prototype.prop2);
		a.assertArraysEquals (child.prop3, ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === ClassParentA.prototype.func1);
		a.assertTrue (child.func2 !== ClassParentA.prototype.func2);
		a.assertTrue (child.func2 === ClassChildA2.prototype.func2);
	},

	/**
	 * Test le triple heritage
	 */
	testTripleExtends: function (a) {

		var parent = new ClassParentTriple();
		var child1 = new ClassChildTriple1();
		var child2 = new ClassChildTriple2();
		
		a.assertTrue (child2 instanceof ClassParentTriple);
		a.assertTrue (child2 instanceof ClassChildTriple1);
		a.assertTrue (child2 instanceof ClassChildTriple2);
		a.assertTrue (ClassParentTriple.isInstance (child1));
		a.assertTrue (ClassChildTriple1.isInstance (child1));
		a.assertTrue (!ClassChildTriple2.isInstance (child1));
		a.assertTrue (ClassParentTriple.isInstance (child2));
		a.assertTrue (ClassChildTriple1.isInstance (child2));
		a.assertTrue (ClassChildTriple2.isInstance (child2));

		a.assertCompare (
			ClassChildTriple2,
			{
				staticPropLevel1: "aa",
				staticPropLevel2: 22,
				staticPropLevel3: -33,
				__gollumjs__: GollumJS.__running__,
				staticFuncLevel1: function() {},
				staticFuncLevel2: function() {},
				staticFuncLevel3: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassChildTriple2.prototype
			}
		);
		a.assertArraysEquals (ClassChildTriple2.getExtendsClass(), [ClassChildTriple1, ClassParentTriple]);

		a.assertTrue (ClassChildTriple2.staticFuncLevel1() == 'staticFuncLevel1:aa');
		a.assertTrue (ClassChildTriple2.staticFuncLevel2() == 'staticFuncLevel2:22');
		a.assertTrue (ClassChildTriple2.staticFuncLevel3() == 'staticFuncLevel3:-33');
		a.assertTrue (ClassChildTriple2.staticFuncLevel1 === ClassParentTriple.staticFuncLevel1);
		a.assertTrue (ClassChildTriple2.staticFuncLevel2 === ClassChildTriple1.staticFuncLevel2);

		a.assertCompare (
			child2,
			{
				propLevel1: "a",
				propLevel2: 2,
				propLevel3: -3,
				value: "initialize:3",

				self: ClassChildTriple2,
				
				initialize: function(){},
				parent: function(){},
				funcLevel1: function(){},
				funcLevel2: function(){},
				funcLevel3: function(){}
			}
		);

		a.assertTrue (child2.funcLevel1() == 'funcLevel1:a');
		a.assertTrue (child2.funcLevel2() == 'funcLevel2:2');
		a.assertTrue (child2.funcLevel3() == 'funcLevel3:-3');
		a.assertTrue (child2.funcLevel1 === ClassParentTriple.prototype.funcLevel1);
		a.assertTrue (child2.funcLevel2 === ClassChildTriple1.prototype.funcLevel2);
	},

	testGetExtendsClass: function (a) {
		
		var child = new ClassChildTriple6();

		a.assertTrue (child instanceof ClassParentTriple);
		a.assertTrue (child instanceof ClassChildTriple1);
		a.assertTrue (child instanceof ClassChildTriple2);
		a.assertTrue (child instanceof ClassChildTriple3);
		a.assertTrue (child instanceof ClassChildTriple4);
		a.assertTrue (child instanceof ClassChildTriple5);
		a.assertTrue (child instanceof ClassChildTriple6);
		a.assertTrue (ClassParentTriple.isInstance (child));
		a.assertTrue (ClassChildTriple1.isInstance (child));
		a.assertTrue (ClassChildTriple2.isInstance (child));
		a.assertTrue (ClassChildTriple3.isInstance (child));
		a.assertTrue (ClassChildTriple4.isInstance (child));
		a.assertTrue (ClassChildTriple5.isInstance (child));
		a.assertTrue (ClassChildTriple6.isInstance (child));

		a.assertArraysEquals (ClassChildTriple6.getExtendsClass(), [
			ClassChildTriple5,
			ClassChildTriple4,
			ClassChildTriple3,
			ClassChildTriple2,
			ClassChildTriple1,
			ClassParentTriple
		]);

		a.assertCompare (
			child,
			{
				propLevel1: "a",
				propLevel2: 2,
				propLevel3: -3,
				value: "initialize:3",

				self: ClassChildTriple6,
				
				initialize: function(){},
				parent: function(){},
				funcLevel1: function(){},
				funcLevel2: function(){},
				funcLevel3: function(){}
			}
		);
	},

	testNoGollumJSClass: function (a) {

		var parent = new ClassParentNoGollumJS();
		var child = new ClassChildNoGollumJS();
		
		a.assertTrue (child instanceof ClassParentNoGollumJS);
		a.assertTrue (child instanceof ClassChildNoGollumJS);
		a.assertTrue (ClassChildNoGollumJS.isInstance (child));

		a.assertTrue (parent instanceof ClassParentNoGollumJS);
		a.assertTrue (!(parent instanceof ClassChildNoGollumJS));
		a.assertTrue (!ClassChildNoGollumJS.isInstance (parent));

		a.assertCompare (
			ClassParentNoGollumJS,
			{
				staticPropNoCopy1: "staticPropNoCopy1",
				Static: {
					staticPropNoCopy2: "staticPropNoCopy2"
				},
				prototype: ClassParentNoGollumJS.prototype
			}
		);

		a.assertCompare (
			ClassChildNoGollumJS,
			{
				__gollumjs__: GollumJS.__running__,
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassChildNoGollumJS.prototype
			}
		);
		
		a.assertCompare (
			child,
			{
				prop1: "prop1",
				prop2: null,
				value: "func1",

				self: ClassChildNoGollumJS,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
			}
		);

		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func1 === ClassChildNoGollumJS.prototype.func1);
		a.assertTrue (ClassParentNoGollumJS.prototype.func1 === ClassChildNoGollumJS.prototype.func1);

	}
});