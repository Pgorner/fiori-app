// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/notifications/NotificationsEntry",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/Container"
], function (Log, NotificationsEntry, SharedComponentUtils, Config, resources, Container) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("The getEntry method");

    QUnit.test("checks if the correct entry settings are applied", function (assert) {
        // Act
        var oEntry = NotificationsEntry.getEntry();
        // Assert
        assert.strictEqual(oEntry.entryHelpID, "notificationsEntry", "entryHelpID is correct");
        assert.strictEqual(oEntry.title, resources.i18n.getText("notificationSettingsEntry_title"), "title is correct");
        assert.strictEqual(oEntry.valueResult, null, "valueResult is null");
        assert.strictEqual(oEntry.contentResult, null, "contentResult is null");
        assert.strictEqual(oEntry.icon, "sap-icon://bell", "icon is correct");
        assert.strictEqual(oEntry.valueArgument, null, "valueArgument is null");
        assert.strictEqual(typeof oEntry.contentFunc, "function", "contentFunc is function");
        assert.strictEqual(typeof oEntry.onSave, "function", "onSave is function");
        assert.strictEqual(typeof oEntry.onCancel, "function", "onCancel is function");
    });

    QUnit.module("The contentFunc method builds the view correctly:", {
        beforeEach: function () {
            this.oEntry = NotificationsEntry.getEntry();
            this.oGetServiceAsyncPromise = sandbox.stub(Container, "getServiceAsync").resolves({
                _getNotificationSettingsAvailability: Promise.resolve({ settingsAvailable: true })
            });
        },
        afterEach: function () {
            sandbox.restore();
            Config._reset();
        }
    });

    QUnit.test("The view is correctly built.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        Config.emit("/core/shell/model/enableNotifications", true);

        // Act
        this.oEntry.contentFunc().then(function (oView) {
            // Assert
            var aContent = oView.getContent();
            assert.strictEqual(aContent.length, 1, "The view has exactly one control in the content aggregation.");
            assert.ok(aContent[0].isA("sap.m.VBox"), "The control in the content aggregation is a VBox.");

            var aItems = aContent[0].getItems();
            assert.strictEqual(aItems.length, 2, "The VBox has exactly 2 controls in the item aggregation.");
            assert.ok(aItems[0].isA("sap.m.CheckBox"), "The first control in the VBox is a CheckBox.");
            assert.strictEqual(aItems[0].getText(), resources.i18n.getText("Label.ShowAlertsForHighNotifications"),
                "The CheckBox has the correct text.");
            assert.strictEqual(aItems[0].getSelected(), false, "The CheckBox is not selected.");
            assert.ok(aItems[1].isA("sap.m.Table"), "The second control in the VBox is a table.");
            assert.strictEqual(aItems[1].getColumns().length, 5, "The table has 5 columns.");

            // Reset
            oView.destroy();
            fnDone();
        });
    });

    QUnit.module("The onSave method", {
        beforeEach: function () {
            this.oEntry = NotificationsEntry.getEntry();
            this.oLogWarningSpy = sandbox.spy(Log, "warning");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("checks that a warning is put into the Log if the view was not created yet", function (assert) {
        // Arrange
        var fnDone = assert.async();
        // Act
        this.oEntry.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");
            // Reset
            fnDone();
        }.bind(this));
    });

    QUnit.module("onCancel:", {
        beforeEach: function () {
            this.oEntry = NotificationsEntry.getEntry();
            this.oLogWarningSpy = sandbox.spy(Log, "warning");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the View was not created yet", function (assert) {
        // Act
        this.oEntry.onCancel();
        // Assert
        assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");
    });
});
