
GT.create({

	name: "TestClassScope",

	/**
	 * Test le this des methods
	 */
	testScopeSimple: function (a) {

		var parent = new DataTest.ClassParentScope();

		a.assertTrue (DataTest.ClassParentScope.staticFuncThis1()  === DataTest.ClassParentScope);
		a.assertTrue (DataTest.ClassParentScope.staticFuncObject1() === DataTest.ClassParentScope.staticPropObject1);

		a.assertTrue (parent === parent.funcThis1());
		a.assertTrue (parent === parent.funcThis2());
		a.assertTrue (parent.funcObject1() === parent.propObject1);

	},

	/**
	 * Test le this des methods
	 */
	testScopeExtend: function (a) {
		
		var child = new DataTest.ClassChildScope();

		a.assertTrue (DataTest.ClassChildScope.staticFuncThis1()  === DataTest.ClassChildScope);
		a.assertTrue (DataTest.ClassChildScope.staticFuncThis2()  === DataTest.ClassChildScope);
		a.assertTrue (DataTest.ClassChildScope.staticFuncObject1() !== DataTest.ClassParentScope.staticPropObject1);
		a.assertTrue (DataTest.ClassChildScope.staticFuncObject2() === DataTest.ClassParentScope.staticPropObject2);
		a.assertTrue (DataTest.ClassChildScope.staticFuncObject1() === DataTest.ClassChildScope.staticPropObject1);
		a.assertTrue (DataTest.ClassChildScope.staticFuncObject2() === DataTest.ClassChildScope.staticPropObject2);

		a.assertTrue (child === child.funcThis1());
		a.assertTrue (child === child.funcThis2());
		a.assertTrue (child === child.funcThis3());
		a.assertTrue (child === child.funcThis4());
		a.assertTrue (child.funcObject1() === child.propObject1);
		a.assertTrue (child.funcObject2() === child.propObject2);

	}

});