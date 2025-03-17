/**
 * tests for the sap.suite.ui.generic.template.listTemplates.listUtils
 */

sap.ui.define(["sap/suite/ui/generic/template/listTemplates/listUtils", "sap/fe/navigation/SelectionVariant"], function (listUtils, SelectionVariant) {
	"use strict";
	var oUserDefaultValues = {"a":"1", "b":"2"};
	var oSFBSelectionValues = {"a": "3", "c": "4"};
	var oSFBSelectionValuesUnique = {"c": "3", "d": "4"};

	QUnit.test("Case 1 - Default Params have values, SFB is empty", function(assert) {
		var oUserDefaultVariant = new SelectionVariant();
		for( var sProp in oUserDefaultValues){
			oUserDefaultVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
		}
		var retVariant = listUtils.getMergedVariants([new SelectionVariant(), oUserDefaultVariant]);
		assert.ok(retVariant.getSelectOption("a")[0].Low, "1");
		assert.ok(retVariant.getSelectOption("b")[0].Low, "2");
	});

	QUnit.test("Case 2 - Default Params is empty, SFB has values", function(assert) {
		var oSFBSelectionVariant = new SelectionVariant();
		for( var sProp in oSFBSelectionValues){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oSFBSelectionValues[sProp]);
		}
		var retVariant = listUtils.getMergedVariants([oSFBSelectionVariant, new SelectionVariant()]);
		assert.ok(retVariant.getSelectOption("a")[0].Low, "3");
		assert.ok(retVariant.getSelectOption("c")[0].Low, "4");
	});

	QUnit.test("Case 3 - Default Params and SFB have unique properties", function(assert) {
		var oSFBSelectionVariant = new SelectionVariant();
		for( var sProp in oSFBSelectionValuesUnique){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oSFBSelectionValuesUnique[sProp]);
		}
		var oUserDefaultVariant = new SelectionVariant();
		for( var sProp in oUserDefaultValues){
			oUserDefaultVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
		}
		var retVariant = listUtils.getMergedVariants([oSFBSelectionVariant, oUserDefaultVariant]);
		assert.ok(retVariant.getSelectOption("a")[0].Low, "1");
		assert.ok(retVariant.getSelectOption("b")[0].Low, "2");
		assert.ok(retVariant.getSelectOption("c")[0].Low, "3");
		assert.ok(retVariant.getSelectOption("d")[0].Low, "4");
	});

	QUnit.test("Case 4 - Default Params and SFB have common properties, merge with higher precedence to Default Params values", function(assert) {
		var oSFBSelectionVariant = new SelectionVariant();
		for( var sProp in oSFBSelectionValues){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oSFBSelectionValues[sProp]);
		}
		var oUserDefaultVariant = new SelectionVariant();
		for( var sProp in oUserDefaultValues){
			oUserDefaultVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
		}
		var retVariant = listUtils.getMergedVariants([oSFBSelectionVariant, oUserDefaultVariant]);
		assert.ok(retVariant.getSelectOption("a")[0].Low, "1");
		assert.ok(retVariant.getSelectOption("b")[0].Low, "2");
		assert.ok(retVariant.getSelectOption("c")[0].Low, "4");
	});

	QUnit.test("fnCreateSVObject - Without Parameters", function(assert) {
		var oSVAnnotation = {
			Parameters: [],
			SelectOptions: [
				{
					PropertyName : {
						PropertyPath: "A"
					},
					Ranges: [
						{
							Low: {
								String: "X"
							},
							Option: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
							},
							RecordType: "com.sap.vocabularies.UI.v1.SelectionRangeType",
							Sign: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		};
		var oSmartFilterBar = {
			getConsiderAnalyticalParameters: function() {
				return false;
			}
		};
		var oSV = {
			SelectOptions: [
				{
					PropertyName: "A",
					Ranges: [
						{
							High: null,
							Low: "X",
							Option: "EQ",
							RecordType: "com.sap.vocabularies.UI.v1.SelectionRangeType",
							Sign: "I"
						}
					],
					RecordType: "com.sap.vocabularies.UI.v1.SelectionOptionType"
				}
			],
			SelectionVariantID: ""
		};

		var oExpectedOutput = new SelectionVariant(oSV);
		var oActualOutput = listUtils.createSVObject(oSVAnnotation, oSmartFilterBar);
		assert.propEqual(oExpectedOutput, oActualOutput, "Selection Variant returned is correct.");
	});

	QUnit.test("fnCreateSVObject - With Parameters", function(assert) {
		var oSVAnnotation = {
			Parameters: [
				{
					PropertyName: {
						PropertyPath: "Parameter"
					},
					PropertyValue: {
						String: "P1"
					}
				}
			],
			SelectOptions: [
				{
					PropertyName : {
						PropertyPath: "A"
					},
					Ranges: [
						{
							Low: {
								String: "X"
							},
							Option: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
							},
							RecordType: "com.sap.vocabularies.UI.v1.SelectionRangeType",
							Sign: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		};
		var oSmartFilterBar = {
			getConsiderAnalyticalParameters: function() {
				return true;
			}
		};
		var oSV = {
			Parameters: [
				{
					PropertyName: "Parameter",
					PropertyValue: "P1"
				}
			],
			SelectOptions: [
				{
					PropertyName: "A",
					Ranges: [
						{
							High: null,
							Low: "X",
							Option: "EQ",
							RecordType: "com.sap.vocabularies.UI.v1.SelectionRangeType",
							Sign: "I"
						}
					],
					RecordType: "com.sap.vocabularies.UI.v1.SelectionOptionType"
				}
			],
			SelectionVariantID: ""
		};

		var oExpectedOutput = new SelectionVariant(oSV);
		var oActualOutput = listUtils.createSVObject(oSVAnnotation, oSmartFilterBar);
		assert.propEqual(oExpectedOutput, oActualOutput, "Selection Variant returned is correct.");
	});

});
