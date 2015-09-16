
"use strict";

(function () {

	var _global = typeof window == 'undefined' ? global : window;
	if (typeof _global.GT == 'undefined') {

		// GT  = GollumTest
		var GT = {};
		var __list__ = [];

		GT.Assert = function () {
			this.results = [];
			this.messages = [];
		};
		GT.Assert.RESULT_OK = "OK";
		GT.Assert.RESULT_KO = "KO";
		GT.Assert.AssertStop = { name: "EndAssert" };

		GT.Assert.prototype.assertTrue = function(obj, up, hideMessage) {

			up = up !== undefined ? up : 0;

			var val = {
				stack: GT.stackScript(1+up)
			};

			if (obj === true) {
				val.value = GT.Assert.RESULT_OK;
				this.results.push(val);
			} else {
				val.value = GT.Assert.RESULT_KO;
				this.results.push(val);
				if(!hideMessage) this.messages.push ("Param1 not is TRUE value");
				throw GT.Assert.AssertStop;
			}
		};

		GT.Assert.prototype.assertCompare = function(obj1, obj2) {
			return this.assertTrue(this.testCompare(obj1, obj2, true), 1, true);
		};

		GT.Assert.prototype.assertArraysEquals = function(ar1, ar2) {
			return this.assertTrue(this.testArraysEquals(ar1, ar2, true), 1, true);
		};

		GT.Assert.prototype.testArraysEquals = function(ar1, ar2, showMessage) {
			
			if (typeof ar1 != 'object') {
				if(showMessage) this.messages.push ("param1 not an object");
				return false;
			}
			if (typeof ar2 != 'object') {
				if(showMessage) this.messages.push ("param2 not an object");
				return false;
			}

			if (Object.prototype.toString.call(ar1) !== '[object Array]') {
				if(showMessage) this.messages.push ("param1 not an Array");
				return false;
			}
			if (Object.prototype.toString.call(ar2) !== '[object Array]') {
				if(showMessage) this.messages.push ("param2 not an Array");
				return false;
			}
			if (ar1.length != ar2.length) {
				if(showMessage) this.messages.push ("Size of param1 not equal to size of param2");
				return false;
			}
			for (var i = 0; i < ar1.length; i++) {
				if (ar1[i] !== ar2[i]) {
					if(showMessage) this.messages.push (i+" element in param1 not equal to "+i+" element in param2");
					return false;
				}
			}
			return true;
		};	

		GT.Assert.prototype.testCompare = function(obj1, obj2, showMessage, compare) {

			if (obj1 === obj2) {
				return true;
			}

			if (!compare) {
				compare = [];
			}
			for (var i = 0; i < compare; i++) {
				if (compare[i].obj1 === obj1 && compare[i].obj2 === obj2) {
					return true;
				}
			}
			compare.push ({obj1:obj1, obj2:obj2});
			
			if (
				(
					typeof obj1 != "object" &&
					typeof obj1 != "function"
				) ||
				(
					typeof obj2 != "object" &&
					typeof obj2 != "function"
				) 
			) {

				if (typeof obj1 == typeof obj2) {
					if(showMessage) this.messages.push ("param1 not equals to param2");
				} else if (
					typeof obj1 != "object" &&
					typeof obj1 != 'function'
				) {
					if(showMessage) this.messages.push ("param1 not an object or function is "+typeof obj1);
				} else if (
					typeof obj2 != "object" &&
					typeof obj2 != 'function'
				) {
					if(showMessage) this.messages.push ("param2 not an object or function is "+typeof obj2);
				}
				return false;
			}
			for (var i in obj1) {
				if (!this.testCompare(obj1[i], obj2[i], showMessage, compare)) {
					if(showMessage) this.messages.push ("property "+i+" not equal with 2 object in parameters");
					return false;
				}
			}
			for (var i in obj2) {
				if (!this.testCompare(obj1[i], obj2[i], showMessage, compare)) {
					if(showMessage) this.messages.push ("property "+i+" not equal with 2 object in parameters");
					return false;
				}
			}
			return true; 
		};

		GT.getErrorObject = function (){
			try { throw Error('') } catch(err) { return err; }
		};
		
		GT.stackScript = function (up) {

			var __rtn__ = [];
			var __lines__ = GT.getErrorObject().stack.split("\n");
			for (var i = __lines__.length-1; i >= 0; i--) {
				if (__lines__[i].indexOf("GT.stackScript") != -1) {
					break;
				}
				__lines__[i] = __lines__[i].replace(/^\s+|\s+$/gm,'');
				if (__lines__[i]) {
					__rtn__.push(__lines__[i]);
				}
			}
			var __rtn__2 = [];
			for (var i = 0; i < __rtn__.length-up; i++) {
				__rtn__2[__rtn__.length-1-up-i] = __rtn__[i];
			}
			return __rtn__2;
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
				__rtn__.messages = a.messages ? a.messages : [];

				if (e != GT.Assert.AssertStop) {
					__rtn__.exception = "JS Exception";
					if (typeof e == 'string') {
						__rtn__.messages.push (e);
					} else if (typeof e == 'object' && typeof e.message == 'string') {
						__rtn__.messages.push (e.message);
					}
					
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

		_global.GT = GT;
	}
	if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
		module.exports = _global.GT;
	}


})();