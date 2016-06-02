GollumJS.NS(GollumJS.Utils, function() {

	this.Collection = {

		/**
		 * Return a function for called after.
		 * If this function is call 'maxCall' times then the call back 'cbFinish' is called.
		 * For each called on this function the optional callback cbStep is called. 
		 * @param  {int}      maxCall
		 * @param  {Function} cbFinish
		 * @param  {Function} cbStep (optional)
         * @return {Function}
         */
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

		/**
		 * @param  {Array|object} iterable
		 * @return {int}
		 */
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

		/**
		 * Call 'cb' for all object into 'iterable'
		 * 'cb' called with params 'key', 'value' with scope bind to 'value'
		 * 
		 * @param  {Array|object} iterable
		 * @param  {function}     cb
		 * @return {Array|object}
		 */
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
		
		/**
		 * Return a promise if resolve when all element in 'iterable' is called with 'cbIter'
		 * The callback 'cbIter' is called with params 'key', 'value', 'step'.
		 * And 'step' is a callback who is called when the action is finish.
		 * 
		 * The params 'cbStep' is callback called after 'step' is called.
		 * 
		 * @param  {Array|object} iterable
		 * @param  {function}     cbIter
		 * @param  {function}     cbStep (optional)
		 * @return {Promise}
		 */
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