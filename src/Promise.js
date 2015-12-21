GollumJS.NS(GollumJS, function() {

	if (GollumJS.Utils.isNodeContext()) {
		this.Promise = require('rsvp').Promise;
	} else {
		if (typeof GollumJS.Utils.global().RSVP == 'undefined' || typeof GollumJS.Utils.global().RSVP.Promise == 'undefined') {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "http://rsvpjs-builds.s3.amazonaws.com/rsvp-latest.min.js";
			GollumJS.Utils.addDOMEvent(script, 'load', function() {
				GollumJS.Promise = GollumJS.Utils.global().RSVP.Promise;
			});
			document.body.appendChild(script);
		}
		
	}

});