
"use strict";

(function () {

	// GT  = GollumTest
	var GT = {};
	var __list__ = [];

	GT.Assert = function () {
		this.results = [];
	};
	GT.Assert.RESULT_OK = "OK";
	GT.Assert.RESULT_KO = "KO";
	GT.Assert.AssertStop = { name: "EndAssert" };

	GT.Assert.prototype.assertTrue = function(obj) {

		var val = {
			stack: GT.stackScript(3)
		};

		if (obj === true) {
			val.value = GT.Assert.RESULT_OK;
			this.results.push(val);
		} else {
			val.value = GT.Assert.RESULT_KO;
			this.results.push(val);
			throw GT.Assert.AssertStop;
		}
	};

	GT.Assert.prototype.assertCompare = function(obj1, obj2) {
		return this.assertTrue(this.testCompare(obj1, obj2));
	};

	GT.Assert.prototype.testCompare = function(obj1, obj2) {
		if (obj1 === obj2) {
			return true;
		}

		if (
			typeof obj1 == typeof obj2
		) {
			if (typeof obj1 == 'object') {
				for (var i in obj1.length) {
					if (!this.testCompare(obj1[i], obj2[i])) {
						return false;
					}
				}
				for (var i in obj2.length) {
					if (!this.testCompare(obj1[i], obj2[i])) {
						return false;
					}
				}
				return true; 
			}
			if (typeof obj1 == 'function') {
				return true;
			}
		}

		return false;
	};

	GT.getErrorObject = function (){
		try { throw Error('') } catch(err) { return err; }
	};
	
	GT.stackScript = function (up) {

		var lines = GT.getErrorObject().stack.split("\n");
		for (var i = lines.length-1; i >= 0; i--) {
			lines[i] = lines[i].replace(/^\s+|\s+$/gm,'');
			if (lines[i].indexOf("GT.stackScript") != -1) {
				break;
			}
			delete lines[i];
		}
		return lines;
	};

	GT.create = function (testGroup) {
		
		if (typeof testGroup.name != 'string') {
			testGroup.name = __list__.length.toString();
		}

		__list__.push(testGroup);
	};

	GT.run = function (test) {
		
		var __rtn__ = {
			sucessNumber: 0,
			errorNumber: 0,
			result: GT.Assert.RESULT_OK
		};

		var a = new GT.Assert()
		try {
			test(a);
		} catch (e) {
			if (e != GT.Assert.AssertStop) {
				__rtn__.exception = "JS Exception"
			}
			__rtn__.result = GT.Assert.RESULT_KO;
			__rtn__.stack =  e.stack ? e.stack.split("\n") : [];
			for (var i = 0; i < __rtn__.stack.length; i++) {
				__rtn__.stack[i] = __rtn__.stack[i].replace(/^\s+|\s+$/gm,'');
			}
		}

		for (var i = 0; i < a.results.length; i++) {
			if (a.results[i].value == GT.Assert.RESULT_OK) {
				__rtn__.sucessNumber++;
			} else {
				__rtn__.errorNumber++;
				__rtn__.exception = "Assert Failure"
				__rtn__.result = GT.Assert.RESULT_KO;
				__rtn__.stack =  a.results[i].stack;
			}
		}

		return __rtn__;
	};

	GT.runGroup = function (group) {
		var __rtn__ = {};
		console.log ("Run group test: "+group.name+":");

		for (var i in group) {
			if (
				typeof group[i] == 'function' &&
				i.substr(0, 4) == 'test'
			) {
				console.log (" - Run test: "+i);
				__rtn__[i] = GT.run(group[i]);
			}
		}

		return __rtn__;
	};

	GT.runAll = function (name) {
		var __rtn__ = {};
		for (var i = 0; i < __list__.length; i++) {
			__rtn__[__list__[i].name] = GT.runGroup(__list__[i]);
		}

		return __rtn__;
	};

	var _global = typeof window == 'undefined' ? global : window;
	_global.GT = GT;



})();