// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.RTA
 */
sap.ui.define([
    "sap/ushell/api/RTA",
    "sap/ushell/Container",
    "sap/ushell/EventHub"
], function (
    RtaUtils,
    Container,
    EventHub
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("getShellHeader", {
        beforeEach: function () {
            this.oShellHeaderMock = { id: "shellHeader" };
            this.oRendererMock = {
                getRootControl: sandbox.stub().returns({
                    getShellHeader: sandbox.stub().returns(this.oShellHeaderMock)
                })
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the shellHeader from the renderer", function (assert) {
        // Act
        const oShellHeader = RtaUtils.getShellHeader();
        // Assert
        assert.strictEqual(oShellHeader, this.oShellHeaderMock, "Returned the correct instance");
    });

    QUnit.module("setShellHeaderVisibility", {
        beforeEach: function () {
            this.oRendererMock = {
                setHeaderVisibility: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets this header visibility to false", function (assert) {
        // Arrange
        var aExpectedArguments = [
            false,
            false
            //undefined
        ];
        // Act
        RtaUtils.setShellHeaderVisibility(false);
        // Assert
        assert.deepEqual(this.oRendererMock.setHeaderVisibility.getCall(0).args, aExpectedArguments, "Renderer was called with correct args");
    });

    QUnit.test("Sets this header visibility to true", function (assert) {
        // Arrange
        var aExpectedArguments = [
            true,
            false
            //undefined
        ];
        // Act
        RtaUtils.setShellHeaderVisibility(true);
        // Assert
        assert.deepEqual(this.oRendererMock.setHeaderVisibility.getCall(0).args, aExpectedArguments, "Renderer was called with correct args");
    });

    QUnit.module("addTopHeaderPlaceHolder", {
        beforeEach: function () {
            this.oRendererMock = {
                addTopHeaderPlaceHolder: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the renderer correctly", function (assert) {
        // Act
        RtaUtils.addTopHeaderPlaceHolder();
        // Assert
        assert.strictEqual(this.oRendererMock.addTopHeaderPlaceHolder.callCount, 1, "Called the Renderer");
    });

    QUnit.module("removeTopHeaderPlaceHolder", {
        beforeEach: function () {
            this.oRendererMock = {
                removeTopHeaderPlaceHolder: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the renderer correctly", function (assert) {
        // Act
        RtaUtils.removeTopHeaderPlaceHolder();
        // Assert
        assert.strictEqual(this.oRendererMock.removeTopHeaderPlaceHolder.callCount, 1, "Called the Renderer");
    });

    QUnit.module("setEnablementOfNavigationBar", {
        beforeEach: function () {
            sandbox.stub(EventHub, "emit");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the enablement of the navigation bar to true", function (assert) {
        // Act
        RtaUtils.setNavigationBarEnabled(true);
        // Assert
        assert.ok(EventHub.emit.firstCall.calledWithExactly("enableMenuBarNavigation", true), "EventHub was called with correct args");
    });

    QUnit.test("Sets the enablement of the navigation bar to false", function (assert) {
        // Act
        RtaUtils.setNavigationBarEnabled(false);
        // Assert
        assert.ok(EventHub.emit.firstCall.calledWithExactly("enableMenuBarNavigation", false), "EventHub was called with correct args");
    });
});
