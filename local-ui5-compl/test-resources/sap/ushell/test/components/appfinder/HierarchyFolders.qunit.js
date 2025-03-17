// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.HierarchyFolders
 */
sap.ui.define([
    "sap/m/Page",
    "sap/m/SelectDialog",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig"
], function (
    Page,
    SelectDialog,
    Controller,
    JSONModel,
    jQuery,
    Container,
    ushellResources,
    fioriDemoConfig
) {
    "use strict";

    /* global QUnit, sinon */

    var oController;
    var aTestSystems = [
        { systemName: "testSystemName1", systemId: "testSystemId1" },
        { systemName: "testSystemName2", systemId: "testSystemId2" },
        { systemName: "testSystemName3", systemId: "testSystemId3" }
    ];

    QUnit.module("sap.ushell.components.appfinder.HierarchyFolders", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local").then(function () {
                Controller.create({ name: "sap.ushell.components.appfinder.HierarchyFolders" }).then(function (oResolvedController) {
                    oController = oResolvedController;
                    var oModel = new JSONModel();
                    oController.getView = function () {
                        return {
                            getModel: function (/*modelName*/) {
                                return oModel;
                            },
                            translationBundle: ushellResources.i18n
                        };
                    };
                    done();
                });
            });
        },

        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            oController.destroy();
        }
    });

    QUnit.test("setSystemSelected - should update in model", function (assert) {
        oController.createDialog();
        var oTestSystem = aTestSystems[0];
        oController.setSystemSelected(oTestSystem);

        assert.deepEqual(oController.getView().getModel().getProperty("/systemSelected"), oTestSystem, "system is updated in the model");

        oController.destroyDialog();
    });

    QUnit.test("setSystemSelected - should update in personalization", function (assert) {
        oController.createDialog();
        var oTestSystem = aTestSystems[0];
        oController.setSystemSelected(oTestSystem);
        var done = assert.async();

        oController.getSelectedSystemInPersonalization().then(function (oSystemFromPersonalization) {
            done();
            assert.deepEqual(oSystemFromPersonalization, oTestSystem, "system is updated in the personalization layer");
        });

        oController.destroyDialog();
    });

    QUnit.test("getSelectedSystem - with only one system", function (assert) {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", [aTestSystems[0]]);

        var spy = sinon.spy(oController, "getSelectedSystemInPersonalization");
        var done = assert.async();

        oController.getSelectedSystem().then(function (oSystem) {
            assert.deepEqual(oSystem, aTestSystems[0], "first system is selected");
            assert.ok(!spy.called, "getSelectedSystemInPersonalization should not be called");
            done();
        });

        oController.destroyDialog();
    });

    QUnit.test("getSelectedSystem - more then one system and value is stored in personalization", function (assert) {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", aTestSystems);

        var done = assert.async();

        sinon.stub(oController, "getSelectedSystemInPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(aTestSystems[1]);
            return oDeferred.promise();
        });
        oController.getSelectedSystem().then(function (oSystem) {
            assert.deepEqual(oSystem, aTestSystems[1], "second system is selected - since it's defined in personalization");
            done();
        });

        oController.destroyDialog();
    });

    QUnit.test("getSelectedSystem - more then one system, value is stored in personalization but not in the systems list", function (assert) {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", aTestSystems);

        var spy = sinon.spy(oController, "setSystemSelectedInPersonalization");
        var done = assert.async();

        sinon.stub(oController, "getSelectedSystemInPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                systemName: "someFakeSystemName",
                systemId: "someFakeSystemId"
            });
            return oDeferred.promise();
        });

        oController.getSelectedSystem().then(function (oSystem) {
            assert.ok(!oSystem, "when personalized system is not in the list should return undefined");
            assert.ok(spy.calledWith(), "system was removed from personalization");
            oController.destroyDialog();
            done();
        });
    });

    QUnit.test("onSystemSelectionPress - only one system in list should not open dialog", function (assert) {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", [aTestSystems[0]]);

        var spy = sinon.spy(oController.oDialog, "open");

        oController.onSystemSelectionPress();

        assert.ok(!spy.called, "dialog did not open");

        oController.destroyDialog();
    });

    QUnit.test("onSystemSelectionPress - should open dialog", function (assert) {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", aTestSystems);

        var spy = sinon.spy(oController.oDialog, "open");

        oController.onSystemSelectionPress();

        assert.ok(spy.called, "dialog opened");

        oController.destroyDialog();
    });

    QUnit.test("systemConfirmHandler - updates the model", function (assert) {
        oController.createDialog();
        var oTestSystem = aTestSystems[1],
            oItem = {
                getBindingContext: function () {
                    return {
                        getObject: function () {
                            return oTestSystem;
                        }
                    };
                }
            },
            oEvent = {
                getParameters: function () {
                    return { selectedItem: oItem };
                }
            };

        oController.systemConfirmHandler(oEvent);

        assert.deepEqual(oController.getView().getModel().getProperty("/systemSelected"), oTestSystem, "selected system is updated in the model");
    });

    QUnit.test("titleFormatter - with system name should return the system name", function (assert) {
        var result = oController.titleFormatter("some system name");
        assert.equal(result, "some system name");
    });

    QUnit.test("titleFormatter - without system name should return the system id", function (assert) {
        var result = oController.titleFormatter(undefined, "someId");
        assert.equal(result, "someId");
    });

    QUnit.test("descriptionFormatter - with system name should return the system id", function (assert) {
        var result = oController.descriptionFormatter("some system name", "someId");
        assert.equal(result, "someId");
    });

    QUnit.test("descriptionFormatter - without system name should return null", function (assert) {
        var result = oController.descriptionFormatter(undefined, "someId");
        assert.equal(result, null);
    });

    QUnit.test("selectedFormatter - with system name which is the selected system should return true", function (assert) {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemName: "name1", systemId: "id1" });
        var result = oController.selectedFormatter("name1", "id1");
        assert.equal(result, true);
    });

    QUnit.test("selectedFormatter - with system name which is not the selected system should return false", function (assert) {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemName: "name1", systemId: "id1" });
        var result = oController.selectedFormatter("name2", "Id2");
        assert.equal(result, false);
    });

    QUnit.test("selectedFormatter - without system name which is the selected system should return true", function (assert) {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemId: "id1" });
        var result = oController.selectedFormatter(undefined, "id1");
        assert.equal(result, true);
    });

    QUnit.test("selectedFormatter - without system name which is not the selected system should return false", function (assert) {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemId: "id1" });
        var result = oController.selectedFormatter(undefined, "Id2");
        assert.equal(result, false);
    });

    QUnit.test("systemSelectorTextFormatter - should return the system name ", function (assert) {
        var result = oController.systemSelectorTextFormatter({ systemName: "name1", systemId: "id1" });
        assert.ok(result === "name1");
    });

    QUnit.test("systemSelectorTextFormatter - should return the system id ", function (assert) {
        var result = oController.systemSelectorTextFormatter({ systemName: undefined, systemId: "id1" });
        assert.ok(result === "id1");
    });

    QUnit.test("systemSelectorTextFormatter - no system - should return 'Select System'", function (assert) {
        var result = oController.systemSelectorTextFormatter(undefined);
        assert.ok(result === oController.getView().translationBundle.getText("easyAccessSelectSystemTextWithoutSystem"));
    });
});
