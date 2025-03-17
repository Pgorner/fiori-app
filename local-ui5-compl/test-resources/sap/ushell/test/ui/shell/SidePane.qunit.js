// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.shell.SidePane
 */
sap.ui.define([
    "sap/ui/Device",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/ui/shell/SidePane"
], function (
    Device,
    nextUIUpdate,
    SidePane
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ui.Device.media.RANGESETS
    var RANGESETS = Device.media.RANGESETS;

    var sandbox = sinon.createSandbox({});

    QUnit.module("Content width", {
        beforeEach: function () {
            this.oAttachHandlerStub = sandbox.stub(Device.resize, "attachHandler");
            this.oGetCurrentRangeStub = sandbox.stub(Device.media, "getCurrentRange").withArgs(RANGESETS.SAP_STANDARD);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Init on desktop", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "desktop" });

        // Act
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "15rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });

    QUnit.test("Init on tablet", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "tablet" });

        // Act
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "13rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });

    QUnit.test("Init on phone", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "phone" });

        // Act
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "13rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });

    QUnit.test("Device resize from desktop to tablet", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "desktop" });
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();
        this.oGetCurrentRangeStub.returns({ name: "tablet" });
        var fnResizeHandler = this.oAttachHandlerStub.firstCall.args[0].bind(this.oAttachHandlerStub.firstCall.args[1]);

        // Act
        fnResizeHandler();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "13rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });

    QUnit.test("Device resize from tablet to phone", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "tablet" });
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();
        this.oGetCurrentRangeStub.returns({ name: "phone" });
        var fnResizeHandler = this.oAttachHandlerStub.firstCall.args[0].bind(this.oAttachHandlerStub.firstCall.args[1]);

        // Act
        fnResizeHandler();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "13rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });

    QUnit.test("Device resize from phone to tablet", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "phone" });
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();
        this.oGetCurrentRangeStub.returns({ name: "tablet" });
        var fnResizeHandler = this.oAttachHandlerStub.firstCall.args[0].bind(this.oAttachHandlerStub.firstCall.args[1]);

        // Act
        fnResizeHandler();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "13rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });

    QUnit.test("Device resize from tablet to desktop", async function (assert) {
        // Arrange
        this.oGetCurrentRangeStub.returns({ name: "tablet" });
        var oSidePane = new SidePane();
        oSidePane.placeAt("qunit-fixture");
        await nextUIUpdate();
        this.oGetCurrentRangeStub.returns({ name: "desktop" });
        var fnResizeHandler = this.oAttachHandlerStub.firstCall.args[0].bind(this.oAttachHandlerStub.firstCall.args[1]);

        // Act
        fnResizeHandler();

        // Assert
        var oDomRef = oSidePane.getDomRef();
        assert.strictEqual(oDomRef.style.width, "15rem", "Applied correct width");

        // Cleanup
        oSidePane.destroy();
    });
});
