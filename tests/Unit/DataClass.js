var ClassSimple = new GollumJS.Class ({
});

var ClassParentA = new GollumJS.Class ({

	prop1: 4,
	prop2: "a",
	prop3: [1 , 12 ,"3"],

	func1: function () {
		return "func1";
	},
	func2: function () {
		return "func2";
	}


});
var ClassChildA1 = new GollumJS.Class ({
	Extends: ClassParentA
});
var ClassChildA2 = new GollumJS.Class ({
	Extends: ClassParentA,

	func2: function () {
		return "func2|extend";
	}
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