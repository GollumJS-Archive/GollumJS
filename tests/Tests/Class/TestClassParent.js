GT.create({

	name: "TestClassParent",

	/**
	 * Test si un constructeur simple
	 */
	testParentSimple: function (a) {
		
		var child = new DataTest.ClassChildForMethodParent1();
		
		a.assertCompare (
			child,
			{
				value: "initialize:12",
				
				self: DataTest.ClassChildForMethodParent1,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){}
			}
		);

		a.assertTrue(child.func1() === 'func1:12');

	},

	/**
	 * Test this parent avec un scope forcersmart
	 */
	testForceScope: function (a) {
		
		var child = new DataTest.ClassChildForMethodParent2();

		a.assertCompare (
			child,
			{
				value: "initialize:12|initialize:2",
				
				self: DataTest.ClassChildForMethodParent1,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){}
			}
		);

		a.assertTrue(child.func1() === 'func1:12|func1:2');

	}

});