// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.MyHomeImport
 */

/* global QUnit, sinon */
sap.ui.define([
    "sap/ushell/components/pages/MyHomeImport",
    "sap/ushell/utils/HttpClient",
    "sap/ushell/Container"
], function (MyHomeImport, HttpClient, Container) {
    "use strict";

    function noop () {
        return null;
    }

    var sandbox = sinon.createSandbox({});
    // Mock the UserInfo service:
    var oUser = {
        getImportBookmarksFlag: noop,
        setImportBookmarksFlag: noop,
        resetChangedProperty: noop
    };

    function stubContainer () {
        sandbox.stub(Container, "getServiceAsync").resolves({
            updateUserPreferences: noop,
            getUser: function () {
                return oUser;
            }
        });

        sandbox.stub(Container, "getUser").returns({getLanguage: () => "EN"});
        sandbox.stub(Container, "getLogonSystem").returns({getClient: () => "4711"});
    }

    window["sap-ushell-config"] = {
        services: {
            PageBuilding: {
                adapter: {
                    config: {
                        services: {
                            pageBuilding: {
                                baseUrl: "MyTestBaseURl"
                            }
                        }
                    }
                }
            }
        }
    };

    QUnit.dump.maxDepth = 10;

    QUnit.module("The getData method", {
        beforeEach: function () {
            stubContainer();
            this.oConfig = {
                order: [
                    "/UI2/Fiori2LaunchpadHome",
                    "customGroupId",
                    "customGroupId2",
                    "catalogGroupId",
                    "emptyGroup",
                    "lockedGroupBId",
                    "lockedGroupAId"
                ],
                hiddenGroups: []
            };
            this.oPages = {
                results: [{
                    PageChipInstances: { results: [{}, {}] },
                    id: "/UI2/Fiori2LaunchpadHome",
                    title: "My Home",
                    isPersLocked: "",
                    scope: "PERSONALIZATION"
                }, {
                    PageChipInstances: { results: [{}, {}] },
                    id: "customGroupId2",
                    title: "Custom group title 2",
                    isPersLocked: "",
                    scope: "PERSONALIZATION"
                }, {
                    PageChipInstances: { results: [{}, {}] },
                    id: "customGroupId",
                    title: "Custom group title",
                    isPersLocked: "",
                    scope: "PERSONALIZATION"
                }, {
                    PageChipInstances: { results: [] },
                    id: "emptyGroup",
                    title: "Empty Group",
                    isPersLocked: "",
                    scope: "PERSONALIZATION"
                }, {
                    PageChipInstances: { results: [{}, {}] },
                    id: "catalogGroupId",
                    title: "Catalog group title",
                    isPersLocked: "",
                    scope: "CONFIGURATION"
                }, {
                    PageChipInstances: { results: [{}, {}] },
                    id: "lockedGroupBId",
                    title: "Locked group b title",
                    layout: "{\"order\": [], \"linkOrder\": []}",
                    isPersLocked: "X",
                    scope: "PERSONALIZATION"
                }, {
                    PageChipInstances: { results: [{}, {}] },
                    id: "lockedGroupAId",
                    title: "Locked group a title",
                    layout: "{\"order\": [], \"linkOrder\": []}",
                    isPersLocked: "X",
                    scope: "PERSONALIZATION"
                }, {
                    PageChipInstances: {
                        results: [{
                            ChipInstanceBags: {
                                results: [
                                    { id: "tileProperties" }
                                ]
                            }
                        }]
                    },
                    id: "groupWithBag",
                    title: "Group with a bag",
                    layout: "{\"order\": [], \"linkOrder\": []}",
                    isPersLocked: "X",
                    scope: "PERSONALIZATION"
                }]
            };
            delete MyHomeImport.oPageSetPromise;
        },
        afterEach: function () {
            sandbox.restore();
            sandbox.reset();
        }
    });

    QUnit.test("Request send", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oHttpClientStub = sinon.stub(HttpClient.prototype, "get");
        oHttpClientStub.resolves();
        var oParseDataStub = sinon.stub(MyHomeImport, "parseData");

        // Act
        MyHomeImport.getData().then(function () {
            // Assert
            assert.ok(oHttpClientStub.called, "Request send");
            assert.ok(oParseDataStub.called, "parseData called");
            // Reset
            oHttpClientStub.restore();
            oParseDataStub.restore();
            fnDone();
        });
    });

    QUnit.test("Request URL", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oHttpClientStub = sinon.stub(HttpClient.prototype, "get");
        oHttpClientStub.resolves();
        var oParseDataStub = sinon.stub(MyHomeImport, "parseData");

        // Act
        MyHomeImport.getData().then(function () {
            // Assert
            var sUrl = oHttpClientStub.getCall(0).args[0];
            assert.equal(sUrl,
                "PageSets('%2FUI2%2FFiori2LaunchpadHome')"
                + "?$expand=Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties,"
                + "Pages/PageChipInstances/Chip"
                + "&$format=json",
                "Request URL as expected");
            // Reset
            oHttpClientStub.restore();
            oParseDataStub.restore();
            fnDone();
        });
    });

    QUnit.test("home group, custom group, empty group, non personalized catalog group, and 2 personalized locked groups in incorrect order", function (assert) {
        // Arrange
        this.sFakeResponse = JSON.stringify({
            d: {
                configuration: JSON.stringify(this.oConfig),
                Pages: this.oPages
            }
        });

        var aExpectedResult = [{
            id: "groupWithBag",
            title: "Group with a bag",
            isLocked: true,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{
                ChipInstanceBags: {
                    results: [{ id: "tileProperties" }]
                }
            }]
        }, {
            id: "lockedGroupAId",
            title: "Locked group a title",
            isLocked: true,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "lockedGroupBId",
            title: "Locked group b title",
            isLocked: true,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "/UI2/Fiori2LaunchpadHome",
            title: "My Home",
            isLocked: false,
            isDefault: true,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "customGroupId",
            title: "Custom group title",
            isLocked: false,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "customGroupId2",
            title: "Custom group title 2",
            isLocked: false,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }
        ];

        // Act
        var aResult = MyHomeImport.parseData({
            responseText: this.sFakeResponse
        });
        assert.deepEqual(aResult, aExpectedResult, "The expected groups are returned.");
    });

    QUnit.test("keeps the sort order if the configuration.order property is empty", function (assert) {
        // Arrange
        this.oConfig.order = [];
        this.sFakeResponse = JSON.stringify({
            d: {
                configuration: JSON.stringify(this.oConfig),
                MyPages: this.oMyPages,
                Pages: this.oPages
            }
        });

        var aExpectedResult = [{
            id: "groupWithBag",
            title: "Group with a bag",
            isLocked: true,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{
                ChipInstanceBags: {
                    results: [{
                        id: "tileProperties"
                    }]
                }
            }]
        }, {
            id: "lockedGroupAId",
            title: "Locked group a title",
            isLocked: true,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "lockedGroupBId",
            title: "Locked group b title",
            isLocked: true,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "/UI2/Fiori2LaunchpadHome",
            title: "My Home",
            isLocked: false,
            isDefault: true,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "customGroupId2",
            title: "Custom group title 2",
            isLocked: false,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }, {
            id: "customGroupId",
            title: "Custom group title",
            isLocked: false,
            isDefault: false,
            tileOrder: [],
            linkOrder: [],
            chips: [{}, {}]
        }];

        // Act
        var aResult = MyHomeImport.parseData({
            responseText: this.sFakeResponse
        });
        assert.deepEqual(aResult, aExpectedResult, "The expected groups are returned in the correct order.");
    });

    QUnit.module("The isImportEnabled method", {
        beforeEach: function () {
            stubContainer();
            this.oGetDataStub = sandbox.stub(MyHomeImport, "getData");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("No groups are returned", function (assert) {
        // Arrange
        this.oGetDataStub.resolves([]);

        // Act
        return MyHomeImport.isImportEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, false, "The result is correct, as there are no groups available.");
        });
    });

    QUnit.test("Two groups are returned", function (assert) {
        // Arrange
        this.oGetDataStub.resolves([{}, {}]);

        // Act
        return MyHomeImport.isImportEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, true, "The result is correct, as there are two groups available.");
        });
    });

    QUnit.module("The isImportEnabled method, MYHOME_IMPORT_FROM_CLASSIC is set", {
        beforeEach: function () {
            stubContainer();
            this.oGetImportBookmarksFlag = sandbox.stub(oUser, "getImportBookmarksFlag").returns("dismissed");
            this.oGetDataStub = sandbox.stub(MyHomeImport, "getData");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("dismissed, return false", function (assert) {
        // Arrange
        this.oGetImportBookmarksFlag.returns("dismissed");

        // Act
        return MyHomeImport.isImportEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(this.oGetDataStub.callCount, 0, "GetData was not called");
            assert.strictEqual(bResult, false, "The result is correct.");
        }.bind(this));
    });

    QUnit.test("pending, return true", function (assert) {
        // Arrange
        this.oGetImportBookmarksFlag.returns("pending");

        // Act
        return MyHomeImport.isImportEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(this.oGetDataStub.callCount, 0, "GetData was not called");
            assert.strictEqual(bResult, true, "The result is correct.");
        }.bind(this));
    });
});
