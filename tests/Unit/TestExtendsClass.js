GT.create({

	name: "TestExtendsClass",

	/**
	 * Test si un heritage direct créer une class identique
	 */
	testDirectExtend (a) {
		var parent = new ClassParentA();
		var child  = new ClassChildA1();

		// Parent is good
		a.assertCompare (
			ClassParentA,
			{
				staticProp1: 1,
				staticProp2: "42a",
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				staticFunc1: function() {},
				staticFunc2: function() {},
				prototype: ClassParentA.prototype
			}
		);
		a.assertCompare (
			parent,
			{
				prop1: 4,
				prop2: "a",
				prop3: [1 , 12 ,"3"],

				self: ClassParentA,           // Non pertinent pour le test
				__proto__: parent.__proto__,  // Non pertinent pour le test

				initialize: function(){},
				func1: function(){},
				func2: function(){}
			}
		);
		a.assertTrue (parent.func1() == 'func1');
		a.assertTrue (parent.func2() == 'func2');

		// Child is good
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
			child,
			{
				prop1: 4,
				prop2: 42,
				prop3: [1 , 12 ,"3"],

				self: ClassParentA,           // Non pertinent pour le test
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
	 * Test le scope
	 */
	testScope (a) {

	}
});