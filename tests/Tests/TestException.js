 // I am the Person class.
function Person( name ){
this.name = name;
}
// Define the class methods.
Person.prototype = {
// I swing this person in the trees.
swing: function(){
return( "Ouch! My hands!" );
},
// I walk this person.
walk: function(){
return( "Walk this way!" );
}
};
// -------------------------------------------------- //
// -------------------------------------------------- //
// I am the Monkey class.
GT.create({

	name: "TestException",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleException: function (a) {

		var exception = new GollumJS.Exception("Super Message");
		var error     = new Error("Super Message");

		console.log (exception);
		console.log (exception.stack);
		console.log (exception.message);
		console.log (exception instanceof GollumJS.Exception);
		console.log (exception instanceof Error);

		console.log (error);
		console.log (error.stack);
		console.log (error.message);
		console.log (error instanceof GollumJS.Exception);
		console.log (error instanceof Error);

		throw exception;
	}
});