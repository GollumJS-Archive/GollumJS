GollumJS.NS(GollumJS.Utils, function() {

	this.Collection = {

		step: function (maxCall, cbFinish, cbStep) {
			var called = 0;
			if (maxCall <= 0) {
				cbFinish();
			}
			return function () {
				called++;
				if (maxCall == called) {
					cbFinish();
				} else {
					if (typeof cbStep == 'function') {
						cbStep();
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
			var _this = this;
			return new GollumJS.Promise (function (resolve, reject) {
				var step = this.step(this.length(iterable), resolve, cbStep);
				return _this.each(iterable, function (i, value) {
					return cbIter.call(value, i, value, step);
				})
			});

		}
	};

});