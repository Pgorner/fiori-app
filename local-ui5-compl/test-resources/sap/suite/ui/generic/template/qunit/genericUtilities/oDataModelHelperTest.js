sap.ui.define([
	"sap/suite/ui/generic/template/genericUtilities/oDataModelHelper"
],function(oDataModelHelper) {
	"use strict";
	QUnit.module("genericUtilities.oDataModelHelper");

	QUnit.test("Split access path no navigation property", function (assert) {
		var sAccessPath = "abc";
		var oAccessPathInfo = oDataModelHelper.splitAccessPath(sAccessPath);
		assert.deepEqual(oAccessPathInfo, {
			navigationPath: "",
			property: "abc"
		});
	});

	QUnit.test("Split access path simple navigation property", function (assert) {
		var sAccessPath = "abc/def";
		var oAccessPathInfo = oDataModelHelper.splitAccessPath(sAccessPath);
		assert.deepEqual(oAccessPathInfo, {
			navigationPath: "/abc",
			property: "def"
		});
	});

	QUnit.test("Split access path complex navigation property", function (assert) {
		var sAccessPath = "abc/def/g";
		var oAccessPathInfo = oDataModelHelper.splitAccessPath(sAccessPath);
		assert.deepEqual(oAccessPathInfo, {
			navigationPath: "/abc/def",
			property: "g"
		});				
	});
	
	QUnit.test("Split access path complex absoulte navigation property (not recommended use-case)", function (assert) {
		var sAccessPath = "/abc/def/g";
		var oAccessPathInfo = oDataModelHelper.splitAccessPath(sAccessPath);
		assert.deepEqual(oAccessPathInfo, {
			navigationPath: "//abc/def",
			property: "g"
		});
	});			
});