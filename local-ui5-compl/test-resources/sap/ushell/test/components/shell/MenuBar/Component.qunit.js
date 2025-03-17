// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.MenuBar.Component
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/MenuBar/Component",
    "sap/ushell/Config",
    "sap/ui/core/mvc/XMLView",
    "sap/ushell/Container"
], function (UIComponent, JSONModel, MenuBarComponent, Config, XMLView, Container) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function init", {
        beforeEach: function () {
            this.oMenuModel = new JSONModel([
                { id: 1 }
            ]);

            this.oInitStub = sandbox.spy(UIComponent.prototype, "init");

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(false);

            this.oIsMenuEnabledStub = sandbox.stub().resolves(true);
            this.oGetMenuModelStub = sandbox.stub().resolves(this.oMenuModel);
            this.oMenuServiceMock = {
                isMenuEnabled: this.oIsMenuEnabledStub,
                getMenuModel: this.oGetMenuModelStub
            };

            var oRendererMock = {
                setNavigationBar: sandbox.stub().callsFake(function (oComponentContainer) {
                    this._oComponentContainer = oComponentContainer;
                }.bind(this))
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Menu").resolves(this.oMenuServiceMock);

            sandbox.stub(Container, "getServiceAsync").callsFake(this.oGetServiceAsyncStub);
            sandbox.stub(Container, "getRendererInternal").returns(oRendererMock);


            sandbox.stub(XMLView, "create").resolves();
        },
        afterEach: function () {
            if (this._oComponentContainer) {
                this._oComponentContainer.destroy();
            }
            sandbox.restore();
        }
    });

    QUnit.test("Sets the correct parameters", function (assert) {
        // Act
        var oComponent = new MenuBarComponent();
        return oComponent.oMenuModelPromise.then(function () {
            // Assert
            assert.strictEqual(this.oInitStub.callCount, 1, "init was called once");
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "getService was called twice");
            assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["Menu"], "getService was called the first time with correct parameters");
            assert.strictEqual(this.oIsMenuEnabledStub.callCount, 1, "isMenuEnabled was called once");
            assert.strictEqual(this.oGetMenuModelStub.callCount, 1, "getMenuEntries was called once");
            // Cleanup
            oComponent.destroy();
        }.bind(this));
    });

    QUnit.test("Calls the Menu service correctly", function (assert) {
        // Act
        var oComponent = new MenuBarComponent();
        return oComponent.oMenuModelPromise.then(function () {
            // Assert
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "getService was called twice");
            assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["Menu"], "getService was called the first time with correct parameters");
            assert.strictEqual(this.oIsMenuEnabledStub.callCount, 1, "isMenuEnabled was called once");
            assert.strictEqual(this.oGetMenuModelStub.callCount, 1, "getMenuEntries was called once");
            // Cleanup
            oComponent.destroy();
        }.bind(this));
    });

    QUnit.test("Creates and places the menuBar in ComponentContainer when enabled", function (assert) {
        // Act
        var oComponent = new MenuBarComponent();
        return oComponent.oMenuModelPromise.then(function () {
            // Assert
            assert.ok(oComponent, "Component was created");
            assert.ok(this._oComponentContainer, "ComponentContainer was created and placed in the Renderer");
            assert.strictEqual(this._oComponentContainer.getComponentInstance(), oComponent, "The Component was placed in the ComponentContainer");
            // Cleanup
            oComponent.destroy();
        }.bind(this));
    });

    QUnit.test("Creates the menuBar but does not place it when disabled", function (assert) {
        // Arrange
        this.oIsMenuEnabledStub.resolves(false);
        // Act
        var oComponent = new MenuBarComponent();
        return oComponent.oMenuModelPromise.then(function () {
            // Assert
            assert.ok(oComponent, "Component was created");
            assert.notOk(this._oComponentContainer, "ComponentContainer was not created");
            // Cleanup
            oComponent.destroy();
        }.bind(this));
    });

    QUnit.test("Resolves the init promise", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("Menu").resolves(this.oMenuServiceMock);
        // Act
        var oComponent = new MenuBarComponent();

        // Assert
        return oComponent.oMenuModelPromise.then(function () {
            assert.ok(true, "the promise resolved");

            // Cleanup
            oComponent.destroy();
        });
    });

    QUnit.module("The function createContent", {
        beforeEach: function () {
            this.oXMLViewCreateStub = sandbox.stub(XMLView, "create");
            this.oConfigLastStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates the menu bar view without personalization button if the menu personalization is disabled", function (assert) {
        //Arrange
        this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(false);
        var oExpectedView = {};
        this.oXMLViewCreateStub.withArgs({ viewName: "sap.ushell.components.shell.MenuBar.view.MenuBar" }).resolves(oExpectedView);

        //Act
        var oMenuBarComponentMock = {};
        var oResult = MenuBarComponent.prototype.createContent.apply(oMenuBarComponentMock);

        //Assert
        return oResult
            .then(function (oView) {
                assert.strictEqual(oView, oExpectedView, "The created view was returned");
            });
    });

    QUnit.test("Creates the menu bar view with personalization button if the menu personalization is enabled", function (assert) {
        //Arrange
        this.oConfigLastStub.withArgs("/core/menu/personalization/enabled").returns(true);
        var oExpectedView = {};
        this.oXMLViewCreateStub.withArgs({ viewName: "sap.ushell.components.shell.MenuBar.view.MenuBarPersonalization" }).resolves(oExpectedView);

        //Act
        var oMenuBarComponentMock = {};
        var oResult = MenuBarComponent.prototype.createContent.apply(oMenuBarComponentMock);

        //Assert
        return oResult
            .then(function (oView) {
                assert.strictEqual(oView, oExpectedView, "The created view was returned");
            });
    });
});
