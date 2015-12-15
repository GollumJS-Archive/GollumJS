
"use strict";

GollumJS.Utils = {

	ENGINE_GECKO : "gecko",
	ENGINE_WEBKIT: "webkit",
	ENGINE_MSIE  : "ie",
	ENGINE_OTHER : "other",
	
	isGollumJsClass: function (clazz) {
		return clazz && clazz.__gollumjs__ === GollumJS.__running__;
	},

	isGollumJsObject: function (obj) {
		return obj && obj.self !== undefined && GollumJS.Utils.isGollumJsClass(obj.self);
	},

	clone: function (value) {

		if (value === null) {
			return null;
		}
		var target = null;
		
		if (typeof (value) == 'object') {
			if (Object.prototype.toString.call( value ) === '[object Array]') {
				target = [];
				for (var k = 0; k < value.length; k++) {
					target[k] = GollumJS.Utils.clone (value[k]);
				}
			} else {
				target = {};
				GollumJS.Utils.extend (target, value);
			}

		} else {
			target = value;
		}
		return target;
	},

	extend: function(destination, source) {
		for (var property in source) {

			if (source[property] == null) {
				if (typeof destination[property] == 'undefined') {
					destination[property] = null;
				}
			} else
			if (typeof (source[property]) == 'object' && Object.prototype.toString.call( source[property] ) !== '[object Array]') {
				if (typeof destination[property] == 'undefined') {
					destination[property] = {};
				}
				GollumJS.Utils.extend (destination[property], source[property]);
			} else {
				destination[property] = GollumJS.Utils.clone(source[property]);
			}
			
		}
		return destination;
	},

	addDOMEvent: function (el, eventType, handler) {
		if (el.addEventListener) { // DOM Level 2 browsers
			el.addEventListener(eventType, handler, false);
		} else if (el.attachEvent) { // IE <= 8
			el.attachEvent('on' + eventType, handler);
		} else { // ancient browsers
			el['on' + eventType] = handler;
		}
	},

	global: function () {
		return typeof window !== 'undefined' ? window : global; 
	},

	isNodeContext: function() {
		return !!(typeof module !== 'undefined' && module.exports);
	},

	isDOMContext: function() {
		return typeof window !== 'undefined'; 
	},

	engine: function () {
		
		if (this.isNodeContext()) {
			return this.ENGINE_WEBKIT;
		}

		if (
			typeof navigator           != "undefined" &&
			typeof navigator.userAgent != "undefined"
		) {

			var ua = navigator.userAgent.toLowerCase();
			var match =
				/(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				/(trident)[ \/]([\w.]+)/.exec(ua)||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || []
			;
			var browser = match[1] || "";
			
			switch (browser) {
				case 'msie':
				case 'trident':
					return this.ENGINE_MSIE;
				case 'mozilla':
					return this.ENGINE_GECKO;
				case 'webkit':
				case 'chrome':
					return this.ENGINE_WEBKIT;
				default:
					break;
			}
		}
 
		return this.ENGINE_OTHER;
	},

	step: function (maxCall, finishCb, stepCb) {
		var called = 0;
		return function () {
			called++;
			if (maxCall == called) {
				if (typeof finishCb == 'function') {
					finishCb();
				}
			} else {
				if (typeof stepCb == 'function') {
					stepCb();
				}
			}
		};
	}

};