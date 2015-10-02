
var GollumJS = require(__dirname+'/../index.js');
var GT       = require(__dirname+'/Unit/testfuncs.js');

require(__dirname+'/Tests/Class/DataClass.js'              );
require(__dirname+'/Tests/Class/TestClassConstructor.js'   );
require(__dirname+'/Tests/Class/TestClassExtends.js'       );
require(__dirname+'/Tests/Class/TestClassExtendsMutiple.js');
require(__dirname+'/Tests/Class/TestClassScope.js'         );
require(__dirname+'/Tests/Class/TestClassParent.js'        );

require(__dirname+'/Tests/Exception/DataException.js');
require(__dirname+'/Tests/Exception/TestException.js');


require(__dirname+'/Tests/Parser/DataParser.js');
require(__dirname+'/Tests/Parser/TestArgumentsParser.js');

require(__dirname+'/Tests/Cache/TestWriteCache.js');

var results = GT.runAll();

console.log ("");
console.log ("");
console.log ("=======================");
console.log ("= Result unit testing =");
console.log ("=======================");
console.log ("");

console.log (results);