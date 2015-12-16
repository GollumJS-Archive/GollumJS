var GollumJS = typeof (typeof window !== 'undefined' ? window : global).GollumJS != 'undefined' ? (typeof window !== 'undefined' ? window : global).GollumJS : {};
GollumJS.__init__ = true;
GollumJS.__running__ = "GollumJS_"+new Date().getTime()+"_"+parseInt(Math.random()*100000, 10);

GollumJS.NS = function (_ns_, cb) {
	_ns_ = _ns_ !== null ? _ns_ : GollumJS.Utils.global();
	cb.call(_ns_, _ns_);
};