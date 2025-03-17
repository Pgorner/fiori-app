sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
    "sap/base/util/isEmptyObject",
    "sap/ovp/handlers/SmartFilterbarHandler"
], function (
    Controller,
    SmartFilterBar,
    isEmptyObject,
    SmartFilterbarHandler
) {
    "use strict";

    var oController, oGlobalFilter;

    QUnit.module("SmartFilterbarHandler", {
        beforeEach: function () {
            return Controller.create({
                name: "sap.ovp.app.Main"
            }).then(function (controller) {
                oController = controller;
                oGlobalFilter = new SmartFilterBar();
                var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
                getGlobalFilterStub.returns(oGlobalFilter);
            });
        }
    });

    QUnit.test("Get Filter bar configurations without custom filters", function (assert) {
        var selectionVariant = {
            Version: {
                Major: "1",
                Minor: "0",
                Patch: "0",
            },
            SelectionVariantID: "",
            Text: "Selection Variant with ID ",
            ODataFilterExpression: "",
            Parameters: [],
            SelectOptions: [],
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);
        var fnDone = assert.async();
        SmartFilterbarHandler.getFilterBarConfiguration(undefined, oController).then(function (data) {
            var val = data;
            assert.ok(isEmptyObject(val.customData._CUSTOM), "Custom Filters must be empty");
            assert.ok(isEmptyObject(val.customData._EXTENSION), "Extension Filters must be empty");
            assert.ok(val.selectionVariant === sSelectionVariant, "Selection Variant Must be empty");
            fnDone();
        })
    });

    QUnit.test("Get Filter bar configurations with custom filters", function (assert) {
        var customData = 'dummyCustomData';
        var extensionData = 'dummyExtensionData'

        var getFilterDataStub = sinon.stub(oGlobalFilter, "getFilterData");
        getFilterDataStub.returns({});

        var _getCustomAppStateStub = sinon.stub(oController, "_getCustomAppState");
        _getCustomAppStateStub.returns({
            "sap.ovp.app.customData": customData,
            "sap.ovp.app.extensionData": extensionData
        });

        var fnDone = assert.async();
        SmartFilterbarHandler.getFilterBarConfiguration(undefined, oController).then(function (data) {
            var val = data;
            assert.ok(val.customData._CUSTOM === customData, "Custom Filters is present");
            assert.ok(val.customData._EXTENSION === extensionData, "Extension Filters is present");
            fnDone();
        })
    });
});