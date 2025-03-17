// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.LogoutButton
 */
sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/Container",
    "sap/ushell/ui/footerbar/LogoutButton"
], function (
    resources,
    Container,
    LogoutButton
) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.ui.footerbar.LogoutButton", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            Container.resetServices();
        }
    });

    QUnit.test("Constructor Test", function (assert) {
        // Act
        var logoutButton = new LogoutButton();

        // Assert
        assert.strictEqual(logoutButton.getIcon(), "sap-icon://log", "Check button icon");
        assert.strictEqual(logoutButton.getText(), resources.i18n.getText("signoutBtn_title"), "Check button title");
        assert.strictEqual(logoutButton.getTooltip(), resources.i18n.getText("signoutBtn_tooltip"), "Check button tooltip");
    });
});
