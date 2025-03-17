// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for "sap.ushell.services.LaunchPage".
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/base/Log",
    "sap/m/library",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/adapters/local/LaunchPageAdapter",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/services/ContentExtensionAdapterFactory",
    "sap/ushell/services/_ContentExtensionAdapterFactory/ContentExtensionAdapterConfig",
    "sap/ushell/services/_ContentExtensionAdapterFactory/FeaturedGroupConfig",
    "sap/ushell/services/LaunchPage",
    "sap/ushell/test/utils"
], function (
    Log,
    mobileLibrary,
    jQuery,
    LaunchPageAdapter,
    Config,
    Container,
    ContentExtensionAdapterFactory,
    AdapterFactoryConfig,
    FeaturedGroupMock,
    LaunchPage,
    testUtils
) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    var sUshellTestRootPath = sap.ui.require.toUrl("sap/ushell").replace("resources", "test-resources");
    var oLaunchPageConfig = {
        config: {
            pathToLocalizedContentResources: sUshellTestRootPath + "/test/services/resources/resources.properties",
            groups: [{
                id: "group_0",
                title: "test_group1",
                isPreset: true,
                isVisible: true,
                isGroupLocked: false,
                tiles: [{
                    id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb111",
                    title: "test_tile_header",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    keywords: ["test_keywords"],
                    properties: {
                        chipId: "catalogTile_1",
                        title: "test_tile_header",
                        subtitle: "test_sub_tile_header",
                        infoState: "Neutral",
                        info: "test_info",
                        icon: "sap-icon://travel-expense-report",
                        targetURL: "#Action-todefaultapp",
                        formFactor: "Desktop,Tablet,Phone"
                    }
                }, {
                    id: "tile_001",
                    title: "test_tile_preview_api",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.TileBase",
                    keywords: ["test_keywords"],
                    properties: {
                        chipId: "catalogTile_1",
                        infoState: "Neutral",
                        info: "test_info",
                        formFactor: "Desktop,Tablet,Phone"
                    }
                }, {
                    id: "tile_787",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    isLink: true,
                    properties: {
                        text: "I am a link!",
                        href: "#Action-todefaultapp"
                    }
                }, {
                    id: "tile_777",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    isLink: true,
                    properties: {
                        text: "I am an external link!",
                        href: "http://www.google.com"
                    }
                }, {
                    id: "tile_797",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    mode: "HeaderMode",
                    properties: {
                        title: "test_tile_header",
                        subtitle: "test_sub_tile_header"
                    }
                }, {
                    id: "tile_807",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    mode: "ContentMode",
                    properties: {
                        title: "test_tile_header",
                        subtitle: "test_sub_tile_header"
                    }
                }]
            }, {
                id: "group_1",
                title: "test_group2",
                isPreset: true,
                isVisible: true,
                isGroupLocked: false,
                tiles: [{}]
            }, {
                id: "group_2",
                title: "test_group3",
                isPreset: true,
                isVisible: true,
                isGroupLocked: false,
                tiles: [{
                    id: "tile_102",
                    title: "Test component tile",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    moduleName: "sap.ushell.demo.demoTiles",
                    moduleType: "UIComponent",
                    namespace: "sap.ushell.demo.demoTiles",
                    path: sUshellTestRootPath + "/demoapps/demoTiles/",
                    properties: {
                        chipId: "catalogTile_38",
                        title: "Test component tile",
                        subtitle: "A tile wrapped in a component",
                        infoState: "Neutral",
                        info: "0 days running without bugs",
                        icon: "sap-icon://flight",
                        targetURL: "#Action-todefaultapp",
                        formFactor: "Desktop,Tablet"
                    }
                }, {
                    id: "tile_103",
                    title: "Test view tile",
                    size: "1x1",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    moduleName: "sap.ushell.demo.demoTiles.TestViewTile",
                    moduleType: "JS",
                    namespace: "sap.ushell.demo.demoTiles",
                    path: sUshellTestRootPath + "/demoapps/demoTiles/",
                    properties: {
                        chipId: "catalogTile_38",
                        title: "Test view tile",
                        subtitle: "A tile wrapped in a view",
                        infoState: "Neutral",
                        info: "0 days running without bugs",
                        icon: "sap-icon://flight",
                        targetURL: "#Action-todefaultapp",
                        formFactor: "Desktop,Tablet"
                    }
                }]
            }, {
                id: "group_3",
                title: "test_group4",
                isPreset: true,
                isVisible: true,
                isGroupLocked: true,
                tiles: [{}]
            }, {
                id: "group_4",
                title: "test_group5",
                isPreset: true,
                isVisible: false,
                isGroupLocked: true,
                tiles: [{}]
            }],
            catalogs: [{
                id: "test_catalog_01",
                title: "test_catalog1",
                tiles: [{}]
            }, {
                id: "test_catalog_02",
                title: "test_catalog2",
                tiles: [{}]
            }]
        }
    };
    var aAdditionalAdapterConfig = [{
        name: "feature",
        adapter: "sap.ushell.adapters.local.LaunchPageAdapter",
        config: "/core/home/featuredGroup/enable",
        system: {
            alias: "",
            platform: "local"
        },
        configHandler: function () {
            return FeaturedGroupMock.getMockAdapterConfig(true, true);
        }
    }];
    var oFeatureGroupConfig = {
        groups: [{
            id: "featuredArea",
            contentProvider: "feature",
            isPersonalizationLocked: function () {
                return true;
            },
            getTitle: function () {
                return "Featured";
            },
            title: "Featured",
            isFeatured: true,
            isPreset: true,
            isVisible: true,
            isDefaultGroup: false,
            isGroupLocked: true,
            tiles: [{
                id: "tile_00",
                contentProvider: "feature",
                type: "recent",
                title: "[FEATURED] Sales Performance",
                text: "[FEATURED] Sales Performance",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.DynamicTile",
                isLinkPersonalizationSupported: false,
                keywords: ["sales", "performance"],
                formFactor: "Desktop,Tablet,Phone",
                serviceRefreshInterval: 10,
                actions: [{
                    text: "Go To Sample App",
                    icon: "sap-icon://action",
                    targetURL: "#Action-toappnavsample"
                }, {
                    text: "Go to stackoverflow",
                    icon: "sap-icon://action",
                    targetURL: "http://stackoverflow.com/"
                }, {
                    text: "Illigal URL",
                    icon: "sap-icon://action",
                    targetURL: "stackoverflow.com/"
                }, {
                    text: "Callback action",
                    icon: "sap-icon://action-settings"
                }],
                chipId: "catalogTile_33",
                properties: {
                    title: "[FEATURED] Sales Performance",
                    numberValue: 3.75,
                    info: "Change to Last Month in %",
                    numberFactor: "%",
                    numberDigits: 2,
                    numberState: "Positive",
                    stateArrow: "Up",
                    icon: "sap-icon://Fiori2/F0002",
                    targetURL: "#Action-toappnavsample"
                }
            }, {
                id: "tile_shelluiservicesample",
                contentProvider: "feature",
                type: "frequent",
                title: "[FEATURED] ShellUIService Sample App",
                size: "1x1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                isLinkPersonalizationSupported: true,
                formFactor: "Desktop,Tablet",
                chipId: "catalogTile_45",
                properties: {
                    title: "[FEATURED] Sample App for ShellUIService",
                    text: "[FEATURED] Sample App for ShellUIService",
                    subtitle: "",
                    infoState: "Neutral",
                    info: "#Action-toappshelluiservicesample",
                    icon: "sap-icon://syringe",
                    targetURL: "#Action-toappshelluiservicesample"
                }
            }]
        }]
    };

    [{
        testDescription: "when enableFeaturedGroup is true",
        input: { enableFeaturedGroup: true },
        output: { numberOfFeaturedGroups: 1 }
    }, {
        testDescription: "when enableFeaturedGroup is false",
        input: { enableFeaturedGroup: false },
        output: { numberOfFeaturedGroups: 0 }
    }].forEach(function (oFixture) {
        QUnit.module("sap.ushell.services.LaunchPage " + oFixture.testDescription, {
            beforeEach: function () {
                this.oConfigLastStub = sandbox.stub(Config, "last");
                this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
                this.oConfigLastStub.returns(oFixture.input.enableFeaturedGroup);

                this.oAppStateService = {};

                this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
                this.oGetServiceAsyncStub.withArgs("AppState").resolves(this.oAppStateService);

                sandbox.stub(FeaturedGroupMock, "getMockAdapterConfig").returns(oFeatureGroupConfig);
                sandbox.stub(AdapterFactoryConfig, "_getConfigAdapters").returns(aAdditionalAdapterConfig);
            },
            afterEach: function () {
                sandbox.restore();
            }
        });

        QUnit.test("addBookmark failures", function (assert) {
            // Act
            var oLaunchPageService = new LaunchPage();

            // Assert
            assert.throws(function () {
                oLaunchPageService.addBookmark();
            });
            assert.throws(function () {
                oLaunchPageService.addBookmark("Test");
            });
            assert.throws(function () {
                oLaunchPageService.addBookmark({});
            }, /Title missing in bookmark configuration/);
            assert.throws(function () {
                oLaunchPageService.addBookmark({ title: "" });
            }, /Title missing in bookmark configuration/);
            assert.throws(function () {
                oLaunchPageService.addBookmark({ title: "MyTitle" });
            }, /URL missing in bookmark configuration/);
        });

        QUnit.test("addBookmark success", function (assert) {
            // Arrange
            var oBookmarkConfig = { title: "MyTitle", url: "MyUrl" };
            var oLaunchPageAdapter = {
                addBookmark: sandbox.stub().returns(new jQuery.Deferred().promise())
            };

            var sContentProviderId = "TestProviderA";

            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            oLaunchPageService.addBookmark(oBookmarkConfig, undefined, sContentProviderId);

            // Assert
            assert.strictEqual(oLaunchPageAdapter.addBookmark.callCount, 1, "The function addBookmark has been called once.");
            assert.ok(oLaunchPageAdapter.addBookmark.calledWith(oBookmarkConfig, undefined, sContentProviderId), "The function addBookmark has been called with the correct parameters.");
        });

        QUnit.test("setTileVisible", function (assert) {
            var oTile = {};
            var oLaunchPageAdapter = {
                setTileVisible: sandbox.spy()
            };

            // prepare test
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // code under test
            oLaunchPageService.setTileVisible(oTile, true);

            // test
            assert.ok(oLaunchPageAdapter.setTileVisible.calledOnce);
            assert.ok(oLaunchPageAdapter.setTileVisible.calledWithExactly(oTile, true));
        });

        QUnit.test("getCatalogError", function (assert) {
            var oCatalog = {};
            var oLaunchPageAdapter = {
                getCatalogError: sandbox.stub().returns("foo")
            };

            // prepare test
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // code under test
            assert.strictEqual(oLaunchPageService.getCatalogError(oCatalog), "foo");

            // test
            assert.ok(oLaunchPageAdapter.getCatalogError.calledOnce);
            assert.ok(oLaunchPageAdapter.getCatalogError.calledWithExactly(oCatalog));
        });

        QUnit.test("isTileIntentSupported", function (assert) {
            var oTile = {};
            var oLaunchPageAdapter = {
                isTileIntentSupported: sandbox.stub().returns("foo") // deliberately no boolean
            };

            // part 1: unsupported in adapter
            var oLaunchPageService = new LaunchPage({});
            assert.strictEqual(oLaunchPageService.isTileIntentSupported(oTile), true);

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            assert.strictEqual(oLaunchPageService.isTileIntentSupported(oTile), "foo");
            assert.ok(oLaunchPageAdapter.isTileIntentSupported.calledOnce);
            assert.ok(oLaunchPageAdapter.isTileIntentSupported.calledWithExactly(oTile));
        });

        QUnit.test("getCardManifest", function (assert) {
            var oCard = {};
            var oLaunchPageAdapter = {
                getCardManifest: sandbox.stub().returns("Manifest")
            };

            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            assert.strictEqual(oLaunchPageService.getCardManifest(oCard), "Manifest");
            assert.ok(oLaunchPageAdapter.getCardManifest.calledOnce);
            assert.ok(oLaunchPageAdapter.getCardManifest.calledWithExactly(oCard));
        });

        QUnit.test("isGroupVisible", function (assert) {
            var oGroup = {};
            var oLaunchPageAdapter = {
                isGroupVisible: sandbox.stub().returns("visible")
            };

            // part 1: unsupported in adapter - default value received from the service directly
            var oLaunchPageService = new LaunchPage({});
            assert.strictEqual(oLaunchPageService.isGroupVisible(oGroup), true);

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            assert.strictEqual(oLaunchPageService.isGroupVisible(oGroup), "visible");
            assert.ok(oLaunchPageAdapter.isGroupVisible.calledOnce);
            assert.ok(oLaunchPageAdapter.isGroupVisible.calledWithExactly(oGroup));
        });

        QUnit.test("isGroupLocked", function (assert) {
            var oGroup = {};
            var oLaunchPageAdapter = {
                isGroupLocked: sandbox.stub().returns("foo")
            };

            // part 1: unsupported in adapter - default value received from the service directly
            var oLaunchPageService = new LaunchPage({});
            assert.strictEqual(oLaunchPageService.isGroupLocked(oGroup), false);

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            assert.strictEqual(oLaunchPageService.isGroupLocked(oGroup), "foo");
            assert.ok(oLaunchPageAdapter.isGroupLocked.calledOnce);
            assert.ok(oLaunchPageAdapter.isGroupLocked.calledWithExactly(oGroup));
        });

        QUnit.test("hideGroups", function (assert) {
            var aGroups = [];
            var oLaunchPageAdapter = {
                hideGroups: sandbox.stub().returns({
                    fail: function () { },
                    done: function () { return this; }
                })
            };

            // part 1: unsupported in adapter - A deferred object is expected which is in failed status
            var oLaunchPageService = new LaunchPage({});
            var oDeferred = oLaunchPageService.hideGroups([]);
            assert.strictEqual(oDeferred.state(), "rejected");

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.hideGroups(aGroups);
            assert.ok(oLaunchPageAdapter.hideGroups.calledOnce);
            assert.ok(oLaunchPageAdapter.hideGroups.calledWithExactly(aGroups));
        });

        QUnit.test("getCatalogData", function (assert) {
            var oCatalog = {};
            var oResult = {};
            var oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.LaunchPage")
                .warning("getCatalogData not implemented in adapter", null, "sap.ushell.services.LaunchPage");

            // part 1: unsupported in adapter
            var oLaunchPageService = new LaunchPage({
                getCatalogId: function (oCatalog0) {
                    assert.strictEqual(oCatalog0, oCatalog);
                    return "foo";
                }
            });
            assert.deepEqual(oLaunchPageService.getCatalogData(oCatalog), { id: "foo" });
            oLogMock.verify();

            // part 2: delegates to adapter
            var oLaunchPageAdapter = {
                getCatalogData: sandbox.stub().returns(oResult)
            };
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            assert.strictEqual(oLaunchPageService.getCatalogData(oCatalog), oResult);
            assert.ok(oLaunchPageAdapter.getCatalogData.calledOnce);
            assert.ok(oLaunchPageAdapter.getCatalogData.calledWithExactly(oCatalog));
        });

        QUnit.test("test countBookmarks", function (assert) {
            var oActualPromise;
            var oExpectedPromise = (new jQuery.Deferred()).promise();
            var oLaunchPageAdapter = {
                countBookmarks: sandbox.stub().returns(oExpectedPromise)
            };

            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            assert.throws(function () {
                oLaunchPageService.countBookmarks();
            }, /Missing URL/);
            assert.throws(function () {
                oLaunchPageService.countBookmarks("");
            }, /Missing URL/);
            assert.throws(function () {
                oLaunchPageService.countBookmarks({});
            }, /Missing URL/);
            assert.ok(oLaunchPageAdapter.countBookmarks.notCalled);

            oActualPromise = oLaunchPageService.countBookmarks("###", "contentProviderId");

            assert.strictEqual(oActualPromise, oExpectedPromise);
            assert.ok(oLaunchPageAdapter.countBookmarks.calledOnce);
            assert.strictEqual(oLaunchPageAdapter.countBookmarks.args[0][0], "###");
            assert.strictEqual(oLaunchPageAdapter.countBookmarks.args[0][1], "contentProviderId");
        });

        QUnit.test("test deleteBookmarks", function (assert) {
            var fnDone = assert.async();

            var oDeleteBookmarksStub = sandbox.stub().returns(new jQuery.Deferred().resolve().promise());
            var oLaunchPageAdapter = {
                deleteBookmarks: oDeleteBookmarksStub
            };

            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            var oDeleteStatesDataStub = sandbox.stub(oLaunchPageService, "deleteURLStatesPersistentData");

            oLaunchPageService.deleteBookmarks("###", "contentProviderId")
                .done(function () {
                    assert.strictEqual(oDeleteBookmarksStub.callCount, 1, "The function deleteBookmarks of the adapter has been called once.");
                    assert.deepEqual(oDeleteBookmarksStub.firstCall.args, ["###", undefined, "contentProviderId"], "The function deleteBookmarks has been called with the correct parameters.");
                    assert.strictEqual(oDeleteStatesDataStub.callCount, 1, "The function deleteURLStatesPersistentData of the adapter has been called once.");
                    assert.strictEqual(oDeleteStatesDataStub.firstCall.args[0], "###", "The function deleteBookmarks has been called with the correct parameter.");
                    assert.strictEqual(oDeleteStatesDataStub.firstCall.args[1], this.oAppStateService, "The function deleteBookmarks has been called with the correct parameter.");
                }.bind(this))
                .fail(function () {
                    assert.notOk(true, "The promise should have been resolved.");
                })
                .always(fnDone);
        });

        QUnit.test("The function deleteBookmarks throws if no URL is passed", function (assert) {
            var fnDone = assert.async();

            // Arrange
            var oDeleteBookmarksStub = sandbox.stub();
            var oLaunchPageAdapter = {
                deleteBookmarks: oDeleteBookmarksStub
            };
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            oLaunchPageService.deleteBookmarks()
                .fail(function (error) {
                    // Assert
                    assert.strictEqual(error.message, "Missing URL", "The correct error message has been found.");
                    assert.strictEqual(oDeleteBookmarksStub.callCount, 0, "The function deleteBookmarks of the adapter has not been called.");
                })
                .done(function () {
                    assert.ok(false, "The promise should have been rejected.");
                })
                .always(fnDone);
        });

        QUnit.test("The function deleteBookmarks throws if an empty URL is passed", function (assert) {
            var fnDone = assert.async();

            // Arrange
            var oDeleteBookmarksStub = sandbox.stub();
            var oLaunchPageAdapter = {
                deleteBookmarks: oDeleteBookmarksStub
            };
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            oLaunchPageService.deleteBookmarks("")
                .fail(function (error) {
                    // Assert
                    assert.strictEqual(error.message, "Missing URL", "The correct error message has been found.");
                    assert.strictEqual(oDeleteBookmarksStub.callCount, 0, "The function deleteBookmarks of the adapter has not been called.");
                })
                .done(function () {
                    assert.ok(false, "The promise should have been rejected.");
                })
                .always(fnDone);
        });

        QUnit.test("The function deleteBookmarks throws if a non-string URL is passed", function (assert) {
            var fnDone = assert.async();

            // Arrange
            var oDeleteBookmarksStub = sandbox.stub();
            var oLaunchPageAdapter = {
                deleteBookmarks: oDeleteBookmarksStub
            };
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            oLaunchPageService.deleteBookmarks(42)
                .fail(function (error) {
                    // Assert
                    assert.strictEqual(error.message, "Missing URL", "The correct error message has been found.");
                    assert.strictEqual(oDeleteBookmarksStub.callCount, 0, "The function deleteBookmarks of the adapter has not been called.");
                })
                .done(function () {
                    assert.ok(false, "The promise should have been rejected.");
                })
                .always(fnDone);
        });

        QUnit.test("test updateBookmarks", function (assert) {
            var oLaunchPageAdapter = {
                updateBookmarks: sandbox.stub().returns(new jQuery.Deferred().resolve())
            };

            sandbox.stub(ContentExtensionAdapterFactory, "getAdapters").returns(new jQuery.Deferred().resolve({}));

            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            assert.throws(function () {
                oLaunchPageService.updateBookmarks();
            }, /Missing URL/);
            assert.throws(function () {
                oLaunchPageService.updateBookmarks("");
            }, /Missing URL/);
            assert.throws(function () {
                oLaunchPageService.updateBookmarks({});
            }, /Missing URL/);
            assert.throws(function () {
                oLaunchPageService.updateBookmarks("foo");
            }, /Missing parameters/);
            assert.throws(function () {
                oLaunchPageService.updateBookmarks("foo", true);
            }, /Missing parameters/);
            assert.strictEqual(oLaunchPageAdapter.updateBookmarks.callCount, 0, "The adapter function \"updateBookmarks\" was not called.");

            this.oAppStateService.getSupportedPersistencyMethods = sandbox.stub().returns([]);
            this.oAppStateService.getPersistentWhenShared = sandbox.stub().returns(false);
            return oLaunchPageService.updateBookmarks("###", { url: "foo" }, "contentProviderId").done(function () {
                assert.strictEqual(oLaunchPageAdapter.updateBookmarks.callCount, 1, "The adapter function \"updateBookmarks\" was called exactly once.");
                assert.strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][0], "###", "1. Argument of adapter call is correct.");
                assert.deepEqual(oLaunchPageAdapter.updateBookmarks.args[0][1], { url: "foo" }, "2. Argument of adapter call is correct.");
                assert.deepEqual(oLaunchPageAdapter.updateBookmarks.args[0][2], undefined, "3. Argument of adapter call is correct.");
                assert.deepEqual(oLaunchPageAdapter.updateBookmarks.args[0][3], "contentProviderId", "4. Argument of adapter call is correct.");
            });
        });

        QUnit.test("Tile actions", function (assert) {
            var oTile = {};

            // part 1: no actions
            var oLaunchPageAdapter = {};
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            assert.deepEqual(oLaunchPageService.getTileActions(oTile), []);

            // part 2: internal actions
            var aInternalActions = [{ text: "InternalAction1" }, { text: "InternalAction2" }];
            oLaunchPageAdapter = {
                getTileActions: sandbox.stub().returns(aInternalActions)
            };
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            assert.deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions);
            assert.ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));

            // part 3: external actions
            var aExternalActions1 = [{ text: "ExternalAction11" }, { text: "ExternalAction12" }];
            var aExternalActions2 = [{ text: "ExternalAction21" }, { text: "ExternalAction22" }];
            oLaunchPageAdapter = {};
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.registerTileActionsProvider(sandbox.stub().returns(aExternalActions1));
            oLaunchPageService.registerTileActionsProvider(sandbox.stub().returns(aExternalActions2));

            assert.deepEqual(oLaunchPageService.getTileActions(oTile), aExternalActions1.concat(aExternalActions2));

            // part 4: internal and external actions
            aInternalActions = [{ text: "InternalAction1" }, { text: "InternalAction2" }];
            oLaunchPageAdapter = {
                getTileActions: sandbox.stub().returns(aInternalActions)
            };
            aExternalActions1 = [{ text: "ExternalAction11" }, { text: "ExternalAction12" }];
            aExternalActions2 = [{ text: "ExternalAction21" }, { text: "ExternalAction22" }];
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.registerTileActionsProvider(sandbox.stub().returns(aExternalActions1));
            oLaunchPageService.registerTileActionsProvider(sandbox.stub().returns(aExternalActions2));

            assert.deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions.concat(aExternalActions1.concat(aExternalActions2)));

            assert.ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));
        });

        QUnit.test("getCatalogTileTargetURL", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act & Assert
            // part 1: TargetUrl exist in configuration
            var sTargetUrl = oLaunchPageService.getCatalogTileTargetURL(oLaunchPageConfig.config.groups[0].tiles[0]);
            assert.strictEqual(sTargetUrl, oLaunchPageConfig.config.groups[0].tiles[0].properties.targetURL, "TargetUrl as expected");

            // Act & Assert
            // part 2: TargetUrl does not exist in configuration
            sTargetUrl = oLaunchPageService.getCatalogTileTargetURL(oLaunchPageConfig.config.groups[0].tiles[1]);
            assert.strictEqual(sTargetUrl, null, "TargetUrl default value is null");
        });

        QUnit.test("getCatalogTilePreviewTitle", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act & Assert
            // part 1: Title exist in configuration
            var sPreviewTitle = oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageConfig.config.groups[0].tiles[0]);
            assert.strictEqual(sPreviewTitle, oLaunchPageConfig.config.groups[0].tiles[0].properties.title, "Preview title as expected");

            // Act & Assert
            // part 2: Title does not exist in configuration
            sPreviewTitle = oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageConfig.config.groups[0].tiles[1]);
            assert.strictEqual(sPreviewTitle, null, "Preview title default value is null");
        });

        QUnit.test("getCatalogTilePreviewInfo", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            var sPreviewInfo = oLaunchPageService.getCatalogTilePreviewInfo(oLaunchPageConfig.config.groups[0].tiles[0]);

            // Assert
            assert.strictEqual(sPreviewInfo, oLaunchPageConfig.config.groups[0].tiles[0].properties.info, "The function getCatalogTilePreviewInfo returns the correct catalog tile preview info.");
        });

        QUnit.test("getCatalogTilePreviewSubtitle", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act & Assert
            // part 1: Title exist in configuration
            var sPreviewSubtitle = oLaunchPageService.getCatalogTilePreviewSubtitle(oLaunchPageConfig.config.groups[0].tiles[0]);
            assert.strictEqual(sPreviewSubtitle, oLaunchPageConfig.config.groups[0].tiles[0].properties.subtitle, "Preview subtitle as expected");

            // Act & Assert
            // part 2: Title does not exist in configuration
            sPreviewSubtitle = oLaunchPageService.getCatalogTilePreviewSubtitle(oLaunchPageConfig.config.groups[0].tiles[1]);
            assert.strictEqual(sPreviewSubtitle, null, "Preview subtitle default value is null");
        });

        QUnit.test("getCatalogTilePreviewIcon", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act & Assert
            // part 1: Title exist in configuration
            var sPreviewIcon = oLaunchPageService.getCatalogTilePreviewIcon(oLaunchPageConfig.config.groups[0].tiles[0]);
            assert.strictEqual(sPreviewIcon, oLaunchPageConfig.config.groups[0].tiles[0].properties.icon, "Preview icon as expected");

            // Act & Assert
            // part 2: Title does not exist in configuration
            sPreviewIcon = oLaunchPageService.getCatalogTilePreviewIcon(oLaunchPageConfig.config.groups[0].tiles[1]);
            assert.strictEqual(sPreviewIcon, null, "Preview icon default value is null");
        });

        QUnit.test("getCatalogWithTranslation", function (assert) {
            // Arrange
            var fnDone = assert.async();
            var oClock = sandbox.useFakeTimers();

            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            oLaunchPageService.getCatalogs()
                .done(function (aCatalogs) {
                    // Assert
                    assert.strictEqual(aCatalogs[0].title, "Translated Catalog 1", "Correct catalog [0] title");
                    assert.strictEqual(aCatalogs[1].title, "Translated Catalog 2", "Correct catalog [1] title");
                })
                .fail(function (error) {
                    assert.notOk(true, "The promise should have been resolved.");
                    throw error;
                }).always(fnDone);

            oClock.runAll(); // Synchronously forward time to avoid long-running tests
        });

        QUnit.test("getGroupsWithTranslation", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getGroups().done(function (aGroups) {
                // Assert
                assert.strictEqual(aGroups[0].title, "Translated Group 1", "Group translation error for aGroups[0].title");
                assert.strictEqual(aGroups[1].title, "Translated Group 2", "Group translation error for aGroups[1].title");
            });
        });

        QUnit.test("getGroupsWithFeatureGroup", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getGroups().done(function (aGroups) {
                // Assert
                var iNumFeaturedGroups = aGroups.filter(function (oGroup) {
                    return oGroup.contentProvider === "feature";
                }).length;
                assert.strictEqual(iNumFeaturedGroups, oFixture.output.numberOfFeaturedGroups, "feature group loaded");
            });
        });

        QUnit.test("getViewDataWithTranslation", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[0]).done(function (oView) {
                // Assert
                assert.strictEqual(oView.getProperty("title"), "Translated Header title", "Translated title check");
                assert.strictEqual(oView.getProperty("subtitle"), "Translated Sub Title", "Translated Sub Title");
                assert.strictEqual(oView.getProperty("info"), "Translated Info", "Translated Info");
                assert.strictEqual(oLaunchPageConfig.config.groups[0].tiles[0].keywords[0], "Translated Keyword", "Translated keywords");
            });
        });

        QUnit.test("getViewForComponentTile", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[2].tiles[0]).done(function (oTileUI) {
                // Assert
                assert.strictEqual(oTileUI.getMetadata().getName(), "sap.ui.core.ComponentContainer", "Module path registered and Component wrapped with ComponentContainer");
            });
        });

        QUnit.test("getViewForViewTileTile", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[2].tiles[1]).done(function (oTileUI) {
                // Assert
                assert.strictEqual(oTileUI.getMetadata().getName(), "sap.ui.core.mvc.JSView", "Module path registered and View tile retreived");
            });
        });

        QUnit.test("getViewForHeaderModeTile", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[4]).done(function (oTileUI) {
                // Assert
                assert.strictEqual(oTileUI.getProperty("mode"), "HeaderMode", "Tile is in Header Mode");
            });
        });

        QUnit.test("getViewForContentModeTile", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            return oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[5]).done(function (oTileUI) {
                // Assert
                assert.strictEqual(oTileUI.getProperty("mode"), "ContentMode", "Tile is in Content Mode");
            });
    });

        QUnit.test("isLinkPersonalizationSupported", function (assert) {
            // Arrange
            var oTile = {};
            var oLaunchPageAdapter = {
                isLinkPersonalizationSupported: sandbox.stub().returns(true)
            };

            // Act
            var oLaunchPageService = new LaunchPage({});

            // Assert
            assert.strictEqual(oLaunchPageService.isLinkPersonalizationSupported(oTile), false);

            // Act
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Assert
            assert.strictEqual(oLaunchPageService.isLinkPersonalizationSupported(oTile), true);
            assert.ok(oLaunchPageAdapter.isLinkPersonalizationSupported.calledOnce);
            assert.ok(oLaunchPageAdapter.isLinkPersonalizationSupported.calledWithExactly(oTile));
        });

        QUnit.test("getCatalogTileViewControl", function (assert) {
            // Arrange
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            var oTileData = {
                namespace: undefined,
                path: undefined,
                moduleType: undefined,
                tileType: "tileTypePart1.tileTypePart2.tileTypePart3",
                properties: {
                    title: "title",
                    subtitle: "subTitle",
                    info: "info",
                    targetURL: "#a-b"
                }
            };
            var oViewConstructor = function (oProps) {
                return {
                    oViewProperties: oProps
                };
            };

            sandbox.stub(oLaunchPageAdapter, "_getImageContent").returns({
                addStyleClass: sandbox.stub()
            });
            var oRequireStub = sandbox.stub(sap.ui, "require").callsArgWith(1, oViewConstructor);
            var oHandleTilePressStub = sandbox.stub(oLaunchPageAdapter, "_handleTilePress").returns({});
            var oApplyDynamicTileIfoState = sandbox.stub(oLaunchPageAdapter, "_applyDynamicTileIfoState").returns({});

            // Act
            return oLaunchPageService.getCatalogTileViewControl(oTileData).done(function (oView) {

                // Assert
                assert.strictEqual(oRequireStub.callCount, 1, "sap.ui.require called");
                assert.strictEqual(oRequireStub.args[0][0][0], "tileTypePart1/tileTypePart2/tileTypePart3", "sap.ui.require called for tileTypePart1/tileTypePart2/tileTypePart3");
                assert.strictEqual(oHandleTilePressStub.callCount, 1, "_handleTilePressStub called once");
                assert.strictEqual(oApplyDynamicTileIfoState.callCount, 1, "_applyDynamicTileIfoState called once");
                assert.strictEqual(oView.oViewProperties.title, "title", "Returned view title is correct");
            });
        });
    });

    QUnit.test("getGroupsForBookmarks when part of the groups are locked or not visable", function (assert) {
        // Arrange
        var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

        // Act
        return oLaunchPageService.getGroupsForBookmarks().done(function (aGroups) {
            // Assert
            assert.strictEqual(aGroups.length, 3, "groups were filtered correctly");
            assert.strictEqual(aGroups[0].title, "My Home", "title was changed correctly");
        });
    });

    QUnit.module("getGroups");

    QUnit.test("getGroups with pages enabled should return a promise resolving to an empty array", function (assert) {
        // Arrange
        sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(true);

        var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        var oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

        // Act
        return oLaunchPageService.getGroups().done(function (aGroups) {
            // Assert
            assert.strictEqual(aGroups.length, 0, "an empty array is returned");
        });
    });

    QUnit.module("getCatalogTileViewControl", {
        beforeEach: function () {
            this.oViewMock = {};
            this.oAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            this.oGetCatalogTileViewStub = sandbox.stub().returns(this.oViewMock);
            this.oAdapter.getCatalogTileView = this.oGetCatalogTileViewStub;

            this.oService = new LaunchPage(this.oAdapter);
            sandbox.stub(this.oService, "getTileTitle").returns("Tile Title");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Uses a fallback on getCatalogTileView", function (assert) {
        // Arrange
        delete this.oAdapter.getCatalogTileViewControl;
        var oTileData = {};

        // Act
        this.oService.getCatalogTileViewControl(oTileData, true).done(function (oView) {
            // Assert
            assert.strictEqual(oView, this.oViewMock, "Resolved the correct view");
            assert.deepEqual(this.oGetCatalogTileViewStub.getCall(0).args, [oTileData, true], "Called the adapter with the correct tileData");
        }.bind(this));
    });

    QUnit.module("getCatalogTileView", {
        beforeEach: function () {
            this.oViewMock = {};
            this.oAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            this.oGetCatalogTileViewStub = sandbox.stub().returns(this.oViewMock);
            this.oAdapter.getCatalogTileView = this.oGetCatalogTileViewStub;

            this.oService = new LaunchPage(this.oAdapter);
            sandbox.stub(this.oService, "getTileTitle").returns("Tile Title");

            this.oErrorStub = sandbox.stub(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Logs a deprecation error", function (assert) {
        // Arrange
        var sDeprecationMessage = "Deprecated API call of 'sap.ushell.LaunchPage.getCatalogTileView'. Please use 'getCatalogTileViewControl' instead";
        var sModule = "sap.ushell.services.LaunchPage";

        // Act
        this.oService.getCatalogTileView({});

        // Assert
        assert.strictEqual(this.oErrorStub.withArgs(sDeprecationMessage, null, sModule).callCount, 1, "The deprecation message was logged");
    });

    QUnit.test("Returns a view provided by the adapter", function (assert) {
        // Arrange
        var oTileData = {};

        // Act
        var oView = this.oService.getCatalogTileView(oTileData);

        // Assert
        assert.strictEqual(oView, this.oViewMock, "Returned the correct view");
        assert.strictEqual(this.oGetCatalogTileViewStub.getCall(0).args[0], oTileData, "Called the adapter with the correct tileData");
    });

    QUnit.test("Returns an error tile in case the adapter does not implement getCatalogTileView", function (assert) {
        // Arrange
        delete this.oAdapter.getCatalogTileView;

        // Act
        var oErrorTile = this.oService.getCatalogTileView({});

        // Assert
        assert.ok(oErrorTile.isA("sap.m.GenericTile"), "Error tile has correct type");
        assert.strictEqual(oErrorTile.getState(), LoadState.Failed, "Error tile has correct state");
        assert.strictEqual(oErrorTile.getHeader(), "Tile Title", "Error tile has correct title");
        assert.strictEqual(oErrorTile.getSubheader(), "The LaunchPageAdapter does not support getCatalogTileView", "Error tile has correct subtitle");
    });

    QUnit.module("The function _createErrorTile", {
        beforeEach: function () {
            var oAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            this.oService = new LaunchPage(oAdapter);
            sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve({
                getPersistentWhenShared: sandbox.stub().returns(true),
                getSupportedPersistencyMethods: sandbox.stub().returns([]),
                setAppStateToPublic: sandbox.stub().returns(new jQuery.Deferred().resolve(
                    "http://www.a.com?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4"
                ).promise())
            }));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a GenericTile with correct properties", function (assert) {
        // Arrange
        var sTitle = "Error Title";
        var sMessage = "Error Message";

        // Act
        var oErrorTile = this.oService._createErrorTile(sTitle, sMessage);

        // Assert
        assert.ok(oErrorTile.isA("sap.m.GenericTile"), "Error tile has correct type");
        assert.strictEqual(oErrorTile.getState(), LoadState.Failed, "Error tile has correct state");
        assert.strictEqual(oErrorTile.getHeader(), sTitle, "Error tile has correct title");
        assert.strictEqual(oErrorTile.getSubheader(), sMessage, "Error tile has correct subtitle");
    });

    QUnit.module("The function getStableCatalogTileId", {
        beforeEach: function () {
            this.oAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            this.oService = new LaunchPage(this.oAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns the expected ID when the adapter supports the method", function (assert) {
        // Arrange
        var oTile = {
            referenceChipId: "stable123"
        };
        var oGetStableCatalogTileIdStub = sandbox.stub(this.oAdapter, "getStableCatalogTileId");
        oGetStableCatalogTileIdStub.withArgs(oTile).returns(oTile.referenceChipId);

        // Act
        var sResult = this.oService.getStableCatalogTileId(oTile);

        // Assert
        assert.strictEqual(sResult, "stable123", "The expected ID was returned");
    });

    QUnit.test("Returns null when the adapter does not support the method", function (assert) {
        // Arrange
        var oTile = {
            referenceChipId: "stable123"
        };
        delete this.oAdapter.getStableCatalogTileId;

        // Act
        var sResult = this.oService.getStableCatalogTileId(oTile);

        // Assert
        assert.strictEqual(sResult, null, "The expected result was returned");
    });

    QUnit.module("getGroupTilesForSearch", {
        beforeEach: function () {
            this.oGroup = { id: "group1" };

            this.oAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            var aGroupTileClones = [{ id: "tileClone1" }];
            this.oAdapter.getGroupTileClones = sandbox.stub().withArgs(this.oGroup).resolves(aGroupTileClones);
            var aGroupTiles = [{ id: "tile1" }];
            this.oAdapter.getGroupTiles = sandbox.stub().withArgs(this.oGroup).resolves(aGroupTiles);

            this.oService = new LaunchPage(this.oAdapter);
            sandbox.stub(this.oService, "getTileTitle").returns("Tile Title");

            this.oErrorStub = sandbox.stub(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the group tiles returned by the adapter", function (assert) {
        // Arrange
        var aExpectedTiles = [{ id: "tileClone1" }];
        // Act
        return this.oService.getGroupTilesForSearch(this.oGroup).then(function (aGroupTiles) {
            // Assert
            assert.deepEqual(aGroupTiles, aExpectedTiles, "Resolved the expected tiles");
        });
    });

    QUnit.test("Has a fallback to getGroupTiles", function (assert) {
        // Arrange
        delete this.oAdapter.getGroupTileClones;
        var aExpectedTiles = [{ id: "tile1" }];
        // Act
        return this.oService.getGroupTilesForSearch(this.oGroup).then(function (aGroupTiles) {
            // Assert
            assert.deepEqual(aGroupTiles, aExpectedTiles, "Resolved the expected tiles");
        });
    });
});
