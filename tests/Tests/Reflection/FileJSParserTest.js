GT.create({

	rootDir: ".",
	name: "FileJSParserTest",

	beforeProcess: function (a) {
 		this.rootDir = typeof __dirname !== 'undefined' ? __dirname : ".";
		this.cache = new ( // Mock
			new GollumJS.Class ({
				Extends: GollumJS.Cache.Cache,

				initialize: function (){},
				get: function (){ return GollumJS.Utils.isNodeContext() ? null : {}; },
				set: function (){}
			})
		);
		a.assertTrue ((this.cache.get("nokey") === null) === GollumJS.Utils.isNodeContext());
	},

	/**
	 * Test un exception simple
	 */
	testIsExclude: function (a) {
		if (GollumJS.Utils.isNodeContext()) {
			
			var parser = new (
				new GollumJS.Class ({
					Extends:  GollumJS.Reflection.FileJSParser.FileJSParser,
					parseSources: function (){}
				})
			)(
				this.cache,
				[ this.rootDir+"/src1", this.rootDir+"/src1/../src2" ],
				[ this.rootDir+"/src1/excludePath"],
				['.svn', ".git", "excludeFile.js"]
			);

			a.assertTrue(parser.isExclude(this.rootDir+"/src1/.svn"));
			a.assertTrue(parser.isExclude(this.rootDir+"/src1/pathNotExist"));
			a.assertTrue(parser.isExclude(this.rootDir+"/src1/excludePath"));
			a.assertTrue(parser.isExclude(this.rootDir+"/src1/excludeFile.js"));
			a.assertTrue(!parser.isExclude(this.rootDir+"/src1/file1"));
			a.assertTrue(!parser.isExclude(this.rootDir+"/src1/file2.js"));
			a.assertTrue(!parser.isExclude(this.rootDir+"/src1/file3.html"));
		}
	},

	/**
	 * Test un exception simple
	 */
	dtestGetFiles: function (a) {

		if (GollumJS.Utils.isNodeContext()) {

			var parser = new (
				new GollumJS.Class ({
					Extends:  GollumJS.Reflection.FileJSParser.FileJSParser,
					parseSources: function (){}
				})
			)(
				this.cache,
				[ this.rootDir+"/src1", this.rootDir+"/src1/../src2" ],
				[ this.rootDir+"/src1/excludePath"],
				['.svn', ".git", "excludeFile.js"]
			);

			var result = [];

			for (var i = 0; i < parser._srcPath.length; i++) {
				result.push(parser.getFiles (parser._srcPath[i]));
			}
			console.log(result);

			a.assertCompare (result, [ 
				[
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/excludePath/notFound',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/file1',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/file2.js',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/file3.html',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/subsrc/excludePath/mustFound',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/subsrc/file1',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/subsrc/file2.js',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src/subsrc/file3.html'
				],
				[
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src2/file1',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src2/file2.js',
					'/home/dduboeuf/Works/JS/Class.js/tests/Tests/Reflection/src2/file3.html' 
				] 
			]);
		}

	}
});