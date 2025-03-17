/*global QUnit, sinon*/
sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/type/StringNullable",
	"sap/ui/comp/smartfield/type/Guid",
	"sap/ui/comp/smartfield/type/TextArrangement",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/comp/smartfield/type/TextArrangementGuid",
	"sap/ui/core/Lib",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/m/Input",
	"sap/ui/model/odata/v2/ODataModel"
], function(
	library,
	StringType,
	GuidType,
	TextArrangement,
	TextArrangementString,
	TextArrangementGuid,
	Library,
	ParseException,
	ValidateException,
	SmartField,
	ODataControlFactory,
	Input,
	ODataModel
) {
	"use strict";

	QUnit.module("");

	QUnit.test("with String type as primary type, it should format the value to an empty string (description only test case)", function (assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangement.prototype, "getPrimaryType").returns(StringType);

		// system under test
		var oType = new TextArrangement(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), null);

		// cleanup
		oType.destroy();
		fnStubGetPrimaryType.restore();
	});

	QUnit.test("with String type as primary type, it should the correct error message when maxLength property is set (description only test case)", function (assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oConstraints = {
			maxLength: 5
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangement.prototype, "getPrimaryType").returns(StringType);
		// system under test
		var oType = new TextArrangementString(oFormatOptions, oConstraints, oSettings);

		try {
			oType.validateValue(["Lorem Ipsum", null]);
		} catch (oException) {
			// assert
			assert.strictEqual(oException.message, Library.getResourceBundleFor("sap.ui.comp").getText("ENTER_A_VALID_VALUE"));
		}

		// cleanup
		oType.destroy();
		fnStubGetPrimaryType.restore();
	});

	QUnit.test("with Guid type as primary type, it should format the value to an empty string (description only test case)", function (assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangement.prototype, "getPrimaryType").returns(GuidType);

		// system under test
		var oType = new TextArrangement(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), null);

		// cleanup
		oType.destroy();
		fnStubGetPrimaryType.restore();
	});

	QUnit.test("with Guid type as primary type, it should show the correct error message when invalid value is entered (description only test case)", function (assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangementGuid.prototype, "getPrimaryType").returns(GuidType);
		// system under test
		var oType = new TextArrangementGuid(oFormatOptions, null, oSettings);

		try {
			oType.getPrimaryType().prototype.validateValue.call(oType,"invalidValue");
		} catch (oException) {
			// assert
			assert.strictEqual(oException.message, Library.getResourceBundleFor("sap.ui.comp").getText("ENTER_AN_EXISTING_DESCRIPTION"));
		}

		// cleanup
		oType.destroy();
		fnStubGetPrimaryType.restore();
	});

	QUnit.test("getFilterFields", function (assert) {
		assert.deepEqual(TextArrangement.prototype.getFilterFields(), ["keyField"], "Only the keyField should be returned");
	});

	QUnit.test("parseIDAndDescription reserved characters", function (assert) {
		// Arrange
		var oTA = new TextArrangementString({textArrangement: "descriptionAndId"}, null, {keyField: "ID", descriptionField: "Text"}),
			fnTest = function (sInput, sKey, bIdAndDescription) {
				var sTA = bIdAndDescription ? "idAndDescription" : "descriptionAndId",
					aResult = oTA.parseIDAndDescription(sInput, "string", null, {
					textArrangement: sTA
				});
				assert.strictEqual(aResult[0], sKey, "Key '" + sKey + "' extracted from " + sInput + " in mode " + sTA);
			};

		// NOTE: Not all combinations tested bellow are valid for keys like leading and trailing spaces. Also, some
		// specific characters are considered reserved by the OData URI Convention even if tey would be accepted
		// by the SmartField as input.

		// Assert - description (ID)
		fnTest("Facility (DE) (1)", "1");
		fnTest("(BG) Factory ( 2)", " 2");
		fnTest("(DE) 1 (SoundStation (ST)) (3 )", "3 ");
		fnTest("1) Helicopter ( 4 )", " 4 ");
		fnTest("Bus (2 (~!@#$%^&*_+{}|[]\`-=:\";<>?,./)", "~!@#$%^&*_+{}|[]\`-=:\";<>?,./");
		fnTest("(description) (6)", "6");
		fnTest(")))))()((((( (7  7)", "7  7");

		// Assert - ID (description)
		fnTest("1 (Facility (DE))", "1", true);
		fnTest(" 2 ((BG) Factory)", " 2", true);
		fnTest("3  ((DE) 1 (SoundStation (ST)))", "3 ", true);
		fnTest(" 4  (1) Helicopter)", " 4 ", true);
		fnTest("~!@#$%^&*_+{}|[]\`-=:\";<>?,./ (Bus (2)", "~!@#$%^&*_+{}|[]\`-=:\";<>?,./", true);
		fnTest("6 ((description))", "6", true);
		fnTest("7  7 ()))))()((((()", "7  7", true);

		// Cleanup
		oTA.destroy();
	});

	QUnit.test("with String type as primary type, it should parse the value to UpperCase (description only test case)", function (assert) {

		// arrange
		var done = assert.async(),
			vValue = "ff",
			sSourceType = "string",
			aCurrentValues = [undefined, undefined],
			oFormatOptions = {
				textArrangement: "descriptionOnly",
				displayFormat: "UpperCase"
			};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangement.prototype, "getPrimaryType").returns(StringType);

		// system under test
		var oType = new TextArrangement(oFormatOptions, null, oSettings);
		sinon.stub(oType, "onBeforeValidateValue").callsFake(function(vValue, oOnBeforeValidateValueSettings){
			oOnBeforeValidateValueSettings.success([{"Text": vValue.toUpperCase()}]);
		});

		//Act
		oType.parseValue(vValue, sSourceType, aCurrentValues).then(function(aValues){
			// assert
			assert.equal(oType.onBeforeValidateValue.getCall(0).args[0], vValue.toUpperCase());

			// cleanup
			oType.destroy();
			fnStubGetPrimaryType.restore();
			done();
		});
	});
});
