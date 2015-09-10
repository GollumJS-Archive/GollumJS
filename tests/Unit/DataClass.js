var ClassSimple = new GollumJS.Class ({
});

var ClassParentA = new GollumJS.Class ({
	
	Static: {
		staticProp1 : 1,
		staticProp2 : "42a",

		staticFunc1: function () {
			return "staticFunc1";
		},

		staticFunc2: function () {
			return "staticFunc2";
		}
	},

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

	prop2: 42,

	func2: function () {
		return "func2|extend";
	}
});


var ClassA = new GollumJS.Class ({
	
	Static: {
		staticProp2 : -42,

		staticFunc1: function () {
			return "staticFunc1";
		},

		staticFunc2: function () {
			return "staticFunc2|extends";
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