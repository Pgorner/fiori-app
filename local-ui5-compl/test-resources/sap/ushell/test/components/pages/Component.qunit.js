// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.Component
 */

/* global QUnit, sinon */
sap.ui.define([
    "sap/ushell/components/pages/Component",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/resources",
    "sap/ushell/services/Pages",
    "sap/ushell/Container"
], function (PagesComponent, SharedComponentUtils, resources, PagesService, Container) {
    "use strict";

    var sandbox = sinon.createSandbox();

    QUnit.module("Constructor", {
        beforeEach: function () {
            this.oToggleUserActivityLogStub = sandbox.stub(SharedComponentUtils, "toggleUserActivityLog");
            this.oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting");
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Toggles user activity log", function (assert) {
        // Act
        new PagesComponent();
        // Assert
        assert.deepEqual(this.oToggleUserActivityLogStub.callCount, 1, "The function toggleUserActivityLog of the SharedComponentUtils is called once.");
    });

    QUnit.test("Gets the effective homepage settings", function (assert) {
        // Act
        new PagesComponent();

        // Assert
        assert.deepEqual(this.oGetEffectiveHomepageSettingStub.firstCall.args, [
            "/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations",
            "/core/contentProviders/providerInfo/userConfigurable"
        ], "The function getEffectiveHomepageSetting of the SharedComponentUtils is called first time with the right parameters.");

        assert.deepEqual(this.oGetEffectiveHomepageSettingStub.secondCall.args, [
            "/core/home/sizeBehavior",
            "/core/home/sizeBehaviorConfigurable"
        ], "The function getEffectiveHomepageSetting of the SharedComponentUtils is called second time with the right parameters.");
    });

    QUnit.test("Sets the i18n model", function (assert) {
        // Act
        var oComponent = new PagesComponent();
        // Assert
        assert.strictEqual(oComponent.getModel("i18n"), resources.i18nModel, "The i18n model is set correctly.");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.test("Calls the Pages service", function (assert) {
        // Act
        var oComponent = new PagesComponent();
        // Assert
        assert.deepEqual(this.oGetServiceAsyncStub.firstCall.args, ["Pages"]);
        // Cleanup
        oComponent.destroy();
    });

    QUnit.module("The getInvisibleMessageInstance function", {
        beforeEach: function () {
            this.oToggleUserActivityLogStub = sandbox.stub(SharedComponentUtils, "toggleUserActivityLog");
            this.oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting");
            sandbox.stub(Container, "getServiceAsync");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the invisibleMessage instance", function (assert) {
        // Arrange
        var oComponent = new PagesComponent();
        // Act
        var oResult = oComponent.getInvisibleMessageInstance();
        // Assert
        assert.strictEqual(oResult.isA("sap.ui.core.InvisibleMessage"), true, "The return object is a invisible message instance.");
        assert.deepEqual(oResult, oComponent._oInvisibleMessageInstance, "The internal invisible message instance is returned.");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.module("The getPagesService function", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oMockService = {
                TEST: "SERVICE"
            };

            this.oGetServiceAsyncStub.withArgs("Pages").resolves(this.oMockService);
            this.oPagesComponent = new PagesComponent();
        },
        afterEach: function () {
            this.oPagesComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns an instance of the pages service", function (assert) {
        // Act
        return this.oPagesComponent.getPagesService()
            .then(function (oService) {
                // Assert
                assert.deepEqual(oService, this.oMockService, "The correct service was returned.");
            }.bind(this));
    });

    QUnit.module("Method getNavigationDisabled", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Defaults to false when no componentData was provided", function (assert) {
        // Arrange
        var oPagesComponent = new PagesComponent();
        // Act
        var bResult = oPagesComponent.getNavigationDisabled();
        // Assert
        assert.strictEqual(bResult, false, "The correct value was returned.");
        // Cleanup
        oPagesComponent.destroy();
    });

    QUnit.test("Returns the value provided by the componentData", function (assert) {
        // Arrange
        var oPagesComponent = new PagesComponent({
            componentData: {
                navigationDisabled: true
            }
        });
        // Act
        var bResult = oPagesComponent.getNavigationDisabled();
        // Assert
        assert.strictEqual(bResult, true, "The correct value was returned.");
        // Cleanup
        oPagesComponent.destroy();
    });

    QUnit.module("Method onRouteMatched", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");
            this.oPagesComponent = new PagesComponent();

            this.oOnRouteMatchedStub = sandbox.stub();
            sandbox.stub(this.oPagesComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    onRouteMatched: this.oOnRouteMatchedStub
                })
            });
        },
        afterEach: function () {
            this.oPagesComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("calls onRouteMatched on the Controller", function (assert) {
        // Act
        this.oPagesComponent.onRouteMatched();

        // Assert
        assert.strictEqual(this.oOnRouteMatchedStub.callCount, 1, "onRouteMatched was called on the controller.");
    });

    QUnit.module("Method navigateToEmptyPage", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");
            this.oPagesComponent = new PagesComponent();

            this.oNavigateToEmptyPageStub = sandbox.stub();
            sandbox.stub(this.oPagesComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    onRouteMatched: this.oNavigateToEmptyPageStub
                })
            });
        },
        afterEach: function () {
            this.oPagesComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("calls onRouteMatched on the Controller", function (assert) {
        // Act
        this.oPagesComponent.onRouteMatched();

        // Assert
        assert.strictEqual(this.oNavigateToEmptyPageStub.callCount, 1, "navigateToEmptyPage was called on the controller.");
    });
});
