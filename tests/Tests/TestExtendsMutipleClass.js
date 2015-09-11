GT.create({

	name: "TestExtendsMutipleClass",

	/**
	 * Test si un heritage simple
	 */
	testExtendsMutipleSimple (a) {

		child = new ClassChildMultiple1();

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

	testGetExtendsClass: function (a) {
		
		console.log (ClassChildMultiple1.getExtendsClass());

		a.assertArraysEquals (ClassChildMultiple1.getExtendsClass(), [
			ClassParentMultile3,
			ClassParentMultile2,
			ClassParentMultile1
		]);
	}
});