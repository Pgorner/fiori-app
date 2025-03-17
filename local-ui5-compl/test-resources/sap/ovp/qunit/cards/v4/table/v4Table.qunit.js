/*global QUnit*/

sap.ui.define([
    "sap/ovp/cards/CommonUtils",
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ui/core/mvc/Controller",
    "sap/m/Table",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover"
], function (
    CommonUtils,
    utils,
    OVPCardAsAPIUtils,
    Controller,
    Table,
    ColumnListItem,
    Label,
    JSONModel,
    Popover
) {
    "use strict";

    var oController;
    QUnit.module("sap.ovp.cards.Table", {
        beforeEach: function() {
            return Controller.create({
                name: "sap.ovp.cards.v4.table.Table"
            }).then(function(controller) { 
               oController = controller;
            });
        }
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    
    QUnit.test("Card Test - Testing card item binding info", function (assert) {
        oController.getView = function () {
                return {
                    byId: function (arg) {
                        if (arg && arg === "ovpTable") {
                            return {
                                getBindingInfo: function (arg) {
                                    if (arg && arg === "items") {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                            };
                        } else {
                            return {
                                getBindingInfo: function () {
                                    return false;
                                },
                            };
                        }
                    },
                };
            };
            var expectedResult = true;
            assert.deepEqual(oController.getCardItemBindingInfo(), expectedResult);
        });
        
    QUnit.test("Card Test - Testing card item binding info", function (assert) {
        var tableData = {
            results: [
                {
                    BusinessProcess: "FI",
                },
            ],
        };
        var oTable = new Table({
            id: "ovpTable",
            headerText: "JavaScript",
            inset: true,
        });
        var oTemplate = new ColumnListItem({
            cells: [
                new Label({
                    text: "{test>BusinessProcess}",
                }),
            ],
        });
        var model = new JSONModel();
        model.setData(tableData);
        oTable.setModel(model, "test");
        oTable.bindItems("test>/results", oTemplate);
        oController.getView = function () {
            return {
                byId: function () {
                    return oTable;
                },
            };
        };
        assert.ok(oController.getCardItemBindingInfo().path == "/results", "To check the items path");
        oTable.destroy();
    }); 

    /**
     *  ------------------------------------------------------------------------------
     *  End of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for onItemPress Function
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("table Card Test - On Content click of OVP Cards used as an API in other Applications", function (assert) {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed").returns(true);
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked").returns(undefined);
        oController.checkAPINavigation = function () {
            return 1;
        };
        var actualValue = oController.onColumnListItemPress();
        assert.ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    }); 

    /**
     *  ------------------------------------------------------------------------------
     *  Test Cases for OnContact Details Press
     *  ------------------------------------------------------------------------------
     */

    QUnit.test("Table Card Test - navigation from contact details", function (assert) {
        var oBindingContext = {
            getPath: function () {
                return "/BusinessPartnerSet('0100000004')";
            },
        };
        var oPopover = [
            new Popover({
                title: "Sample Popover",
            }),
        ];

        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            },
                        };
                    },
                };
            },
        };
        var openByStub = sinon.stub(oPopover[0], "openBy").returns(null);
        oController.onContactDetailsLinkPress(oEvent);
        assert.ok(
            oPopover[0].mObjectBindingInfos.undefined.path === "/BusinessPartnerSet('0100000004')",
            "Binding path is fetched for Popover"
        );
        openByStub.restore();
    });

    QUnit.test("Table Card Test - navigation from contact details When binding context is null", function (assert) {
        var oBindingContext = null;
        var oPopover = [
            new Popover({
                title: "Sample Popover",
            }),
        ];
        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            },
                        };
                    },
                };
            },
        };
        var actualValue = oController.onContactDetailsLinkPress(oEvent);
        assert.ok(actualValue === undefined, "Function returns undefined if the binding context is null");
    });
});
