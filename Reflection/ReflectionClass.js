GollumJS.Reflection = GollumJS.Reflection || {};
/**
 *  @author     Damien Duboeuf
 *  @version 	1.0
 */
GollumJS.Reflection.ReflectionClass = new GollumJS.Class ({
	
	identifiers: null,
	constructor: null,
	comment: null,
	methods: {},
	properties: {},
	staticMethods: {},
	staticProperties: {},

	annotations: [],

	Static: {

		getClassByName: function (name, target) {

			target = target || window;

			return this.getClassByIdentifers (name.split ('.'), target);
		},

		getClassByIdentifers: function (identifiers, target, i) {

			if (!target) {
				if (typeof module !== 'undefined' && module.exports) {
					target = global;
				} else {
					target = window;
				}
			}

			i = i || 0;

			if (i >= identifiers.length) {
				return target;
			}
			
			if (typeof target[identifiers[i]] !== 'undefined') {
				return this.getClassByIdentifers (identifiers, target[identifiers[i]], i+1);
			}

			return null;
		},

	},

	initialize: function (identifiers) {
		if (identifiers) {
			this.identifiers  = identifiers;
			this.constructor = this.self.getClassByIdentifers (identifiers);

			var parser = new GollumJS.Annotation.Parser (this.comment);
			this.annotations = parser.annotions;
		}
	},

	getName: function () {
		return this.identifiers.join ('.');
	},

	serialiseInfos: function () {

		var serialiseInfosObject = function (o) {
			var datas = {};
			for (var i in o) {
				datas[i] = o[i].serialiseInfos();
			}
			return datas;
		} 

		return {
			identifiers     : this.identifiers,
			comment         : this.comment,
			methods         : serialiseInfosObject(this.methods),
			properties      : serialiseInfosObject(this.properties),
			staticMethods   : serialiseInfosObject(this.staticMethods),
			staticProperties: serialiseInfosObject(this.staticProperties),
		};
	},

	unserialiseInfos: function (infos) {
		
		var _this = this;
		var unserialiseInfosObject = function (datas, clazz) {
			var os = {};
			for (var i in datas) {
				os[i] = new clazz (_this);
				os[i].unserialiseInfos(datas[i]);
			}
			return os;
		} 

		this.identifiers      = infos.identifiers;
		this.constructor      = this.self.getClassByIdentifers (infos.identifiers);
		this.comment          = infos.comment;
		this.methods          = unserialiseInfosObject(infos.methods         , GollumJS.Reflection.ReflectionMethod);
		this.properties       = unserialiseInfosObject(infos.properties      , GollumJS.Reflection.ReflectionProperty);
		this.staticMethods    = unserialiseInfosObject(infos.staticMethods   , GollumJS.Reflection.ReflectionMethod);
		this.staticProperties = unserialiseInfosObject(infos.staticProperties, GollumJS.Reflection.ReflectionProperty);
	}

});
