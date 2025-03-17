// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.SideNavigation.Component
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/Container"
], function (Component, XMLView, UIComponent, JSONModel, Config, Container) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("The function init", {
        beforeEach: function () {
            this.oModel = new JSONModel([
                { id: 1 }
            ]);

            this.oInitSpy = sandbox.spy(UIComponent.prototype, "init");

            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oMenuServiceMock = {
                isSideNavigationEnabled: sandbox.stub().resolves(true),
                getMenuModel: sandbox.stub().resolves(this.oModel)
            };

            this.oSetSideNavigationStub = sandbox.stub().callsFake((oComponentContainer) => {
                this._oComponentContainer = oComponentContainer;
            });

            const oRendererMock = {
                setSideNavigation: this.oSetSideNavigationStub
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("Menu").resolves(this.oMenuServiceMock);
            sandbox.stub(Container, "getRendererInternal").returns(oRendererMock);

            sandbox.stub(XMLView, "create").resolves();
        },
        afterEach: function () {
            this._oComponentContainer?.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls the Menu service correctly", async function (assert) {
        // Act
        const done = assert.async();
        Component.create({
            name: "sap.ushell.components.shell.SideNavigation"
        }).then((oComponent) => {
            return oComponent.oMenuModelPromise.then(() => {
                // Assert
                assert.strictEqual(this.oInitSpy.callCount, 1, "init was called once");
                assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "getService was called twice");
                assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["Menu"], "getService was called the first time with correct parameters");
                assert.strictEqual(this.oMenuServiceMock.isSideNavigationEnabled.callCount, 1, "isSideNavigationEnabled was called once");
                assert.strictEqual(this.oMenuServiceMock.getMenuModel.callCount, 1, "getMenuEntries was called once");
                // Cleanup
                oComponent.destroy();
                done();
            });
        });
    });

    QUnit.test("Creates and places the sideNavigation in ComponentContainer when enabled", function (assert) {
        // Act
        const done = assert.async();
        Component.create({
            name: "sap.ushell.components.shell.SideNavigation"
        }).then((oComponent) => {
            return oComponent.oMenuModelPromise.then(() => {
                // Assert
                assert.ok(oComponent, "Component was created");
                assert.strictEqual(this.oSetSideNavigationStub.callCount, 1, "setSideNavigation was called once");
                assert.strictEqual(this._oComponentContainer.getComponentInstance(), oComponent, "The Component was placed in the ComponentContainer");
                // Cleanup
                oComponent.destroy();
                done();
            });
        });
    });

    QUnit.test("Creates the sideNavigation but does not place it when disabled", function (assert) {
        // Arrange
        this.oMenuServiceMock.isSideNavigationEnabled.resolves(false);
        // Act
        const done = assert.async();
        Component.create({
            name: "sap.ushell.components.shell.SideNavigation"
        }).then((oComponent) => {
            return oComponent.getMenuModelPromise().then(() => {
                // Assert
                assert.ok(oComponent, "Component was created");
                assert.notOk(this._oComponentContainer, "ComponentContainer was not created");
                // Cleanup
                oComponent.destroy();
                done();
            });
        });
    });

    QUnit.test("Resolves the init promise", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("Menu").resolves(this.oMenuServiceMock);
        // Act
        const done = assert.async();
        Component.create({
            name: "sap.ushell.components.shell.SideNavigation"
        }).then((oComponent) => {
            // Assert
            return oComponent.oMenuModelPromise.then(function () {
                assert.ok(true, "the promise resolved");
                // Cleanup
                oComponent.destroy();
                done();
            });
        });
    });

    QUnit.module("The function createContent", {
        beforeEach: function () {
            this.oModel = new JSONModel([
                { id: 1 }
            ]);

            this.oMenuServiceMock = {
                isSideNavigationEnabled: sandbox.stub().resolves(true),
                getMenuModel: sandbox.stub().resolves(this.oModel)
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("Menu").resolves(this.oMenuServiceMock);

            this.oXMLViewCreateStub = sandbox.stub(XMLView, "create");
        },
        afterEach: function () {
            this._oComponentContainer?.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Creates the sideNavigation view", function (assert) {
        //Arrange
        const oExpectedView = new sap.ui.core.mvc.View();
        this.oXMLViewCreateStub.withArgs({ viewName: "sap.ushell.components.shell.SideNavigation.view.SideNavigation" }).returns(oExpectedView);

        //Act
        const done = assert.async();
        Component.create({
            name: "sap.ushell.components.shell.SideNavigation"
        }).then((oComponent) => {
            // Assert
            assert.strictEqual(oComponent.getRootControl(), oExpectedView, "The created view was returned");
            // Cleanup
            oComponent.destroy();
            done();
        });
    });
});
