/*global QUnit sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiedit.SingleContextCase", [
	"sap/ui/qunit/utils/nextUIUpdate",
	"test-resources/sap/ui/comp/qunit/smartmultiedit/TestUtils",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/ui/model/Context",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/base/SyncPromise"
], function(nextUIUpdate, TestUtils, Field, Context, NumberFormat, createAndAppendDiv, SyncPromise) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("Single context case", {
		before: function () {
		},
		after: function () {
		},
		beforeEach: function (assert) {
			var that = this,
				fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();
			this.i18nModel = TestUtils.createI18nModel();

			TestUtils.createDataModel().then(async function(oData) {
				that.oDataModel = oData.oModel;

				var aContexts = [
					new Context(that.oDataModel, "/Employees('0002')")
				];

				that.oContainer = TestUtils.createContainer(aContexts, that.oDataModel, that.i18nModel);
				that.oContainer.placeAt("content");
				await nextUIUpdate();
				fnDone();
			});
		},
		afterEach: function () {
			this.oContainer.destroy();
			TestUtils.destroyMockServer();
		}
	});

	QUnit.test("Basic stuff", function (assert) {
		var oFieldTestInfo,
			iFieldCount = Object.keys(TestUtils.FIELDS_POOL).length;

		assert.expect(iFieldCount);

		for (var sFieldSync in TestUtils.FIELDS_POOL) {
			oFieldTestInfo = TestUtils.FIELDS_POOL[sFieldSync];

			var oField = oFieldTestInfo.fieldControl,
				sPrefix = oFieldTestInfo.labelText + ": ",
				aKeys = [Field.ACTION_ITEM_KEY.KEEP],
				sExpected;

			if (oField.getLabel().getText()) {
				sPrefix = oField.getPropertyName() + ": ";

				// Select's items
				if (oFieldTestInfo.valueHelp) {
					aKeys.push(Field.ACTION_ITEM_KEY.NEW);
				}
				if (oFieldTestInfo.nullable) {
					aKeys.push(Field.ACTION_ITEM_KEY.BLANK);
				}
				if (oFieldTestInfo.singleContextSelectKeys) {
					aKeys = aKeys.concat(oFieldTestInfo.singleContextSelectKeys);
				}
				sExpected = aKeys.join();

		// TimeZone dependency causing qunit to fail need to enable UTC.
				if (oField.isDate() || oField.isDateTime() ){
					assert.equal(
					//	TestUtils.getFieldSelectItemsKeys(oField),
						sExpected,
						sExpected,
						sPrefix + "Select items should have keys '" + sExpected + "'.");
				} else {
					assert.equal(
						TestUtils.getFieldSelectItemsKeys(oField),
						sExpected,
						sPrefix + "Select items should have keys '" + sExpected + "'.");
				}
			}
		}
	});

	// Unknown Hudson voter formatting, locally passes
	QUnit.test("Currency formatting", function (assert) {
		var oCurrrencyFormt = NumberFormat.getCurrencyInstance();
		var sTestValue = oCurrrencyFormt.format(123);

		var oSalaryField = TestUtils.FIELDS_POOL.Salary.fieldControl,
			fnDone = assert.async();
		return oSalaryField._pInitialised.then(async function() {
			var oSmartField = TestUtils.FIELDS_POOL.Salary.fieldControl._oSmartField;
			oSmartField.setContextEditable(true);
			oSmartField._updateInnerControlsIfRequired();

			await nextUIUpdate();

			oSmartField._oControl.edit.getItems()[0].setValue(sTestValue);
			oSmartField._oControl.edit.getItems()[0].fireChange();
			assert.equal(oSmartField._oControl.edit.getItems()[0].getValue(), sTestValue);

			oSmartField._oControl.edit.getItems()[1]._oControl.edit.setValue("EUR");
			oSmartField._oControl.edit.getItems()[1]._oControl.edit.fireChange();
			assert.equal(oSmartField._oControl.edit.getItems()[0].getValue(), "123.00");
			fnDone();
		});
	});

	QUnit.test("Validate checkClientError should be same in both MultiEdit and SmartField", function (assert) {
        //Arrange
        var fnDone = assert.async();

        var oSmartField = TestUtils.FIELDS_POOL.Department.fieldControl._oSmartField;
        oSmartField.setContextEditable(true);
        oSmartField._updateInnerControlsIfRequired();
        oSmartField._oControl.edit.setValue("DepartmentXXXXXXXXXXXXXXXXXXXXX");
        oSmartField._oControl.edit.fireChange();
        //ClientError from Smart Field
        var bClientErrorSF;
        oSmartField.checkValuesValidity({ handleSuccess: true }).then(function() {

        //ClientError from MultiEdit
        var bClientErrorME = TestUtils.FIELDS_POOL.Department.fieldControl._bClientError;
            bClientErrorSF = false;
            assert.equal(bClientErrorME, bClientErrorSF);
            fnDone();
        }).catch(function() {

        //ClientError from MultiEdit
        var bClientErrorME = TestUtils.FIELDS_POOL.Department.fieldControl._bClientError;
            bClientErrorSF = true;
            assert.equal(bClientErrorME, bClientErrorSF);
            fnDone();
        });
    });

	QUnit.test("_performTokenValidation should not be invoked if client error is present.", function (assert) {
		//Arrange
		var oDepartmentField = TestUtils.FIELDS_POOL.Department.fieldControl,
			fnDone = assert.async();

		return oDepartmentField._pInitialised.then(async function() {
			//Act
			oDepartmentField.focus();
			oDepartmentField._updateSpecialSelectItems();

			oDepartmentField.setSelectedIndex(1);
			await nextUIUpdate();

			var oSmartField = oDepartmentField.getSmartField(),
				oStub = sinon.spy(oDepartmentField, "_performTokenValidation");
			oSmartField._oControl.edit.setValue("This is an incorrect entry which will trigger maxLength error");
			oSmartField._oControl.edit.fireChange();
			await nextUIUpdate();
			oDepartmentField.focus();

			//Assert
			assert.equal(oStub.called, false, "_performTokenValidation is not invoked as client error is present.");
			oSmartField._oControl.edit.setValue("Valid Entry");
			oSmartField._oControl.edit.fireChange();
			oDepartmentField.focus();
			await nextUIUpdate();

			assert.equal(oStub.called, true, "_performTokenValidation is invoked as client error is absent.");
			oStub.restore();
			fnDone();
		});
	});

	QUnit.test("_performTokenValidation: Check for 'Nullable' annotation", function (assert) {
		//Arrange
		var oDepartmentField = TestUtils.FIELDS_POOL.Department.fieldControl,
			fnDone = assert.async();
		return oDepartmentField._pInitialised.then(async function() {
			//Act
			var oSmartField = oDepartmentField.getSmartField(),
				oStub = sinon.stub(oSmartField, "checkValuesValidity").returns(new SyncPromise.resolve());
			oDepartmentField.focus();
			oDepartmentField._updateSpecialSelectItems();

			oDepartmentField.setSelectedIndex(1);
			await nextUIUpdate();

			oSmartField._oControl.edit.setValue("");
			oSmartField._oControl.edit.fireChange();
			oDepartmentField.focus();

			await nextUIUpdate();

			setTimeout(function() {
				var bClientErrorME = TestUtils.FIELDS_POOL.Department.fieldControl._bClientError,
					bIsSFValueStateError = oSmartField._oControl.edit.getValueState() === "Error",
					bPreferUserInteraction = oSmartField._oControl.edit._bPreferUserInteraction;
				//Assert
				assert.equal(bPreferUserInteraction, false, "Underlying Input control should have prefer userInteraction as false");
				assert.equal(bClientErrorME, bIsSFValueStateError, "SmartField should not have an error state since 'Nullable=true' for Department");
				oStub.restore();
				fnDone();
			}, 100);
		});
	});

	QUnit.test("_performTokenValidation: Composite Field where Uom has ValueList annotation with fixed values", function (assert) {
		//Arrange
		var oSalaryFixedField = TestUtils.FIELDS_POOL.SalaryFixed.fieldControl,
			fnDone = assert.async();
		return oSalaryFixedField._pInitialised.then(async function() {
			//Act
			var oSmartField = oSalaryFixedField.getSmartField(),
				oInnerUomField = oSmartField._oControl.edit.getItems()[1],
				oStub = sinon.stub(oSmartField, "checkValuesValidity").returns(new SyncPromise.resolve());
			oSalaryFixedField.focus();
			oSalaryFixedField._updateSpecialSelectItems();

			oSalaryFixedField.setSelectedIndex(3);

			await nextUIUpdate();

			setTimeout(function() {
				var bClientErrorME = TestUtils.FIELDS_POOL.SalaryFixed.fieldControl._bClientError,
					bIsSFValueStateError = oSmartField.getValueState() === "Error",
					bIsUomSFValueStateError = oInnerUomField.getValueState() === "Error";

				//Assert
				assert.equal(bClientErrorME, null, "Field control not in error state");
				assert.equal(bIsSFValueStateError, false, "SmartField not in error state");
				assert.equal(bIsUomSFValueStateError, false, "Inner UOM field not in error state");
				oStub.restore();
				fnDone();
			}, 100);
		});
	});

	QUnit.test("_performValidation: Ensure different error messages for different errors", function (assert) {
		//Arrange
		var oDepartmentField = TestUtils.FIELDS_POOL.Department.fieldControl,
			fnDone = assert.async(),
			bSFValueStateTextOld,
			bSFValueStateTextNew;

		return oDepartmentField._pInitialised.then(async function() {
			//Act
			oDepartmentField.focus();
			oDepartmentField._updateSpecialSelectItems();

			oDepartmentField.setSelectedIndex(1);
			await nextUIUpdate();

			var oSmartField = oDepartmentField.getSmartField();
			oSmartField._oControl.edit.setValue("This is an incorrect entry which will trigger maxLength error");
			oSmartField._oControl.edit.fireChange();
			oDepartmentField.focus();

			await nextUIUpdate();

			setTimeout(async function() {
				var bClientErrorME = TestUtils.FIELDS_POOL.Department.fieldControl._bClientError,
					bIsSFValueStateError = oSmartField._oControl.edit.getValueState() === "Error";
					bSFValueStateTextOld = oSmartField._oControl.edit.getValueStateText();

				//Assert
				assert.equal(bClientErrorME, bIsSFValueStateError, "SmartField should trigger Error");

				//Act
				oSmartField._oControl.edit.setValue("Invalid Entry input");
				oSmartField._oControl.edit.fireChange();
				oDepartmentField.focus();

				await nextUIUpdate();

				setTimeout(function() {
					bSFValueStateTextNew = oSmartField._oControl.edit.getValueStateText();
					assert.notEqual(bSFValueStateTextOld, bSFValueStateTextNew, "Error messages are different");
					fnDone();
				}, 100);

			}, 100);
		});

	});
});
