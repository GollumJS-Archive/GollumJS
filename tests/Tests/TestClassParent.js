GT.create({

	name: "TestClassParent",

	/**
	 * Test si un constructeur simple
	 */
	testParentSimple (a) {
		
		var child = new ClassChildForMethodParent1();

		a.assertCompare (
			child,
			{
				value: "initialize:12",
				
				self: ClassChildForMethodParent1,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){}
			}
		);

		a.assertTrue(child.func1() === 'func1:12');

	},

	/**
	 * Test this parent avec un scope forcer
	 */
	testForceScope (a) {
		
		var child = new ClassChildForMethodParent2();

		console.log (child);

		a.assertCompare (
			child,
			{
				value: "initialize:1|initialize:2",
				
				self: ClassChildForMethodParent1,
				
				initialize: function(){},
				parent: function(){},
				func1: function(){}
			}
		);

		a.assertTrue(child.func1() === 'func1:1|func1:2');

	}

});