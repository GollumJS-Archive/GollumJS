GollumJS.NS(GollumJS.Utils, function() {

	this.Collection = {

		step: function (maxCall, cbFinish, cbStep) {
			var called = 0;
			var results = [];

			if (maxCall <= 0) {
				cbFinish();
			}
			return function () {
				if (arguments.length == 1) {
					results.push(arguments[0]);
				} else if (arguments.length) {
					results.push(arguments);
				}
				called++;
				if (maxCall == called) {
					cbFinish(results);
				} else {
					if (typeof cbStep == 'function') {
						cbStep(results);
					}
				}
			};
		},

		length: function (iterable) {
			if (typeof iterable.length == 'undefined') {
				var l = 0;
				for (i in iterable) {
					l++;
				}
				return l;
			}
			return iterable.length;
		},

		each: function (iterable, cb) {
			if (typeof iterable.length == 'undefined') {
				for (var i in iterable) {
					if (cb.call(iterable[i], i, iterable[i]) === false) {
						break;
					}
				}
			} else {
				var l = iterable.length;
				for (var i = 0; i < l; i++) {
					if (cb.call(iterable[i], i, iterable[i]) === false) {
						break;
					}
				}
			}
			return iterable;
		},

		eachStep: function (iterable, cbIter, cbStep) {
			return new GollumJS.Promise (function (resolve, reject) {
				var step = GollumJS.Utils.Collection.step(GollumJS.Utils.Collection.length(iterable), resolve, cbStep);
				return GollumJS.Utils.Collection.each(iterable, function (i, value) {
					return cbIter.call(value, i, value, step);
				})
			});

		}
	};

});