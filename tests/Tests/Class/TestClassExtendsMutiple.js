GT.create({

	name: "TestClassExtendsMutiple",

	/**
	 * Test si un heritage simple
	 */
	testExtendsMutipleSimple: function (a) {

		var child = new DataTest.ClassChildMultiple1();

		a.assertTrue (!(child instanceof DataTest.ClassParentMultile1));
		a.assertTrue (!(child instanceof DataTest.ClassParentMultile2));
		a.assertTrue (child instanceof DataTest.ClassParentMultile3);
		a.assertTrue (child instanceof DataTest.ClassChildMultiple1);
		a.assertTrue (DataTest.ClassParentMultile1.isInstance (child));
		a.assertTrue (DataTest.ClassParentMultile2.isInstance (child));
		a.assertTrue (DataTest.ClassParentMultile3.isInstance (child));
		a.assertTrue (DataTest.ClassChildMultiple1.isInstance (child));
		a.assertTrue (!DataTest.ClassChildMultiple2.isInstance (child));
		
		a.assertCompare (
			DataTest.ClassChildMultiple1,
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
				prototype: DataTest.ClassChildMultiple1.prototype
			}
		);

		a.assertTrue (DataTest.ClassChildMultiple1.staticFunc1() == 'staticFunc1');
		a.assertTrue (DataTest.ClassChildMultiple1.staticFunc2() == 'staticFunc2');
		a.assertTrue (DataTest.ClassChildMultiple1.staticFunc3() == 'staticFunc3');
		a.assertTrue (DataTest.ClassChildMultiple1.staticFuncCommon() == 'staticFuncCommon:3');
		a.assertTrue (DataTest.ClassChildMultiple1.staticFunc1 === DataTest.ClassParentMultile1.staticFunc1);
		a.assertTrue (DataTest.ClassChildMultiple1.staticFunc2 === DataTest.ClassParentMultile2.staticFunc2);
		a.assertTrue (DataTest.ClassChildMultiple1.staticFunc3 === DataTest.ClassParentMultile3.staticFunc3);
		a.assertTrue (DataTest.ClassChildMultiple1.staticFuncCommon === DataTest.ClassParentMultile3.staticFuncCommon);

		a.assertCompare (
			child,
			{
				prop1: 1,
				prop2: 2,
				prop3: 3,
				propCommon: "propCommon:3",

				self: DataTest.ClassChildMultiple1,
				
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
		a.assertTrue (child.func1 === DataTest.ClassParentMultile1.prototype.func1);
		a.assertTrue (child.func2 === DataTest.ClassParentMultile2.prototype.func2);
		a.assertTrue (child.func3 === DataTest.ClassParentMultile3.prototype.func3);
		a.assertTrue (child.funcCommon === DataTest.ClassParentMultile3.prototype.funcCommon);

	},

	/**
	 * Test si un heritage multiple 2 niveau
	 */
	testExtendsMutipleComplex: function (a) {

		var child = new DataTest.ClassChildMultiple2();


		a.assertTrue (!(child instanceof DataTest.ClassParentMultile1));
		a.assertTrue (child instanceof DataTest.ClassParentMultile2);
		a.assertTrue (!(child instanceof DataTest.ClassParentMultile3));
		a.assertTrue (child instanceof DataTest.ClassChildMultiple2);
		a.assertTrue (!(child instanceof DataTest.ClassChildMultiple1));
		a.assertTrue (DataTest.ClassParentMultile1.isInstance (child));
		a.assertTrue (DataTest.ClassParentMultile2.isInstance (child));
		a.assertTrue (DataTest.ClassParentMultile3.isInstance (child));
		a.assertTrue (DataTest.ClassChildMultiple1.isInstance (child));
		a.assertTrue (DataTest.ClassChildMultiple2.isInstance (child));

		a.assertCompare (
			DataTest.ClassChildMultiple2,
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
				prototype: DataTest.ClassChildMultiple2.prototype
			}
		);

		a.assertTrue (DataTest.ClassChildMultiple2.staticFunc1() == 'staticFunc1');
		a.assertTrue (DataTest.ClassChildMultiple2.staticFunc2() == 'staticFunc2');
		a.assertTrue (DataTest.ClassChildMultiple2.staticFunc3() == 'staticFunc3');
		a.assertTrue (DataTest.ClassChildMultiple2.staticFuncCommon() == 'staticFuncCommon:2');
		a.assertTrue (DataTest.ClassChildMultiple2.staticFunc1 === DataTest.ClassParentMultile1.staticFunc1);
		a.assertTrue (DataTest.ClassChildMultiple2.staticFunc2 === DataTest.ClassParentMultile2.staticFunc2);
		a.assertTrue (DataTest.ClassChildMultiple2.staticFunc3 === DataTest.ClassParentMultile3.staticFunc3);
		a.assertTrue (DataTest.ClassChildMultiple2.staticFuncCommon === DataTest.ClassParentMultile2.staticFuncCommon);

		a.assertCompare (
			child,
			{
				prop1: 1,
				prop2: 2,
				prop3: 3,
				propCommon: "propCommon:2",

				self: DataTest.ClassChildMultiple2,
				
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
		a.assertTrue (child.func1 === DataTest.ClassParentMultile1.prototype.func1);
		a.assertTrue (child.func2 === DataTest.ClassParentMultile2.prototype.func2);
		a.assertTrue (child.func3 === DataTest.ClassParentMultile3.prototype.func3);
		a.assertTrue (child.funcCommon === DataTest.ClassParentMultile2.prototype.funcCommon);

	},

	testGetExtendsClass: function (a) {
		
		a.assertArraysEquals (DataTest.ClassChildMultiple1.getExtendsClass(), [
			DataTest.ClassParentMultile3,
			DataTest.ClassParentMultile2,
			DataTest.ClassParentMultile1
		]);

		a.assertArraysEquals (DataTest.ClassChildMultiple2.getExtendsClass(), [
			// Direct extends
			DataTest.ClassParentMultile2,
			DataTest.ClassChildMultiple1,
				// Level 2 extends
				DataTest.ClassParentMultile3,
				DataTest.ClassParentMultile2,
				DataTest.ClassParentMultile1,
			DataTest.ClassParentMultile3,

		]);
	}
});