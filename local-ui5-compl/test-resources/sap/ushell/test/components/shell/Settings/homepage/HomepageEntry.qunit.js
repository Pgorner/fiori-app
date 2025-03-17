// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.components.shell.Settings.homepage.HomepageEntry
 * @deprecated since 1.120
 */

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/components/shell/Settings/homepage/HomepageEntry",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (Log, SharedComponentUtils, HomepageEntry, Config, resources, jQuery, Container) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("getEntry:");

    QUnit.test("Check if the correct entry settings are applied", function (assert) {
        // Act
        var oHomepageEntry = HomepageEntry.getEntry();

        // Assert
        assert.strictEqual(oHomepageEntry.entryHelpID, "homepageEntry", "entryHelpID is correct");
        assert.strictEqual(oHomepageEntry.title, resources.i18n.getText("FlpSettings_entry_title"), "title is correct");
        assert.strictEqual(oHomepageEntry.valueResult, null, "valueResult is null");
        assert.strictEqual(oHomepageEntry.contentResult, null, "contentResult is null");
        assert.strictEqual(oHomepageEntry.icon, "sap-icon://home", "icon is correct");
        assert.strictEqual(oHomepageEntry.provideEmptyWrapper, false, "provideEmptyWrapper is false");
        assert.strictEqual(oHomepageEntry.valueArgument, null, "valueArgument is null");
        assert.strictEqual(typeof oHomepageEntry.contentFunc, "function", "contentFunc is function");
        assert.strictEqual(typeof oHomepageEntry.onSave, "function", "onSave is function");
        assert.strictEqual(typeof oHomepageEntry.onCancel, "function", "onCancel is function");
    });

    QUnit.module("contentFunc:", {
        beforeEach: function () {
            this.oHomepageEntry = HomepageEntry.getEntry();
            this.oLogErrorSpy = sandbox.spy(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Check if the view is correct", function (assert) {
        // Arrange
        var oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting").resolves(true);

        // Act
        return this.oHomepageEntry.contentFunc().then(function (oView) {
            // Assert
            var aContent = oView.getContent();
            assert.strictEqual(aContent.length, 2, "The view has exactly two controls in the content aggregation.");
            assert.ok(aContent[0].isA("sap.ui.layout.form.SimpleForm"), "The control in the content aggregation is a SimpleForm.");
            var aFormContent = aContent[0].getContent();
            assert.strictEqual(aFormContent.length, 2, "The SimpleForm has exactly 2 controls in the item aggregation.");
            assert.ok(aFormContent[0].isA("sap.m.Label"), "The first control in the item aggregation is a Label.");
            assert.strictEqual(aFormContent[0].getId(), oView.getId() + "--anchorBarLabel",
                "The Label has the id \"anchorBarLabel\".");
            assert.ok(aFormContent[0].hasStyleClass("sapUshellFlpSettingsLabel"),
                "The Label has the class \"sapUshellFlpSettingsLabel\".");
            assert.strictEqual(aFormContent[0].getText(), resources.i18n.getText("AnchorBarLabel"),
                "The Label has the correct text.");
            assert.ok(aFormContent[1].isA("sap.m.VBox"), "The second control in the item aggregation is a Vbox.");
            var aItems = aFormContent[1].getItems();
            assert.strictEqual(aItems.length, 2, "The VBox has exactly 2 controls in the item aggregation.");
            assert.ok(aItems[0].isA("sap.m.RadioButtonGroup"), "The first control in the item aggregation is a RadioButtonGroup.");
            assert.strictEqual(aItems[0].getSelectedIndex(), 0, "The RadioButtonGroup selectedIndex is 0.");
            assert.deepEqual(aItems[0].getAriaLabelledBy(), [oView.getId() + "--anchorBarLabel"],
                "The RadioButtonGroup is labeledBy \"anchorBarLabel\".");
            assert.deepEqual(aItems[0].getAriaDescribedBy(), [oView.getId() + "--anchorBarDescription"],
                "The RadioButtonGroup is describedBy \"anchorBarDescription\".");
            var aButtons = aItems[0].getButtons();
            assert.strictEqual(aButtons.length, 2, "The RadioButtonGroup has exactly 2 controls in the buttons aggregation.");
            assert.ok(aButtons[0].isA("sap.m.RadioButton"), "The first control in the buttons aggregation is a RadioButton.");
            assert.strictEqual(aButtons[0].getId(), oView.getId() + "--anchorBarScrollModeRBtn",
                "The first RadioButton has the id \"anchorBarScrollModeRBtn\".");
            assert.strictEqual(aButtons[0].getText(), resources.i18n.getText("anchorBarScrollMode"),
                "The first RadioButton has the correct text.");
            assert.ok(aButtons[1].isA("sap.m.RadioButton"), "The second control in the buttons aggregation is a RadioButton.");
            assert.strictEqual(aButtons[1].getId(), oView.getId() + "--anchorBarTabModeRBtn",
                "The second RadioButton has the id \"anchorBarTabModeRBtn\".");
            assert.strictEqual(aButtons[1].getText(), resources.i18n.getText("anchorBarTabMode"),
                "The second RadioButton has the correct text.");
            assert.ok(aItems[1].isA("sap.m.VBox"), "The second control in the item aggregation is a VBox.");
            assert.ok(aItems[1].hasStyleClass("sapUshellFlpSettingsDescriptionBorder"),
                "The inner VBox has the class \"sapUshellFlpSettingsDescriptionBorder\".");
            var aInnerVBoxItems = aItems[1].getItems();
            assert.strictEqual(aInnerVBoxItems.length, 2, "The inner VBox has exactly 2 controls in the items aggregation.");
            assert.ok(aInnerVBoxItems[0].isA("sap.m.Text"), "The first control in the inner VBox items aggregation is a Text.");
            assert.strictEqual(aInnerVBoxItems[0].getId(), oView.getId() + "--anchorBarDescription",
                "The first Text has the id \"anchorBarDescription\".");
            assert.ok(aInnerVBoxItems[0].hasStyleClass("sapUshellFlpSettingsDescription"),
                "The first Text has the class \"sapUshellFlpSettingsDescription\".");
            assert.strictEqual(aInnerVBoxItems[0].getText(),
                resources.i18n.getText("homePageGroupDisplayDescriptionText"),
                "The first Text has the correct text.");
            assert.ok(aInnerVBoxItems[1].isA("sap.m.Text"), "The second control in the inner VBox items aggregation is a Text.");
            assert.ok(aInnerVBoxItems[1].hasStyleClass("sapUshellFlpSettingsDescription"),
                "The second Text has the class \"sapUshellFlpSettingsDescription\".");
            assert.strictEqual(aInnerVBoxItems[1].getText(),
                resources.i18n.getText("homePageGroupDisplayDescriptionText_secondParagraph"),
                "The second Text has the correct text.");
            assert.strictEqual(aInnerVBoxItems[1].getVisible(), true, "The second Text is visible.");

            // Clean - up
            oView.destroy();
            oGetEffectiveHomepageSettingStub.restore();
        });
    });

    QUnit.test("Check that an error is put in the log, if the effectiveHomepageSetting is rejected.", function (assert) {
        // Arrange
        var oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting").rejects();

        // Act
        return this.oHomepageEntry.contentFunc().catch(function () {
            // Assert
            assert.strictEqual(this.oLogErrorSpy.callCount, 1, "An error was put in the Log.");

            // Clean - up
            oGetEffectiveHomepageSettingStub.restore();
        }.bind(this));
    });

    QUnit.module("onSave:", {
        beforeEach: function () {
            this.oHomepageEntry = HomepageEntry.getEntry();
            this.oLogWarningSpy = sandbox.spy(Log, "warning");
            this.oLogErrorSpy = sandbox.spy(Log, "error");
            this.oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting").resolves(true);
            this.oSetPersDataStub = sandbox.stub().returns(jQuery.Deferred().resolve(true));
            this.oGetPersonalizer = sandbox.stub(SharedComponentUtils, "getPersonalizer").resolves({
                setPersData: this.oSetPersDataStub
            });
            sandbox.stub(Container, "getRendererInternal").returns({});

        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the view was not created yet", function (assert) {
        // Act
        return this.oHomepageEntry.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");

        }.bind(this));
    });

    QUnit.test("Check that only one warning is put into the Log if the View was already created", function (assert) {
        // Arrange
        return this.oHomepageEntry.contentFunc().then(function (oView) {
            // Act
            this.oHomepageEntry.onSave().then(function () {
                // Assert
                assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Only the VBox was written into the Log.");

                // Clean - up
                oView.destroy();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("Check that the setting stays changed if it was changed.", function (assert) {
        // Arrange
        Config.emit("/core/home/homePageGroupDisplay", "tabs");

        return this.oHomepageEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getContent()[1].getItems()[0].setSelectedIndex(0);

            // Act
            this.oHomepageEntry.onSave().then(function () {
                // Assert
                assert.strictEqual(Config.last("/core/home/homePageGroupDisplay"), "scroll",
                    "The Config value homePageGroupDisplay is \"scroll\".");

                // Clean - up
                oView.destroy();
            });
        }.bind(this));
    });

    QUnit.test("Check that the setting stays changed if it was changed. (2)", function (assert) {
        // Arrange
        Config.emit("/core/home/homePageGroupDisplay", "scroll");

        return this.oHomepageEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getContent()[1].getItems()[0].setSelectedIndex(1);

            // Act
            this.oHomepageEntry.onSave().then(function () {
                // Assert
                assert.strictEqual(Config.last("/core/home/homePageGroupDisplay"), "tabs",
                    "The Config value homePageGroupDisplay is \"tabs\".");

                // Clean - up
                oView.destroy();
            });
        }.bind(this));
    });

    QUnit.test("Check that an error is put into the log, if setting the persData fails.", function (assert) {
        // Arrange
        Config.emit("/core/home/homePageGroupDisplay", "scroll");
        this.oSetPersDataStub.returns(jQuery.Deferred().reject());

        return this.oHomepageEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getContent()[1].getItems()[0].setSelectedIndex(1);

            // Act
            this.oHomepageEntry.onSave().catch(function () {
                // Assert
                assert.strictEqual(this.oLogErrorSpy.callCount, 1, "An error was put into the log.");

                // Clean - up
                oView.destroy();
            }.bind(this));
        }.bind(this));
    });

    QUnit.module("onCancel:", {
        beforeEach: function () {
            this.oHomepageEntry = HomepageEntry.getEntry();
            this.oLogWarningSpy = sandbox.spy(Log, "warning");
            this.oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting").resolves(true);
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the View was not created yet", function (assert) {
        // Act
        this.oHomepageEntry.onCancel();

        // Assert
        assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");
    });

    QUnit.test("Check that only one warning is put into the Log if the View was already created", function (assert) {
        // Act
        return this.oHomepageEntry.contentFunc().then(function (oView) {
            // Act
            this.oHomepageEntry.onCancel();

            // Assert
            assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Only the VBox was written into the Log.");

            // Clean - up
            oView.destroy();
        }.bind(this));
    });
});
