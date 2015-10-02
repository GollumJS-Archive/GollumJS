GT.create({

	name: "TestClassExtends",

	/**
	 * Test si un heritage direct créer une class identique
	 */
	testDirectExtend: function (a) {
		var parent = new DataTest.ClassParentA();
		var child  = new DataTest.ClassChildA1();

		a.assertTrue (child instanceof DataTest.ClassChildA1);
		a.assertTrue (child instanceof DataTest.ClassParentA);
		a.assertTrue (DataTest.ClassChildA1.isInstance (child));
		a.assertTrue (DataTest.ClassParentA.isInstance (child));
		
		// Child is good
		a.assertCompare (
			DataTest.ClassChildA1,
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
				prototype: DataTest.ClassChildA1.prototype
			}
		);
		a.assertArraysEquals (DataTest.ClassChildA1.getExtendsClass(), [DataTest.ClassParentA]);
		
		a.assertTrue (DataTest.ClassParentA.staticFunc1() == 'staticFunc1');
		a.assertTrue (DataTest.ClassParentA.staticFunc2() == 'staticFunc2');

		a.assertCompare (parent, child);
		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func2() == 'func2');

		a.assertTrue (DataTest.ClassChildA1.prototype.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (DataTest.ClassChildA1.prototype.func2 === DataTest.ClassParentA.prototype.func2);

		a.assertTrue (DataTest.ClassChildA1.prototype.prop1 === DataTest.ClassParentA.prototype.prop1);
		a.assertTrue (DataTest.ClassChildA1.prototype.prop2 === DataTest.ClassParentA.prototype.prop2);
		a.assertArraysEquals (DataTest.ClassChildA1.prototype.prop3, DataTest.ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (child.func2 === DataTest.ClassParentA.prototype.func2);

		a.assertTrue (child.prop1 === DataTest.ClassParentA.prototype.prop1);
		a.assertTrue (child.prop2 === DataTest.ClassParentA.prototype.prop2);
		a.assertArraysEquals (child.prop3, DataTest.ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (child.func2 === DataTest.ClassParentA.prototype.func2);

		DataTest.ClassChildA1.staticPropArray1.push ("cool");
		a.assertArraysEquals (DataTest.ClassParentA.staticPropArray1, [ "a", 1]);
		a.assertArraysEquals (DataTest.ClassChildA1.staticPropArray1, [ "a", 1, "cool"]);

	},

	/**
	 * Test la surcharge
	 */
	testDirectExtendMethodAndProperty: function (a) {
		var parent = new DataTest.ClassParentA();
		var child  = new DataTest.ClassChildA2();

		a.assertTrue (child instanceof DataTest.ClassChildA2);
		a.assertTrue (child instanceof DataTest.ClassParentA);
		a.assertTrue (DataTest.ClassChildA2.isInstance (child));
		a.assertTrue (DataTest.ClassParentA.isInstance (child));
		
		a.assertCompare (
			DataTest.ClassChildA2,
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
				prototype: DataTest.ClassChildA2.prototype
			}
		);
		a.assertArraysEquals (DataTest.ClassChildA2.getExtendsClass(), [DataTest.ClassParentA]);
		
		a.assertTrue (DataTest.ClassChildA2.staticFunc1() == 'staticFunc1');
		a.assertTrue (DataTest.ClassChildA2.staticFunc2() == 'staticFunc2|extends');
		a.assertTrue (DataTest.ClassChildA2.staticFunc1 === DataTest.ClassParentA.staticFunc1);
		
		a.assertCompare (
			child,
			{
				prop1: 4,
				prop2: 42,
				prop3: [1 , 12 ,"3"],
				propNull1 : null,
				propNull2 : "null",

				self: DataTest.ClassChildA2,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
				func2: function(){}
			}
		);

		a.assertTrue (child.func2() != 'func2');
		a.assertTrue (child.func2() == 'func2|extend');


		a.assertTrue (DataTest.ClassChildA2.prototype.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (DataTest.ClassChildA2.prototype.func2 !== DataTest.ClassParentA.prototype.func2);
		
		a.assertTrue (DataTest.ClassChildA2.prototype.prop1 === DataTest.ClassParentA.prototype.prop1);
		a.assertTrue (DataTest.ClassChildA2.prototype.prop2 !== DataTest.ClassParentA.prototype.prop2);
		a.assertArraysEquals (DataTest.ClassChildA2.prototype.prop3, DataTest.ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (child.func2 !== DataTest.ClassParentA.prototype.func2);

		a.assertTrue (child.prop1 === DataTest.ClassParentA.prototype.prop1);
		a.assertTrue (child.prop2 !== DataTest.ClassParentA.prototype.prop2);
		a.assertTrue (child.prop2 === DataTest.ClassChildA2.prototype.prop2);
		a.assertArraysEquals (child.prop3, DataTest.ClassParentA.prototype.prop3);

		a.assertTrue (child.func1 === DataTest.ClassParentA.prototype.func1);
		a.assertTrue (child.func2 !== DataTest.ClassParentA.prototype.func2);
		a.assertTrue (child.func2 === DataTest.ClassChildA2.prototype.func2);
	},

	/**
	 * Test le triple heritage
	 */
	testTripleExtends: function (a) {

		var parent = new DataTest.ClassParentTriple();
		var child1 = new DataTest.ClassChildTriple1();
		var child2 = new DataTest.ClassChildTriple2();
		
		a.assertTrue (child2 instanceof DataTest.ClassParentTriple);
		a.assertTrue (child2 instanceof DataTest.ClassChildTriple1);
		a.assertTrue (child2 instanceof DataTest.ClassChildTriple2);
		a.assertTrue (DataTest.ClassParentTriple.isInstance (child1));
		a.assertTrue (DataTest.ClassChildTriple1.isInstance (child1));
		a.assertTrue (!DataTest.ClassChildTriple2.isInstance (child1));
		a.assertTrue (DataTest.ClassParentTriple.isInstance (child2));
		a.assertTrue (DataTest.ClassChildTriple1.isInstance (child2));
		a.assertTrue (DataTest.ClassChildTriple2.isInstance (child2));

		a.assertCompare (
			DataTest.ClassChildTriple2,
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
				prototype: DataTest.ClassChildTriple2.prototype
			}
		);
		a.assertArraysEquals (DataTest.ClassChildTriple2.getExtendsClass(), [DataTest.ClassChildTriple1, DataTest.ClassParentTriple]);

		a.assertTrue (DataTest.ClassChildTriple2.staticFuncLevel1() == 'staticFuncLevel1:aa');
		a.assertTrue (DataTest.ClassChildTriple2.staticFuncLevel2() == 'staticFuncLevel2:22');
		a.assertTrue (DataTest.ClassChildTriple2.staticFuncLevel3() == 'staticFuncLevel3:-33');
		a.assertTrue (DataTest.ClassChildTriple2.staticFuncLevel1 === DataTest.ClassParentTriple.staticFuncLevel1);
		a.assertTrue (DataTest.ClassChildTriple2.staticFuncLevel2 === DataTest.ClassChildTriple1.staticFuncLevel2);

		a.assertCompare (
			child2,
			{
				propLevel1: "a",
				propLevel2: 2,
				propLevel3: -3,
				value: "initialize:3",

				self: DataTest.ClassChildTriple2,
				
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
		a.assertTrue (child2.funcLevel1 === DataTest.ClassParentTriple.prototype.funcLevel1);
		a.assertTrue (child2.funcLevel2 === DataTest.ClassChildTriple1.prototype.funcLevel2);
	},

	testGetExtendsClass: function (a) {
		
		var child = new DataTest.ClassChildTriple6();

		a.assertTrue (child instanceof DataTest.ClassParentTriple);
		a.assertTrue (child instanceof DataTest.ClassChildTriple1);
		a.assertTrue (child instanceof DataTest.ClassChildTriple2);
		a.assertTrue (child instanceof DataTest.ClassChildTriple3);
		a.assertTrue (child instanceof DataTest.ClassChildTriple4);
		a.assertTrue (child instanceof DataTest.ClassChildTriple5);
		a.assertTrue (child instanceof DataTest.ClassChildTriple6);
		a.assertTrue (DataTest.ClassParentTriple.isInstance (child));
		a.assertTrue (DataTest.ClassChildTriple1.isInstance (child));
		a.assertTrue (DataTest.ClassChildTriple2.isInstance (child));
		a.assertTrue (DataTest.ClassChildTriple3.isInstance (child));
		a.assertTrue (DataTest.ClassChildTriple4.isInstance (child));
		a.assertTrue (DataTest.ClassChildTriple5.isInstance (child));
		a.assertTrue (DataTest.ClassChildTriple6.isInstance (child));

		a.assertArraysEquals (DataTest.ClassChildTriple6.getExtendsClass(), [
			DataTest.ClassChildTriple5,
			DataTest.ClassChildTriple4,
			DataTest.ClassChildTriple3,
			DataTest.ClassChildTriple2,
			DataTest.ClassChildTriple1,
			DataTest.ClassParentTriple
		]);

		a.assertCompare (
			child,
			{
				propLevel1: "a",
				propLevel2: 2,
				propLevel3: -3,
				value: "initialize:3",

				self: DataTest.ClassChildTriple6,
				
				initialize: function(){},
				parent: function(){},
				funcLevel1: function(){},
				funcLevel2: function(){},
				funcLevel3: function(){}
			}
		);
	},

	testNoGollumJSClass: function (a) {

		var parent = new DataTest.ClassParentNoGollumJS();
		var child = new DataTest.ClassChildNoGollumJS();
		
		a.assertTrue (child instanceof DataTest.ClassParentNoGollumJS);
		a.assertTrue (child instanceof DataTest.ClassChildNoGollumJS);
		a.assertTrue (DataTest.ClassChildNoGollumJS.isInstance (child));

		a.assertTrue (parent instanceof DataTest.ClassParentNoGollumJS);
		a.assertTrue (!(parent instanceof DataTest.ClassChildNoGollumJS));
		a.assertTrue (!DataTest.ClassChildNoGollumJS.isInstance (parent));

		a.assertCompare (
			DataTest.ClassParentNoGollumJS,
			{
				staticPropNoCopy1: "staticPropNoCopy1",
				Static: {
					staticPropNoCopy2: "staticPropNoCopy2"
				},
				prototype: DataTest.ClassParentNoGollumJS.prototype
			}
		);

		a.assertCompare (
			DataTest.ClassChildNoGollumJS,
			{
				__gollumjs__: GollumJS.__running__,
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: DataTest.ClassChildNoGollumJS.prototype
			}
		);
		
		a.assertCompare (
			child,
			{
				prop1: "prop1",
				prop2: null,
				value: "func1",

				self: DataTest.ClassChildNoGollumJS,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
			}
		);

		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func1 === DataTest.ClassChildNoGollumJS.prototype.func1);
		a.assertTrue (DataTest.ClassParentNoGollumJS.prototype.func1 === DataTest.ClassChildNoGollumJS.prototype.func1);

	}
});