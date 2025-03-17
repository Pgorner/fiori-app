sap.ui.define([
    "sap/apf/cloudFoundry/ui/utils/ComponentCorrector",
    "sap/ui/core/library",
    "sap/ui/core/Component",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (ComponentCorrector, CoreLibrary, Component, JSONModel, sinon) {
    "use strict";

    QUnit.module("ComponentCorrector", {
        beforeEach: function() {
        },
        afterEach: function() {
        }
    });
    QUnit.test("Constructor", function (assert) {
        assert.throws(function() {
            ComponentCorrector(); //eslint-disable-line new-cap
        }, "Constructor throws if not called with new");
        assert.throws(function() {
            new ComponentCorrector(); //eslint-disable-line no-new
        }, "Constructor throws if not passed an argument");
        assert.throws(function() {
            new ComponentCorrector({}); //eslint-disable-line no-new
        }, "Constructor throws if not passed a Component as argument");
        assert.ok(new ComponentCorrector(new Component()) instanceof ComponentCorrector, "Given a Component, the ComponentCorrector is constructed correctly");
    });
    QUnit.test("createView with Model", function(assert) {
        var oComponent = new Component();
        var oModel = new JSONModel();
        oComponent.setModel(oModel, "test");
        oComponent.setModel(oModel, "setByController");
        var oComponentCorrector = new ComponentCorrector(oComponent);
        return oComponentCorrector.createView({
            viewName : "test.sap.apf.cloudFoundry.ui.utils.view.Test",
            type : CoreLibrary.mvc.ViewType.XML,
            viewData: {}
        }).then(function(oView) {
            assert.strictEqual(oView.getController().getOwnerComponent(), oComponent, "The owner Component is set correctly");
            assert.strictEqual(oView.getParent(), oComponent, "The Component is set as parent for rendering");
            assert.strictEqual(oView.getModel("test"), oComponent.getModel("test"), "The Model from the Component is applied to the View");
            assert.notStrictEqual(oView.getModel("setByController"), oComponent.getModel("setByController"), "The Model set by the Controller is not overwritten");
        });
    });
    QUnit.test("createView with destroyed view", function(assert) {
        var oComponent = new Component();
        var oModel = new JSONModel();
        oComponent.setModel(oModel, "test");
        oComponent.setModel(oModel, "setByController");
        var oComponentCorrector = new ComponentCorrector(oComponent);
        return oComponentCorrector.createView({
            viewName : "test.sap.apf.cloudFoundry.ui.utils.view.Test",
            type : CoreLibrary.mvc.ViewType.XML,
            viewData: {
                bDestroyYourself: true
            }
        }).then(function(oView) {
            assert.strictEqual(oView, null, "oView is null");
        });
    });
});
