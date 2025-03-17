// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.FrameBoundExtension.UserSettingsEntry
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/services/FrameBoundExtension"
], function (
    Container,
    FrameBoundExtension
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("UserSettingsEntry", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates a UserSettingsEntry", async function (assert) {
        // Arrange
        const oExtensionService = new FrameBoundExtension();
        const oGetRendererInternalStub = sandbox.stub(Container, "getRendererInternal");
        const oAddUserPreferencesEntryStub = sandbox.stub().resolves();
        const oRendererMock = {
            addUserPreferencesEntry: oAddUserPreferencesEntryStub
        };
        oGetRendererInternalStub.returns(oRendererMock);
        const oEntry = {
            title: "Test Title",
            value: "Test SubTitle",
            content: function () {},
            onSave: function () {},
            onCancel: function () {}
        };

        // Act
        await oExtensionService.addUserSettingsEntry(oEntry);
        // Assert
        assert.strictEqual(oAddUserPreferencesEntryStub.getCall(0).args[0], oEntry, "Renderer was called with correct arguments ");
    });

    QUnit.module("UserSettingsEntry", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates a GroupedUserSettingsEntry", async function (assert) {
        // Arrange
        const oExtensionService = new FrameBoundExtension();
        const oGetRendererInternalStub = sandbox.stub(Container, "getRendererInternal");
        const oAddUserPreferencesGroupedEntryStub = sandbox.stub().resolves();
        const oRendererMock = {
            addUserPreferencesGroupedEntry: oAddUserPreferencesGroupedEntryStub
        };
        oGetRendererInternalStub.returns(oRendererMock);
        const oEntry = {
            title: "Test Title",
            value: "Test SubTitle",
            content: function () {},
            onSave: function () {},
            onCancel: function () {}
        };

        // Act
        await oExtensionService.addGroupedUserSettingsEntry(oEntry);
        // Assert
        assert.strictEqual(oAddUserPreferencesGroupedEntryStub.getCall(0).args[0], oEntry, "Renderer was called with correct arguments ");
    });
});
