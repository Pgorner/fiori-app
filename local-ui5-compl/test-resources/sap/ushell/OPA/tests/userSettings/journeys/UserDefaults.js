// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This OPA journey will test the UserDefaults in the UserSettings dialog.
 */
sap.ui.define([
    "sap/ui/fl/FakeLrepConnectorLocalStorage",
    "sap/ui/test/opaQunit",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/userSettings/pages/UserDefaults"
], function (FakeLrepConnectorLocalStorage, opaTest, resources) {
    "use strict";

    /* global QUnit */

    var oView1 = {
        fileName: "id_1601457802403_15_wrapper",
        fileType: "variant",
        changeType: "wrapper",
        moduleName: "",
        reference: "sap.ushell.components.shell.Settings.userDefaults.Component",
        packageName: "",
        favorite: true,
        content: {
            Second: { value: "View1 Second" },
            First: { value: "View1 First" },
            AdditionalValueParam: {
                value: "View1 Extended Value",
                additionalValues: {
                    Ranges: [
                        { Sign: "I", Option: "BT", Low: "2", High: "2323" },
                        { Sign: "I", Option: "CP", Low: "ASDF", High: null },
                        { Sign: "I", Option: "LT", Low: "200", High: null }
                    ]
                }
            }
        },
        selector: { persistencyKey: "UserDefaultsFormPersKey" },
        layer: "USER",
        texts: { variantName: { value: "View1", type: "XFLD" } },
        namespace: "apps/sap.ushell.components.shell.Settings.userDefaults/changes/",
        projectId: "sap.ushell.components.shell.Settings.userDefaults",
        creation: "2020-09-30T09:23:22.429Z",
        originalLanguage: "EN",
        support: {
            generator: "Change.createInitialFileContent",
            service: "",
            user: "",
            sapui5Version: "1.84.0-SNAPSHOT",
            sourceChangeFileName: "",
            compositeCommand: "",
            command: ""
        },
        oDataInformation: {},
        dependentSelector: {},
        validAppVersions: {},
        jsOnly: false,
        variantReference: "",
        appDescriptorChange: false
    };

    var oView2 = {
        fileName: "id_1601457802403_16_wrapper",
        fileType: "variant",
        changeType: "wrapper",
        moduleName: "",
        reference: "sap.ushell.components.shell.Settings.userDefaults.Component",
        packageName: "",
        favorite: true,
        content: {
            Second: { value: "View2 Second" },
            First: { value: "View2 First" },
            AdditionalValueParam: { value: "View2 Extended Value" }
        },
        selector: { persistencyKey: "UserDefaultsFormPersKey" },
        layer: "USER",
        texts: { variantName: { value: "View2", type: "XFLD" } },
        namespace: "apps/sap.ushell.components.shell.Settings.userDefaults/changes/",
        projectId: "sap.ushell.components.shell.Settings.userDefaults",
        creation: "2020-09-30T09:23:22.429Z",
        originalLanguage: "EN",
        support: {
            generator: "Change.createInitialFileContent",
            service: "",
            user: "",
            sapui5Version: "1.84.0-SNAPSHOT",
            sourceChangeFileName: "",
            compositeCommand: "",
            command: ""
        },
        oDataInformation: {},
        dependentSelector: {},
        validAppVersions: {},
        jsOnly: false,
        variantReference: "",
        appDescriptorChange: false
    };

    FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();
    FakeLrepConnectorLocalStorage.forTesting.synchronous.store(
        oView1.fileName,
        oView1
    );
    FakeLrepConnectorLocalStorage.forTesting.synchronous.store(
        oView2.fileName,
        oView2
    );
    FakeLrepConnectorLocalStorage.enableFakeConnector();

    QUnit.module("UserDefaults tests", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            sap.ui.require(["sandbox"], function () {
                window["sap-ui-config"]["xx-bootTask"](fnDone);
            });
        }
    });

    /*
    opaTest("Should show the input fields", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: { name: "sap.ushell.components.shell.Settings.userDefaults" }
        });

        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("First", "");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("Second", "");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("AdditionalValueParam", "");
        Then.onTheUserDefaultsPage.iSeeTheAdditionalValuesButton(false);

        Then.iTeardownMyUIComponent();
    });

    opaTest("Should display the correct values for each view", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: { name: "sap.ushell.components.shell.Settings.userDefaults" }
        });

        When.onTheUserDefaultsPage.iSelectView("View1");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("First", "View1 First");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("Second", "View1 Second");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("AdditionalValueParam", "View1 Extended Value");
        Then.onTheUserDefaultsPage.iSeeTheAdditionalValuesButton(true);

        When.onTheUserDefaultsPage.iSelectView("View2");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("First", "View2 First");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("Second", "View2 Second");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("AdditionalValueParam", "View2 Extended Value");
        Then.onTheUserDefaultsPage.iSeeTheAdditionalValuesButton(false);

        Then.iTeardownMyUIComponent();
    });

    opaTest("Should display the dirty state asterisk if a view is modified", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: { name: "sap.ushell.components.shell.Settings.userDefaults" }
        });

        When.onTheUserDefaultsPage.iTypeIntoInputFieldWithName("First", "a");
        Then.onTheUserDefaultsPage.iSeeTheDirtyStateAsterisk();
        When.onTheUserDefaultsPage.iSelectView("View1");
        When.onTheUserDefaultsPage.iTypeIntoInputFieldWithName("First", "a");
        Then.onTheUserDefaultsPage.iSeeTheDirtyStateAsterisk();
        Then.iTeardownMyUIComponent();
    });
    */

    opaTest("Should display the diff state text if a view except Standard is loaded", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: { name: "sap.ushell.components.shell.Settings.userDefaults" }
        });

        When.onTheUserDefaultsPage.iSelectView("View1");
        Then.onTheUserDefaultsPage.iSeeTheDiffStateText(resources.i18n.getText("userDefaultsDiffState"));
        When.onTheUserDefaultsPage.iSelectView("View2");
        Then.onTheUserDefaultsPage.iSeeTheDiffStateText(resources.i18n.getText("userDefaultsDiffState"));
        When.onTheUserDefaultsPage.iSelectStandardView();
        Then.onTheUserDefaultsPage.iDoNotSeeTheDiffStateText(resources.i18n.getText("userDefaultsDiffState"));
        Then.iTeardownMyUIComponent();
    });
});
