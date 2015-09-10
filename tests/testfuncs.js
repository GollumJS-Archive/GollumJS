
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
			infos: GT.infosScript(3)
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
	
	GT.infosScript = function (up) {

		var getErrorObject = function (){
		    try { throw Error('') } catch(err) { return err; }
		}

		var lines = getErrorObject().stack.split("\n");
		for (var i = 0; i < lines.length;i++) {
			if (lines[i].indexOf("GT.infosScript") != -1) {
				return lines[i+up].replace(/^\s+|\s+$/gm,'');
			}
		}
		return null;
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
				console.log(e);
			}
			__rtn__.result = GT.Assert.RESULT_KO;
		}

		for (var i = 0; i < a.results.length; i++) {
			if (a.results[i].value == GT.Assert.RESULT_OK) {
				__rtn__.sucessNumber++;
			} else {
				__rtn__.errorNumber++;
				__rtn__.result = GT.Assert.RESULT_KO;
				__rtn__.infos =  a.results[i].infos;
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