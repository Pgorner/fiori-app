// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for ClientSideTargetResolution SystemContext
 */

sap.ui.define([
    "sap/ushell/services/ClientSideTargetResolution/SystemContext"
], function (
    SystemContext
) {
    "use strict";

    /* global QUnit, sinon*/

    QUnit.dump.maxDepth = 10;

    var sandbox = sinon.createSandbox({});

    QUnit.module("createSystemContextFromSystemAlias", {
        beforeEach: function () {
            this.oGetProtocolStub = sandbox.stub(SystemContext, "_getProtocol").returns("http");
            this.oSystemAlias = {
                id: "systemAliasId",
                label: "systemAliasLabel",
                https: {
                    xhr: {
                        pathPrefix: "httpsPathPrefix"
                    }
                },
                http: {
                    xhr: {
                        pathPrefix: "httpPathPrefix"
                    }
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Has the same id as the passed systemAlias", function (assert) {
        // Arrange

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(this.oSystemAlias);

        // Assert
        assert.strictEqual(oSystemContext.id, this.oSystemAlias.id, "The id is correct");
    });

    QUnit.test("Has the same label as the passed systemAlias", function (assert) {
        // Arrange

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(this.oSystemAlias);

        // Assert
        assert.strictEqual(oSystemContext.label, this.oSystemAlias.label, "The label is correct");
    });

    QUnit.test("Has a fallback for the label to the systemAlias id", function (assert) {
        // Arrange
        delete this.oSystemAlias.label;
        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(this.oSystemAlias);

        // Assert
        assert.strictEqual(oSystemContext.label, this.oSystemAlias.id, "The label is correct");
    });

    QUnit.test("Returns a http system context and getFullyQualifiedXhrUrl returns the right path if there is a prefix", function (assert) {
        // Arrange
        var sPath = "/SomePath";
        var sExpectedPath = "httpPathPrefix/SomePath";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(this.oSystemAlias);
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sExpectedPath, "The right path was returned");
    });

    QUnit.test("Returns a https system context and getFullyQualifiedXhrUrl returns the right path if there is a prefix", function (assert) {
        // Arrange
        this.oGetProtocolStub.returns("https");
        var sPath = "SomePath";
        var sExpectedPath = "httpsPathPrefix/SomePath";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(this.oSystemAlias);
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sExpectedPath, "The right path was returned");
    });

    QUnit.test("Returns a https system context and getFullyQualifiedXhrUrl returns the right path if there is a prefix and a query part", function (assert) {
        // Arrange
        this.oGetProtocolStub.returns("https");
        var sPath = "SomePath?sap-client=200&$filter=someFilter";
        var sExpectedPath = "httpsPathPrefix/SomePath?sap-client=200&$filter=someFilter";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(this.oSystemAlias);
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sExpectedPath, "The right path was returned");
    });

    QUnit.test("Returns a http system context and getFullyQualifiedXhrUrl returns the right path if there is no prefix", function (assert) {
        // Arrange
        var sPath = "SomePath";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias({});
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sPath, "The right path was returned");
    });

    QUnit.test("Returns a system context and getFullyQualifiedXhrUrl returns give path if it starts with 'http://'", function (assert) {
        // Arrange
        var sPath = "http://SomePath";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias("someSystemContext");
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sPath, "The right path was returned");
    });

    QUnit.test("Returns a system context and getFullyQualifiedXhrUrl returns give path if it starts with 'https://'", function (assert) {
        // Arrange
        var sPath = "https://SomePath";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias("someSystemContext");
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sPath, "The right path was returned");
    });

    QUnit.test("Returns a system context and getFullyQualifiedXhrUrl returns given path if it includes 'dynamic_dest' already", function (assert) {
        // Arrange
        var sPath = "/dynamic_dest/SomePath";

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias("someSystemContext");
        var sReturnedPath = oSystemContext.getFullyQualifiedXhrUrl(sPath);

        // Assert
        assert.strictEqual(sReturnedPath, sPath, "The right path was returned");
    });

    QUnit.module("getProtocol");

    QUnit.test("Returns 'http' or 'https'", function (assert) {
        // Arrange

        // Act
        var sReturnedProtocol = SystemContext._getProtocol();
        var bReturnedHttpOrHttps = sReturnedProtocol === "https" || sReturnedProtocol === "http";

        // Assert
        assert.ok(bReturnedHttpOrHttps, "The right protocol was returned");
    });

    QUnit.module("getProperty", {
        beforeEach: function () {
            this.oGetProtocolStub = sandbox.stub(SystemContext, "_getProtocol").returns("http");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns 'ina'", function (assert) {
        // Arrange
        var oSystemAlias = {
            http: { /* ... */ },
            https: { /* ... */ },
            properties: {
                "esearch.provider": "ina"
            }
        };

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(oSystemAlias);
        var sReturnedProperty = oSystemContext.getProperty("esearch.provider");

        // Assert
        assert.strictEqual(sReturnedProperty, "ina", "The right property was returned");
    });

    QUnit.test("Returns undefined if properties are unknown", function (assert) {
        // Arrange
        var oSystemAlias = {
            http: { /* ... */ },
            https: { /* ... */ },
            properties: {
                "esearch.provider": "ina"
            }
        };

        // Act
        var oSystemContext = SystemContext.createSystemContextFromSystemAlias(oSystemAlias);
        var sReturnedProperty = oSystemContext.getProperty("unknown.property");

        // Assert
        assert.strictEqual(sReturnedProperty, undefined, "The right property was returned");
    });
});
