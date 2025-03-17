// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/userActivities/UserActivitiesEntry",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (Log, UserActivitiesEntry, SharedComponentUtils, Config, resources) {
    "use strict";

    /* global QUnit sinon */
    var sandbox;

    QUnit.module("The getEntry method");

    QUnit.test("checks if the correct entry settings are applied", function (assert) {
        // Act
        var oEntry = UserActivitiesEntry.getEntry();
        // Assert
        assert.strictEqual(oEntry.entryHelpID, "userActivitiesEntry", "entryHelpID is correct");
        assert.strictEqual(oEntry.title, resources.i18n.getText("userActivities"), "title is correct");
        assert.strictEqual(oEntry.valueResult, null, "valueResult is null");
        assert.strictEqual(oEntry.contentResult, null, "contentResult is null");
        assert.strictEqual(oEntry.icon, "sap-icon://laptop", "icon is correct");
        assert.strictEqual(oEntry.valueArgument, null, "valueArgument is null");
        assert.strictEqual(typeof oEntry.contentFunc, "function", "contentFunc is function");
        assert.strictEqual(typeof oEntry.onSave, "function", "onSave is function");
        assert.strictEqual(typeof oEntry.onCancel, "function", "onCancel is function");
    });

    QUnit.module("The contentFunc method builds the view correctly:", {
        beforeEach: function () {
            this.oEntry = UserActivitiesEntry.getEntry();
        },
        afterEach: function () {
            Config._reset();
        }
    });

    QUnit.test("The view is correct if user activities are not tracked", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            bExpectedCheckboxSelected = false;
        Config.emit("/core/shell/model/enableTrackingActivity", false);

        // Act
        this.oEntry.contentFunc().then(function (oView) {
            // Assert
            var aContent = oView.getContent();
            assert.strictEqual(aContent.length, 1, "The view has exactly one control in the content aggregation.");
            assert.ok(aContent[0].isA("sap.ui.layout.form.SimpleForm"), "The control in the content aggregation is a SimpleForm.");

            var aFormContent = aContent[0].getContent();
            assert.ok(aFormContent[0].isA("sap.m.VBox"), "The control in the SimpleForm is a VBox.");
            assert.ok(aContent[0].hasStyleClass("sapUiSmallMarginBegin"), "The Form has the class \"sapUiSmallMarginBegin\".");

            var aItems = aFormContent[0].getItems();
            assert.strictEqual(aItems.length, 3, "The VBox has exactly 3 controls in the item aggregation.");
            assert.ok(aItems[0].isA("sap.m.CheckBox"), "The first control in the item aggregation is a CheckBox.");
            assert.ok(aItems[1].isA("sap.m.Button"), "The second control in the item aggregation is a Button.");
            assert.strictEqual(aItems[0].getText(), resources.i18n.getText("trackingLabel"),
                "The CheckBox has the correct text.");
            assert.strictEqual(aItems[0].getSelected(), bExpectedCheckboxSelected, "The CheckBox is not selected.");
            assert.strictEqual(aItems[1].getText(), resources.i18n.getText("cleanActivityLabel"),
                "The Button has the correct text.");
            assert.strictEqual(aItems[1].getVisible(), false, "The Button is not visible.");

            // Reset
            oView.destroy();
            fnDone();
        });
    });

    QUnit.test("The view is correct if user activities are tracked", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            bExpectedCheckboxSelected = true;
        Config.emit("/core/shell/model/enableTrackingActivity", true);

        // Act
        this.oEntry.contentFunc().then(function (oView) {
            // Assert
            var aContent = oView.getContent();
            assert.strictEqual(aContent.length, 1, "The view has exactly one control in the content aggregation.");
            assert.ok(aContent[0].isA("sap.ui.layout.form.SimpleForm"), "The control in the content aggregation is a SimpleForm.");

            var aFormContent = aContent[0].getContent();
            assert.ok(aFormContent[0].isA("sap.m.VBox"), "The control in the SimpleForm is a VBox.");
            assert.ok(aContent[0].hasStyleClass("sapUiSmallMarginBegin"), "The Form has the class \"sapUiSmallMarginBegin\".");

            var aItems = aFormContent[0].getItems();
            assert.strictEqual(aItems.length, 3, "The VBox has exactly 3 controls in the item aggregation.");
            assert.ok(aItems[0].isA("sap.m.CheckBox"), "The first control in the item aggregation is a CheckBox.");
            assert.ok(aItems[1].isA("sap.m.Button"), "The second control in the item aggregation is a Button.");
            assert.strictEqual(aItems[0].getText(), resources.i18n.getText("trackingLabel"),
                "The CheckBox has the correct text.");
            assert.strictEqual(aItems[0].getSelected(), bExpectedCheckboxSelected, "The CheckBox is selected.");
            assert.strictEqual(aItems[1].getText(), resources.i18n.getText("cleanActivityLabel"),
                "The Button has the correct text.");
            assert.strictEqual(aItems[1].getVisible(), true, "The Button is visible.");

            // Reset
            oView.destroy();
            fnDone();
        });
    });

    QUnit.module("The onSave method", {
        beforeEach: function () {
            sandbox = sinon.sandbox.create();

            this.oEntry = UserActivitiesEntry.getEntry();
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
            this.oEntry = UserActivitiesEntry.getEntry();
            this.oLogWarningSpy = sinon.spy(Log, "warning");
        },
        afterEach: function () {
            Config._reset();
            this.oLogWarningSpy.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the View was not created yet", function (assert) {
        // Act
        this.oEntry.onCancel();
        // Assert
        assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");
    });
});
