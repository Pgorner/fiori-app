// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.services.Extension".
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/services/Extension"
], function (
    Container,
    Extension
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("setSecondTitle", {
        beforeEach: async function () {
            this.Extension = new Extension();
            this.oRendererMock = {
                setHeaderTitle: sandbox.stub()
            };
            sandbox.stub(Container, "getRendererInternal").returns(this.oRendererMock);
        },
        afterEach: async function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Calls the Renderer correctly", async function (assert) {
        // Arrange
        const aExpectedArgs = ["[secondTitle]"];
        // Act
        await this.Extension.setSecondTitle("[secondTitle]");
        // Assert
        assert.deepEqual(this.oRendererMock.setHeaderTitle.getCall(0).args, aExpectedArgs, "The Renderer was called correctly");
    });

    QUnit.test("Rejects when Renderer fails", async function (assert) {
        // Arrange
        this.oRendererMock.setHeaderTitle.throws(new Error("Renderer failed"));
        // Act
        return this.Extension.setSecondTitle("[secondTitle]")
            .catch(() => {
                // Assert
                assert.ok(true, "Promise was rejected");
            });
    });
});
