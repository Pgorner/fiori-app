// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Settings.Components
 *
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ushell/Container",
    "sap/ushell/Config",
    "sap/ushell/state/StateManager"
], function (
    Component,
    Element,
    Container,
    Config,
    StateManager
) {
    "use strict";
    /*global QUnit sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("Settings ShellHeader button", {
        beforeEach: function () {
            this.oSettingsComponent = null;
            Config.emit("/core/shell/model/enableNotifications", false);

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oShellConfigStub = sandbox.stub();
            sandbox.stub(Container, "getRendererInternal").returns({
                getShellConfig: this.oShellConfigStub,
                reorderUserPrefEntries: sandbox.stub().returns([])
            });
            sandbox.stub(Container, "getUser").returns({getFullName: sandbox.stub()});

            sandbox.stub(StateManager, "updateAllBaseStates");
        },
        afterEach: function () {
            sandbox.restore();
            if (this.oSettingsComponent) {
                this.oSettingsComponent.destroy();
            }
        }
    });

    QUnit.test("create shell button if button is moved to header", function (assert) {
        var fnDone = assert.async();
        this.oShellConfigStub.returns({
            moveUserSettingsActionToShellHeader: true,
            enableSearch: false
        });
        Component.create({
            id: "sap-ushell-components-Settings-component",
            name: "sap.ushell.components.shell.Settings",
            componentData: {}
        }).then(function (oSettingsComponent) {
            this.oSettingsComponent = oSettingsComponent;
            assert.ok(Element.getElementById("userSettingsBtn"), "button was created");
            assert.ok(StateManager.updateAllBaseStates.calledOnce, "StateManager.updateAllBaseStates was called");
            fnDone();
        }.bind(this));
    });

    QUnit.test("don't create button if the button is not moved", function (assert) {
        var fnDone = assert.async();
        this.oShellConfigStub.returns({
            moveUserSettingsActionToShellHeader: false,
            enableSearch: false
        });
        Component.create({
            id: "sap-ushell-components-Settings-component",
            name: "sap.ushell.components.shell.Settings",
            componentData: {}
        }).then(function (oSettingsComponent) {
            this.oSettingsComponent = oSettingsComponent;
            assert.notOk(Element.getElementById("userSettingsBtn"), "button was not created");
            assert.ok(StateManager.updateAllBaseStates.notCalled, "StateManager.updateAllBaseStates was not called");
            fnDone();
        }.bind(this));
    });
});
