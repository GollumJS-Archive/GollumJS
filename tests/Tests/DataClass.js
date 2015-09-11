var ClassSimple = new GollumJS.Class ({
});

var NoGollumJsClass = function () {
};
NoGollumJsClass.prototype.prop1 = 1;
NoGollumJsClass.prototype.func1 = function () {
};

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
var ClassChildTriple3 = new GollumJS.Class ({ Extends: ClassChildTriple2 });
var ClassChildTriple4 = new GollumJS.Class ({ Extends: ClassChildTriple3 });
var ClassChildTriple5 = new GollumJS.Class ({ Extends: ClassChildTriple4 });
var ClassChildTriple6 = new GollumJS.Class ({ Extends: ClassChildTriple5 });

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

var ClassParentMultile1 = new GollumJS.Class ({

	Static: {

		staticProp1: 1,
		staticPropCommon: "staticPropCommon:1",

		staticFunc1: function () {
			return "staticFunc1";
		},

		staticFuncCommon: function () {
			return "staticFuncCommon:1";
		}

	},

	prop1: 1,
	propCommon: "propCommon:1",

	func1: function () {
		return "func1";
	},

	funcCommon: function () {
		return "funcCommon:1";
	}

});

var ClassParentMultile2 = new GollumJS.Class ({

	Static: {

		staticProp2: 2,
		staticPropCommon: "staticPropCommon:2",

		staticFunc2: function () {
			return "staticFunc2";
		},

		staticFuncCommon: function () {
			return "staticFuncCommon:2";
		}

	},

	prop2: 2,
	propCommon: "propCommon:2",

	func2: function () {
		return "func2";
	},

	funcCommon: function () {
		return "funcCommon:2";
	}

});

var ClassParentMultile3 = new GollumJS.Class ({

	Static: {

		staticProp3: 3,
		staticPropCommon: "staticPropCommon:3",

		staticFunc3: function () {
			return "staticFunc3";
		},

		staticFuncCommon: function () {
			return "staticFuncCommon:3";
		}

	},

	prop3: 3,
	propCommon: "propCommon:3",

	func3: function () {
		return "func3";
	},

	funcCommon: function () {
		return "funcCommon:3";
	}

});


var ClassChildMultiple1 = new GollumJS.Class ({
	Extends: [
		ClassParentMultile1,
		ClassParentMultile2,
		ClassParentMultile3
	]
});

var ClassChildMultiple2 = new GollumJS.Class ({
	Extends: [
		ClassParentMultile3,
		ClassChildMultiple1,
		ClassParentMultile2
	]
});


var ClassParentForMethodParent1 = new GollumJS.Class ({

	value: null,

	initialize: function () {
		this.value = "initialize:1";
	},

	func1: function () {
		return "func1:1";
	},

});

var ClassParentForMethodParent2 = new GollumJS.Class ({

	value: null,

	initialize: function () {
		this.value = "initialize:2";
	},

	func1: function () {
		return "func1:2";
	},

});

var ClassChildForMethodParent1 = new GollumJS.Class ({

	Extends: ClassParentForMethodParent1,

	value: null,

	initialize: function () {
		this.parent()();
		this.value += "2";
	},

	func1: function () {
		return this.parent().func1()+"2";
	},

});


var ClassChildForMethodParent2 = new GollumJS.Class ({

	Extends: ClassChildForMethodParent1,

	value: null,

	initialize: function () {
		this.parent()();
		var val = this.value;
		this.parent(ClassParentForMethodParent2)()
		this.value = val+"|"+this.value;
	},

	func1: function () {
		return this.parent().func1()+"|"+this.parent(ClassParentForMethodParent2).func1();
	},

});
