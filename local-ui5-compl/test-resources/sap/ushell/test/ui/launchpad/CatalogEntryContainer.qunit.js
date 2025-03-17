// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/ui/launchpad/TileContainerUtils",
    "sap/ushell/ui/launchpad/CatalogEntryContainer",
    "sap/ui/model/json/JSONModel"
], function (Container, TileContainerUtils, CatalogEntryContainer, JSONModel) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    var oCatalogEntryContainer,
        iContVisibleAppBoxesElements = 0,
        iContVisibleCustomTilesElements = 0,
        demiItemData = {
            appBoxesContainer: [{
                getVisible: function () {
                    return false;
                },
                setVisible: function () {
                    iContVisibleAppBoxesElements++;
                },
                getBindingContext: function () {
                    return {
                        getPath: function () {
                            return "catalogs/0/appBoxes/0";
                        }
                    };
                },
                associatedGroups: [],
                icon: "sap-icon://create-leave-request",
                id: "catalogTile_30",
                src: {},
                title: "test 1",
                url: "#so-act1"
            }],
            customTilesContainer: [{
                getVisible: function () {
                    return false;
                },
                setVisible: function () {
                    iContVisibleCustomTilesElements++;
                },
                getBindingContext: function () {
                    return {
                        getProperty: function () {
                            return "some context";
                        },
                        getPath: function () {
                            return "catalogs/0/customTiles/0";
                        }
                    };
                },
                associatedGroups: [],
                icon: "sap-icon://create-leave-request",
                id: "catalogTile_30",
                src: {},
                title: "test 1",
                url: "#so-act1"
            }]
        };

    QUnit.module("sap.ushell.ui.launchpad.CatalogEntryContainer", {
        beforeEach: function () {
            var that = this;
            iContVisibleAppBoxesElements = 0;
            iContVisibleCustomTilesElements = 0;

            this.oModel = new JSONModel({
                catalogs: [{
                    customTiles: [{
                        content: []
                    }, {
                        content: []
                    }]
                }]
            });

            return Container.init("local")
                .then(function () {
                    oCatalogEntryContainer = new CatalogEntryContainer();
                    //This renderes the catalogs.

                    sandbox.stub(TileContainerUtils, "addNewItem").callsFake(function (oNewCatalog, sName) {
                        demiItemData[sName].push({
                            getVisible: function () {
                                return false;
                            },
                            setVisible: function () {
                                if (sName === "appBoxesContainer") {
                                    iContVisibleAppBoxesElements++;
                                } else {
                                    iContVisibleCustomTilesElements++;
                                }
                            },
                            getBindingContext: function () {
                                return {
                                    getPath: function () {
                                        return "catalogs/0/appBoxes/1";
                                    }
                                };
                            },
                            associatedGroups: [],
                            icon: "sap-icon://create-leave-request",
                            id: "catalogTile_31",
                            src: {},
                            title: "test 2",
                            url: "#so-act2"
                        });
                    });

                    oCatalogEntryContainer.getAppBoxesContainer = function () {
                        return demiItemData.appBoxesContainer;
                    };
                    oCatalogEntryContainer.getCustomTilesContainer = function () {
                        return demiItemData.customTilesContainer;
                    };
                    oCatalogEntryContainer.mBindingInfos = {
                        appBoxesContainer: {
                            factory: function (sId, oContext) {
                                return {
                                    setBindingContext: function () {
                                        return {
                                            this: "bala"
                                        };
                                    }
                                };
                            },
                            binding: {
                                destroy: function () { },
                                detachEvents: function () { },
                                detachRefresh: function () { },
                                detachChange: function () { },
                                getContexts: function () {
                                    return [
                                        {
                                            getPath: function () {
                                                return "catalogs/0/appBoxes/0";
                                            }
                                        }
                                    ];
                                }
                            }
                        },
                        customTilesContainer: {
                            unbindProperty: function () { },
                            unbindAggregation: function () { },
                            factory: function (sId, oContext) {
                                return {
                                    setBindingContext: function () {
                                        return { this: "bala" };
                                    }
                                };
                            },
                            binding: {
                                destroy: function () { },
                                detachEvents: function () { },
                                detachRefresh: function () { },
                                detachChange: function () { },
                                getContexts: function () {
                                    return [{
                                        getProperty: function () {
                                            return ["some context"];
                                        },
                                        getPath: function () {
                                            return "/catalogs/0/customTiles/0";
                                        },
                                        getModel: function () {
                                            return that.oModel;
                                        }
                                    }, {
                                        getProperty: function () {
                                            return ["some context"];
                                        },
                                        getPath: function () {
                                            return "/catalogs/0/customTiles/1";
                                        },
                                        getModel: function () {
                                            return that.oModel;
                                        }
                                    }];
                                }
                            }
                        }
                    };
                });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            oCatalogEntryContainer.destroy(false);
            sandbox.restore();
        }
    });

    QUnit.test("CatalogEntryContainer handleElements appBoxesContainer", function (assert) {
        oCatalogEntryContainer.handleElements("appBoxesContainer");
        assert.ok(iContVisibleAppBoxesElements === 1, "Check that now we have 1 visible app boex");
    });

    QUnit.test("CatalogEntryContainer handleElements customTilesContainer", function (assert) {
        oCatalogEntryContainer.handleElements("customTilesContainer");
        assert.strictEqual(iContVisibleCustomTilesElements, 3, "Check that now we have 3 visible custom tiles");
    });

    QUnit.test("CatalogEntryContainer handleElements customTilesContainer tile content replaced", function (assert) {
        var fnDone = assert.async();
        assert.expect(2);

        oCatalogEntryContainer.handleElements("customTilesContainer");

        var oTileViewPromise = Container.getServiceAsync("FlpLaunchPage").then(function (oLaunchPageService) {
            return oLaunchPageService.getCatalogTileViewControl("some context");
        });

        oTileViewPromise.then(function () {
            assert.ok(this.oModel.getProperty("/catalogs/0/customTiles/0/content/0").isA("sap.m.GenericTile"), "The tile content was replaced");
            assert.ok(this.oModel.getProperty("/catalogs/0/customTiles/1/content/0").isA("sap.m.GenericTile"), "The tile content was replaced");
            fnDone();
        }.bind(this));
    });

    QUnit.test("CatalogEntryContainer handleElements appBoxesContainer with no allocated units left", function (assert) {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 0;
        };
        oCatalogEntryContainer.catalogState = {
            appBoxesContainer: "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos.appBoxesContainer.binding.getContexts()[0], "appBoxesContainer");
        assert.ok(bIsAdded === false, "Check That it did not create the AppBox");
    });

    QUnit.test("CatalogEntryContainer handleElements appBoxesContainer with allocated units", function (assert) {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 5;
        };
        oCatalogEntryContainer.indexingMaps = {
            appBoxesContainer: {
                onScreenPathIndexMap: {
                }
            }
        };
        oCatalogEntryContainer.catalogState = {
            appBoxesContainer: "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos.appBoxesContainer.binding.getContexts()[0], "appBoxesContainer");
        assert.ok(bIsAdded === true, "Check That it did create the AppBox");
        assert.ok(
            oCatalogEntryContainer.indexingMaps.appBoxesContainer.onScreenPathIndexMap["catalogs/0/appBoxes/0"].aItemsRefrenceIndex === 1,
            "Validate that new app box path is added correctly to the index mapping");

        assert.ok(
            oCatalogEntryContainer.indexingMaps.appBoxesContainer.onScreenPathIndexMap["catalogs/0/appBoxes/0"].isVisible,
            "Validate that new app box visibility is added correctly to the index mapping");
    });

    QUnit.test("CatalogEntryContainer handleElements customTilesContainer with no allocated units left", function (assert) {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 0;
        };
        oCatalogEntryContainer.catalogState = {
            customTilesContainer: "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos.customTilesContainer.binding.getContexts()[0], "customTilesContainer");
        assert.ok(bIsAdded === false, "Check That it did not create the customTilesContainer");
    });

    QUnit.test("CatalogEntryContainer handleElements customTilesContainer with allocated units", function (assert) {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 5;
        };
        oCatalogEntryContainer.indexingMaps = {
            customTilesContainer: {
                onScreenPathIndexMap: {
                }
            }
        };
        oCatalogEntryContainer.catalogState = {
            customTilesContainer: "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos.customTilesContainer.binding.getContexts()[0], "customTilesContainer");
        assert.ok(bIsAdded === true, "Check That it did create the AppBox");
    });
});
