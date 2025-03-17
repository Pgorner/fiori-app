// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.Footer
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/services/FrameBoundExtension",
    "sap/m/MessageToast",
    "sap/m/Button"
], function (
    Container,
    FrameBoundExtension,
    MessageToast,
    Button
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("Footer", {
        beforeEach: function () {
            this.oExtensionService = new FrameBoundExtension();
            const oGetRendererInternalStub = sandbox.stub(Container, "getRendererInternal");
            const oSetShellFooterMock = sandbox.stub();
            const oGetIdStub = sandbox.stub();
            oGetIdStub.returns("footer4");
            const oMockFooterControl = {
                destroy: sandbox.stub(),
                getId: oGetIdStub,
                controlType: "sap.m.Bar"
            };
            oSetShellFooterMock.returns(oMockFooterControl);
            this.oRendererMock = {
                setShellFooter: oSetShellFooterMock,
                removeFooterById: sandbox.stub()
            };
            oGetRendererInternalStub.returns(this.oRendererMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds a 'sap.m.Bar' with Button in the left content", async function (assert) {
        // Arrange
        const oMockButton = new Button({
            text: "Footer contentLeftBtn",
            press: function () {
                MessageToast.show("Press footer1 contentLeft");
            }
        });
        const oMockFooter = {
            id: "footer1",
            contentLeft: [
                oMockButton
            ]
        };
        // Act
        await this.oExtensionService.createFooter(
            oMockFooter
        );
        // Assert
        const oExpectedParameterObjectForRendererCall = {
            controlType: "sap.m.Bar",
            oControlProperties: {
                contentLeft: [
                    oMockButton
                ],
                id: "footer1"
            }
        };
        assert.deepEqual(this.oRendererMock.setShellFooter.getCall(0).args[0], oExpectedParameterObjectForRendererCall);
    });

    QUnit.test("Adds a button as a footer, which is not the default type", async function (assert) {
        // Arrange
        const oMockFooter = {
            id: "footer1"
        };
        // Act
        await this.oExtensionService.createFooter(
            oMockFooter,
            {
                controlType: "sap.m.Button"
            }
        );
        // Assert
        const oExpectedParameterObjectForRendererCall = {
            controlType: "sap.m.Button",
            oControlProperties: {
                id: "footer1"
            }
        };
        assert.deepEqual(this.oRendererMock.setShellFooter.getCall(0).args[0], oExpectedParameterObjectForRendererCall);
    });

    QUnit.test("destroys the footer", async function (assert) {
        // Arrange
        const oFooter = await this.oExtensionService.createFooter();
        const oControl = await oFooter.getControl();
        // Act
        await oFooter.destroy();
        // Assert
        assert.strictEqual(this.oRendererMock.removeFooterById.getCall(0).args[0], "footer4", "Footer control was destroyed with correct id");
        assert.ok(oControl.destroy.called, "Control was destroyed correctly");
    });

    QUnit.test("gets the control of the footer", async function (assert) {
        // Arrange
        const oFooterControlMock = {};
        const oFooter = await this.oExtensionService.createFooter(oFooterControlMock);
        // Act
        const oActualControl = await oFooter.getControl();
        // Assert
        assert.strictEqual(oActualControl.controlType, "sap.m.Bar", "Footer control has correct control type");
        assert.strictEqual(oActualControl.getId(), "footer4", "Footer control has correct ID");
    });
});
