var GollumJS = typeof (typeof window !== 'undefined' ? window : global).GollumJS != 'undefined' ? (typeof window !== 'undefined' ? window : global).GollumJS : {};
GollumJS.__init__ = true;
GollumJS.__running__ = "GollumJS_"+new Date().getTime()+"_"+parseInt(Math.random()*100000, 10);

GollumJS.NS = function () {

	var _ns_, cb;
	if (arguments.length == 1) {
		_ns_ = GollumJS.Utils.global();
		cb   = arguments[0];
	} else {
		_ns_ = arguments[0];
		cb   = arguments[1];
	}
	cb.call(_ns_, _ns_);
};