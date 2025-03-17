sap.ui.define([
	"sap/ui/comp/providers/TokenParser",
	"sap/m/MultiInput",
	"sap/ui/comp/library",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/model/type/DateTime",
	"sap/ui/model/type/Float",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/String",
	"sap/ui/model/odata/type/String",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/thirdparty/qunit-2",
	"sap/ui/thirdparty/sinon"
], function (TokenParser, MultiInput, library, FormatUtil, TypeDateTime, TypeFloat, TypeInteger, TypeString, ODataTypeString, MetadataAnalyser, QUnit, sinon) {
	"use strict";

	QUnit.module("Testing Public API", {
		beforeEach: function () {
			this.oTokenParser = new TokenParser();
		},
		afterEach: function () {
			this.oTokenParser.destroy();
			delete this.oTokenParser;
		}
	});

	QUnit.test("Test defaultOperation", function (assert) {
		assert.equal(this.oTokenParser.getDefaultOperation(), undefined, "defaultOperation should be undefined");
		this.oTokenParser.setDefaultOperation("EQ");
		assert.equal(this.oTokenParser.getDefaultOperation(), "EQ", "defaultOperation should be EQ");
	});

	QUnit.test("Test getOperation", function (assert) {
		assert.equal(this.oTokenParser.getOperation("foo"), undefined, "getOperation should return undefined");
		assert.notEqual(this.oTokenParser.getOperation("EQ"), undefined, "getOperation should return object");
	});

	QUnit.test("Test removeOperation", function (assert) {
		this.oTokenParser.removeOperation("EQ");
		assert.equal(this.oTokenParser.getOperation("EQ"), undefined, "getOperation should return undefined");
		this.oTokenParser.removeAllOperations();
		assert.equal(Object.keys(this.oTokenParser.getOperations()).length, 0, "getOperations should return empty list");
	});

	QUnit.test("Test getTranslatedText", function (assert) {
		assert.equal(this.oTokenParser.getTranslatedText("default", this.oTokenParser.getOperation("EQ")), "equal to", "getTranslatedText should return 'equal to'");
		assert.equal(this.oTokenParser.getTranslatedText("default", this.oTokenParser.getOperation("GT")), "greater than", "getTranslatedText should return 'greater than");
		assert.equal(this.oTokenParser.getTranslatedText("date", this.oTokenParser.getOperation("GT")), "after", "getTranslatedText should return 'after'");
	});

	QUnit.test("Test associateInput", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		assert.equal(oInput.getValidators().length, 1, "1 validator must be attached");
	});

	QUnit.test("Test validate all operations for string type", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var fnTokenValidator = oInput.getValidators()[0];
		var oToken = fnTokenValidator({ text: "foo" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "key", type: "string", oType: new TypeString()});

		var aTests = [
			{text: "foo", token: "=foo", exclude: false, keyField: "key", operation: "EQ", value1: "foo"},
			{text: ">=100", token: ">=100", exclude: false, keyField: "key", operation: "GE", value1: "100"},
			{text: ">100", token: ">100", exclude: false, keyField: "key", operation: "GT", value1: "100"},
			{text: "<=100", token: "<=100", exclude: false, keyField: "key", operation: "LE", value1: "100"},
			{text: "<100", token: "<100", exclude: false, keyField: "key", operation: "LT", value1: "100"},
			{text: "100...200", token: "100...200", exclude: false, keyField: "key", operation: "BT", value1: "100", value2: "200"},
			{text: "*foo*", token: "*foo*", exclude: false, keyField: "key", operation: "Contains", value1: "foo"},
			{text: "*foo", token: "*foo", exclude: false, keyField: "key", operation: "EndsWith", value1: "foo"},
			{text: "foo*", token: "foo*", exclude: false, keyField: "key", operation: "StartsWith", value1: "foo"},
			{text: "!=foo", token: "!(=foo)", exclude: true, keyField: "key", operation: "EQ", value1: "foo"},
			{text: "!(=foo)", token: "!(=foo)", exclude: true, keyField: "key", operation: "EQ", value1: "foo"},
			{text: "<empty>", token: "<empty>", exclude: false, keyField: "key", operation: "Empty", value1: undefined},
			{text: "!(<empty>)", token: "!(<empty>)", exclude: true, keyField: "key", operation: "Empty", value1: undefined},
			{text: "!>=100", token: "!(>=100)", exclude: true, keyField: "key", operation: "GE", value1: "100"},
			{text: "!(>=100)", token: "!(>=100)", exclude: true, keyField: "key", operation: "GE", value1: "100"},
			{text: "!>100", token: "!(>100)", exclude: true, keyField: "key", operation: "GT", value1: "100"},
			{text: "!(>100)", token: "!(>100)", exclude: true, keyField: "key", operation: "GT", value1: "100"},
			{text: "!<=100", token: "!(<=100)", exclude: true, keyField: "key", operation: "LE", value1: "100"},
			{text: "!(<=100)", token: "!(<=100)", exclude: true, keyField: "key", operation: "LE", value1: "100"},
			{text: "!<100", token: "!(<100)", exclude: true, keyField: "key", operation: "LT", value1: "100"},
			{text: "!(<100)", token: "!(<100)", exclude: true, keyField: "key", operation: "LT", value1: "100"},
			{text: "!100...200", token: "!(100...200)", exclude: true, keyField: "key", operation: "BT", value1: "100", value2: "200"},
			{text: "!(100...200)", token: "!(100...200)", exclude: true, keyField: "key", operation: "BT", value1: "100", value2: "200"},
			{text: "!*foo*", token: "!(*foo*)", exclude: true, keyField: "key", operation: "Contains", value1: "foo"},
			{text: "!(*foo*)", token: "!(*foo*)", exclude: true, keyField: "key", operation: "Contains", value1: "foo"},
			{text: "!*foo", token: "!(*foo)", exclude: true, keyField: "key", operation: "EndsWith", value1: "foo"},
			{text: "!(*foo)", token: "!(*foo)", exclude: true, keyField: "key", operation: "EndsWith", value1: "foo"},
			{text: "!foo*", token: "!(foo*)", exclude: true, keyField: "key", operation: "StartsWith", value1: "foo"},
			{text: "!(foo*)", token: "!(foo*)", exclude: true, keyField: "key", operation: "StartsWith", value1: "foo"}
		];

		this.oTokenParser.setDefaultOperation("EQ");
		aTests.forEach(function (oTest) {
			var oToken = fnTokenValidator({ text: oTest.text }),
				oRange = oToken.data().range;

			assert.strictEqual(oToken.getText(), oTest.token, "validator returns valid Token");
			assert.strictEqual(oRange.exclude , oTest.exclude, "returned range has exclude " + oTest.exclude);
			assert.strictEqual(oRange.keyField, oTest.keyField, "returned range has keyfield '" + oTest.keyField + "'");
			assert.strictEqual(oRange.operation, oTest.operation, "returned range has operation " + oTest.operation);
			assert.strictEqual(oRange.value1, oTest.value1, "returned range has value1 '" + oTest.value1 + "'");
			if (oTest.value2) {
				assert.strictEqual(oRange.value2, oTest.value2, "returned range has value1 '" + oTest.value2 + "'");
			}
		});

		this.oTokenParser.getKeyFields()[0].maxLength = 4;
		oToken = fnTokenValidator({ text: "*fooo*" });
		assert.equal(oToken.getText(), "*fooo*", "validator returns valid Token");
		oToken = fnTokenValidator({ text: "*foooooo*" });
		assert.equal(oToken, null, "validator returns null");

		this.oTokenParser.getKeyFields()[0].displayFormat = "UpperCase";
		oToken = fnTokenValidator({ text: "*fooo*" });
		assert.equal(oToken.getText(), "*FOOO*", "validator returns valid Token");
	});


	QUnit.test("Test validate other types", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var oToken = oInput.getValidators()[0]({ text: "foo" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "float", label: "float", oType: new TypeFloat()});
		this.oTokenParser.addKeyField({key: "int", label: "int", oType: new TypeInteger()});
		this.oTokenParser.addKeyField({key: "date", label: "date", oType: new TypeDateTime()});

		this.oTokenParser.setDefaultOperation("EQ");
		oToken = oInput.getValidators()[0]({ text: "float: 100.11" });
		assert.equal(oToken.getText(), "float: =100.11", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "float", "returned range has keyfield 'key'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1, 100.11, "returned range has value1 100.11");

		oToken = oInput.getValidators()[0]({ text: "int: >100" });
		assert.equal(oToken.getText(), "int: >100", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "int", "returned range has keyfield 'key'");
		assert.equal(oToken.data().range.operation, "GT", "returned range has operation GT");
		assert.equal(oToken.data().range.value1, 100, "returned range has value1 100");

		var oDateType = new TypeDateTime();
		var oToday = new Date();
		var sValue = oDateType.formatValue(oToday, "string");
		oToken = oInput.getValidators()[0]({ text: "date: =" + sValue });
		assert.equal(oToken.getText(), "date: =" + sValue, "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "date", "returned range has keyfield 'key'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1.toDateString(), oToday.toDateString(), "returned range has correct value1");
	});

	QUnit.test("Test validate with maxLength=1", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var oToken = oInput.getValidators()[0]({ text: "foo" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "string", label: "String ", maxLength: 1, oType: new TypeString()});

		this.oTokenParser.setDefaultOperation("EQ");
		oToken = oInput.getValidators()[0]({ text: "f" });
		assert.equal(oToken.getText(), "=f", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "string", "returned range has keyfield 'string'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1, "f", "returned range has value1 f");

		oToken = oInput.getValidators()[0]({ text: ">f" });
		assert.equal(oToken.getText(), ">f", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "string", "returned range has keyfield 'string'");
		assert.equal(oToken.data().range.operation, "GT", "returned range has operation GT");
		assert.equal(oToken.data().range.value1, "f", "returned range has value1 f");

		oToken = oInput.getValidators()[0]({ text: "*f*" });
		assert.equal(oToken, null, "validator returns no Token");

		oToken = oInput.getValidators()[0]({ text: "*f" });
		assert.equal(oToken, null, "validator returns no Token");

		oToken = oInput.getValidators()[0]({ text: "f*" });
		assert.equal(oToken, null, "validator returns no Token");
	});

	QUnit.test("Test validate numc", function (assert) {
		var oInput = new MultiInput();
		this.oTokenParser.associateInput(oInput);
		var oToken = oInput.getValidators()[0]({ text: "123" });
		assert.equal(oToken, null, "validator returns no Token");

		this.oTokenParser.addKeyField({key: "numc", maxLength: 5, type: "numc",
			oType: new ODataTypeString({}, {
				isDigitSequence: true,
				maxLength: 5
			})
		});

		this.oTokenParser.setDefaultOperation("EQ");
		oToken = oInput.getValidators()[0]({ text: "123" });
		assert.equal(oToken.getText(), "=123", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "numc", "returned range has keyfield 'numc'");
		assert.equal(oToken.data().range.operation, "EQ", "returned range has operation EQ");
		assert.equal(oToken.data().range.value1, "00123", "returned range has value1 00123");

		oToken = oInput.getValidators()[0]({ text: "*123*" });
		assert.equal(oToken.getText(), "*123*", "validator returns valid Token text");
		assert.equal(oToken.data().range.exclude , false, "returned range has exclude false");
		assert.equal(oToken.data().range.keyField, "numc", "returned range has keyfield 'numc'");
		assert.equal(oToken.data().range.operation, "Contains", "returned range has operation Contains");
		assert.equal(oToken.data().range.value1, "123", "returned range has value1 123");
	});

	QUnit.test("Type operations", function (assert) {
		// Arrange
		var oTP = new TokenParser();

		// Assert
		assert.strictEqual(
			JSON.stringify(oTP._mTypeOperations),
			'{"default":["EQ","BT","LT","LE","GT","GE","NotEQ","NotBT","NotLT","NotLE","NotGT","NotGE"],' +
			'"string":["Empty","NotEmpty","Contains","EQ","BT","StartsWith","EndsWith","LT","LE","GT","GE","NotEQ","NotContains","NotStartsWith","NotEndsWith","NotBT","NotLT","NotLE","NotGT","NotGE"],' +
			'"date":["Empty","NotEmpty","EQ","BT","LT","LE","GT","GE","NotEQ","NotBT","NotLT","NotLE","NotGT","NotGE"],' +
			'"time":["EQ","BT","LT","LE","GT","GE","NotEQ","NotBT","NotLT","NotLE","NotGT","NotGE"],' +
			'"numeric":["EQ","BT","LT","LE","GT","GE","NotEQ","NotBT","NotLT","NotLE","NotGT","NotGE"],' +
			'"numc":["Contains","EQ","BT","EndsWith","LT","LE","GT","GE","Empty","NotContains","NotEQ","NotBT","NotEndsWith","NotLT","NotLE","NotGT","NotGE"],' +
			'"boolean":["EQ"]}',
			"Type operations list should match"
		);

		// Cleanup
		oTP.destroy();
	});

	QUnit.module("TokenParser create range from text");

	QUnit.test("Should find the proper range operator form a text", function (assert) {
		// Include operators
		var sText = "abc";
		var oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, null, "Range operator should be null");

		//
		sText = FormatUtil.getFormattedRangeText(library.valuehelpdialog.ValueHelpRangeOperation.Empty, null, null, false);
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["Empty"].operator, "Range operator should be 'Empty'");

		//
		sText = "foo...bar";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["BT"].operator, "Range operator should be 'BT'");

		//
		sText = "=foo";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["EQ"].operator, "Range operator should be 'EQ'");

		//
		sText = "*foo*";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["Contains"].operator, "Range operator should be 'Contains'");

		//
		sText = "foo*";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["StartsWith"].operator, "Range operator should be 'StartsWith'");

		//
		sText = "*foo";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["EndsWith"].operator, "Range operator should be 'EndsWith'");

		//
		sText = "<100";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["LT"].operator, "Range operator should be 'LT'");

		//
		sText = "<=100";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["LE"].operator, "Range operator should be 'LE'");

		//
		sText = "> foo";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["GT"].operator, "Range operator should be 'GT'");

		//
		sText = ">=foo";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["GE"].operator, "Range operator should be 'GE'");

		// Exclude operators
		sText = FormatUtil.getFormattedRangeText(library.valuehelpdialog.ValueHelpRangeOperation.Empty, null, null, true);
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotEmpty"].operator, "Range operator should be 'NotEmpty'");

		//
		sText = "!(foo...bar)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotBT"].operator, "Range operator should be 'NotBT'");

		//
		sText = "!(=foo)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotEQ"].operator, "Range operator should be 'NotEQ'");

		//
		sText = "!(*foo*)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotContains"].operator, "Range operator should be 'NotContains'");

		//
		sText = "!(foo*)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotStartsWith"].operator, "Range operator should be 'NotStartsWith'");

		//
		sText = "!(*foo)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotEndsWith"].operator, "Range operator should be 'NotEndsWith'");

		//
		sText = "!(<foo)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotLT"].operator, "Range operator should be 'NotLT'");

		//
		sText = "!(<=foo)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotLE"].operator, "Range operator should be 'NotLE'");

		//
		sText = "!(>foo)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotGT"].operator, "Range operator should be 'NotGT'");

		//
		sText = "!(>=foo)";
		oRangeOperator = TokenParser._matchOperationFromText(sText);

		assert.equal(oRangeOperator, TokenParser.rangeOperations["NotGE"].operator, "Range operator should be 'NotGE'");
	});

	QUnit.test("Should create a range with the proper include operator when the text contains one", function (assert) {
		var sText = "*abc*";
		var oRange = TokenParser._createRangeByText(sText);

		assert.equal(oRange.exclude, false, "Range operator should be an include operator");
		assert.equal(oRange.operation, "Contains", "Proper operator is 'Contains'");
		assert.equal(oRange.value1, "abc", "Value should not contain a range operator");
		assert.equal(oRange.value2, null, "'Contains' is a one value operator");
	});

	QUnit.test("Should create a range with the proper exclude operator when the text contains one", function (assert) {
		var sText = "!(*abc*)";
		var oRange = TokenParser._createRangeByText(sText);

		assert.equal(oRange.exclude, true, "Range operator should be an exclude operator");
		assert.equal(oRange.operation, "Contains", "Proper operator is 'Contains'");
		assert.equal(oRange.value1, "abc", "Value should not contain a range operator");
		assert.equal(oRange.value2, null, "'NotContains' is a one value operator");
	});

	QUnit.test("Should create a proper range for multi-operands operators like between", function (assert) {
		var sText = "a...b";
		var oRange = TokenParser._createRangeByText(sText);

		assert.equal(oRange.exclude, false, "Range operator should be an include operator");
		assert.equal(oRange.operation, "BT", "Proper operator is 'BT'");
		assert.equal(oRange.value1, "a", "Value1 should be 'a'");
		assert.equal(oRange.value2, "b", "Value2 should be 'b'");
	});

	QUnit.test("Should create a range with EQ operator when text does not have operator", function (assert) {
		var sText = "abc";
		var oRange = TokenParser._createRangeByText(sText);

		assert.equal(oRange.exclude, false, "Range operator should be an include operator");
		assert.equal(oRange.operation, "EQ", "Proper default operator is 'EQ'");
		assert.equal(oRange.value1, "abc", "Value should not contain a range operator");
		assert.equal(oRange.value2, null, "'EQ' is a one value operator");
	});

	QUnit.test("Selecing from the suggestions should make correct selection", function(assert) {
		// Arrange
		var oResult,
			oInput = new MultiInput(),
			oTokenParser = new TokenParser();

		oTokenParser._aKeyFields = [{type: "string"}];

			oTokenParser.associateInput(oInput);
		sinon.stub(oTokenParser._oInput, "_getIsSuggestionPopupOpen").returns(true);
		sinon.stub(oTokenParser._oInput._oSuggestionsTable, "getSelectedItem").returns({});

		// Act
		oResult = oTokenParser._onValidate("1*");

		// Assert
		assert.equal(oResult, null, "When the suggestion popup is open and the user has clicked on a suggest item " +
			"_onValidate should not return a valid token");

		oTokenParser.destroy();
	});

	QUnit.test("_onValidate should create token with ':' in the text", function (assert) {
		// Arrange
		var oResult,
			oInput = new MultiInput(),
			oTokenParser = new TokenParser();
		oTokenParser._sDefaultOperation = "EQ";
		oTokenParser._aKeyFields = [{type: "string", label: "FieldLabel"}];

		oTokenParser.associateInput(oInput);

		// Act
		oResult = oTokenParser._onValidate("Value: with colon");

		// Assert
		assert.ok(oResult, "token should be created");
		assert.equal(oResult.getText(), "=Value: with colon", "token text should not remove anything from the passed text");

		oTokenParser.destroy();
	});

	QUnit.test("_onValidate should parse ':' and remove the first part if it is equal to label in the SmartFilterBar when creating a token", function (assert) {
		// Arrange
		var oResult,
			oInput = new MultiInput(),
			oTokenParser = new TokenParser();
		oTokenParser._sDefaultOperation = "EQ";
		oTokenParser._aKeyFields = [{type: "string", label: "FieldLabel"}];

		oTokenParser.associateInput(oInput);

		// Act
		oResult = oTokenParser._onValidate("FieldLabel: with colon");

		// Assert
		assert.ok(oResult, "token should be created");
		assert.equal(oResult.getText(), "=with colon", "token text should be equal to the second part after ':' symbol");

		oTokenParser.destroy();
	});

	QUnit.module("Testing Public API when SearchExpression FilterRestriction annotation", {
		beforeEach: function () {
			this.oTokenParser = new TokenParser({
				defaultOperation: library.valuehelpdialog.ValueHelpRangeOperation.Contains,
				typeOperations: MetadataAnalyser._getSearchExpressionTypeOperations(),
				rangeOperationsKeys: MetadataAnalyser._getSearchExpressionRangeOperationsKeys()
			});
		},
		afterEach: function () {
			this.oTokenParser.destroy();
			delete this.oTokenParser;
		}
	});

	QUnit.test("Test defaultOperation should be 'Contains'", function (assert) {
		assert.equal(this.oTokenParser.getDefaultOperation(), "Contains", "defaultOperation should be Contains");
	});

	QUnit.test("Test validate all operations for string type to be 3 and return valid tokens", function (assert) {
		var oInput = new MultiInput();

		this.oTokenParser.associateInput(oInput);
		this.oTokenParser.addKeyField({key: "key", type: "string", oType: new TypeString()});

		var fnTokenValidator = oInput.getValidators()[0],
		oToken = fnTokenValidator({ text: "foo" });


		assert.equal(this.oTokenParser._mTypeOperations.string.length, 3, "_mTypeOperations of string type should be three");
		oToken = fnTokenValidator({ text: "*fooo" });
		assert.equal(oToken.getText(), "*fooo", "validator returns valid Token with operation 'EndsWith");
		oToken = fnTokenValidator({ text: "=foooooo" });
		assert.equal(oToken.getText(),  "*=foooooo*", "validator returns valid token with default operation 'Contains' and ignore the equal sign");
	});
});
