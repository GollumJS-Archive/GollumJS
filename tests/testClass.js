
var GollumJS = require(__dirname+'/../index.js');
var GT       = require(__dirname+'/Unit/testfuncs.js');
var fs       = require('fs');

eval(fs.readFileSync(__dirname+'/Tests/DataClass.js', 'utf8'));

eval(fs.readFileSync(__dirname+'/Tests/TestClassConstructor.js'   , 'utf8'));
eval(fs.readFileSync(__dirname+'/Tests/TestClassExtends.js'       , 'utf8'));
eval(fs.readFileSync(__dirname+'/Tests/TestClassExtendsMutiple.js', 'utf8'));
eval(fs.readFileSync(__dirname+'/Tests/TestClassScope.js'         , 'utf8'));
eval(fs.readFileSync(__dirname+'/Tests/TestClassParent.js'        , 'utf8'));
eval(fs.readFileSync(__dirname+'/Tests/TestException.js'          , 'utf8'));

console.log (GT.runAll());