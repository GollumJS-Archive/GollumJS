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
		a.assertArraysEquals (args6.parse(), [ 3 ]);
		
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

	testArrayArg: function (a) {

		GollumJS.config.services.fakeService = {
			class: "DataTest.FakeServiceForParser"
		}
		GollumJS.config.testFakeConfig = {
			config1: "configurationTest1",
			config2: "configurationTest2",
			config3: 3
		};

		var args = new GollumJS.Parser.ArgumentsParser([ [
			"%testFakeConfig.config1%",
			"%testFakeConfig.config2%",
			"%testFakeConfig.config3%",
			"@fakeService"
		] ]);

		a.assertArraysEquals (args.parse()[0], [
			"configurationTest1",
			"configurationTest2",
			3,
			GollumJS.get("fakeService")
		]);
		a.assertTrue (typeof args.parse()[1] === 'undefined');

		delete GollumJS.config.testFakeConfig;
		delete GollumJS.config.services.fakeService;
	},

	testObjectArg: function (a) {

		GollumJS.config.services.fakeService = {
			class: "DataTest.FakeServiceForParser"
		}
		GollumJS.config.testFakeConfig = {
			config1: "configurationTest1",
			config2: "configurationTest2",
			config3: 3
		};

		var args = new GollumJS.Parser.ArgumentsParser([ {
			arg1: "%testFakeConfig.config1%",
			arg2: "%testFakeConfig.config2%",
			arg3: "%testFakeConfig.config3%",
			arg4: "@fakeService"
		} ]);

		a.assertCompare (args.parse()[0], {
			arg1: "configurationTest1",
			arg2: "configurationTest2",
			arg3: 3,
			arg4: GollumJS.get("fakeService")
		});
		a.assertTrue (typeof args.parse()[1] === 'undefined');

		delete GollumJS.config.testFakeConfig;
		delete GollumJS.config.services.fakeService;
	},

	testConfigArgIntoConfigArg: function (a) {
		GollumJS.config.testFakeConfig = {
			config1: "configurationTest1",
			config2: "%testFakeConfig.config1%2",
			config3: "%testFakeConfig.config2%3",
			config4: [
				"%testFakeConfig.config1%",
				"%testFakeConfig.config2%",
				"%testFakeConfig.config3%"
			]
		};

		var args = new GollumJS.Parser.ArgumentsParser([
			"%testFakeConfig.config3%", 
			[
				"%testFakeConfig.config1%",
				"%testFakeConfig.config2%",
				"%testFakeConfig.config3%",
			],
			"%testFakeConfig.config4%",
			"%testFakeConfig%"
		]);

		a.assertCompare (args.parse(), [
			"configurationTest123",
			[ 
				"configurationTest1",
				"configurationTest12", 
				"configurationTest123"
			],
			[ 
				"configurationTest1",
				"configurationTest12", 
				"configurationTest123"
			],
			{
				config1: "configurationTest1",
				config2: "configurationTest12",
				config3: "configurationTest123",
				config4: [
					"configurationTest1",
					"configurationTest12", 
					"configurationTest123"
				]
			}
		]);

		delete GollumJS.config.testFakeConfig;
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

		delete GollumJS.config.services.fakeService;
		delete GollumJS.config.testFakeConfig;
	},

	testArgToContructor: function (a) {
		GollumJS.config.services.fakeService = {
			class: "DataTest.FakeServiceForParser"
		}
		GollumJS.config.services.fakeServiceArg = {
			class: "DataTest.FakeServiceForParserArgument",
			args: [
				"%testFakeConfig.config1%",
				15,
				"string",
				"@fakeService"
			]
		}
		GollumJS.config.testFakeConfig = {
			config1: "configurationTest1"
		}

		var service = GollumJS.get('fakeServiceArg');
		a.assertTrue (service.args[0] == "configurationTest1");
		a.assertTrue (service.args[1] == 15);
		a.assertTrue (service.args[2] == "string");
		a.assertTrue (service.args[3] == GollumJS.get("fakeService"));
		a.assertTrue (typeof service.args[4] === "undefined");

		delete GollumJS.config.services.fakeService;
		delete GollumJS.config.services.fakeServiceArg;
		delete GollumJS.config.testFakeConfig;
	}

});