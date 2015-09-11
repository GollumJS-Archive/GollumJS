GollumJS.Annotation = GollumJS.Annotation ? GollumJS.Annotation : {};

GollumJS.Annotation.AbstractAnnotation = new GollumJS.Class ({

	Static: {

		ANNOTATION_CLASS   : 0x1,
		ANNOTATION_METHOD  : 0x2,
		ANNOTATION_PROPERTY: 0x4,

		getClassWhichUse: function (target) {
			target = target ? target : (this.ANNOTATION_CLASS | this.ANNOTATION_METHOD | this.ANNOTATION_PROPERTY);

			// TODO not implement

			console.log (target);
		}

	},

	initialize: function (values) {

		if (typeof values == 'object') {
			for (var i in values) {
				if (typeof this[i] != 'undefined') {
					this[i] = values[i];
				}
			}
		}

	}

});