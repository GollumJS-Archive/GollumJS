GT.create({

	name: "TestException",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleException (a) {

		var exception = new GollumJS.Exception("Super Message");
		var error     = new Error("Super Message");
		
		console.log (exception);
		console.log (exception.stack);
		console.log (exception.message);
		console.log (exception instanceof GollumJS.Exception);
		console.log (exception instanceof Error);

		console.log (error);
		console.log (error.stack);
		console.log (error.message);
		console.log (error instanceof GollumJS.Exception);
		console.log (error instanceof Error);

		throw exception;
	}
});