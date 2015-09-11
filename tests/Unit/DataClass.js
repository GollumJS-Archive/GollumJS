var ClassSimple = new GollumJS.Class ({
});

var ClassParentA = new GollumJS.Class ({
	
	Static: {
		staticProp1 : 1,
		staticProp2 : "42a",
		staticPropNull1 : null,
		staticPropNull2 : "null",
		staticPropArray1 : [ "a", 1],

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
	propNull1 : "null",
	propNull2 : null,
	
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

	Static: {
		staticProp2 : -42,
		staticPropNull1 : "null",
		staticPropNull2 : null,
		staticPropArray1 : [ "b", 2],

		staticFunc2: function () {
			return "staticFunc2|extends";
		}
	},

	prop2: 42,
	propNull1 : null,
	propNull2 : "null",

	func2: function () {
		return "func2|extend";
	}
});


var ClassParentTriple = new GollumJS.Class ({
	
	Static: {
		staticPropLevel1 : "aa",
		staticPropLevel2 : 11,
		staticPropLevel3 : -11,

		staticFuncLevel1: function () {
			return "staticFuncLevel1:aa";
		},

		staticFuncLevel2: function () {
			return "staticFuncLevel2:11";
		},

		staticFuncLevel3: function () {
			return "staticFuncLevel3:-11";
		}
	},

	propLevel1: "a",
	propLevel2: 1,
	propLevel3: -1,

	value: null,

	initialize: function () {
		this.value = "initialize:1";
	},

	funcLevel1: function () {
		return "funcLevel1:a";
	},

	funcLevel2: function () {
		return "funcLevel2:1";
	},

	funcLevel3: function () {
		return "funcLevel3:-1";
	}
	
});

var ClassChildTriple1 = new GollumJS.Class ({
	
	Extends: ClassParentTriple,
	
	Static: {
		staticPropLevel2 : 22,
		staticPropLevel3 : -22,

		staticFuncLevel2: function () {
			return "staticFuncLevel2:22";
		},

		staticFuncLevel3: function () {
			return "staticFuncLevel3:-22";
		}
	},
	
	propLevel2: 2,
	propLevel3: -2,

	value: null,

	initialize: function () {
		this.value = "initialize:2";
	},

	funcLevel2: function () {
		return "funcLevel2:2";
	},

	funcLevel3: function () {
		return "funcLevel3:-2";
	}
	
});

var ClassChildTriple2 = new GollumJS.Class ({
	
	Extends: ClassChildTriple1,
	
	Static: {
		staticPropLevel3 : -33,

		staticFuncLevel3: function () {
			return "staticFuncLevel3:-33";
		}
	},

	propLevel3: -3,

	value: null,

	initialize: function () {
		this.value = "initialize:3";
	},

	funcLevel3: function () {
		return "funcLevel3:-3";
	}
	
});

var ClassParentScope = new GollumJS.Class ({
	
	Static: {

		staticPropObject1: ["aa", 11, null],
		staticPropObject1: ["bb", 22, "nullnull"],

		staticFuncThis1: function () {
			return this;
		},

		staticFuncObject1: function () {
			return this.staticPropObject1;
		}
	},

	propObject1: ["a", 1, null],
	propObject2: ["b", 2, "null"],

	funcThis1: function () {
		return this;
	},

	funcThis2: function () {
		return this.funcThis1();
	},

	funcObject1: function () {
		return this.propObject1;
	}
	
});

var ClassChildScope = new GollumJS.Class ({
	
	Extends: ClassParentScope,

	Static: {

		staticPropObject1: ["aa2", -11, null],

		staticFuncThis2: function () {
			return this;
		},

		staticFuncObject2: function () {
			return this.staticPropObject2;
		}
	},

	propObject1: ["a2", -1, "exist"],

	funcThis3: function () {
		return this;
	},

	funcThis4: function () {
		return this.funcThis1();
	},

	funcObject2: function () {
		return this.propObject2;
	}
});