GT.create({

	name: "TestArgumentsParser",

	testNoArg: function (a) {
		
		var noArgs = new GollumJS.Parser.ArgumentsParser();
		a.assertArraysEquals (noArgs.parse(), []);

	},

	testSimpleStringArg: function (a) {

		var stringArgs = new GollumJS.Parser.ArgumentsParser([ "TestArgValue" ]);
		a.assertArraysEquals (stringArgs.parse(), [ "TestArgValue" ]);

	},

	testMultiArg: function (a) {

		var args = new GollumJS.Parser.ArgumentsParser([ "val1", 2, 3.12 ]);
		a.assertArraysEquals (args.parse(), [ "val1", 2, 3.12 ]);
		
	},

	testConfigArg: function (a) {

		GollumJS.config.testFakeConfig = {
			config1: "configurationTest1",
			config2: "configurationTest2",
			config3: 3
		};

		var args1 = new GollumJS.Parser.ArgumentsParser([ "%testFakeConfig.config1%" ]);
		var args2 = new GollumJS.Parser.ArgumentsParser([ "Before%testFakeConfig.config1%" ]);
		var args3 = new GollumJS.Parser.ArgumentsParser([ "%testFakeConfig.config1%After" ]);
		var args4 = new GollumJS.Parser.ArgumentsParser([ "Before%testFakeConfig.config1%After" ]);
		var args5 = new GollumJS.Parser.ArgumentsParser([ "%testFakeConfig.config1%/%testFakeConfig.config2%" ]);
		var args6 = new GollumJS.Parser.ArgumentsParser([ "%testFakeConfig.config3%" ]);

		a.assertArraysEquals (args1.parse(), [ "configurationTest1" ]);
		a.assertArraysEquals (args2.parse(), [ "BeforeconfigurationTest1" ]);
		a.assertArraysEquals (args3.parse(), [ "configurationTest1After" ]);
		a.assertArraysEquals (args4.parse(), [ "BeforeconfigurationTest1After" ]);
		a.assertArraysEquals (args5.parse(), [ "configurationTest1/configurationTest2" ]);
		a.assertArraysEquals (args6.parse(), [ "3" ]);
		
		delete GollumJS.config.testFakeConfig;
	},

	testServiceArg: function (a) {
		
		GollumJS.config.services.fakeService = {
			class: "DataTest.FakeServiceForParser"
		}

		var args = new GollumJS.Parser.ArgumentsParser([ "@fakeService" ]);

		a.assertArraysEquals (args.parse(), [ GollumJS.get("fakeService") ]);
		a.assertTrue (args.parse()[0] instanceof DataTest.FakeServiceForParser);

		delete GollumJS.config.services.fakeService;
	},

	testComplexArg: function (a) {
		GollumJS.config.services.fakeService = {
			class: "DataTest.FakeServiceForParser"
		}
		GollumJS.config.testFakeConfig = {
			config1: "configurationTest1"
		}

		var args = new GollumJS.Parser.ArgumentsParser([
			"%testFakeConfig.config1%",
			15,
			"string",
			"@fakeService"
		]);

		a.assertArraysEquals (args.parse(), [
			"configurationTest1",
			15,
			"string",
			GollumJS.get("fakeService")
		]);
	}

});