// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ContentExtensionAdapterFactory
 * @deprecated since 1.120.0
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/Config",
    "sap/ushell/services/ContentExtensionAdapterFactory",
    "sap/ushell/services/_ContentExtensionAdapterFactory/ContentExtensionAdapterConfig"
], function (
    ObjectPath,
    Config,
    ContentExtensionAdapterFactory,
    ContentExtensionAdapterConfig
) {
    "use strict";

    /*global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function getAdapters", {
        beforeEach: function () {
            sandbox.stub(ContentExtensionAdapterFactory, "_getAdapter");
            sandbox.stub(Config, "last").returns(true);
            sandbox.stub(ContentExtensionAdapterFactory, "_getConfigAdapters").returns([]);
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the function _getConfigAdapters", function (assert) {
        // Arrange
        var aConfigs = [];
        ContentExtensionAdapterFactory._getConfigAdapters.returns(aConfigs);

        // Act
        return ContentExtensionAdapterFactory.getAdapters(aConfigs).then(function () {
            // Assert
            assert.strictEqual(ContentExtensionAdapterFactory._getConfigAdapters.callCount, 1, "The function _getConfigAdapters has been called once.");
            assert.strictEqual(ContentExtensionAdapterFactory._getConfigAdapters.firstCall.args[0], aConfigs, "The function _getConfigAdapters has been called with the correct parameter.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapter.callCount, 0, "The function _getAdapter has not been called.");
        });
    });

    QUnit.test("Returns a map of content provider names and adapters if called with one config object", function (assert) {
        // Arrange
        var oAdapter = {};
        var oConfig = { contentProviderName: "feature-test" };
        ContentExtensionAdapterFactory._getAdapter.resolves(oAdapter);
        ContentExtensionAdapterFactory._getConfigAdapters.returns([oConfig]);

        // Act
        return ContentExtensionAdapterFactory.getAdapters().then(function (oAdapters) {
            // Assert
            assert.strictEqual(oAdapters["feature-test"], oAdapter, "The correct reference has been found.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapter.callCount, 1, "The function _getAdapter has been called once.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapter.firstCall.args[0], oConfig, "The function _getAdapter has been called with the correct parameter.");
        });
    });

    QUnit.test("Returns an empty map if all content providers are disabled via configuration", function (assert) {
        // Arrange
        var oConfig = { contentProviderName: "feature-test" };
        Config.last.returns(false);
        ContentExtensionAdapterFactory._getConfigAdapters.returns([oConfig, oConfig]);

        // Act
        return ContentExtensionAdapterFactory.getAdapters().then(function (oAdapters) {
            // Assert
            assert.strictEqual(oAdapters.hasOwnProperty("feature-test"), false, "The object does not contain the feature-test field.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapter.callCount, 0, "The function _getAdapter has not been called.");
        });
    });

    QUnit.module("The function _getConfigAdapters", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the same object reference if an array is passed", function (assert) {
        // Arrange
        var aConfigs = [];

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters(aConfigs);

        // Assert
        assert.strictEqual(oResult, aConfigs, "The correct reference has been found.");
    });

    QUnit.test("Returns the given object reference wrapped in an array", function (assert) {
        // Arrange
        var oConfig = {};

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters(oConfig);

        // Assert
        assert.strictEqual(oResult[0], oConfig, "The correct reference has been found.");
    });

    QUnit.test("Returns the return value of ContentExtensionAdapterConfig._getConfigAdapters if no value is passed", function (assert) {
        // Arrange
        var aConfigs = [];
        sandbox.stub(ContentExtensionAdapterConfig, "_getConfigAdapters").returns(aConfigs);

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters();

        // Assert
        assert.strictEqual(oResult, aConfigs, "The correct reference has been found.");
        assert.strictEqual(ContentExtensionAdapterConfig._getConfigAdapters.callCount, 1, "The function _getConfigAdapters has been called.");
    });

    QUnit.test("Returns the return value of ContentExtensionAdapterConfig._getConfigAdapters wrapped in an array", function (assert) {
        // Arrange
        var aConfigs = {};
        sandbox.stub(ContentExtensionAdapterConfig, "_getConfigAdapters").returns(aConfigs);

        // Act
        var oResult = ContentExtensionAdapterFactory._getConfigAdapters();

        // Assert
        assert.strictEqual(oResult[0], aConfigs, "The correct reference has been found.");
        assert.strictEqual(ContentExtensionAdapterConfig._getConfigAdapters.callCount, 1, "The function _getConfigAdapters has been called.");
    });

    QUnit.module("The function _getAdapter", {
        beforeEach: function () {
            sandbox.stub(sap.ui, "require");

            this.oInstance = {};
            sandbox.stub(ContentExtensionAdapterFactory, "_getAdapterInstance").returns(this.oInstance);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls sap.ui.require to load the adapter's module", function (assert) {
        // Arrange
        var oConfig = {
            adapter: "some.adapter.module"
        };

        // Act
        ContentExtensionAdapterFactory._getAdapter(oConfig);

        // Assert
        assert.strictEqual(sap.ui.require.callCount, 1, "The function sap.ui.require has been called once.");
        assert.deepEqual(sap.ui.require.firstCall.args[0], ["some/adapter/module"], "The function sap.ui.require has been called with the correct module name.");
        assert.strictEqual(typeof sap.ui.require.firstCall.args[1], "function", "The function sap.ui.require has been provided with a callback function.");
    });

    QUnit.test("Returns a promise that is resolved to an adapter instance when the adapter's module is loaded", function (assert) {
        // Arrange
        var oConfig = {
            adapter: "some.adapter.module",
            system: {}
        };

        var oPromise = ContentExtensionAdapterFactory._getAdapter(oConfig);
        var fnCallback = sap.ui.require.firstCall.args[1];

        // Act
        fnCallback();

        // Assert
        return oPromise.then(function (oResult) {
            assert.strictEqual(oResult, this.oInstance, "The correct reference has been found.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapterInstance.callCount, 1,
                "The function _getAdapterInstance has been called once.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapterInstance.firstCall.args[0], oConfig.adapter,
                "The function _getAdapterInstance has been called with the correct parameter.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapterInstance.firstCall.args[1], oConfig.system,
                "The function _getAdapterInstance has been called with the correct parameter.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapterInstance.firstCall.args[2], null,
                "The function _getAdapterInstance has been called with the correct parameter.");
            assert.deepEqual(ContentExtensionAdapterFactory._getAdapterInstance.firstCall.args[3], {},
                "The function _getAdapterInstance has been called with the correct parameter.");
        }.bind(this));
    });

    QUnit.test("Calls the configHandler from the given config object and passes the return value to the adapter instance", function (assert) {
        // Arrange
        var oAdapterConfig = {};
        var oConfig = {
            adapter: "",
            configHandler: sandbox.stub().returns(oAdapterConfig)
        };

        var oPromise = ContentExtensionAdapterFactory._getAdapter(oConfig);
        var fnCallback = sap.ui.require.firstCall.args[1];

        // Act
        fnCallback();

        return oPromise.then(function (oResult) {
            // Assert
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapterInstance.callCount, 1,
                "The function _getAdapterInstance has been called once.");
            assert.strictEqual(ContentExtensionAdapterFactory._getAdapterInstance.firstCall.args[3], oAdapterConfig,
                "The correct reference has been found.");
        });
    });

    QUnit.module("The function _getAdapterInstance", {
        beforeEach: function () {
            sandbox.stub(ObjectPath, "get");
            sandbox.stub(sap.ui, "require");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns null if the adapter's constructor cannot be found", function (assert) {
        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance("some.adapter.module");

        // Assert
        assert.strictEqual(sap.ui.require.callCount, 1, "The function sap.ui.require has been called once.");
        assert.strictEqual(sap.ui.require.firstCall.args[0], "some/adapter/module", "The function sap.ui.require has been called with the correct parameter.");
        assert.strictEqual(oResult, null, "The correct value has been found.");
    });

    QUnit.test("Creates an instance of the given module and returns it", function (assert) {
        // Arrange
        var oConstructor = sandbox.stub();
        sap.ui.require.returns(oConstructor);

        var oSystem = {};
        var oParameter = {};
        var oConfig = {};

        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance("some.adapter.name", oSystem, oParameter, oConfig);

        // Assert
        assert.strictEqual(oConstructor.callCount, 1, "The constructor function has been called once.");
        assert.strictEqual(oConstructor.firstCall.calledWithNew(), true, "The constructor function has been called with 'new'.");
        assert.strictEqual(oConstructor.firstCall.args[0], oSystem, "The constructor function has been called with the correct parameter.");
        assert.strictEqual(oConstructor.firstCall.args[1], oParameter, "The constructor function has been called with the correct parameter.");
        assert.deepEqual(oConstructor.firstCall.args[2], { config: oConfig }, "The constructor function has been called with the correct parameter.");
        assert.ok(oResult instanceof oConstructor, "The correct constructor has been used.");
    });

    QUnit.test("Uses a default config object if none is given", function (assert) {
        // Arrange
        var oConstructor = sandbox.stub();
        sap.ui.require.returns(oConstructor);

        // Act
        var oResult = ContentExtensionAdapterFactory._getAdapterInstance("some.adapter.name" /*value irrelevant for test, but for .replaceAll */);

        // Assert
        assert.strictEqual(oConstructor.callCount, 1, "The constructor function has been called once.");
        assert.strictEqual(oConstructor.firstCall.calledWithNew(), true, "The constructor function has been called with 'new'.");
        assert.notOk(oConstructor.firstCall.args[0], "The constructor function has been called with the correct parameter.");
        assert.notOk(oConstructor.firstCall.args[1], "The constructor function has been called with the correct parameter.");
        assert.deepEqual(oConstructor.firstCall.args[2], { config: {} }, "The constructor function has been called with the correct parameter.");
        assert.ok(oResult instanceof oConstructor, "The correct constructor has been used.");
    });
});
