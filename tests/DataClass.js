var ClassSimple = new GollumJS.Class ({
});

var ClassA = new GollumJS.Class ({
	
	Static: {
		static1 : 1,
		static2 : {},

		staticFunc: function () {
			console.log ("staticFunc", this);
			this.staticFunc2();
		},

		staticFunc2: function () {
			console.log ("staticFunc2", this);
		}
	},

	tata: {},

	initialize: function () {
		console.log ("constructeur A");
	},

	hello: function (var1) {
		console.log ("hello "+var1, this);
		this.world(var1);
	},

	world: function (var1) {
		console.log ("world "+var1, this);
	}
	
});