/* globals QUnit, sinon */

sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/base/i18n/LanguageTag",
	"sap/ui/comp/state/UIState",
	"sap/base/util/merge",
	"sap/ui/core/Locale"
], function(
	Formatting,
	LanguageTag,
	UIState,
	merge,
	Locale) {
	"use strict";

	QUnit.module("sap.ui.comp.state.UIState", {
		beforeEach: function() {
			this.oUiState = new UIState();
		},
		afterEach: function() {
			this.oUiState.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oUiState, "shall not be null");
	});

	QUnit.test("checking calculateValueTexts", function(assert) {
		var oValueState, oSelectionVariant = {
			SelectOptions: [
				{
					"PropertyName": "Bukrs",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "0001",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "ARG1",
							"High": null
						}
					]
				}
			]
		};

		var oExpectedValueState = {
			Texts: [
				{
					ContextUrl: "",
					Language: "en",
					PropertyTexts: [
						{
							PropertyName: "Bukrs",
							ValueTexts: [
								{
									PropertyValue: "0001",
									Text: "SAP"
								}, {
									PropertyValue: "ARG1",
									Text: "SAP2"
								}
							]
						}
					]
				}
			]
		};

		var oStub = sinon.stub(Formatting, "getLanguageTag").returns(new LanguageTag("en"));

		oValueState = UIState.calculateValueTexts(oSelectionVariant, {});
		assert.ok(!oValueState);

		oSelectionVariant.SelectOptions[0].Ranges[0];
		oValueState = UIState.calculateValueTexts(oSelectionVariant, {
			"Bukrs": {
				ranges: [],
				items: [
					{
						key: "0001",
						text: "SAP"
					}, {
						key: "ARG1",
						text: "SAP2"
					}
				]
			}
		});
		assert.ok(oValueState);
		assert.deepEqual(oValueState, oExpectedValueState);

		oStub.restore();
	});


	QUnit.test("checking calcSemanticDates", function(assert) {
		var oValueState, oSelectionVariant = {
			SelectOptions: [
				{
					"PropertyName": "BUDAT_ST",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2020-07-19T21:00:00.000Z",
							"High": "2020-07-22T20:59:59.999Z"
						}
					]
				}
			]
		};

		var oExpectedValueState = {
			Dates: [
				{
					PropertyName: "BUDAT_ST",
					Data: {
						calendarType: "Gregorian",
						key: "BUDAT_ST",
						operation: "TODAY",
						tokenText: "",
						value1: null,
						value2: null
					}
				}
			]
		};

		oValueState = UIState.calcSemanticDates(oSelectionVariant, {});
		assert.ok(!oValueState);

		oSelectionVariant.SelectOptions[0].Ranges[0];
		oValueState = UIState.calcSemanticDates(oSelectionVariant, {
			"BUDAT_ST": {
				conditionTypeInfo: {
						data: {
							calendarType: "Gregorian",
							key: "BUDAT_ST",
							operation: "TODAY",
							tokenText: "",
							value1: null,
							value2: null
						}
					},
					items: [],
					ranges: [
						{
							exclude: false,
							keyField: "BUDAT_ST",
							operation: "BT",
							tokenText: "",
							value1: "Thu Jul 23 2020 00:00:00 GMT+0300 (Eastern European Summer Time)",
							value2: "Thu Jul 23 2020 23:59:59 GMT+0300 (Eastern European Summer Time)"
						}
					]
			}
		});
		assert.ok(oValueState);
		assert.deepEqual(oValueState, oExpectedValueState);
	});


	QUnit.test("checking enrichWithValueTexts", function(assert) {
		var oExpectedResult = {}, oValueState, sPayload, oPayload = {
			"Bukrs": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "Bukrs",
						"value1": "0001",
						"value2": null
					}, {
						"exclude": false,
						"operation": "EQ",
						"keyField": "Bukrs",
						"value1": "ARG1",
						"value2": null
					}
				]
			}
		};

		sPayload = JSON.stringify(oPayload);
		merge(oExpectedResult, oPayload);
		oExpectedResult["Bukrs"].ranges.splice(0, 1);
		oExpectedResult["Bukrs"].items = [
			{
				key: "0001",
				text: "SAP"
			}
		];

		oValueState = {
			Texts: [
				{
					ContextUrl: "",
					Language: "en",
					PropertyTexts: [
						{
							PropertyName: "Bukrs",
							ValueTexts: [
								{
									PropertyValue: "0001",
									Text: "SAP"
								}
							]
						}
					]
				}
			]
		};

		var oStub = sinon.stub(Formatting, "getLanguageTag").returns(new LanguageTag("en"));

		var sResult = UIState.enrichWithValueTexts(sPayload, oValueState);
		assert.ok(sResult);
		assert.deepEqual(JSON.parse(sResult), oExpectedResult);

		oStub.restore();
	});


	QUnit.test("checking enrichWithSemanticDates", function(assert) {
		var oExpectedResult = {}, oValueState, sPayload, oPayload = {
			"BUDAT_ST": {
				conditionTypeInfo: {
						data: {
							calendarType: "Gregorian",
							key: "BUDAT_ST",
							operation: "TODAY",
							tokenText: "",
							value1: null,
							value2: null
						}
					},
					items: [],
					ranges: [
						{
							exclude: false,
							keyField: "BUDAT_ST",
							operation: "BT",
							tokenText: "",
							value1: "Thu Jul 23 2020 00:00:00 GMT+0300 (Eastern European Summer Time)",
							value2: "Thu Jul 23 2020 23:59:59 GMT+0300 (Eastern European Summer Time)"
						}
					]
			}
		};

		sPayload = JSON.stringify(oPayload);
		merge(oExpectedResult, oPayload);
		oExpectedResult["BUDAT_ST"].ranges[0].semantic = {
			calendarType: "Gregorian",
			key: "BUDAT_ST",
			operation: "TODAY",
			tokenText: "",
			value1: null,
			value2: null
		};

		oValueState = {
			Dates: [
				{
					PropertyName: "BUDAT_ST",
					Data: {
						calendarType: "Gregorian",
						key: "BUDAT_ST",
						operation: "TODAY",
						tokenText: "",
						value1: null,
						value2: null
					}
				}
			]
		};

		var sResult = UIState.enrichWithSemanticDates(sPayload, oValueState);
		assert.ok(sResult);
		assert.deepEqual(JSON.parse(sResult), oExpectedResult);
	});

	QUnit.module("sap.ui.comp.state.UIState: API", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	var fnDefault01 = function(assert, oUiState) {
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
		assert.equal(oUiState.getSemanticDates(), undefined);
	};
	QUnit.test("Defaults", function(assert) {
		fnDefault01(assert, new UIState());
	});

	var fnDefault02 = function(assert, oUiState, oExpectedValue) {
		assert.deepEqual(oUiState.getPresentationVariant(), oExpectedValue);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
		assert.equal(oUiState.getSemanticDates(), undefined);
	};
	QUnit.test("only presentationVariant", function(assert) {
		var oExpectedValue = {
			ContextUrl: "",
			MaxItems: 3,
			SortOrder: [],
			GroupBy: [],
			Total: [],
			RequestAtLeast: [],
			Visualizations: []
		};
		fnDefault02(assert, new UIState({
			presentationVariant: oExpectedValue
		}), oExpectedValue);
	});

	var fnDefault03 = function(assert, oUiState, oExpectedValue) {
		assert.deepEqual(oUiState.getSelectionVariant(), oExpectedValue);
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
		assert.equal(oUiState.getSemanticDates(), undefined);
	};


	QUnit.test("only selectionVariant", function(assert) {
		var oExpectedValue = {
			SelectionVariantID: "123",
			Parameters: [],
			SelectOptions: []
		};
		fnDefault03(assert, new UIState({
			selectionVariant: oExpectedValue
		}), oExpectedValue);
	});

	var fnDefault04 = function(assert, oUiState, oExpectedValue) {
		assert.equal(oUiState.getVariantName(), oExpectedValue);
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
		assert.equal(oUiState.getSemanticDates(), undefined);
	};
	QUnit.test("only variantName", function(assert) {
		fnDefault04(assert, new UIState({
			variantName: "VariantABC"
		}), "VariantABC");
	});

	QUnit.test("check determineFiltersWithOnlyKeyValues", function(assert) {

		var aResult = UIState.determineFiltersWithOnlyKeyValues(null, null);
		assert.ok(aResult);
		assert.equal(aResult.length, 0);

		aResult = UIState.determineFiltersWithOnlyKeyValues([], null);
		assert.ok(aResult);
		assert.equal(aResult.length, 0);

		aResult = UIState.determineFiltersWithOnlyKeyValues(null, []);
		assert.ok(aResult);
		assert.equal(aResult.length, 0);

		var oSelectionVariant = {
			SelectOptions: [
				{
					"PropertyName": "Bukrs",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "0001",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "ARG1",
							"High": null
						}
					]
				}
			]
		};

		aResult = UIState.determineFiltersWithOnlyKeyValues(null, oSelectionVariant);
		assert.ok(aResult);
		assert.equal(aResult.length, 1);
		assert.equal(aResult[0].filterName, "Bukrs");
		assert.ok(aResult[0].keys);
		assert.equal(aResult[0].keys.length, 2);
		assert.equal(aResult[0].keys[0], "0001");
		assert.equal(aResult[0].keys[1], "ARG1");

		var oStub = sinon.stub(Formatting, "getLanguageTag").returns(new LanguageTag("en"));

		var oValueTexts = {
			"Texts": [
				{
					"ContextUrl": "",
					"Language": "en",
					"PropertyTexts": [
						{
							"PropertyName": "Bukrs",
							"ValueTexts": [
								{
									"PropertyValue": "ARG1",
									"Text": "SAP A.G.test (ARG1)"
								}
							]
						}
					]
				}
			]
		};
		aResult = UIState.determineFiltersWithOnlyKeyValues(oValueTexts, oSelectionVariant);
		assert.ok(aResult);
		assert.equal(aResult.length, 1);
		assert.equal(aResult[0].filterName, "Bukrs");
		assert.ok(aResult[0].keys);
		assert.equal(aResult[0].keys.length, 1);
		assert.equal(aResult[0].keys[0], "0001");

		aResult = UIState.determineFiltersWithOnlyKeyValues(oValueTexts, oSelectionVariant, [
			"Bukrs"
		]);
		assert.ok(aResult);
		assert.equal(aResult.length, 0);

		oStub.restore();
	});

	var fnDefault05 = function(assert, oUiState, oExpectedValue) {
		assert.deepEqual(oUiState.getValueTexts(), oExpectedValue);
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
	};
	QUnit.test("only valueTexts", function(assert) {
		fnDefault05(assert, new UIState({
			valueTexts: [
				{
					Language: "DE"
				}
			]
		}), [
			{
				Language: "DE"
			}
		]);
	});

	QUnit.test("check determineFiltersWithOnlyKeyValues with Exclude", function(assert) {

		// Arrange
		var aResult, oSelectionVariant = {
			SelectOptions: [
				{
					"PropertyName": "Bukrs",
					"Ranges": [
						{
							"Sign": "E",
							"Option": "EQ",
							"Low": "0001",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "ARG1",
							"High": null
						}
					]
				}
			]
		};

		// Act
		aResult = UIState.determineFiltersWithOnlyKeyValues(null, oSelectionVariant);

		// Assert
		assert.equal(aResult[0].keys.length, 1, "SelectOption Ranges with Exclude operator (Sign: E) should not be present");
		assert.equal(aResult[0].keys[0], "ARG1", "Only Include operator should be set");

	});

	QUnit.module("sap.ui.comp.state.UIState: createFromSelectionAndPresentationVariantAnnotation", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Default", function(assert) {
		fnDefault01(assert, UIState.createFromSelectionAndPresentationVariantAnnotation());
		fnDefault01(assert, UIState.createFromSelectionAndPresentationVariantAnnotation(null, undefined, {}));
		fnDefault01(assert, UIState.createFromSelectionAndPresentationVariantAnnotation("", {
			dummy: []
		}, {
			dummy: {}
		}));
	});

	QUnit.test("only presentationVariant", function(assert) {
		fnDefault02(assert, UIState.createFromSelectionAndPresentationVariantAnnotation(null, null, {
			maxItems: "10",
			sortOrderFields: [
				{
					name: "AmountInCompanyCodeCurrency",
					descending: false
				}
			],
			groupByFields: [],
			requestAtLeastFields: []
		}), {
			MaxItems: 10,
			SortOrder: [
				{
					Property: "AmountInCompanyCodeCurrency",
					Descending: false
				}
			],
			GroupBy: [],
			RequestAtLeast: []
		});
	});

	QUnit.test("only selectionVariant", function(assert) {
		fnDefault03(assert, UIState.createFromSelectionAndPresentationVariantAnnotation(null, {
			SelectOptions: [
				{
					PropertyName: {
						PropertyPath: "Bukrs"
					},
					Ranges: [
						{
							Low: {
								String: "0002"
							},
							Option: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
							},
							Sign: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		}, null), {
			SelectOptions: [
				{
					PropertyName: "Bukrs",
					Ranges: [
						{
							Sign: "I",
							Option: "EQ",
							Low: "0002",
							High: undefined
						}
					]
				}
			]
		});
	});


	QUnit.test("only selectionVariant with parameters", function(assert) {
		var oUiState = UIState.createFromSelectionAndPresentationVariantAnnotation(null, {
			Parameters: [
				{
					PropertyName: {
						PropertyPath: "P_Param1"
					},
					PropertyValue: {
						String: "Value1"
					}
				},
				{
					PropertyName: {
						PropertyPath: "P_Param2"
					},
					PropertyValue: {
						String: "Value2"
					}
				}
			],
			SelectOptions: [
				{
					PropertyName: {
						PropertyPath: "Bukrs"
					},
					Ranges: [
						{
							Low: {
								String: "0002"
							},
							Option: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
							},
							Sign: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		});

		var oExpectedResult = {
			SelectOptions: [
				{
					PropertyName: "Bukrs",
					Ranges: [
						{
							Sign: "I",
							Option: "EQ",
							Low: "0002",
							High: undefined
						}
					]
				}
			],
			Parameters: [
				{ PropertyName: "P_Param1", PropertyValue: "Value1"},
				{ PropertyName: "P_Param2", PropertyValue: "Value2"}
			]
		};

		assert.deepEqual(oUiState.getSelectionVariant(), oExpectedResult);
	});

	QUnit.test("only variantName", function(assert) {
		fnDefault04(assert, UIState.createFromSelectionAndPresentationVariantAnnotation("variantABC", null, null), "variantABC");
	});

});
