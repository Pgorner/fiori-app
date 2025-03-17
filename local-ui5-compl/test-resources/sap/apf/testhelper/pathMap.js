/*global sap*/
sap.ui.define([
	"sap/apf/utils/exportToGlobal"
], function(
	exportToGlobal
) {
	"use strict";
	/**
	 * @class Class for mapping the module names and their namespaces to URLs / folder paths in the folder structure deployed on a server (Tomcat/Jety, SAP WebIDE, Karma/node.js).
	 * @param {String} modulePathPrefixTest Prefix path directly above the project's namespace for test code. The prefix must end with a slash.
	 * @param {String} modulePathPrefixProductive Prefix path directly above the project's namespace for productive code. The prefix must end with a slash.
	 * @param {String} namespace the namespace prefix which is unique for the project resources, for instance "sap.mySpace".
	 * @param {String} [pathname] when omitted then window.location.pathname is used as value internally.
	 * @alias sap.apf.testhelper.PathMap
	 */
	function PathMap(modulePathPrefixTest, modulePathPrefixProductive, namespace, pathname) {
		var pathnameLocal = (pathname || window.location.pathname);
		var pathnameWithoutLeadingSlash = pathnameLocal.slice(1, pathnameLocal.length);
		var modulePath;
		/**
		 * Returns true when application is run on Tomcat for test.
		 * @returns {boolean}
		 */
		this.isOnTomcat = function() {
			return pathnameLocal.indexOf("/test-resources") > -1;
		};
		/**
		 * Returns true when application is run on Tomcat for test.
		 * @returns {boolean}
		 */
		this.isOnKarma = function() {
			return (pathnameLocal.indexOf("/context.html") > -1 || pathnameLocal.indexOf("/debug.html") > -1);
		};
		/**
		 *  Determines a prefix path for the test resources such that the path end with the suffix,
		 *  and the path is the segment between the origin and all modules in the project.
		 *  For instance: WHEN namespace === "myLib/test/uilib/sap/hugo.test.html" and suffic === "test/uilib"
		 *  THEN returns "myLib/test/uilib/"
		  * @param suffix
		 * @returns {string}
		 */
		this.composePrefix = function(suffix) {
			var tmp2 = pathnameWithoutLeadingSlash.split(modulePathPrefixTest); // replace e.g. test/uilib by main/uilib
			if (tmp2.length <= 1) { // case WebStorm: "/debug.html"
				return "";
			}
			var prefix = tmp2[0];
			prefix += suffix;
			if (prefix[prefix.length - 1] !== "/") {
				prefix += "/";
			}
			return prefix;
		};
		this.getPathUpToRoot = function() {
			var path2Root = "";
			var compList = pathnameWithoutLeadingSlash.split("/");
			compList.pop(); // remove file component
			compList.forEach(function() {
				path2Root += "../";
			});
			return path2Root;
		};
		this.getProductiveAndTestPaths = function() {
			var component4Test, component4Productive;
			var path2Root = this.getPathUpToRoot();
			if (this.isOnKarma()) {
				modulePath = sap.ui.require.toUrl(namespace.replace(/\./g, "/")); // assumed to be set by the Karma configuration!
				modulePath = modulePath.split("/sap")[0];
				return { // then pathname === "/debug.html" or "/context.html"
					productivePath : modulePath.replace("test", "main") + "/",
					testPath : modulePath.replace("main", "test") + "/"
				};
			}
			if (this.isOnTomcat()) {
				return {
					productivePath : sap.ui.require.toUrl("") + "/",
					testPath : sap.ui.require.toUrl("").replace("resources", "test-resources") + "/"
				};
			}
			component4Productive = this.composePrefix(modulePathPrefixProductive);
			component4Test = this.composePrefix(modulePathPrefixTest);
			return {
				productivePath : path2Root + component4Productive,
				testPath : path2Root + component4Test
			};
		};
		/**
		 * Registers the module name on the corresponding folder path containing the productive code area.
		 * @param {string} sModuleName An empty string or undefined parameter will be mapped to the default of getModulePath().
		 */
		this.registerModulePathForProductiveResource = function(sModuleName) {
			var sResourceName = sModuleName.replace(/\./g, "/");
			var sPath = this.getProductiveAndTestPaths().productivePath + sResourceName;
			var oPaths = {};
			oPaths[sResourceName] = sPath;
			sap.ui.loader.config({
				paths: oPaths
			});
		};
		/**
		 * Registers the module name on the corresponding folder path containing the productive code area.
		 * @param {string} sModuleName An empty string or undefined parameter will be mapped to the default of getModulePath().
		 */
		this.registerModulePathForTestResource = function(sModuleName) {
			var sResourceName = sModuleName.replace(/\./g, "/");
			var sPath = this.getProductiveAndTestPaths().testPath + sResourceName;
			var oPaths = {};
			oPaths[sResourceName] = sPath;
			sap.ui.loader.config({
				paths: oPaths
			});
		};
	}

	exportToGlobal("sap.apf.testhelper.PathMap", PathMap);

	return PathMap;
});
