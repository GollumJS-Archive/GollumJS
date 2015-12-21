GollumJS.NS(GollumJS, function() {

	if (GollumJS.Utils.isNodeContext()) {
		this.Promise = require('rsvp').Promise;
	} else {
		if (!GollumJS.Utils.global().RSVP || !GollumJS.Utils.global().RSVP.Promise) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "http://rsvpjs-builds.s3.amazonaws.com/rsvp-latest.min.js";
			$("head").append(s);
			document.body.appendChild(script);
			this.Promise = GollumJS.Utils.global().RSVP.Promise;
		}
	}

});