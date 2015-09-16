GT.create({

	name: "TestException",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleException: function (a) {

		var exception = new GollumJS.Exception("Super Message", 18);

		a.assertTrue (exception instanceof Error);
		a.assertTrue (exception instanceof GollumJS.Exception);
		a.assertTrue (GollumJS.Exception.isInstance (exception));

		a.assertTrue (exception.message == "Super Message");
		a.assertTrue (exception.code == 18);
		if (
			GollumJS.Utils.engine() == GollumJS.Utils.ENGINE_WEBKIT ||
			GollumJS.Utils.engine() == GollumJS.Utils.ENGINE_GECKO
		) {
			a.assertTrue (exception.fileName.indexOf("TestException.js") != -1);
		// 	a.assertTrue (exception.columnNumber == 19);
		// 	a.assertTrue (exception.lineNumber == 10);
		}

	},

	testTryCatch: function (a) {
		try  {
			throw new GollumJS.Exception("Super Message", 18);
		} catch (e) {
			a.assertTrue (e instanceof Error);
			a.assertTrue (e instanceof GollumJS.Exception);
			a.assertTrue (GollumJS.Exception.isInstance(e));
		}
	}
});