
/*global QUnit, sinon */
sap.ui.define([
	'sap/insights/utils/UrlGenerateHelper',
	'sap/ui/model/json/JSONModel',
	"sap/m/DynamicDateUtil",
	'sap/insights/utils/AppConstants',
	'sap/insights/utils/SelectionVariantHelper',
	"sap/ui/comp/odata/type/StringDate"
], function(UrlGenerateHelper, JSONModel, DynamicDateUtil, AppConstants, SelectionVariantHelper, StringDate) {
	"use strict";
	QUnit.module("UrlGenerateHelper test cases", {
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oUrlGenerateHelper = UrlGenerateHelper;
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oUrlGenerateHelper = null;
		}
	});

	QUnit.test("formatSemanticDateTime", function(assert) {
		this.oUrlGenerateHelper.formatSemanticDateTime("THISWEEK", "Parameter","dateTime");
        assert.equal(AppConstants.DATE_OPTIONS.RANGE_OPTIONS.includes("THISWEEK"), true, "Returned true");
    });
	QUnit.test("formatSemanticDateTime with string datatype", function(assert) {
		var stubDynamicDate = sinon.stub(DynamicDateUtil, "toDates");
		stubDynamicDate.returns([{oDate:'Fri Jul 07 2023 12:54:39 GMT+0530 (India Standard Time)'}]);
		sinon.stub(StringDate.prototype, "parseValue").returns("20220601");

		this.oUrlGenerateHelper.formatSemanticDateTime("TODAY", "Parameter","string");
		assert.ok(stubDynamicDate.called,"DynamicDateUtil has been called");
		assert.ok(StringDate.prototype.parseValue.called,"StringDate.parseValue has been called");
        assert.equal(AppConstants.DATE_OPTIONS.SINGLE_OPTIONS.includes("TODAY"), true, "Returned true");
		stubDynamicDate.restore();
    });
	QUnit.test("getDateRangeValue", function(assert) {
		var oValue = {
			operator: "DATE",
			values: []
		};
		var oParamSet = this.oUrlGenerateHelper.getDateRangeValue(oValue, false, "Parameter");
        assert.equal(oParamSet.Text, "Parameter", "Returned true");
    });
	QUnit.test("processPrivateParams", function(assert) {
		var oCard = {
			descriptorContent: {
				"sap.card": {
					configuration: {
						parameters: {
							P_KeyDate: {
								value: "2022-12-07T18:30:00.000Z"
							},
							CompanyCode: {
								value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CompanyCode\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"1010\",\"Text\":\"Company Code 1010 (1010)\",\"High\":null}]}]}"
							},
							_entitySet: {
								value: "C_FXForwardNominal"
							},
							_urlSuffix: {
								value: "/Results"
							},
							_headerDataUrl: {},
							_contentDataUrl: {
								value: ""
							},
							_relevantODataFilters: {
								value: ['CompanyCode']
							},
							_relevantODataParameters: {
								value: ['P_KeyDate']
							},
							_semanticDateRangeSetting: {
								value: "{\"P_KeyDate\":{\"sap:filter-restriction\":\"single-value\"}}"
							}
						}
					},
					"data": {
						"request": {
							batch: {
								header: {},
								content: {}
							}
						}
					}
				}
			}
		};
		SelectionVariantHelper.getParameterQueryFromSV = function() {return "C_FXForwardNominal(P_KeyDate%3ddatetime%272022-12-08T00%3a00%3a00%27%2cP_DisplayCurrency%3d%27EUR%27%2cP_ExchangeRateType%3d%27P%27)";};
		SelectionVariantHelper.getFilterQueryFromSV = function() {return "$filter=%28CompanyCode%20eq%20%271010%27%29";};
		var oParamSet = this.oUrlGenerateHelper.processPrivateParams(oCard, {}, true);
                assert.equal(oParamSet.content, "C_FXForwardNominalC_FXForwardNominal(P_KeyDate%3ddatetime%272022-12-08T00%3a00%3a00%27%2cP_DisplayCurrency%3d%27EUR%27%2cP_ExchangeRateType%3d%27P%27)/Results?$filter=%28CompanyCode%20eq%20%271010%27%29", "Returned true");
        });
        QUnit.test("semanticDateProcess", function(assert) {
		var descriptorContent = {
				configuration: {
					parameters: {
						"P_KeyDate": {
							value: "2022-12-07T18:30:00.000Z"
						},
						CompanyCode: {
							value: "{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"CompanyCode\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"1010\",\"Text\":\"Company Code 1010 (1010)\",\"High\":null}]}]}"
						},
						_entitySet: {
							value: "C_FXForwardNominal"
						},
						_urlSuffix: {
							value: "/Results"
						},
						_headerDataUrl: {},
						_contentDataUrl: {
							value: ""
						},
						_relevantODataFilters: {
							value: ['CompanyCode']
						},
						_relevantODataParameters: {
							value: ['P_KeyDate']
						},
						_semanticDateRangeSetting: {
							value: "{\"P_KeyDate\":{\"sap:filter-restriction\":\"single-value\"}}"
						}
					}
				},
				"data": {
					"request": {
						batch: {
							header: {},
							content: {}
						}
					}
				}
		};
		var oParameter = {
			ibnParams: {
				"CurrencyPair": "EUR/USD",
				"P_ExchangeRateType": "M",
				"P_KeyDate": "2024-01-01T00:00:00.000",
				"P_MarketDataReportingPeriod": "5_D",
				"sap-xapp-state-data": "{\"presentationVariant\":{\"SortOrder\":[{\"Property\":\"MarketDataReportingPeriod\",\"Descending\":false}]},\"selectionVariant\":{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"P_KeyDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"2024-01-01T00:00:00.000\",\"High\":null}]},{\"PropertyName\":\"P_MarketDataReportingPeriod\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"5_D\",\"High\":null}]},{\"PropertyName\":\"P_ExchangeRateType\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"M\",\"High\":null}]},{\"PropertyName\":\"CurrencyPair\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"EUR/USD\",\"High\":null}]}]}}"
			},
			ibnTarget: {
				"action": "maintainSpotRates",
				"semanticObject": "Currency"
			}
		};
		var oResult = {
		  "ibnParams": {
			"CurrencyPair": "EUR/USD",
			"P_ExchangeRateType": "M",
			"P_KeyDate": "2022-12-07T18:30:00.000Z",
			"P_MarketDataReportingPeriod": "5_D",
			"sap-xapp-state-data": "{\"presentationVariant\":{\"SortOrder\":[{\"Property\":\"MarketDataReportingPeriod\",\"Descending\":false}]},\"selectionVariant\":{\"Parameters\":[],\"SelectOptions\":[{\"PropertyName\":\"P_KeyDate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"2024-01-01T00:00:00.000\",\"High\":null}]},{\"PropertyName\":\"P_MarketDataReportingPeriod\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"5_D\",\"High\":null}]},{\"PropertyName\":\"P_ExchangeRateType\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"M\",\"High\":null}]},{\"PropertyName\":\"CurrencyPair\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"EUR/USD\",\"High\":null}]}]}}"
		  },
		  "ibnTarget": {
			"action": "maintainSpotRates",
			"semanticObject": "Currency"
		  }
		};
		// Please uncomment below code to run the test cases locally and change new SelectionVariant() with new sap.fe.navigation.SelectionVariant()
		// sap = {
		// 	fe: {
		// 		navigation: {
		// 			SelectionVariant: function () {
		// 				return {
		// 					massAddSelectOption: function () {
		// 						return {};
		// 					},
		// 					getSelectOption: function () {
		// 						return [
		// 							{
		// 								High: "2023-12-20T23:59:59.999",
		// 								Low: "2023-12-14T00:00:00.000",
		// 								Option: "BT",
		// 								Sign: "I"
		// 							}
		// 						];
		// 					},
		// 					addParameter: function () {
		// 						return {};
		// 					}
		// 				};
		// 			}
		// 		}
		// 	}
		// };
		var oParamSet = this.oUrlGenerateHelper.semanticDateProcess(oParameter, descriptorContent);
                assert.equal(JSON.stringify(oParamSet), JSON.stringify(oResult));
	});
});