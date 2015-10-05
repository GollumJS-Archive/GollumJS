GollumJS.Utils.global().DataTest = GollumJS.Utils.global().DataTest || {};

DataTest.FakeServiceForParser = new GollumJS.Class ({	
});

DataTest.FakeServiceForParserArgument = new GollumJS.Class ({
	
	args: null,

	initialize: function () {
		this.args = arguments;
	}
});
