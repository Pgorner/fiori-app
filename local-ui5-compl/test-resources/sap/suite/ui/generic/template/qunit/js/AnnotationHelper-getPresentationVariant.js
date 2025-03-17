sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		QUnit.module("Test methods to check function getPresentationVariant", {

			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
			},

			afterEach: function () {
				this.oAnnotationHelper = null;
			},

			oPresentationVariant: {
				Visualizations: [],
				SortOrder: []
			},

			oSPVariantWithInlinePresentationVariant: {
				SelectionVariant: {},
				PresentationVariant: {
					Visualizations: [],
					SortOrder: []
				}
			},

			oSPVariantReferencingPresentationVariant: {
				SelectionVariant: {},
				PresentationVariant: {
					Path: "@UI.PresentationVariant#SomeQualifier"
				}
			},
			oSPVariantReferencingPresentationVariantViaAnnoPath: {
				SelectionVariant: {},
				PresentationVariant: {
					AnnotationPath: "@UI.PresentationVariant#SomeQualifier"
				}
			},
			oSPVariantWithoutPresentationVariant: {
				SelectionVariant: {}
			}
		});

		QUnit.test("Test getPresentationVariant for a PresentationVariant", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;

			var oVariant = this.oPresentationVariant;
			var oEntityType = {};
			var oResult = oAnnotationHelper.getPresentationVariant(oVariant, oEntityType);
			var oExpectedResult = this.oPresentationVariant;
			assert.equal(oResult, oExpectedResult, "Expected value is: " + oExpectedResult);
		});

		QUnit.test("Test getPresentationVariant for a SelectionPresentationVariant with an inner PresentationVariant", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;

			var oVariant = this.oSPVariantWithInlinePresentationVariant;
			var oEntityType = {};
			var oResult = oAnnotationHelper.getPresentationVariant(oVariant, oEntityType);
			var oExpectedResult = this.oSPVariantWithInlinePresentationVariant.PresentationVariant;
			assert.equal(oResult, oExpectedResult, "Expected value is: " + oExpectedResult);
		});

		QUnit.test("Test getPresentationVariant for a SelectionPresentationVariant referencing a PresentationVariant via Path", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;

			var oVariant = this.oSPVariantReferencingPresentationVariant;
			var oEntityType = {
				"UI.PresentationVariant#SomeQualifier": {
					Visualizations: "UI.LineItem#SomeQualifier"
				}
			};
			var oResult = oAnnotationHelper.getPresentationVariant(oVariant, oEntityType);
			var oExpectedResult = oEntityType["UI.PresentationVariant#SomeQualifier"];
			assert.equal(oResult, oExpectedResult, "Expected value is: " + oExpectedResult);
		});

		QUnit.test("Test getPresentationVariant for a SelectionPresentationVariant referencing a PresentationVariant via AnnotationPath", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;

			var oVariant = this.oSPVariantReferencingPresentationVariant;
			var oEntityType = {
				"UI.PresentationVariant#SomeQualifier": {
					Visualizations: "UI.LineItem#SomeQualifier"
				}
			};
			var oResult = oAnnotationHelper.getPresentationVariant(oVariant, oEntityType);
			var oExpectedResult = oEntityType["UI.PresentationVariant#SomeQualifier"];
			assert.equal(oResult, oExpectedResult, "Expected value is: " + oExpectedResult);
		});

		QUnit.test("Test getPresentationVariant for a SelectionPresentationVariant without a PresentationVariant", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oVariant = this.oSPVariantWithoutPresentationVariant;
			var oEntityType = {};
			var oResult = oAnnotationHelper.getPresentationVariant(oVariant, oEntityType);
			var oExpectedResult = undefined;
			assert.equal(oResult, oExpectedResult, "Expected value is: " + oExpectedResult);
		});
		/*
		Test for checking PresentationVariant Qualifier
		*/
		QUnit.test("Test getPresentationVariantQualifier", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			this.oEntityTypeForPVQualifierTests = {
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithoutPV": {
					"SelectionVariant" : {}
				},
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithInnerPV": {
					"SelectionVariant" : {},
					"PresentationVariant": {
						"Visualizations" : [],
						"SortOrder": []
					}
				},
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithPVViaPath": {
					"SelectionVariant" : {},
					"PresentationVariant": {
						"Path": "@com.sap.vocabularies.UI.v1.PresentationVariant#PVWithQualifier"
					}
				},
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithPVViaAnnotationPath": {
					"SelectionVariant" : {},
					"PresentationVariant": {
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.PresentationVariant#PVWithQualifier"
					}
				},
				"com.sap.vocabularies.UI.v1.PresentationVariant#PVWithQualifier": {
					"Visualizations" : [],
					"SortOrder": []
				},
				"com.sap.vocabularies.UI.v1.PresentationVariant": {
					"Visualizations" : [],
					"SortOrder": []
				}
			};
			this.ResultQualifiers = [undefined, "", "PVWithQualifier", "PVWithQualifier", "PVWithQualifier", ""];
			var aAnnotationTerms = Object.keys(this.oEntityTypeForPVQualifierTests);
			if (aAnnotationTerms) {
				for (var i = 0; i < aAnnotationTerms.length; i++) {
					var oResult = oAnnotationHelper.getPresentationVariantQualifier(this.oEntityTypeForPVQualifierTests, aAnnotationTerms[i]);
					var oExpectedResult = this.ResultQualifiers[i];
					assert.equal(oResult, oExpectedResult, "Expected value is " + (oExpectedResult === "" ? "Empty String" : oExpectedResult));
				}
			}
		});
		/*
		Test for checking Initial Expansion Level
		*/
		QUnit.test("Test Initial Expansion Level", function (assert) {
			var oAnnotationHelper = this.oAnnotationHelper;
			this.oEntityTypeForPVQualifierTests = {
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithInnerPV": {
					"SelectionVariant" : {},
					"PresentationVariant": {
						"InitialExpansionLevel": {
							"Int": "1"
						},
						"Visualizations" : [],
						"SortOrder": []
					}
				},
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithPVViaPath": {
					"SelectionVariant" : {},
					"PresentationVariant": {
						"Path": "@com.sap.vocabularies.UI.v1.PresentationVariant#PVWithQualifier"
					}
				},
				"com.sap.vocabularies.UI.v1.SelectionPresentationVariant#WithPVViaAnnotationPath": {
					"SelectionVariant" : {},
					"PresentationVariant": {
						"Path": "@com.sap.vocabularies.UI.v1.PresentationVariant#PVWithQualifier"
					}
				},
				"com.sap.vocabularies.UI.v1.PresentationVariant#PVWithQualifier": {
					"InitialExpansionLevel" : {
						"Int": "2"
					},
					"Visualizations" : [],
					"SortOrder": []
				},
				"com.sap.vocabularies.UI.v1.PresentationVariant": {
					"Visualizations" : [],
					"SortOrder": []
				}
			};
			this.ResultQualifiers = ["1", "2", "2", "2", undefined];
			var aAnnotationTerms = Object.keys(this.oEntityTypeForPVQualifierTests);
			if (aAnnotationTerms) {
				for (var i = 0; i < aAnnotationTerms.length; i++) {
					var oResult = oAnnotationHelper.getPresentationVariantInitialExpansionLevel(this.oEntityTypeForPVQualifierTests, aAnnotationTerms[i]);
					var oExpectedResult = this.ResultQualifiers[i];
					assert.equal(oResult, oExpectedResult, "Expected value is " + oExpectedResult);
				}
			}
		});
});
