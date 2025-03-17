/*global QUnit sinon*/

sap.ui.define([
	"sap/ui/qunit/utils/nextUIUpdate",
	"test-resources/sap/ui/comp/qunit/smartmultiedit/TestUtils",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/ui/comp/smartmultiedit/Container",
	"sap/ui/core/util/MockServer",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/Context",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (nextUIUpdate, TestUtils, Field, Container, MockServer, SmartForm, Group, GroupElement, ODataModel,
             ResourceModel, Context, NumberFormat, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("Special Case: EntitySet is creatable and has updatable path", {
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer("metadataSpecialCase.xml", "smartmultiedit.EmployeesUpdatable/");
			this.i18nModel = TestUtils.createI18nModel();

			TestUtils.createDataModel("smartmultiedit.EmployeesUpdatable", "EmployeesUpdatable").then(async function(oData) {
				this.oDataModel = oData.oModel;

				var aContexts = [
					new Context(this.oDataModel, "/EmployeesUpdatable('0001')"),
					new Context(this.oDataModel, "/EmployeesUpdatable('0003')")
				];

				this.oContainer = TestUtils.createContainer(aContexts, this.oDataModel, this.i18nModel, TestUtils.createSimpleSmartForm(["FirstName"]), "EmployeesUpdatable");
				this.oContainer.placeAt("content");
				await nextUIUpdate();
				fnDone();
			}.bind(this));
		},
		afterEach: function () {
			this.oContainer.destroy();
			TestUtils.destroyMockServer();
		}
	});

	QUnit.test("Basic Checks: Number of fields", function (assert) {
		assert.equal(this.oContainer.getFields().length, 1, "Container has 1 field");
	});

	QUnit.test("Check if field is editable", function (assert) {
		var oFirstNameField = this.oContainer.getFields()[0];
		return oFirstNameField._pInitialised.then(async function() {
			oFirstNameField.focus();
			oFirstNameField._updateSpecialSelectItems();

			assert.strictEqual(oFirstNameField.getSmartField().getFirstInnerControl().getDomRef(), null, "Smart Field not rendered on inital load");

			oFirstNameField.setSelectedIndex(2);
			await nextUIUpdate();

			assert.ok(!!oFirstNameField.getSmartField().getDomRef(), "Smart Field rendered when item is selected");
			assert.equal(oFirstNameField.getSmartField().getEditable(), true, "Smart Field should be editable.");
		});
	});

	QUnit.test("resetContainer Test", function (assert) {
		var oFirstNameField = this.oContainer.getFields()[0],
			fnDone = assert.async();

		oFirstNameField._pInitialised.then(function () {
			assert.equal(oFirstNameField.getSmartField().getEditable(), true, "Smart Field should be editable.");
			fnDone();
		});

		this.oContainer.resetContainer();
	});

	QUnit.test("Check if field is editable on modelContextChange", function (assert) {
		var oFirstNameField = this.oContainer.getFields()[0],
			fnDone = assert.async();

		this.oDataModel.metadataLoaded().then(async function() {
			var oModel = this.oContainer.getModel(),
				oContext = oModel.createEntry("/EmployeesUpdatable", {
				groupId: "changes"
			});

			this.oContainer.setBindingContext(oContext);
			oFirstNameField.setSelectedIndex(2);
			await nextUIUpdate();

			oFirstNameField._pInitialised.then(function () {
				assert.equal(oFirstNameField.getSmartField().getContextEditable(), true, "Smart Field should be editable.");
				fnDone();
			});
		}.bind(this));
	});

	QUnit.module("Special cases");
	QUnit.test("Combo box without text annotation returns row value", function (assert) {
		var oMockServer = TestUtils.createMockServer("metadata.xml"),
			i18nModel = TestUtils.createI18nModel();

		return TestUtils.createDataModel().then(function (oData) {
			var oDataModel = oData.oModel;

			var aContexts = [
				new Context(oDataModel, "/Employees('0002')"),
				new Context(oDataModel, "/Employees('0003')")
			];

			var oContainer = TestUtils.createContainer(aContexts, oDataModel, i18nModel, TestUtils.createSimpleSmartForm(["GenderWithoutText"]));
			oContainer.placeAt("content");
			var oField = oContainer.getFields()[0];
			// eslint-disable-next-line max-nested-callbacks
			return oField._pInitialised.then(async function() {
				oField.focus();
				oField._updateSpecialSelectItems();
				oField.setSelectedIndex(1);
				await nextUIUpdate();

				var oValue = oField.getRawValue();
				assert.equal(Object.keys(oValue).length, 1, "Row value return only one value");
				assert.strictEqual(oValue["GenderWithoutText"], "", "GenderWithoutText value returned");

				oContainer.destroy();
				oMockServer.destroy();
				TestUtils.destroyMockServer();
			});
		});
	});

	QUnit.test("Combo box without text annotation fallback value to key", function(assert){
		var oMockServer = TestUtils.createMockServer("metadata.xml"),
			i18nModel = TestUtils.createI18nModel();

			return TestUtils.createDataModel().then(function (oData) {
				var oDataModel = oData.oModel;

				var aContexts = [
					new Context(oDataModel, "/Employees('0002')"),
					new Context(oDataModel, "/Employees('0003')")
				];
				var oContainer = TestUtils.createContainer(aContexts, oDataModel, i18nModel, TestUtils.createSimpleSmartForm(["Gender"]));
				oContainer.placeAt("content");
				var oField = oContainer.getFields()[0];

				sinon.stub(oField, "getRecordTextPath").returns(null);
				sinon.stub(oField, "isComboBox").returns(true);
				sinon.stub(oField, "_setSmartFieldDisplayText").returns('');
				sinon.stub(oField.getSmartField(), "_getEmbeddedSmartFieldByMode");
				return oField._pInitialised.then(function () {
					var aAllKeys = Object.keys(oField._mRecordKeyTextMap);
					var aAllValues = Object.values(oField._mRecordKeyTextMap);
					aAllKeys.map(function(sKey, ind) {
						var sVal = aAllValues[ind];
						assert.equal(sKey, sVal, "Text is falling back to key");
					});
					oContainer.destroy();
					oMockServer.destroy();
					TestUtils.destroyMockServer();
				});
			});
	});
});
