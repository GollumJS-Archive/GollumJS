GollumJS.Annotation = {};

GollumJS.AnnotationParser = new GollumJS.Class ({

	comment: null,
	annotions: [],

	initialize: function (comment) {
		this.comment = comment;
		this.parse();
	},

	parse : function () {
		console.log (this.comment);
	}
});