// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/m/Page",
    "sap/ushell/Config",
    "sap/ushell/state/StateManager"
], function (
    Component,
    Container,
    EventHub,
    Page,
    Config,
    StateManager
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("Integration tests", {
        beforeEach: function () {
            QUnit.sap.ushell.createTestDomRef(); // used to place the Renderer

            this.aPages = [
                new Page(),
                new Page(),
                new Page(),
                new Page()
            ];
            this.aEntries = [
                {
                    id: "firstEntry",
                    contentFunc: sandbox.stub().resolves(this.aPages[0]),
                    entryHelpID: "entry-help-id-0",
                    icon: "sap-icon://home",
                    onCancel: sandbox.stub().resolves(),
                    onSave: sandbox.stub().resolves(),
                    title: "entry0",
                    valueArgument: sandbox.stub().resolves("subtitle0")
                },
                {
                    id: "secondEntry",
                    contentFunc: sandbox.stub().resolves(this.aPages[1]),
                    entryHelpID: "entry-help-id-1",
                    icon: "sap-icon://delete",
                    onCancel: sandbox.stub().resolves(),
                    onSave: sandbox.stub().resolves(),
                    title: "entry1",
                    valueArgument: sandbox.stub().resolves("subtitle1"),
                    groupingEnablement: true,
                    groupingId: "group0",
                    groupingTabTitle: "entry1 - tab",
                    groupingTabHelpId: "entry-help-id-1-tab"
                },
                {
                    id: "thirdEntry",
                    contentFunc: sandbox.stub().resolves(this.aPages[2]),
                    entryHelpID: "entry-help-id-2",
                    icon: "sap-icon://refresh",
                    onCancel: sandbox.stub().resolves(),
                    onSave: sandbox.stub().resolves(),
                    title: "entry2",
                    valueArgument: sandbox.stub().resolves("subtitle2")
                },
                {
                    id: "fourthEntry",
                    contentFunc: sandbox.stub().resolves(this.aPages[3]),
                    entryHelpID: "entry-help-id-3",
                    icon: "sap-icon://edit",
                    onCancel: sandbox.stub().resolves(),
                    onSave: sandbox.stub().resolves(),
                    title: "entry3",
                    valueArgument: sandbox.stub().resolves("subtitle3"),
                    groupingEnablement: true,
                    groupingId: "group1",
                    groupingTabTitle: "entry3 - tab",
                    groupingTabHelpId: "entry-help-id-3-tab"
                },
                {
                    id: "fifthEntry",
                    contentFunc: sandbox.stub().rejects(),
                    entryHelpID: "entry-help-id-4",
                    icon: "sap-icon://add",
                    onCancel: sandbox.stub().resolves(),
                    onSave: sandbox.stub().resolves(),
                    title: "entry4",
                    valueArgument: sandbox.stub().resolves("subtitle4")
                }
            ];
            return new Promise(function (resolve) {
                Container.init("local")
                    .then(function () {
                        Container.createRendererInternal("fiori2")
                            .then(function (oRendererControl) {
                                this.oRendererControl = oRendererControl;
                                oRendererControl.placeAt("qunit-canvas");

                                return Component.create({
                                    name: "sap.ushell.components.shell.Settings"
                                });
                            }.bind(this))
                            .then(function (oUserSettingsComponent) {
                                this.oComponent = oUserSettingsComponent;
                                Config._reset(); // removes the default settings for this test
                                return oUserSettingsComponent._openUserSettings({});
                            }.bind(this))
                            .then(function () {
                                this.oView = this.oComponent.oSettingsView;
                                this.oController = this.oView.getController();
                                resolve();
                            }.bind(this));
                    }.bind(this));
            }.bind(this));
        },

        afterEach: function () {
            this.aPages.forEach(function (oPage) {
                oPage.destroy();
            });
            this.oComponent.destroy();
            return this.oRendererControl.destroy().then(function () {
                EventHub._reset();
                Config._reset();
                sandbox.restore();
                StateManager.resetAll();
            });
        }
    });

    /**
     * Asserts that the created UserSettings has the correct state and is rendered correctly.
     * To check the rendering of each entry, the content of each entry is opened.
     *
     * @param {object} assert QUnit assert, that is used for testing.
     * @param {object} oExpectations The expected results.
     * @param {sap.ushell.components.shell.Settings.UserSettings.view} oView The view of the UserSettings Component
     * @param {sap.ushell.components.shell.Settings.UserSettings.controller} oController The controller of the UserSettings Component
     * @returns {Promise<undefined>} resolves when all checks are done or rejects if there was an error during promise chaining.
     */
    function doAssertions (assert, oExpectations, oView, oController) {
        return new Promise(function (resolve, reject) {
            var oUserSettingEntryList = oView.byId("userSettingEntryList");
            var aItems = oUserSettingEntryList.getItems();
            assert.strictEqual(aItems.length, oExpectations.itemTitles.length, "The amount of items is as expected.");

            var aMainEntries = oUserSettingEntryList.getModel().getProperty("/entries");
            var aMainEntryIds = aMainEntries.map(function (oMainEntry) {
                return oMainEntry.id;
            });
            assert.deepEqual(aMainEntryIds, oExpectations.mainEntryIds, "Correct entries are in the model.");

            var aItemTitles = aItems.map(function (oItem) {
                return oItem.getTitle();
            });
            assert.deepEqual(aItemTitles, oExpectations.itemTitles, "Entries in the view have the expected titles.");

            var aMainEntryTabIds = aMainEntries.map(function (oMainEntry) {
                return oMainEntry.tabs.map(function (oTabEntry) {
                    return oTabEntry.id;
                });
            });
            assert.deepEqual(aMainEntryTabIds, oExpectations.mainEntryTabIds, "Correct tabs in the model.");

            // Open every entry to test how the tabs are rendered.
            aItems
                .reduce(function (oPromiseChain, oItem) {
                    return oPromiseChain.then(function () {
                        return oController._toDetail(oItem);
                    });
                }, Promise.resolve())
                .then(function () {
                    var aDetailPages = oView.byId("settingsApp").getDetailPages();
                    var iExpectedDetailPages = oExpectations.tabTitles.length + 1; // expected entries + the busy page
                    assert.strictEqual(aDetailPages.length, iExpectedDetailPages, "The amount of detail pages is as expected.");

                    aDetailPages.forEach(function (oDetailPage, index) {
                        // exclude busy page
                        if (index === 0) {
                            return;
                        }
                        var oIconTabBar = oDetailPage.getContent()[1];
                        assert.ok(oIconTabBar.isA("sap.m.IconTabBar"), "IconTabBar is at the correct position in the wrapper.");
                        assert.strictEqual(oIconTabBar.getVisible(), oExpectations.tabTitles[index - 1].length > 1, "Entry " + index - 1 + ": visibility as expected.");
                        var aTabNames = oIconTabBar.getItems().map(function (oFilter) {
                            return oFilter.getText();
                        });
                        assert.deepEqual(aTabNames, oExpectations.tabTitles[index - 1], "Entry " + index - 1 + ": tabs are as expected.");
                    });
                    resolve();
                })
                .catch(reject);
        });
    }

    QUnit.test("Two groups with only one entry each", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oExpectations = {
            mainEntryIds: [
                this.aEntries[0].id,
                this.aEntries[1].id,
                this.aEntries[2].id,
                this.aEntries[3].id,
                this.aEntries[4].id
            ],
            itemTitles: [
                this.aEntries[0].title,
                this.aEntries[1].title,
                this.aEntries[2].title,
                this.aEntries[3].title,
                this.aEntries[4].title
            ],
            mainEntryTabIds: [
                [this.aEntries[0].id],
                [this.aEntries[1].id],
                [this.aEntries[2].id],
                [this.aEntries[3].id],
                [this.aEntries[4].id]
            ],
            tabTitles: [
                [""],
                ["entry1 - tab"],
                [""],
                ["entry3 - tab"],
                [""]
            ]
        };

        // Act
        Config.emit("/core/userPreferences/entries", this.aEntries);

        // Assert
        setTimeout(function () {
            doAssertions(assert, oExpectations, this.oView, this.oController).finally(fnDone);
        }.bind(this), 300);
    });

    QUnit.test("One Group with two entries", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.aEntries[2].groupingEnablement = true;
        this.aEntries[2].groupingId = "group0";
        this.aEntries[2].groupingTabTitle = "entry2 - tab";
        this.aEntries[2].groupingTabHelpId = "entry-help-id-2-tab";
        var oExpectations = {
            mainEntryIds: [
                this.aEntries[0].id,
                this.aEntries[1].id,
                this.aEntries[3].id,
                this.aEntries[4].id
            ],
            itemTitles: [
                this.aEntries[0].title,
                this.aEntries[1].title,
                this.aEntries[3].title,
                this.aEntries[4].title
            ],
            mainEntryTabIds: [
                [this.aEntries[0].id],
                [this.aEntries[1].id, this.aEntries[2].id],
                [this.aEntries[3].id],
                [this.aEntries[4].id]
            ],
            tabTitles: [
                [""],
                ["entry1 - tab", "entry2 - tab"],
                ["entry3 - tab"],
                [""]
            ]
        };

        // Act
        Config.emit("/core/userPreferences/entries", this.aEntries);

        // Assert
        setTimeout(function () {
            doAssertions(assert, oExpectations, this.oView, this.oController).finally(fnDone);
        }.bind(this), 300);
    });

    QUnit.test("Two groups with three and two items", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.aEntries[0].groupingEnablement = true;
        this.aEntries[0].groupingId = "group0";
        this.aEntries[0].groupingTabTitle = "entry0 - tab";
        this.aEntries[0].groupingTabHelpId = "entry-help-id-0-tab";
        this.aEntries[2].groupingEnablement = true;
        this.aEntries[2].groupingId = "group0";
        this.aEntries[2].groupingTabTitle = "entry2 - tab";
        this.aEntries[2].groupingTabHelpId = "entry-help-id-2-tab";
        this.aEntries[4].groupingEnablement = true;
        this.aEntries[4].groupingId = "group1";
        this.aEntries[4].groupingTabTitle = "entry4 - tab";
        this.aEntries[4].groupingTabHelpId = "entry-help-id-4-tab";
        var oExpectations = {
            mainEntryIds: [
                this.aEntries[0].id,
                this.aEntries[3].id
            ],
            itemTitles: [
                this.aEntries[0].title,
                this.aEntries[3].title
            ],
            mainEntryTabIds: [
                [this.aEntries[0].id, this.aEntries[1].id, this.aEntries[2].id],
                [this.aEntries[3].id, this.aEntries[4].id]
            ],
            tabTitles: [
                ["entry0 - tab", "entry1 - tab", "entry2 - tab"],
                ["entry3 - tab", "entry4 - tab"]
            ]
        };

        // Act
        Config.emit("/core/userPreferences/entries", this.aEntries);

        // Assert
        setTimeout(function () {
            doAssertions(assert, oExpectations, this.oView, this.oController).finally(fnDone);
        }.bind(this), 300);
    });

    QUnit.test("One group with three tabs, one of them not visible and another invisible entry.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.aEntries[0].valueArgument.resolves({ value: false, displayText: "someIssue" });
        this.aEntries[2].groupingEnablement = true;
        this.aEntries[2].groupingId = "group0";
        this.aEntries[2].groupingTabTitle = "entry2 - tab";
        this.aEntries[2].groupingTabHelpId = "entry-help-id-2-tab";
        this.aEntries[2].valueArgument.resolves({ value: false, displayText: "someIssue" });
        this.aEntries[3].groupingEnablement = true;
        this.aEntries[3].groupingId = "group0";
        this.aEntries[3].groupingTabTitle = "entry3 - tab";
        this.aEntries[3].groupingTabHelpId = "entry-help-id-3-tab";
        var oExpectations = {
            mainEntryIds: [
                this.aEntries[1].id,
                this.aEntries[4].id
            ],
            itemTitles: [
                this.aEntries[1].title,
                this.aEntries[4].title
            ],
            mainEntryTabIds: [
                [this.aEntries[1].id, this.aEntries[3].id],
                [this.aEntries[4].id]
            ],
            tabTitles: [
                ["entry1 - tab", "entry3 - tab"],
                [""]
            ]
        };

        // Act
        Config.emit("/core/userPreferences/entries", this.aEntries);

        // Assert
        setTimeout(function () {
            doAssertions(assert, oExpectations, this.oView, this.oController).finally(fnDone);
        }.bind(this), 300);
    });

    QUnit.test("One Group with three entries, second tab gets opened and onCancel is called correctly", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.aEntries[2].groupingEnablement = true;
        this.aEntries[2].groupingId = "group0";
        this.aEntries[2].groupingTabTitle = "entry2 - tab";
        this.aEntries[2].groupingTabHelpId = "entry-help-id-2-tab";
        this.aEntries[3].groupingEnablement = true;
        this.aEntries[3].groupingId = "group0";
        this.aEntries[3].groupingTabTitle = "entry3 - tab";
        this.aEntries[3].groupingTabHelpId = "entry-help-id-3-tab";

        // Act
        Config.emit("/core/userPreferences/entries", this.aEntries);

        // Assert
        setTimeout(function () {
            var oUserSettingEntryList = this.oView.byId("userSettingEntryList");
            var aItems = oUserSettingEntryList.getItems();
            oUserSettingEntryList.setSelectedItem(aItems[1]);
            this.oController._toDetail(aItems[1]).then(function () {
                var oDetailPage = this.oView.byId("settingsApp").getDetailPages()[2];
                var oIconTabBar = oDetailPage.getContent()[1];
                var aIconTabFilters = oIconTabBar.getItems();
                oIconTabBar.setSelectedKey(aIconTabFilters[1].getId());
                oIconTabBar.fireSelect({
                    item: aIconTabFilters[1],
                    key: aIconTabFilters[1].getId(),
                    previousKey: aIconTabFilters[0].getId()
                });
                setTimeout(function () {
                    this.oView.byId("userSettingCancelButton").firePress();
                    setTimeout(function () {
                        assert.strictEqual(this.aEntries[0].onCancel.callCount, 1);
                        assert.strictEqual(this.aEntries[1].onCancel.callCount, 1);
                        assert.strictEqual(this.aEntries[2].onCancel.callCount, 1);
                        assert.strictEqual(this.aEntries[3].onCancel.callCount, 0);
                        assert.strictEqual(this.aEntries[4].onCancel.callCount, 0);
                        fnDone();
                    }.bind(this), 300);
                }.bind(this), 300);
            }.bind(this));
        }.bind(this), 300);
    });

    QUnit.test("One Group with three entries, third tab gets opened and onSave is called correctly", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.aEntries[2].groupingEnablement = true;
        this.aEntries[2].groupingId = "group0";
        this.aEntries[2].groupingTabTitle = "entry2 - tab";
        this.aEntries[2].groupingTabHelpId = "entry-help-id-2-tab";
        this.aEntries[3].groupingEnablement = true;
        this.aEntries[3].groupingId = "group0";
        this.aEntries[3].groupingTabTitle = "entry3 - tab";
        this.aEntries[3].groupingTabHelpId = "entry-help-id-3-tab";

        // Act
        Config.emit("/core/userPreferences/entries", this.aEntries);

        // Assert
        setTimeout(function () {
            var oUserSettingEntryList = this.oView.byId("userSettingEntryList");
            var aItems = oUserSettingEntryList.getItems();
            oUserSettingEntryList.setSelectedItem(aItems[1]);
            this.oController._toDetail(aItems[1]).then(function () {
                var oDetailPage = this.oView.byId("settingsApp").getDetailPages()[2];
                var oIconTabBar = oDetailPage.getContent()[1];
                var aIconTabFilters = oIconTabBar.getItems();
                oIconTabBar.setSelectedKey(aIconTabFilters[2].getId());
                oIconTabBar.fireSelect({
                    item: aIconTabFilters[2],
                    key: aIconTabFilters[2].getId(),
                    previousKey: aIconTabFilters[0].getId()
                });
                setTimeout(function () {
                    this.oView.byId("userSettingSaveButton").firePress();
                    setTimeout(function () {
                        assert.strictEqual(this.aEntries[0].onSave.callCount, 1);
                        assert.strictEqual(this.aEntries[1].onSave.callCount, 1);
                        assert.strictEqual(this.aEntries[2].onSave.callCount, 0);
                        assert.strictEqual(this.aEntries[3].onSave.callCount, 1);
                        assert.strictEqual(this.aEntries[4].onSave.callCount, 0);
                        fnDone();
                    }.bind(this), 200);
                }.bind(this), 200);
            }.bind(this));
        }.bind(this), 200);
    });
});
