// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.PluginManager.MenuExtensions
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/services/PluginManager/MenuExtensions",
    "sap/ushell/EventHub"
], function (Container, fnMenuExtensions) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.services.PluginManager.MenuExtensions", {
        beforeEach: function () {

            this.oGetEntryProviderStub = sandbox.stub();
            sandbox.stub(Container, "getServiceAsync").resolves({
                getEntryProvider: this.oGetEntryProviderStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("MenuExtensions: getMenuEntryProvider", function (assert) {
        // Arrange
        var oMenuExtensions = fnMenuExtensions("test-plugin");
        // Act
        return oMenuExtensions.getMenuEntryProvider(["test-node"]).then(function () {
            // Assert
            assert.ok(this.oGetEntryProviderStub.calledOnce, "getMenuEntryProvider was called once.");
            assert.ok(this.oGetEntryProviderStub.calledWith("test-plugin", ["test-node"]), "getMenuEntryProvider was called with the expected arguments.");
        }.bind(this));
    });
});
