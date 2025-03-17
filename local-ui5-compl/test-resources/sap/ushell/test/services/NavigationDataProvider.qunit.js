// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell_abap.adapters.abap.PagePersistence
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/ushell/services/NavigationDataProvider"
], function (
    jQuery,
    resources,
    NavigationDataProvider
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("NavigationDataProvider: _init");

    QUnit.test("is correctly called and sets the correct adapter", function (assert) {
        // Arrange
        var oTestAdapter = { foo: "bar" };
        var oInitSpy = sandbox.spy(NavigationDataProvider.prototype, "_init");

        // Act
        var oNavigationDataProvider = new NavigationDataProvider(oTestAdapter);

        // Assert
        assert.deepEqual(oNavigationDataProvider.oAdapter, oTestAdapter, "Correct adapter was set");
        assert.ok(oInitSpy.called, "Init was called");
        assert.equal(oNavigationDataProvider.S_COMPONENT_NAME, "sap.ushell.services.NavigationDataProvider", "The component name is set correctly.");

        // Cleanup
        sandbox.restore();
    });

    QUnit.module("NavigationDataProvider: getNavigationData", {
        beforeEach: function () {
            this.oResourcesI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returns("This is the translated error message.");
            this.oAdapter = {
                getInbounds: sandbox.stub(),
                getSystemAliases: sandbox.stub()
            };
            this.oNavigationDataProvider = new NavigationDataProvider(this.oAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the correct method on the adapter and returns the expected data", function (assert) {
        // Arrange
        var oTestData = {
            inbounds: [{ inbound: "SomeInbound" }],
            systemAliases: { alias: "SomeAlias" }
        };

        this.oAdapter.getInbounds.returns(new jQuery.Deferred().resolve(oTestData.inbounds).promise());
        this.oAdapter.getSystemAliases.returns(oTestData.systemAliases);

        // Act & Assert
        return this.oNavigationDataProvider.getNavigationData().then(function (result) {
            assert.ok(this.oAdapter.getInbounds.called, "ClientSideTargetResolutionAdapter.getInbounds was called");
            assert.ok(this.oAdapter.getSystemAliases.called, "ClientSideTargetResolutionAdapter.getSystemAliases was called");
            assert.deepEqual(result, oTestData, "Expected data was returned");
        }.bind(this));
    });

    QUnit.test("doesn't throw when the adapter does not implement getSystemAliases and returns the expected data", function (assert) {
        // Arrange
        var oExpectedData = {
            inbounds: undefined,
            systemAliases: {}
        };

        this.oAdapter.getInbounds.returns(new jQuery.Deferred().resolve().promise());

        // Act & Assert
        return this.oNavigationDataProvider.getNavigationData().then(function (navigationData) {
            assert.ok(true, "Promise was resolved");
            assert.deepEqual(navigationData, oExpectedData, "Expected data was returned");
        });
    });

    QUnit.test("rejects the promise when getInbounds fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oExpectedResult = {
            component: "sap.ushell.services.NavigationDataProvider",
            description: "This is the translated error message.",
            detail: {
                code: 1,
                text: "Some Error"
            }
        };

        this.oAdapter.getInbounds.returns(new jQuery.Deferred().reject({
            code: 1,
            text: "Some Error"
        }).promise());

        // Act & Assert
        this.oNavigationDataProvider.getNavigationData()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (error) {
                assert.deepEqual(error, oExpectedResult, "Expected error provided");
                assert.ok(this.oResourcesI18nGetTextStub.calledOnce, "The getText of resource.i18n is called once");
                assert.deepEqual(this.oResourcesI18nGetTextStub.getCall(0).args, ["NavigationDataProvider.CannotLoadData"], "The getText of resource.i18n is called with correct parameters");
            })
            .finally(fnDone);
    });
});
