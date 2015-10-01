
GT.create({

	name: "TestClassScope",

	/**
	 * Test le this des methods
	 */
	testScopeSimple: function (a) {

		var parent = new ClassParentScope();

		a.assertTrue (ClassParentScope.staticFuncThis1()  === ClassParentScope);
		a.assertTrue (ClassParentScope.staticFuncObject1() === ClassParentScope.staticPropObject1);

		a.assertTrue (parent === parent.funcThis1());
		a.assertTrue (parent === parent.funcThis2());
		a.assertTrue (parent.funcObject1() === parent.propObject1);

	},

	/**
	 * Test le this des methods
	 */
	testScopeExtend: function (a) {
		
		var child = new ClassChildScope();

		a.assertTrue (ClassChildScope.staticFuncThis1()  === ClassChildScope);
		a.assertTrue (ClassChildScope.staticFuncThis2()  === ClassChildScope);
		a.assertTrue (ClassChildScope.staticFuncObject1() !== ClassParentScope.staticPropObject1);
		a.assertTrue (ClassChildScope.staticFuncObject2() === ClassParentScope.staticPropObject2);
		a.assertTrue (ClassChildScope.staticFuncObject1() === ClassChildScope.staticPropObject1);
		a.assertTrue (ClassChildScope.staticFuncObject2() === ClassChildScope.staticPropObject2);

		a.assertTrue (child === child.funcThis1());
		a.assertTrue (child === child.funcThis2());
		a.assertTrue (child === child.funcThis3());
		a.assertTrue (child === child.funcThis4());
		a.assertTrue (child.funcObject1() === child.propObject1);
		a.assertTrue (child.funcObject2() === child.propObject2);

	}

});