/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/CardExtension',
    'sap/insights/utils/UrlGenerateHelper',
	'sap/ui/model/json/JSONModel',
	"sap/m/DynamicDateUtil",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/integration/util/Utils"
], function(CardExtension, UrlGenerateHelper, JSONModel, DynamicDateUtil, AppConstants, SelectionVariantHelper, NumberFormat, IntegrationUtils) {
	"use strict";
	QUnit.module("CardExtension test cases", {
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oCardExtension = new CardExtension();
		},
		afterEach: function () {
			this.oSandbox.restore();
            this.oCardExtension.destroy();
		}
	});
    QUnit.test("addFormater: sNamespace is empty", function(assert) {
        var oSpy = sinon.spy(this.oCardExtension, "setFormatters");
        this.oCardExtension.addFormatters("", {});
        assert.ok(oSpy.notCalled,"setFormatters getting called");
    });
    QUnit.test("addFormater: sNamespace is not empty", function(assert) {
        var oSpy = sinon.spy(this.oCardExtension, "setFormatters");
        this.oCardExtension.addFormatters("test", {});
        assert.ok(oSpy.calledOnce,"setFormatters getting called");
    });
    QUnit.test("loadDependencies", function(assert) {
        var stubGetCard = sinon.stub(this.oCardExtension, "getCard");
        stubGetCard.returns({
            getManifestEntry: function() {
                return "Analytical";
            }
        });
        this.oCardExtension.loadDependencies("test", {});
        assert.ok(stubGetCard.called,"getCard getting called");
        stubGetCard.restore();
    });
    QUnit.test("kpiformatter", function(assert) {
        var ovpProperties = {
            NumberOfFractionalDigits: 2,
            percentageAvailable: 2
        };
        var bResult = this.oCardExtension.getFormatters().kpiformatter("test", ovpProperties, true);
        assert.equal(bResult, "T%", "return false");
    });
    QUnit.test("formatContentUrl", function(assert) {
        this.oCardExtension._setCard(null,
            {
                getCombinedParameters: function() {return {_contentDataUrl: "contentDataUrl"};}
            }
        );
        var bResult = this.oCardExtension.getFormatters().formatContentUrl();
        assert.equal(bResult, "contentDataUrl");
    });
    QUnit.test("formatHeaderUrl", function(assert) {
        this.oCardExtension._setCard(null,
            {
                getCombinedParameters: function() {return {_headerDataUrl: "headerDataUrl"};}
            }
        );
        var bResult = this.oCardExtension.getFormatters().formatHeaderUrl();
        assert.equal(bResult, "headerDataUrl");
    });
    QUnit.test("formatHeaderDataUrlForSemanticDate", function(assert) {
        UrlGenerateHelper.processPrivateParams = function() {return {header: "header"};};
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function() {}
            }
        );
        var bResult = this.oCardExtension.getFormatters().formatHeaderDataUrlForSemanticDate();
        assert.equal(bResult, "header");
    });
    QUnit.test("targetValueFormatter", function(assert) {
        var oStaticValues = {
            NumberOfFractionalDigits: 2,
            manifestTarget: 2
        };
        var bResult = this.oCardExtension.getFormatters().targetValueFormatter(0, 2, oStaticValues);
        assert.equal(bResult, "2.00");
    });
    QUnit.test("returnPercentageChange", function(assert) {
        var oStaticValues = {
            NumberOfFractionalDigits: 2,
            manifestTarget: 2
        };
        var bResult = this.oCardExtension.getFormatters().returnPercentageChange(0, 2, oStaticValues);
        assert.equal(bResult, "-100.00%");
    });
    QUnit.test("kpiValueCriticality", function(assert) {
        var bResult = this.oCardExtension.getFormatters().kpiValueCriticality(1);
        assert.equal(bResult, "Error");
    });
    QUnit.test("formatCurrency", function(assert) {
        var oFormatterProperties = {numberOfFractionalDigits: "0", scaleFactor: "1000"};
        var bIncludeCurrencyCodeText = true;
        var iAmount = 2400;
        var sCurencyCode = "EUR";
        var sCurrencyCodeText = "Euro";
        var sFormattedValue = this.oCardExtension.getFormatters().formatCurrency(oFormatterProperties, bIncludeCurrencyCodeText, iAmount, sCurencyCode, sCurrencyCodeText);
        assert.equal(
            sFormattedValue,
            "2K EUR (Euro)",
            "currency formatted with currency code text"
        );

        bIncludeCurrencyCodeText = false;
        sFormattedValue = this.oCardExtension.getFormatters().formatCurrency(oFormatterProperties, bIncludeCurrencyCodeText, iAmount, sCurencyCode, sCurrencyCodeText);
        assert.equal(
            sFormattedValue,
            "2K EUR",
            "currency formatted without currency code text"
        );
    });
    QUnit.test("formatNumber", function(assert) {
        var bResult = this.oCardExtension.getFormatters().formatNumber({}, [0,1], "123", "345");
        assert.equal(bResult, "123345");

        var sFormatWithSaptext = this.oCardExtension.getFormatters().formatNumber({}, [0, " ", 1, "  (", 2, ")"], "3", "KG", "Kilogram");
	    assert.equal(sFormatWithSaptext, "3 KG  (Kilogram)");
    });
    QUnit.test("navigation date, type: datetime", function (assert) {
        var oDummyObj = {
            "configuration": {
                "parameters": {
                    "P_KeyDate": {
                        description: '{\"operator\":\"DATE\",\"values\":[{\"oDate\":\"2023-04-17T00:00:00.000Z\",\"sCalendarType\":\"Gregorian\"}]}',
                        label: "17.04.2023",
                        type: "datetime",
                        value: "2023-04-17T00:00:00.000Z"
                    },
                    "_semanticDateRangeSetting": {
                        value: '{\"P_KeyDate\":{\"sap:filter-restriction\":\"single-value\"}}'
                    },
                    "_relevantODataFilters": { value: [] },
                    "_relevantODataParameters": {
                        "value": [
                            "P_KeyDate"
                        ]
                    }
                }
            }
        };
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function () { return oDummyObj; }
            }
        );
        var sNavData = '{"ibnTarget":{"semanticObject":"BankAccount","action":"monitorBankFee"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"ServiceAmountInDisplayCurrency","Descending":true}]}},"sensitiveProps":[]}';
        var bResult = this.oCardExtension.getFormatters().getNavigationContext(sNavData, null);
        assert.equal(bResult["ibnParams"]["P_KeyDate"], "2023-04-17T02:00:00.000"); // To handle UTC time difference +2Hrs
        assert.equal(JSON.parse(bResult["ibnParams"]['sap-xapp-state-data'])['selectionVariant']['SelectOptions'][0]['Ranges'][0]['Low'], "2023-04-17T02:00:00.000");
    });
    QUnit.test("navigation date, type: string", function (assert) {
        var oDummyObj = {
            "configuration": {
                "parameters": {
                    "P_KeyDate": {
                        description: '{\"operator\":\"DATE\",\"values\":[{\"oDate\":\"20230417\",\"sCalendarType\":\"Gregorian\"}]}',
                        label: "20230417",
                        type: "string",
                        value: "20230417"
                    },
                    "_semanticDateRangeSetting": {
                        value: '{\"P_KeyDate\":{\"sap:filter-restriction\":\"single-value\"}}'
                    },
                    "_relevantODataFilters": { value: [] },
                    "_relevantODataParameters": {
                        "value": [
                            "P_KeyDate"
                        ]
                    }
                }
            }
        };
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function () { return oDummyObj; }
            }
        );
        var sNavData = '{"ibnTarget":{"semanticObject":"BankAccount","action":"monitorBankFee"},"ibnParams":{"presentationVariant":{"SortOrder":[{"Property":"ServiceAmountInDisplayCurrency","Descending":true}]}},"sensitiveProps":[]}';
        var bResult = this.oCardExtension.getFormatters().getNavigationContext(sNavData, null);
        assert.equal(bResult["ibnParams"]["P_KeyDate"], "20230417");
        assert.equal(JSON.parse(bResult["ibnParams"]['sap-xapp-state-data'])['selectionVariant']['SelectOptions'][0]['Ranges'][0]['Low'], "20230417");
    });

    QUnit.test("formatCriticality", function(assert) {
        var bResult = this.oCardExtension.getFormatters().formatCriticality("Warning","state");
        assert.equal(bResult, "Warning");
    });
    QUnit.test("formatContentDataUrlForSemanticDate: if request.batch is there", function(assert) {
        var oDummyObj = {
            "sap.card": {
                "configuration": {
                    "csrfTokens": {
                        "token1": {
                            data: {
                                request: {
                                    url: "#testUrl"
                                }
                            }
                        }
                    }
                },
                "data": {
                    "request": {
                        "batch": {}
                    }
                }
            }
        };
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function() {return oDummyObj;}
            }
        );
        UrlGenerateHelper.processPrivateParams = function() {return {content: "content"};};
        var bResult = this.oCardExtension.getFormatters().formatContentDataUrlForSemanticDate();
        assert.equal(bResult, "content");
    });
    QUnit.test("formatContentDataUrlForSemanticDate: if request.batch not is there", function(assert) {
        var oDummyObj = {
            "sap.card": {
                "configuration": {
                    "csrfTokens": {
                        "token1": {
                            data: {
                                request: {
                                    url: "#testUrl"
                                }
                            }
                        }
                    }
                },
                "data": {
                    "request": {}
                }
            }
        };
        this.oCardExtension._setCard(null,
            {
                getManifestEntry: function() {return oDummyObj;}
            }
        );
        UrlGenerateHelper.processPrivateParams = function() {return {content: "content"};};
        var bResult = this.oCardExtension.getFormatters().formatContentDataUrlForSemanticDate();
        assert.equal(bResult, "#testUrl/content");
    });
    QUnit.test("formatValueColor", function (assert) {
        var argument1 = 101299.22;
        var oStaticValues = {
            "deviationLow": "4000",
            "deviationHigh": "",
            "toleranceLow": "3000",
            "toleranceHigh": "",
            "bIsDeviationLowBinding": false,
            "bIsDeviationHighBinding": false,
            "bIsToleranceLowBinding": false,
            "bIsToleranceHighBinding": false,
            "sImprovementDirection": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximizing",
            "oCriticalityConfigValues": {
                "None": "Neutral",
                "Negative": "Error",
                "Critical": "Critical",
                "Positive": "Good"
            }
        };
        var sResult = this.oCardExtension.getFormatters().formatValueColor(argument1, oStaticValues);
        assert.ok(sResult === "Good", "the value color is formatted");
    });
    QUnit.test("formatTrendIcon", function (assert) {
        var arguments1 = "2028";
        var argument2 = "1009";
        var oStaticValues = {
            referenceValue: "1000",
            downDifference: 10,
            upDifference: 50,
            bIsRefValBinding: false,
            bIsDownDiffBinding: false,
            bIsUpDiffBinding: false
        };
        var sResult = this.oCardExtension.getFormatters().formatTrendIcon(arguments1, oStaticValues);
        assert.ok(sResult === "Up", "The trend type is UP");
        oStaticValues.upDifference = 1029;
        var sResult1 = this.oCardExtension.getFormatters().formatTrendIcon(argument2, oStaticValues);
        assert.ok(sResult1 === "Down", "The trend type is Down");
    });
    QUnit.test("formatDate", function (assert) {
        var sDateValue = "/Date(1530403200000)/";
        var formatterProperties = {
            "relative": true,
            "relativeScale": "auto",
            "bUTC": true
        };
        // Calculate expected relative time dynamically
        var currentDate = new Date();
        //extract numeric part from the sDateValue and convert it to corresponding date.
        var dateValue = new Date(parseInt(sDateValue.match(/\d+/)[0]));

        // Calculate the difference in years between sDateValue and current date
        var yearsAgo = currentDate.getFullYear() - dateValue.getFullYear();
        var expected = yearsAgo + " years ago";

        var sResult = this.oCardExtension.getFormatters().formatDate(sDateValue, formatterProperties);
        assert.ok(sResult == expected, "The date value is formatted");
    });
    QUnit.test("getMinMax", function (assert) {
        var sPath = "NonManagedSpendAmount";
        var sType = "min";
        var aData = [
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "",
                "MaterialGroupName": "1",
                "TotalSpendAmount": "100833308563.58",
                "TotalSpendAmount_F": "100,833,308,563.58 EUR",
                "NonManagedSpendAmount": "100833118397.44",
                "NonManagedSpendAmount_F": "100,833,118,397.44 EUR",
                "NonManagedSpendInPct": "100",
                "NonManagedSpendInPct_F": "100",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "L001",
                "MaterialGroupName": "Trading Materials",
                "TotalSpendAmount": "39438664.71",
                "TotalSpendAmount_F": "39,438,664.71 EUR",
                "NonManagedSpendAmount": "502005.99",
                "NonManagedSpendAmount_F": "502,005.99 EUR",
                "NonManagedSpendInPct": "1",
                "NonManagedSpendInPct_F": "1",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "P001",
                "MaterialGroupName": "Services",
                "TotalSpendAmount": "164196.54",
                "TotalSpendAmount_F": "164,196.54 EUR",
                "NonManagedSpendAmount": "163997.42",
                "NonManagedSpendAmount_F": "163,997.42 EUR",
                "NonManagedSpendInPct": "100",
                "NonManagedSpendInPct_F": "100",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "P002",
                "MaterialGroupName": "Expenses",
                "TotalSpendAmount": "17201.53",
                "TotalSpendAmount_F": "17,201.53 EUR",
                "NonManagedSpendAmount": "6600.00",
                "NonManagedSpendAmount_F": "6,600.00 EUR",
                "NonManagedSpendInPct": "38",
                "NonManagedSpendInPct_F": "38",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "L002",
                "MaterialGroupName": "Raw Materials",
                "TotalSpendAmount": "1889492.37",
                "TotalSpendAmount_F": "1,889,492.37 EUR",
                "NonManagedSpendAmount": "11.90",
                "NonManagedSpendAmount_F": "11.90 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "A001",
                "MaterialGroupName": "On Account Billed",
                "TotalSpendAmount": "23.80",
                "TotalSpendAmount_F": "23.80 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "L003",
                "MaterialGroupName": "Semi-Finished Goods",
                "TotalSpendAmount": "11112234.50",
                "TotalSpendAmount_F": "11,112,234.50 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "L004",
                "MaterialGroupName": "Finished Goods",
                "TotalSpendAmount": "51185070.85",
                "TotalSpendAmount_F": "51,185,070.85 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "L005",
                "MaterialGroupName": "Unvaluated Materials",
                "TotalSpendAmount": "8376622.39",
                "TotalSpendAmount_F": "8,376,622.39 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "L008",
                "MaterialGroupName": "Hardware",
                "TotalSpendAmount": "1307192.53",
                "TotalSpendAmount_F": "1,307,192.53 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "YBMM00",
                "MaterialGroupName": "Non-Sto Mat. w.o ID",
                "TotalSpendAmount": "303.23",
                "TotalSpendAmount_F": "303.23 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "YBMM01",
                "MaterialGroupName": "Non-Sto Mat. w. ID",
                "TotalSpendAmount": "206586.07",
                "TotalSpendAmount_F": "206,586.07 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            },
            {
                "DisplayCurrency": "EUR",
                "MaterialGroup": "YBPM01",
                "MaterialGroupName": "Spare parts",
                "TotalSpendAmount": "388.81",
                "TotalSpendAmount_F": "388.81 EUR",
                "NonManagedSpendAmount": "0",
                "NonManagedSpendAmount_F": "0.00 EUR",
                "NonManagedSpendInPct": "0",
                "NonManagedSpendInPct_F": "0",
                "NonManagedSpendInPct_E": ""
            }
        ];
        this.oCardExtension.getCard = function () {
            return {
                getModel: function () {
                    return {
                        getProperty: function(){
                            return aData;
                        }
                    };
                }
            };
        };
        var sResult = this.oCardExtension.getFormatters().getMinMax(sPath, sType);
        assert.ok(sResult === 0, "When type is min the min value is obtained");
        var sType1 = "max";
        var sResult1 = this.oCardExtension.getFormatters().getMinMax(sPath, sType1);
        assert.ok(sResult1 === 100833118397.44, "When type is max the max value is obtained");
    });
});