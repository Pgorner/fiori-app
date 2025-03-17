/*global QUnit*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.FixedValuesWithBinding", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"sap/ui/qunit/utils/nextUIUpdate",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, nextUIUpdate, TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("fixed-values binding context", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(async function(oModel) {
				that.oModel = oModel;

				that.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/Description"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				that.oSmartMultiInput.placeAt("content");
				await nextUIUpdate();

				that.oSmartMultiInput.attachInnerControlsCreated(function() {
					that.oSmartMultiInput._oMultiInput.getBinding("tokens").attachDataReceived(function (oEvent) {
						that.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					});
				});
			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestKeys = ["Projector", "Laptop"];

		var aKeys = this.oSmartMultiInput._oMultiComboBox.getSelectedKeys();

		for (var i = 0; i < mTestKeys.length; i++) {
			assert.equal(aKeys[i], mTestKeys[i], "key is correct");
		}

		assert.ok(this.oSmartMultiInput._oMultiComboBox, "multiComboBox is used");
	});

	QUnit.test("MultiComboBox items", function (assert) {
		var aTestItems = [
			{
				key: "Laptop",
				text: "Laptop"
			},
			{
				key: "Projector",
				text: "Projector"
			},
			{
				key: "Soundstation",
				text: "Soundstation"
			}
		];

		var aSuggestItems = this.oSmartMultiInput._oMultiComboBox.getItems();

		for (var i = 0; i < aSuggestItems.length; i++) {
			assert.equal(aSuggestItems[i].getKey(), aTestItems[i].key, "key is correct");
			assert.equal(aSuggestItems[i].getText(), aTestItems[i].text, "text is correct");
		}
	});

	QUnit.test("Helper Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oMultiInput.getBinding("tokens");
		assert.equal(oBinding.mParameters, undefined, "select parameters are undefined");
	});

	QUnit.test("Helper Multi Input's token data", function (assert) {
		var aTestDataKeys = ["CategoryId", "Description", "Price", "ProductId", "Boolean", "DateTime", "Decimal", "DateTimeOffset", "Guid", "Salary", "SalaryUnit", "__metadata", "Product"];
		for (var i = 0; i < this.data.length; i++) {
			var aResultKeys = Object.keys(this.data[i]);
			assert.deepEqual(aResultKeys, aTestDataKeys, "Right data is returned");
		}
	});

	QUnit.module("fixed-values binding context - odata select enabled", {
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(async function(oModel) {
				that.oModel = oModel;

				that.oSmartMultiInput = new SmartMultiInput({
					enableODataSelect: true,
					value: {
						path: "Categories/Description"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				that.oSmartMultiInput.placeAt("content");
				await nextUIUpdate();

				that.oSmartMultiInput.attachInnerControlsCreated(function() {
					that.oSmartMultiInput._oMultiInput.getBinding("tokens").attachDataReceived(function (oEvent) {
						that.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					});
				});
			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestKeys = ["Projector", "Laptop"];

		var aKeys = this.oSmartMultiInput._oMultiComboBox.getSelectedKeys();

		for (var i = 0; i < mTestKeys.length; i++) {
			assert.equal(aKeys[i], mTestKeys[i], "key is correct");
		}

		assert.ok(this.oSmartMultiInput._oMultiComboBox, "multiComboBox is used");
	});
	QUnit.test("Helper Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oMultiInput.getBinding("tokens");
		assert.equal(oBinding.mParameters.select, "Description", "select parameters are correct");
	});

	QUnit.test("Helper Multi Input's token data", function (assert) {
		var aTestDataKeys = ["__metadata", "Description"];
		for (var i = 0; i < this.data.length; i++) {
			var aResultKeys = Object.keys(this.data[i]);
			assert.deepEqual(aResultKeys, aTestDataKeys, "Right data is returned");
		}
	});

	QUnit.module("fixed-values binding context - odata select enabled and requestAtLeastFields provided", {
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(async function(oModel) {
				that.oModel = oModel;

				that.oSmartMultiInput = new SmartMultiInput({
					enableODataSelect: true,
					requestAtLeastFields: "CategoryId,ProductId",
					value: {
						path: "Categories/Description"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				that.oSmartMultiInput.placeAt("content");
				await nextUIUpdate();

				that.oSmartMultiInput.attachInnerControlsCreated(function() {
					that.oSmartMultiInput._oMultiInput.getBinding("tokens").attachDataReceived(function (oEvent) {
						that.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					});
				});
			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestKeys = ["Projector", "Laptop"];

		var aKeys = this.oSmartMultiInput._oMultiComboBox.getSelectedKeys();

		for (var i = 0; i < mTestKeys.length; i++) {
			assert.equal(aKeys[i], mTestKeys[i], "key is correct");
		}

		assert.ok(this.oSmartMultiInput._oMultiComboBox, "multiComboBox is used");
	});

	QUnit.test("Helper Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oMultiInput.getBinding("tokens");
		assert.equal(oBinding.mParameters.select, "Description,CategoryId,ProductId", "select parameters are correct");
	});

	QUnit.test("Helper Multi Input's token data", function (assert) {
		var aTestDataKeys = ["__metadata", "Description", "CategoryId", "ProductId"];
		for (var i = 0; i < this.data.length; i++) {
			var aResultKeys = Object.keys(this.data[i]);
			assert.deepEqual(aResultKeys, aTestDataKeys, "Right data is returned");
		}
	});
});
