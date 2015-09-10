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

		console.log (child);

		// Child is good
		a.assertCompare (parent, child);
		a.assertTrue (child.func1() == 'func1');
		a.assertTrue (child.func2() == 'func2');
	},

	/**
	 * Test si un constructeur sans initialize en récupère un
	 */
	testDirectExtendMethod (a) {
		var parent = new ClassParentA();
		var child  = new ClassChildA2();
		
		a.assertTrue (child.func2() != 'func2');
		a.assertTrue (child.func2() != 'func2|extend');
	}

});