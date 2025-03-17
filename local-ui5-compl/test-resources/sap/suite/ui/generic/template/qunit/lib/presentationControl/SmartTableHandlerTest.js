/**
 * tests for the sap.suite.ui.generic.template.lib.presentationControl.SmartTableHandler.js
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/genericUtilities/controlHelper",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/presentationControl/SmartTableHandler"],
	function(sinon, controlHelper, testableHelper, SmartTableHandler) {
	"use strict";

	// Variables defined (but not necessarily initialized) in global closure:
	// 1. global test objects (same for all tests)
	var oSandbox;
	var oStubForPrivate;

	// 2. SUT. Can be the same or different ones for different modules 
	var oSmartTableHandler;
	
	// 3. parameters needed for creation of SUT (including static dependencies)
	var oSmartTable = {};
	var oInnerTable = { };
	var oController, oCommonUtils, oComponentUtils;
	var sType;

	function fnCommonBeforeEach(){
		oSandbox = sinon.sandbox.create();
		oSandbox.stub(oSmartTable, "getTable").returns(oInnerTable);
		oSandbox.stub(controlHelper, "isMTable", function(oTable){
			return (oTable === oInnerTable) ? sType === "sap/m/Table" : "The wrong instance was passed as inner table";
		});
		oSandbox.stub(controlHelper, "isUiTable", function(oTable){
			return (oTable === oInnerTable) ? (sType === "sap/ui/table/Table" || sType === "sap/ui/table/TreeTable"): "The wrong instance was passed as inner table";
		});
		oSandbox.stub(controlHelper, "isTreeTable", function(oTable){
			return (oTable === oInnerTable) ? sType === "sap/ui/table/TreeTable" : "The wrong instance was passed as inner table";
		});
	}
	
	function fnCommonAfterEach(){
		oSandbox.restore();
		sType = "";
	}
	
	QUnit.module("SmartTableHandler constructor", {
		beforeEach: fnCommonBeforeEach,
		afterEach: fnCommonAfterEach
	}, function(){
		QUnit.test("SmartTableHandler instance creation", function(assert) {
			// arrange
			sType = "sap/m/Table";
			try {
				// act
				oSmartTableHandler = new SmartTableHandler(oController, oCommonUtils, oComponentUtils, oSmartTable);	
				// assert
				assert.ok(oSmartTableHandler, "oSmartTableHandler instance creation was successfull");
				assert.strictEqual(oSmartTableHandler.isMTable(), true, "An MTable was tested");
			} catch (oError) {
				assert.notOk(oError, "oSmartTableHandler instance creation was not successfull");
			}
		});
		QUnit.test("SmartTableHandler instance creation", function(assert) {
			// arrange
			sType = "sap.ui/table/Table";
			try {
				// act
				oSmartTableHandler = new SmartTableHandler(oController, oCommonUtils, oComponentUtils, oSmartTable);	
				// assert
				assert.ok(oSmartTableHandler, "oSmartTableHandler instance creation was successfull");
				assert.notOk(oSmartTableHandler.isMTable(), "A UiTable was tested");
			} catch (oError) {
				assert.notOk(oError, "oSmartTableHandler instance creation was not successfull");
			}
		});		
	});


	QUnit.module("Analyze Grid table", {
		beforeEach: function() {
			// initialize global test objects
			fnCommonBeforeEach();
			oStubForPrivate = testableHelper.startTest();
			sType = "sap/ui/table/Table";
			oSmartTableHandler = new SmartTableHandler(oController, oCommonUtils, oComponentUtils, oSmartTable);
			oSandbox.stub(oInnerTable, "getContextByIndex", function(i) {
				switch (i) {
					case 0:
						return {
							getPath: function() {
								return "path0";
							}
						};
					case 1:
						return {
							getPath: function() {
								return "path1";
							}
						};
					case 2:
						return {
							getPath: function() {
								return "path2";
							}
						};
				}
				return null;
			});
		},
		afterEach: function() {
			testableHelper.endTest();
			fnCommonAfterEach();
		}
	}, function(){
		QUnit.test("getGridTableRowIndexFromContext function returns correct index 1", function(assert) {
			//arrange
			var oContext = {
				getPath: function () {
					return "path4";
				}
			};
			var iExpected = -1;
			//act
			var iResult = oStubForPrivate.getGridTableRowIndexFromContext(oContext);
			//assert
			assert.equal(iResult, iExpected, "correct index is calculated")
		});
		QUnit.test("getGridTableRowIndexFromContext function returns correct index -1", function(assert) {
			//arrange
			var oContext = {
				getPath: function () {
					return "path1";
				}
			};
			var iExpected = 1;
			//act
			var iResult = oStubForPrivate.getGridTableRowIndexFromContext(oContext);
			//assert
			assert.equal(iResult, iExpected, "correct index is calculated")
		});
		QUnit.test("getGridTableRow function returns correct table row", function(assert) {
			//prepare
			var oContext = {
				getPath: function () {
					return "path1";
				}
			};
			oSandbox.stub(oInnerTable, "getFirstVisibleRow").returns(0);
			oSandbox.stub(oInnerTable, "getVisibleRowCount").returns(5);
			var aRows = [{sId: "1"}, {sId: "2"}, {sId: "3"}, {sId: "4"}, {sId: "5"}];
			oSandbox.stub(oInnerTable, "getRows").returns(aRows);
			//act
			var oExpected = aRows[1];
			var oResult = oStubForPrivate.getGridTableRow(oContext);
			//assert
			assert.deepEqual(oResult, oExpected, "correct table row is returned")
			//clean
		});		
	});
});