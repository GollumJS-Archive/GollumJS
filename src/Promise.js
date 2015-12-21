GollumJS.NS(GollumJS, function() {

	if (GollumJS.Utils.isNodeContext()) {
		this.Promise = require('rsvp').Promise;
	} else {
		if (typeof GollumJS.Utils.global().RSVP == 'undefined' || typeof GollumJS.Utils.global().RSVP.Promise == 'undefined') {
		 	var url = GollumJS.getParameter('dependency.rsvp');
		 	console.warn ("Dependency not found load:", url);
			GollumJS.Utils.include(url);
		}
		this.Promise = GollumJS.Utils.global().RSVP.Promise;
	}

});