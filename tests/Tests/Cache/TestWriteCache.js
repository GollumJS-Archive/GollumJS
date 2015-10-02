GT.create({

	name: "TestWriteCache",

	cache: null,

	beforeProcess: function () {
		this.cache = new GollumJS.Cache.Cache("./tmp");
	},

	/**
	 * Test si un constructeur simple
	 */
	testSetSimpleValue: function (a) {
		
		this.cache.set("testVar1", "testValue1");

		a.assertTrue (GollumJS.cache["testVar1"] === "testValue1");

		if (GollumJS.Utils.isNodeContext()) {
			var fs 
		}

	}

});