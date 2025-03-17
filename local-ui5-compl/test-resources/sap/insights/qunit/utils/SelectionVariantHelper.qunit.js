/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/utils/SelectionVariantHelper',
	'sap/ui/model/json/JSONModel'
], function(SelectionVariantHelper, JSONModel) {
	"use strict";
	var oMockedData = null;
	var oJsonModel = new JSONModel();
	var pMockedDataLoaded = oJsonModel.loadData(sap.ui.require.toUrl("test-resources/sap/insights/qunit/__mocks__/SelectionVariantHelper.json")).then(function(){
		oMockedData = oJsonModel.getData();
	});
	QUnit.module("SelectionVariantHelper test cases", {
		before: function() {
			// ensure that tests can safely access oMockedData
			return pMockedDataLoaded;
		},
		beforeEach: function () {
			this.oSandbox = sinon.sandbox.create();
            this.oSelectionVariantHelper = SelectionVariantHelper;
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oSelectionVariantHelper = null;
		}
	});
    /**
	 * Test cases to verify the scenarios for getFilterQueryFromSV
	 */
     QUnit.test("getFilterQueryFromSV", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getFilterQueryFromSV.oSV._mParameters,
            _mSelectOptions: oMockedData.getFilterQueryFromSV.oSV._mSelectOptions,
            _sId: "",
            getSelectOptionsPropertyNames: function() {return ["SalesGroup"];},
            getSelectOption: function(sProperty) { return oMockedData.getFilterQueryFromSV.oSV.getSelectOption;}
        },
            olookup = oMockedData.getFilterQueryFromSV.olookup;
        var result = this.oSelectionVariantHelper.getFilterQueryFromSV(oSV, olookup);
        assert.equal(result, "$filter=%28SalesGroup%20eq%20%27SAP%27%29", "filter parameters received");
    });
    QUnit.test("getFilterQueryFromSV sign E", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getFilterQueryFromSVSignE.oSV._mParameters,
            _mSelectOptions: oMockedData.getFilterQueryFromSVSignE.oSV._mSelectOptions,
            _sId: "",
            getSelectOptionsPropertyNames: function() {return ["SalesGroup"];},
            getSelectOption: function(sProperty) { return oMockedData.getFilterQueryFromSVSignE.oSV.getSelectOption;}
        },
            olookup = oMockedData.getFilterQueryFromSVSignE.olookup;
        var result = this.oSelectionVariantHelper.getFilterQueryFromSV(oSV, olookup);
        assert.equal(result, "$filter=%28not%20%28SalesGroup%20eq%20%27SAP%27%29%29", "filter parameters received");
    });
    QUnit.test("getFilterQueryFromSV with empty existingString", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getFilterQueryFromSVExistingString.oSV._mParameters,
            _mSelectOptions: oMockedData.getFilterQueryFromSVExistingString.oSV._mSelectOptions,
            _sId: "",
            getSelectOptionsPropertyNames: function() {return ["SalesGroup", "PurchaseGroup"];},
            getSelectOption: function(sProperty) { return oMockedData.getFilterQueryFromSVExistingString.oSV.getSelectOption;}
        },
            olookup = oMockedData.getFilterQueryFromSVExistingString.olookup;
        var result = this.oSelectionVariantHelper.getFilterQueryFromSV(oSV, olookup);
        assert.equal(result, "$filter=%28SalesGroup%20ne%20%27SAP%27%29%20and%20%28not%20%28%28SalesGroup%20ge%20%27SAP%27%20and%20SalesGroup%20le%20%27null%27%29%29%29%20and%20%28PurchaseGroup%20ne%20%27SAP%27%29%20and%20%28not%20%28%28PurchaseGroup%20ge%20%27SAP%27%20and%20PurchaseGroup%20le%20%27null%27%29%29%29", "filter parameters received");
    });
    QUnit.test("getFilterQueryFromSV with empty select option CP", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getFilterQueryFromSVOptionCP.oSV._mParameters,
            _mSelectOptions: oMockedData.getFilterQueryFromSVOptionCP.oSV._mSelectOptions,
            _sId: "",
            getSelectOptionsPropertyNames: function() {return ["SalesGroup", "PurchaseGroup"];},
            getSelectOption: function(sProperty) { return oMockedData.getFilterQueryFromSVOptionCP.oSV.getSelectOption;}
        },
            olookup = oMockedData.getFilterQueryFromSVOptionCP.olookup;
        var result = this.oSelectionVariantHelper.getFilterQueryFromSV(oSV, olookup);
        assert.equal(result,"$filter=%28SalesGroup%20ne%20%27SAP%27%29%20and%20%28not%20%28substringof%28%27SAP%27%2cSalesGroup%29%29%29%20and%20%28PurchaseGroup%20ne%20%27SAP%27%29%20and%20%28not%20%28substringof%28%27SAP%27%2cPurchaseGroup%29%29%29"
        , "filter parameters received");
    });
    QUnit.test("getFilterQueryFromSV with select I NE", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getFilterQueryFromSVOptionINE.oSV._mParameters,
            _mSelectOptions: oMockedData.getFilterQueryFromSVOptionINE.oSV._mSelectOptions,
            _sId: "",
            getSelectOptionsPropertyNames: function() {return ["SalesGroup", "PurchaseGroup"];},
            getSelectOption: function(sProperty) { return oMockedData.getFilterQueryFromSVOptionINE.oSV.getSelectOption;}
        },
            olookup = oMockedData.getFilterQueryFromSVOptionINE.olookup;
        var result = this.oSelectionVariantHelper.getFilterQueryFromSV(oSV, olookup);
        assert.equal(result, "$filter=%28not%20%28SalesGroup%20ne%20%27SAP%27%29%20and%20not%20%28substringof%28%27SAP%27%2cSalesGroup%29%29%29%20and%20%28not%20%28PurchaseGroup%20ne%20%27SAP%27%29%20and%20not%20%28substringof%28%27SAP%27%2cPurchaseGroup%29%29%29"
        , "filter parameters received");
    });
    QUnit.test("getParameterQueryFromSV", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getParameterQueryFromSV.oSV._mParameters,
            _mSelectOptions: oMockedData.getParameterQueryFromSV.oSV._mSelectOptions,
            _sId: "",
            getParameterNames: function() {return oMockedData.getParameterQueryFromSV.oSV.getParameterNames;},
            getParameter: function(sParam) {
                switch (sParam) {
                    case "P_ExchangeRateType": return "M";
                    case "P_DisplayCurrency": return "USD";
                    case "P_NumberOfMonths": return "4";
                }
            },
            getSelectOptionsPropertyNames: function() {return ["SalesGroup"];},
            getSelectOption: function() {return oMockedData.getParameterQueryFromSV.oSV.getSelectOption;}
        },
            olookup = oMockedData.getParameterQueryFromSV.olookup;
        var result = this.oSelectionVariantHelper.getParameterQueryFromSV(oSV, olookup);
        assert.equal(result, "(P_ExchangeRateType%3d%27M%27%2cP_DisplayCurrency%3d%27USD%27%2cP_NumberOfMonths%3d4)", "ParameterQueryFromSV received");
    });
    QUnit.test("getParameterQueryFromSV Option CP", function(assert) {
        var oSV = {
            _mParameters: oMockedData.getParameterQueryFromSVOptionCP.oSV._mParameters,
            _mSelectOptions: oMockedData.getParameterQueryFromSVOptionCP.oSV._mSelectOptions,
            _sId: "",
            getParameterNames: function() {return oMockedData.getParameterQueryFromSVOptionCP.oSV.getParameterNames;},
            getParameter: function(sParam) {
                switch (sParam) {
                    case "P_ExchangeRateType": return "M";
                    case "P_DisplayCurrency": return "USD";
                    case "P_NumberOfMonths": return "4";
                }
            },
            getSelectOptionsPropertyNames: function() {return ["SalesGroup"];},
            getSelectOption: function() {return oMockedData.getParameterQueryFromSVOptionCP.oSV.getSelectOption;}
        },
            olookup = oMockedData.getParameterQueryFromSVOptionCP.olookup;
        var result = this.oSelectionVariantHelper.getParameterQueryFromSV(oSV, olookup);
        assert.equal(result, "(P_ExchangeRateType%3d%27M%27%2cP_DisplayCurrency%3d%27USD%27%2cP_NumberOfMonths%3d4)", "ParameterQueryFromSV received");
    });
    QUnit.test("getTokenFromSelectOptions", function(assert) {
        var aSelectOption = oMockedData.aSelectOption;
        var filter = "SalesGroup";
        var result = this.oSelectionVariantHelper.getTokenFromSelectOptions(aSelectOption, filter);
        assert.equal(result.length, 9, "TokenFromSelectOptions receieved");
    });
    QUnit.test("getTokenFromSelectOptions Starts With", function(assert) {
        var aSelectOption = oMockedData.aSelectOptionStartsWith;
        var filter = "SalesGroup";
        var result = this.oSelectionVariantHelper.getTokenFromSelectOptions(aSelectOption, filter);
        assert.equal(result.length, 2, "TokenFromSelectOptions receieved");
    });
    QUnit.test("getTokenFromSelectOptions Ends With", function(assert) {
        var aSelectOption = oMockedData.aSelectOptionEndsWith;
        var filter = "SalesGroup";
        var result = this.oSelectionVariantHelper.getTokenFromSelectOptions(aSelectOption, filter);
        assert.equal(result.length, 2, "TokenFromSelectOptions receieved");
    });
    QUnit.test("getTokenFromSelectOptions Starts and Ends With", function(assert) {
        var aSelectOption = oMockedData.aSelectOptionStartAndEndsWith;
        var filter = "SalesGroup";
        var result = this.oSelectionVariantHelper.getTokenFromSelectOptions(aSelectOption, filter);
        assert.equal(result.length, 2, "TokenFromSelectOptions receieved");
    });
    QUnit.test("getSelectOptionFromRange", function(assert) {
        var oRange = {
            exclude: "E",
            operation: "StartsWith",
            Option: "CP",
            value1: 100,
            value2: 200
        },
        oResult = {
          "High": "200",
          "Low": "100*",
          "Option": "CP",
          "Sign": "E",
          "Text": "100*"
        };

        var result = this.oSelectionVariantHelper.getSelectOptionFromRange(oRange);
        assert.deepEqual(result, oResult, "Received SelectOptionFromRange");
    });
    QUnit.test("getSelectOptionFromRange EndsWith", function(assert) {
        var oRange = {
            exclude: "E",
            operation: "EndsWith",
            Option: "CP",
            value1: 100,
            value2: 200
        },
        oResult = {
            "High": "200",
            "Low": "*100",
            "Option": "CP",
            "Sign": "E",
            "Text": "*100"
          };
        var result = this.oSelectionVariantHelper.getSelectOptionFromRange(oRange);
        assert.deepEqual(result,oResult, "Received SelectOptionFromRange");
    });
    QUnit.test("getSelectOptionFromRange Contains", function(assert) {
        var oRange = {
            exclude: "E",
            operation: "Contains",
            Option: "CP",
            value1: 100,
            value2: 200
        },
        oResult = {
            "High": "200",
            "Low": "*100*",
            "Option": "CP",
            "Sign": "E",
            "Text": "*100*"
          };
        var result = this.oSelectionVariantHelper.getSelectOptionFromRange(oRange);
        assert.deepEqual(result,oResult, "Received SelectOptionFromRange");
    });
    QUnit.test("getSelectOptionFromRange Empty", function(assert) {
        var oRange = {
            exclude: "E",
            operation: "Empty",
            Option: "CP",
            value1: 100,
            value2: 200
        },
        oResult = {
            "High": "200",
            "Low": "",
            "Option": "EQ",
            "Sign": "E",
            "Text": "<EMPTY>"
        };
        var result = this.oSelectionVariantHelper.getSelectOptionFromRange(oRange);
        assert.deepEqual(result, oResult, "Received SelectOptionFromRange");
    });
    QUnit.test("getEmptySVStringforProperty", function(assert) {
        var result = typeof (this.oSelectionVariantHelper.getEmptySVStringforProperty());
        assert.equal(result, "string", "Received getEmptySVStringforProperty value as String");
    });
});