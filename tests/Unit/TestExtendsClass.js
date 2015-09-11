GT.create({

	name: "TestExtendsClass",

	/**
	 * Test si un heritage direct créer une class identique
	 */
	testDirectExtend (a) {
		var parent = new ClassParentA();
		var child  = new ClassChildA1();
		
		// Child is good
		a.assertCompare (
			ClassChildA1,
			{
				staticProp1: 1,
				staticProp2: "42a",
				staticPropNull1 : null,
				staticPropNull2 : "null",
				staticFunc1: function() {},
				staticFunc2: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				prototype: ClassChildA1.prototype
			}
		);
		
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
	},

	/**
	 * Test la surcharge
	 */
	testDirectExtendMethodAndProperty (a) {
		var parent = new ClassParentA();
		var child  = new ClassChildA2();
		
		a.assertCompare (
			ClassChildA2,
			{
				staticProp1: 1,
				staticProp2: -42,
				staticPropNull1 : "null",
				staticPropNull2 : null,
				staticFunc1: function() {},
				staticFunc2: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				prototype: ClassChildA2.prototype
			}
		);
		
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

				self: ClassChildA2,           // Non pertinent pour le test
				__proto__: parent.__proto__,  // Non pertinent pour le test

				initialize: function(){},
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
	testTripleExtends (a) {

		var parent = new ClassParentTriple();
		var child1 = new ClassChildTriple1();
		var child2 = new ClassChildTriple2();

		a.assertCompare (
			ClassChildTriple2,
			{
				staticPropLevel1: "aa",
				staticPropLevel2: 22,
				staticPropLevel3: -33,
				staticFuncLevel1: function() {},
				staticFuncLevel2: function() {},
				staticFuncLevel3: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				prototype: ClassChildTriple2.prototype
			}
		);

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

				self: ClassChildTriple2,           // Non pertinent pour le test
				__proto__: parent.__proto__,  // Non pertinent pour le test

				initialize: function(){},
				funcLevel1: function(){},
				funcLevel2: function(){},
				funcLevel3: function(){}
			}
		);
	}
});