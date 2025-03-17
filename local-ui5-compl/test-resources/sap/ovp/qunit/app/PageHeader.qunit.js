sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller"
], function (
    Device,
    Controller
) {
    "use strict";

    var oController;
    QUnit.module("sap.ovp.app.Main", {
        beforeEach: function () {
            return Controller.create({
                name: "sap.ovp.app.Main"
            }).then(function(controller) { 
                oController = controller;
                oController.oLoadedComponents = {};
            }); 
        },
        afterEach: function () { },
    });

    /* 
     *   Mobile device test cases
     */
    QUnit.test("Test _collapseHeaderForPage: Collapse page header once Go button is clicked in mobile device, mandatory filters filled", function (assert) {
        Device.system.phone = true;
        oController.headerExpanded = true;
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (bValue) {
                            oController.headerExpanded = bValue;
                        },
                        getHeaderExpanded: function () {
                            return oController.headerExpanded;
                        },
                    };
                },
            };
        };
        sinon.stub(oController, "getGlobalFilter").returns({
            validateMandatoryFields: function() {
                return true;
            }
        });
        oController._collapseHeaderForPage();
        assert.ok(oController.headerExpanded === false, "Page header should be collapsed");
    });

    QUnit.test("Test _collapseHeaderForPage: Don't collapse page header once Go button is clicked in mobile device, mandatory filters not filled", function (assert) {
        Device.system.phone = true;
        oController.headerExpanded = true;
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (bValue) {
                            oController.headerExpanded = bValue;
                        },
                        getHeaderExpanded: function () {
                            return oController.headerExpanded;
                        },
                    };
                },
            };
        };
        sinon.stub(oController, "getGlobalFilter").returns({
            validateMandatoryFields: function() {
                return false;
            }
        });
        oController._collapseHeaderForPage();
        assert.ok(oController.headerExpanded === true, "Page header should not be collapsed");
    });
    
    /* 
     *   Desktop test cases
     */
    QUnit.test("Test _collapseHeaderForPage: Don't Collapse page header once Go button is clicked in non-mobile device, mandatiry filters filled", function (assert) {
        Device.system.phone = false;
        oController.headerExpanded = true;
        oController.getView = function () {
            return {
                byId: function (param) {
                    return {
                        setVisible: function (param) { },
                        setHeaderExpanded: function (bValue) {
                            oController.headerExpanded = bValue;
                        },
                        getHeaderExpanded: function () {
                            return oController.headerExpanded;
                        },
                    };
                },
            };
        };
        sinon.stub(oController, "verifyGlobalFilterLoaded").returns(true);
        oController._collapseHeaderForPage();
        assert.ok(oController.headerExpanded === true, "The Smart filter bar will be expanded.");
    });
});

