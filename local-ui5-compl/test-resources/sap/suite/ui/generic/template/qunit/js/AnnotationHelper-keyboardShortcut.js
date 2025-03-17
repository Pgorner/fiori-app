sap.ui.define([
    "sap/suite/ui/generic/template/js/AnnotationHelper"
], function (AnnotationHelper) {
    var oSandbox;
    QUnit.module("Tests for DataFieldForAction and DataFieldForIntentBasedNavigation's keyboard shortcut formatters", {
        beforeEach: function () {
            oSandbox = sinon.sandbox.create();
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

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

    function getOutboundPageSettings() {
        return {
            outbounds: {
                OutboundName: {
                    command: "OutboundCommand"
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

    QUnit.test("Function getAnnotatedActionPress is available", function (assert) {
        assert.ok(AnnotationHelper.getAnnotatedActionPress);
    });

    QUnit.test("getAnnotatedActionPress", function (assert) {
        var oPageSettings = getAnnotatedActionPageSettings();
        var oDataField = getDataFieldForAction();
        var sExpectedResult = "cmd:FunctionImportCommand";

        var sResult = AnnotationHelper.getAnnotatedActionPress(oPageSettings, oDataField);

        assert.equal(sResult, sExpectedResult, "should return correct press handler for DataFieldForAction with a command for LR table toolbar");
    });

    QUnit.test("getAnnotatedActionPress", function (assert) {
        var oDataField = getDataFieldForAction();
        var sExpectedResult = "._templateEventHandlers.onDeterminingDataFieldForAction";

        var sResult = AnnotationHelper.getAnnotatedActionPress({}, oDataField, {}, true);

        assert.equal(sResult, sExpectedResult, "should return correct press handler for DataFieldForAction without a command for OP determining action");
    });

    QUnit.test("getAnnotatedActionPress", function (assert) {
        var oDataField = getDataFieldForAction();
        var sExpectedResult = "sOpHeaderCallAction";

        var sResult = AnnotationHelper.getAnnotatedActionPress({}, oDataField, {}, false, "sOpHeaderCallAction");

        assert.equal(sResult, sExpectedResult, "should return correct press handler for DataFieldForAction without a command for OP non determining action");
    });

    QUnit.test("getAnnotatedActionPress", function (assert) {
        var oDataField = getDataFieldForAction();
        var sExpectedResult = "._templateEventHandlers.onCallActionFromToolBar";

        var sResult = AnnotationHelper.getAnnotatedActionPress({}, oDataField, {}, false, undefined);

        assert.equal(sResult, sExpectedResult, "should return correct press handler for DataFieldForAction without a command for OP table toolbar action");
    });

    QUnit.test("getAnnotatedActionPress", function (assert) {
        var oPageSettings = getOutboundPageSettings();
        var oDataField = getDataFieldForIntentBasedNavigation();
        var oManifest = getOutboundManifest();
        var sExpectedResult = "cmd:OutboundCommand";

        var sResult = AnnotationHelper.getAnnotatedActionPress(oPageSettings, oDataField, oManifest);

        assert.equal(sResult, sExpectedResult, "should return correct press handler for DataFieldForIBN with a command for LR table toolbar");
    });

    QUnit.test("getAnnotatedActionPress", function (assert) {
        var oDataField = getDataFieldForIntentBasedNavigation();
        var oManifest = {
            "sap.app": {}
        };
        var sExpectedResult = "._templateEventHandlers.onDataFieldForIntentBasedNavigation";

        var sResult = AnnotationHelper.getAnnotatedActionPress({}, oDataField, oManifest, false);

        assert.equal(sResult, sExpectedResult, "should return correct press handler for DataFieldForIBN without a command for OP table toolbar action");
    });
});