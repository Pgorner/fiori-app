/**
 * tests for the sap.suite.ui.generic.template.ListReport.AnnotationHelper.js and in particular for the SmartChart in multi-tab mode
 */
sap.ui.define([
	"sap/suite/ui/generic/template/ListReport/AnnotationHelper"
], function(AnnotationHelper){
	"use strict";

	QUnit.module("test ListReport/AnnotationHelper", {
		beforeEach : fnCommonSetUp,
		afterEach: fnCommonTeardown
	});

	function fnCommonSetUp() {
		this.oAnnotationHelper = AnnotationHelper;
	}

	function fnCommonTeardown() {
		this.oAnnotationHelper = null;
	}

	QUnit.test("test getRelevantPresentationVariantPath - annotationPath = undefined", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.SelectionPresentationVariant": {
                "PresentationVariant": {
                    "Path": "@com.sap.vocabularies.UI.v1.PresentationVariant#Test"
                }
            }
        };
        var sAnnotationPath = undefined;
		var sPresentationVariantPath = this.oAnnotationHelper.getRelevantPresentationVariantPath(oEntityType, sAnnotationPath);
		assert.ok(sPresentationVariantPath === "com.sap.vocabularies.UI.v1.PresentationVariant", "PresentationVariant without a qualifier is returned");
	});

    QUnit.test("test getRelevantPresentationVariantPath - annotationPath pointing to SelectionPresentationVariant", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.SelectionPresentationVariant": {
                "PresentationVariant": {
                    "Path": "@com.sap.vocabularies.UI.v1.PresentationVariant#Test"
                }
            }
        };
        var sAnnotationPath = "com.sap.vocabularies.UI.v1.SelectionPresentationVariant";
		var sPresentationVariantPath = this.oAnnotationHelper.getRelevantPresentationVariantPath(oEntityType, sAnnotationPath);
		assert.ok(sPresentationVariantPath === "com.sap.vocabularies.UI.v1.PresentationVariant#Test", "PresentationVariant with qualifier 'Test' is returned");
	});

    QUnit.test("test getRelevantPresentationVariantPath - annotationPath pointing to SelectionPresentationVariant - PresentationVariant defined inline", function (assert) {
        var oEntityType = {
            "com.sap.vocabularies.UI.v1.SelectionPresentationVariant": {
                "PresentationVariant": {
                    "SortOrder": {
                        
                    }
                }
            }
        };
        var sAnnotationPath = "com.sap.vocabularies.UI.v1.SelectionPresentationVariant";
		var sPresentationVariantPath = this.oAnnotationHelper.getRelevantPresentationVariantPath(oEntityType, sAnnotationPath);
		assert.ok(sPresentationVariantPath === "com.sap.vocabularies.UI.v1.PresentationVariant", "PresentationVariant without qualifier is returned");
	});

    QUnit.test("test getRelevantPresentationVariantPath - annotationPath pointing to PresentationVariant with qualifier 'Test'", function (assert) {
        var oEntityType = {
            
        };
        var sAnnotationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Test";
		var sPresentationVariantPath = this.oAnnotationHelper.getRelevantPresentationVariantPath(oEntityType, sAnnotationPath);
		assert.ok(sPresentationVariantPath === "com.sap.vocabularies.UI.v1.PresentationVariant#Test", "PresentationVariant with qualifier 'Test' is returned");
	});

    QUnit.test("test getRelevantPresentationVariantPath - annotationPath pointing to SelectionVariant", function (assert) {
        var oEntityType = {
            
        };
        var sAnnotationPath = "com.sap.vocabularies.UI.v1.SelectionVariant#Test";
		var sPresentationVariantPath = this.oAnnotationHelper.getRelevantPresentationVariantPath(oEntityType, sAnnotationPath);
		assert.ok(sPresentationVariantPath === "com.sap.vocabularies.UI.v1.PresentationVariant", "PresentationVariant without a qualififer is returned");
	});

    QUnit.test("getValidPresentationVariantForSingleView - Pick the right PresentationVariant annotation for a single view LR - annotationPath is undefined", function (assert) {

		var oEntityType = {
			"com.sap.vocabularies.UI.v1.PresentationVariant#Test" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"net_amount"
						},
						"Descending":{
							"Bool":"true"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			},
			"com.sap.vocabularies.UI.v1.PresentationVariant" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"gross_amount"
						},
						"Descending":{
							"Bool":"false"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			}
		}

		var oActualOutput = this.oAnnotationHelper.getValidPresentationVariantForSingleView(oEntityType, undefined);
		var oExpectedOutput = {
			"SortOrder":[
				{
					"Property":{
						"PropertyPath":"gross_amount"
					},
					"Descending":{
						"Bool":"false"
					},
					"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
				}
			]
		};
		assert.propEqual(oExpectedOutput, oActualOutput, "Presentation Variant returned is correct.");
	});

	QUnit.test("getValidPresentationVariantForSingleView - Pick the right PresentationVariant annotation for a single view LR - annotationPath pointing to a PV", function (assert) {

		var oEntityType = {
			"com.sap.vocabularies.UI.v1.PresentationVariant#Test" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"net_amount"
						},
						"Descending":{
							"Bool":"true"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			},
			"com.sap.vocabularies.UI.v1.PresentationVariant" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"gross_amount"
						},
						"Descending":{
							"Bool":"false"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			}
		}

		var oActualOutput = this.oAnnotationHelper.getValidPresentationVariantForSingleView(oEntityType, "com.sap.vocabularies.UI.v1.PresentationVariant#Test");
		var oExpectedOutput = {
			"SortOrder":[
				{
					"Property":{
						"PropertyPath":"net_amount"
					},
					"Descending":{
						"Bool":"true"
					},
					"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
				}
			]
		};
		assert.propEqual(oExpectedOutput, oActualOutput, "Presentation Variant returned is correct.");
	});

	QUnit.test("getValidPresentationVariantForSingleView - Pick the right PresentationVariant annotation for a single view LR - annotationPath pointing to a SPV", function (assert) {

		var oEntityType = {
			"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#DefaultSPV": {
				"ID":{
					"String":""
				},
				"Text":{
					"String":"Default SPV"
				},
				"SelectionVariant":{
					"Path":"@com.sap.vocabularies.UI.v1.SelectionVariant#FilterDefaults"
				},
				"PresentationVariant":{
					"Path":"@com.sap.vocabularies.UI.v1.PresentationVariant#Test"
				}
			},
			"com.sap.vocabularies.UI.v1.PresentationVariant#Test" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"net_amount"
						},
						"Descending":{
							"Bool":"true"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			},
			"com.sap.vocabularies.UI.v1.PresentationVariant" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"gross_amount"
						},
						"Descending":{
							"Bool":"false"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			}
		}

		var oActualOutput = this.oAnnotationHelper.getValidPresentationVariantForSingleView(oEntityType, "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#DefaultSPV");
		var oExpectedOutput = {
			"SortOrder":[
				{
					"Property":{
						"PropertyPath":"net_amount"
					},
					"Descending":{
						"Bool":"true"
					},
					"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
				}
			]
		};
		assert.propEqual(oExpectedOutput, oActualOutput, "Presentation Variant returned is correct.");
	});

	QUnit.test("getValidPresentationVariantForSingleView - Pick the right PresentationVariant annotation for a single view LR - annotationPath pointing to a SV", function (assert) {

		var oEntityType = {
			"com.sap.vocabularies.UI.v1.PresentationVariant#Test" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"net_amount"
						},
						"Descending":{
							"Bool":"true"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			},
			"com.sap.vocabularies.UI.v1.PresentationVariant" : {
				"SortOrder":[
					{
						"Property":{
							"PropertyPath":"gross_amount"
						},
						"Descending":{
							"Bool":"false"
						},
						"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
					}
				]
			}
		}

		var oActualOutput = this.oAnnotationHelper.getValidPresentationVariantForSingleView(oEntityType, "com.sap.vocabularies.UI.v1.SelectionVariant");
		var oExpectedOutput = {
			"SortOrder":[
				{
					"Property":{
						"PropertyPath":"gross_amount"
					},
					"Descending":{
						"Bool":"false"
					},
					"RecordType":"com.sap.vocabularies.Common.v1.SortOrderType"
				}
			]
		};
		assert.propEqual(oExpectedOutput, oActualOutput, "Presentation Variant returned is correct.");
	});

});
