var GollumJS = typeof (typeof window !== 'undefined' ? window : global).GollumJS != 'undefined' ? (typeof window !== 'undefined' ? window : global).GollumJS : {};
GollumJS.__init__ = true;
GollumJS.__running__ = "GollumJS_"+new Date().getTime()+"_"+parseInt(Math.random()*100000, 10);