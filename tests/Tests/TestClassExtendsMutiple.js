GT.create({

	name: "TestClassExtendsMutiple",

	/**
	 * Test si un heritage simple
	 */
	testExtendsMutipleSimple: function (a) {

		child = new ClassChildMultiple1();

		a.assertTrue (!(child instanceof ClassParentMultile1));
		a.assertTrue (!(child instanceof ClassParentMultile2));
		a.assertTrue (child instanceof ClassParentMultile3);
		a.assertTrue (child instanceof ClassChildMultiple1);
		a.assertTrue (ClassParentMultile1.isInstance (child));
		a.assertTrue (ClassParentMultile2.isInstance (child));
		a.assertTrue (ClassParentMultile3.isInstance (child));
		a.assertTrue (ClassChildMultiple1.isInstance (child));
		a.assertTrue (!ClassChildMultiple2.isInstance (child));
		
		a.assertCompare (
			ClassChildMultiple1,
			{
				staticProp1: 1,
				staticProp2: 2,
				staticProp3: 3,
				staticPropCommon: "staticPropCommon:3",
				__gollumjs__: GollumJS.__running__,
				staticFunc1: function() {},
				staticFunc2: function() {},
				staticFunc3: function() {},
				staticFuncCommon: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassChildMultiple1.prototype
			}
		);

		a.assertTrue (ClassChildMultiple1.staticFunc1() == 'staticFunc1');
		a.assertTrue (ClassChildMultiple1.staticFunc2() == 'staticFunc2');
		a.assertTrue (ClassChildMultiple1.staticFunc3() == 'staticFunc3');
		a.assertTrue (ClassChildMultiple1.staticFuncCommon() == 'staticFuncCommon:3');
		a.assertTrue (ClassChildMultiple1.staticFunc1 === ClassParentMultile1.staticFunc1);
		a.assertTrue (ClassChildMultiple1.staticFunc2 === ClassParentMultile2.staticFunc2);
		a.assertTrue (ClassChildMultiple1.staticFunc3 === ClassParentMultile3.staticFunc3);
		a.assertTrue (ClassChildMultiple1.staticFuncCommon === ClassParentMultile3.staticFuncCommon);

		a.assertCompare (
			child,
			{
				prop1: 1,
				prop2: 2,
				prop3: 3,
				propCommon: "propCommon:3",

				self: ClassChildMultiple1,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
				func2: function(){},
				func3: function(){},
				funcCommon: function(){}
			}
		);

		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func2() == 'func2');
		a.assertTrue (child.func3() == 'func3');
		a.assertTrue (child.funcCommon() == 'funcCommon:3');
		a.assertTrue (child.func1 === ClassParentMultile1.prototype.func1);
		a.assertTrue (child.func2 === ClassParentMultile2.prototype.func2);
		a.assertTrue (child.func3 === ClassParentMultile3.prototype.func3);
		a.assertTrue (child.funcCommon === ClassParentMultile3.prototype.funcCommon);

	},

	/**
	 * Test si un heritage multiple 2 niveau
	 */
	testExtendsMutipleComplex: function (a) {

		child = new ClassChildMultiple2();


		a.assertTrue (!(child instanceof ClassParentMultile1));
		a.assertTrue (child instanceof ClassParentMultile2);
		a.assertTrue (!(child instanceof ClassParentMultile3));
		a.assertTrue (child instanceof ClassChildMultiple2);
		a.assertTrue (!(child instanceof ClassChildMultiple1));
		a.assertTrue (ClassParentMultile1.isInstance (child));
		a.assertTrue (ClassParentMultile2.isInstance (child));
		a.assertTrue (ClassParentMultile3.isInstance (child));
		a.assertTrue (ClassChildMultiple1.isInstance (child));
		a.assertTrue (ClassChildMultiple2.isInstance (child));

		a.assertCompare (
			ClassChildMultiple2,
			{
				staticProp1: 1,
				staticProp2: 2,
				staticProp3: 3,
				staticPropCommon: "staticPropCommon:2",
				__gollumjs__: GollumJS.__running__,
				staticFunc1: function() {},
				staticFunc2: function() {},
				staticFunc3: function() {},
				staticFuncCommon: function() {},
				getExtendsClass: function() {},
				getIdClass: function() {},
				getReflectionClass: function() {},
				isInstance: function() {},
				prototype: ClassChildMultiple2.prototype
			}
		);

		a.assertTrue (ClassChildMultiple2.staticFunc1() == 'staticFunc1');
		a.assertTrue (ClassChildMultiple2.staticFunc2() == 'staticFunc2');
		a.assertTrue (ClassChildMultiple2.staticFunc3() == 'staticFunc3');
		a.assertTrue (ClassChildMultiple2.staticFuncCommon() == 'staticFuncCommon:2');
		a.assertTrue (ClassChildMultiple2.staticFunc1 === ClassParentMultile1.staticFunc1);
		a.assertTrue (ClassChildMultiple2.staticFunc2 === ClassParentMultile2.staticFunc2);
		a.assertTrue (ClassChildMultiple2.staticFunc3 === ClassParentMultile3.staticFunc3);
		a.assertTrue (ClassChildMultiple2.staticFuncCommon === ClassParentMultile2.staticFuncCommon);

		a.assertCompare (
			child,
			{
				prop1: 1,
				prop2: 2,
				prop3: 3,
				propCommon: "propCommon:2",

				self: ClassChildMultiple2,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){},
				func2: function(){},
				func3: function(){},
				funcCommon: function(){}
			}
		);

		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func2() == 'func2');
		a.assertTrue (child.func3() == 'func3');
		a.assertTrue (child.funcCommon() == 'funcCommon:2');
		a.assertTrue (child.func1 === ClassParentMultile1.prototype.func1);
		a.assertTrue (child.func2 === ClassParentMultile2.prototype.func2);
		a.assertTrue (child.func3 === ClassParentMultile3.prototype.func3);
		a.assertTrue (child.funcCommon === ClassParentMultile2.prototype.funcCommon);

	},

	testGetExtendsClass: function (a) {
		
		a.assertArraysEquals (ClassChildMultiple1.getExtendsClass(), [
			ClassParentMultile3,
			ClassParentMultile2,
			ClassParentMultile1
		]);

		a.assertArraysEquals (ClassChildMultiple2.getExtendsClass(), [
			// Direct extends
			ClassParentMultile2,
			ClassChildMultiple1,
				// Level 2 extends
				ClassParentMultile3,
				ClassParentMultile2,
				ClassParentMultile1,
			ClassParentMultile3,

		]);
	}
});