GT.create({

	name: "TestException",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleException: function (a) {

		var exception = new GollumJS.Exception("Super Message");

		console.log (exception);
		console.log (exception.stack);
		console.log (exception.message);

		a.assertTrue (exception instanceof Error);
		a.assertTrue (exception instanceof GollumJS.Exception);
		a.assertTrue (GollumJS.Exception.isInstance (exception));
		
		a.assertTrue (exception.message == "Super Message");
		
		// throw exception;
	}
});