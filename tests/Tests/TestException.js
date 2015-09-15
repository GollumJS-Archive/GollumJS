var IDataSource = function(){
    throw new Error("Not implemented, interface only");
};

IDataSource.prototype.getData = function(){
    throw new Error("Not implemented.");
};

var BasicDataSource = function(){};
BasicDataSource.prototype = Object.create(IDataSource.prototype);
BasicDataSource.prototype.getData = function(){
    //[do some stuff, get some real data, return it]
    return "bds data";
};
BasicDataSource.prototype.getData2 = function(){
    //[do some stuff, get some real data, return it]
    return "bds data";
};

var MockDataSource = function(){};
MockDataSource.prototype = Object.create(IDataSource.prototype);
MockDataSource.prototype.getData = function(){
    //[DONT DO some stuff return mock json]
    return "mds data";
};

MockDataSource.prototype.getDataTwo = function(){
    //[DONT DO some stuff return mock json]
    return "mds data2";
};


var MockDataSource2 = function(){};
MockDataSource2.prototype = Object.create(MockDataSource.prototype);




var bds = new BasicDataSource();
console.log("bds is NOT MockDataSource:", bds instanceof MockDataSource);
console.log("bds is BasicDataSource:", bds instanceof Object);
console.log("bds is BasicDataSource:", bds instanceof BasicDataSource);
console.log("bds is an IDataSource:", bds instanceof IDataSource);
console.log("bds Data:", bds.getData());

console.log(" ============ ");


GT.create({

	name: "TestException",

	/**
	 * Test si un constructeur simple
	 */
	testSimpleException (a) {

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