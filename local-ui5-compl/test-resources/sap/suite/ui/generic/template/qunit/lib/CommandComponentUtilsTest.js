sap.ui.define([
    "testUtils/sinonEnhanced",
    "sap/suite/ui/generic/template/lib/CommandComponentUtils",
    "sap/suite/ui/generic/template/js/AnnotationHelper"
], function (sinon, CommandComponentUtils, AnnotationHelper) {
    var oSandbox,
        oCommandComponentUtils,
        oComponentRegistryEntry = {
            utils: {
                getOutboundNavigationIntent: Function.prototype
            }
        };

    QUnit.module("Tests for DataFieldForAction and DataFieldForIntentBasedNavigation's keyboard shortcut formatters", {
        beforeEach: function () {
            oSandbox = sinon.sandbox.create();
            oCommandComponentUtils = new CommandComponentUtils(oComponentRegistryEntry);
        },
        afterEach: function () {
            oSandbox.restore();
            oCommandComponentUtils = undefined;
        }
    }, function () {
        function getDataFieldForAction() {
            return {
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
                Action: {
                    String: "EntitySetsContainer/FunctionImportName"
                }
            };
        }

        function getDataFieldForIntentBasedNavigation() {
            return {
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                Action: {
                    String: "Action"
                },
                SemanticObject: {
                    String: "SemanticObject"
                }
            };
        }

        function getAnnotatedActionPageSettings() {
            return {
                annotatedActions: {
                    FunctionImportName: {
                        command: "FunctionImportCommand"
                    }
                }
            };
        }

        function getOutboundManifest() {
            return {
                "sap.app": {
                    crossNavigation: {
                        outbounds: {
                            OutboundName: {
                                semanticObject: "SemanticObject",
                                action: "Action"
                            }
                        }
                    }
                }
            };
        }

        QUnit.test("Function getToolbarDataFieldForActionCommandDetails is available", function (assert) {
            assert.ok(oCommandComponentUtils.getToolbarDataFieldForActionCommandDetails);
        });

        QUnit.test("getToolbarDataFieldForActionCommandDetails", function (assert) {
            var oDataField = getDataFieldForAction();
            var oPageSettings = getAnnotatedActionPageSettings();
            oSandbox.stub(AnnotationHelper, "getStableIdPartForDatafieldActionButton").returns("ActionId");
            oSandbox.stub(AnnotationHelper, "getSuffixFromIconTabFilterKey").returns("");
            var oExpectedResult = {
                id: "ActionId",
                action: "FunctionImportCommand",
                callbackName: "._templateEventHandlers.onCallActionFromToolBar",
                annotatedAction: true
            };

            var oResult = oCommandComponentUtils.getToolbarDataFieldForActionCommandDetails(oDataField, oPageSettings, {}, {});

            assert.deepEqual(oResult, oExpectedResult, "should return correct table toolbar DataFieldForAction command details for action which has an associated command");
        });

        QUnit.test("getToolbarDataFieldForActionCommandDetails", function (assert) {
            var oDataField = getDataFieldForAction();
            oSandbox.stub(AnnotationHelper, "getStableIdPartForDatafieldActionButton").returns("ActionId");
            oSandbox.stub(AnnotationHelper, "getSuffixFromIconTabFilterKey").returns("");

            var oResult = oCommandComponentUtils.getToolbarDataFieldForActionCommandDetails(oDataField, {}, {}, {});

            assert.deepEqual(oResult, {}, "should return correct table toolbar DataFieldForAction command details for action which does not have an associated command");
        });

        QUnit.test("getToolbarDataFieldForActionCommandDetails", function (assert) {
            var oDataField = getDataFieldForAction();
            oDataField.Inline = "true";
            var oPageSettings = getAnnotatedActionPageSettings();
            oSandbox.stub(AnnotationHelper, "getStableIdPartForDatafieldActionButton").returns("ActionId");
            oSandbox.stub(AnnotationHelper, "getSuffixFromIconTabFilterKey").returns("");

            var oResult = oCommandComponentUtils.getToolbarDataFieldForActionCommandDetails(oDataField, oPageSettings, {}, {});

            assert.deepEqual(oResult, {}, "should return correct table toolbar inline DataFieldForAction command details for action which has an associated command");
        });

        QUnit.test("Function getToolbarDataFieldForIBNCommandDetails is available", function (assert) {
            assert.ok(oCommandComponentUtils.getToolbarDataFieldForIBNCommandDetails);
        });

        QUnit.test("getToolbarDataFieldForIBNCommandDetails", function (assert) {
            var oDataField = getDataFieldForIntentBasedNavigation();
            oDataField.Inline = "true";

            var oResult = oCommandComponentUtils.getToolbarDataFieldForIBNCommandDetails(oDataField);

            assert.deepEqual(oResult, Object.create(null), "should return empty object for inline DataFieldForIBN");
        });

        QUnit.test("getToolbarDataFieldForIBNCommandDetails", function (assert) {
            var oDataField = getDataFieldForIntentBasedNavigation();
            var oPageSettings = {
                outbounds: {
                    OutboundName: {
                        command: "OutboundCommand"
                    }
                }
            };
            var oManifest = getOutboundManifest();
            oSandbox.stub(AnnotationHelper, "getStableIdPartForDatafieldActionButton").returns("ActionId");
            oSandbox.stub(AnnotationHelper, "getSuffixFromIconTabFilterKey").returns("");
            oSandbox.stub(oComponentRegistryEntry.utils, "getOutboundNavigationIntent").returns({
                semanticObject: "SemanticObject",
                action: "Action"
            });
            var oExpectedResult = {
                id: "ActionId",
                action: "OutboundCommand",
                callbackName: "._templateEventHandlers.onDataFieldForIntentBasedNavigation",
                outboundAction: true
            };

            var oResult = oCommandComponentUtils.getToolbarDataFieldForIBNCommandDetails(oDataField, oPageSettings, oManifest);

            assert.deepEqual(oResult, oExpectedResult, "should return correct DataFieldForIBN details");
        });
    });
});