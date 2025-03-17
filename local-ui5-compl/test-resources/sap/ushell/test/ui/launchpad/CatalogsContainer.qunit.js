// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/ui/launchpad/TileContainerUtils",
    "sap/ushell/ui/launchpad/CatalogsContainer"
], function (Container, TileContainerUtils, CatalogsContainer) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    var oCatalogsContainer,
        iContVisibleElements = 0,
        demiItemData = {
            catalogs: [{
                setVisible: function (bIsVisible) {
                    if (bIsVisible) {
                        iContVisibleElements++;
                    }
                },
                getVisible: function () {
                    return false;
                },
                getBindingContext: function () {
                    return {
                        getPath: function () {
                            return "catalogs/0";
                        }
                    };
                },
                appBoxes: [{
                    associatedGroups: [],
                    icon: "sap-icon://create-leave-request",
                    id: "catalogTile_30",
                    src: {},
                    title: "test 1",
                    url: "#so-act1"
                }],
                customTiles: [{
                    associatedGroups: [],
                    icon: "sap-icon://create-leave-request",
                    id: "catalogTile_30",
                    src: {},
                    title: "test 1",
                    url: "#so-act1"
                }],
                id: "catalog_1",
                numberTilesSupportedOnCurrectDevice: 0,
                static: false,
                title: "Employee Self Service"
            }]
        };

    QUnit.module("sap.ushell.ui.launchpad.CatalogsContainer", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").resolves({});
            oCatalogsContainer = new CatalogsContainer();
            //This renderes the catalogs.
            oCatalogsContainer.getCatalogs = function () {
                return demiItemData.catalogs;
            };
            oCatalogsContainer.mBindingInfos.catalogs = {
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
                            getPath: function () {
                                return "catalogs/0";
                            }
                        }, {
                            getPath: function () {
                                return "catalogs/1";
                            },
                            getProperty: function () {
                                return "catalog1";
                            }
                        }];
                    }
                }
            };
            sandbox.stub(TileContainerUtils, "addNewItem").callsFake(function () {
                demiItemData.catalogs.push({
                    setVisible: function (bIsVisible) {
                        if (bIsVisible) {
                            iContVisibleElements++;
                        }
                    },
                    getVisible: function () {
                        return false;
                    },
                    getBindingContext: function () {
                        return {
                            getPath: function () {
                                return "catalogs/0";
                            }
                        };
                    },
                    appBoxes: [{
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_30",
                        src: {},
                        title: "test 1",
                        url: "#so-act1"
                    }],
                    customTiles: [{
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_30",
                        src: {},
                        title: "test 1",
                        url: "#so-act1"
                    }],
                    id: "catalog_1",
                    numberTilesSupportedOnCurrectDevice: 0,
                    static: false,
                    title: "Employee Self Service"
                });
            });
            return Container.init("local");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            oCatalogsContainer.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("CatalogsContainer filterElements", function (assert) {
        oCatalogsContainer.nAllocatedUnits = 30;
        oCatalogsContainer.filterElements();
        assert.ok(iContVisibleElements === 2, "Check that now we have 2 visible groups");
    });

    QUnit.test("CatalogsContainer setCategoryFilter", function (assert) {
        oCatalogsContainer.indexingMaps = {
            onScreenPathIndexMap: {}
        };

        oCatalogsContainer.catalogPagination = {
        };

        oCatalogsContainer.addNewItem(oCatalogsContainer.mBindingInfos.catalogs.binding.getContexts()[0], "catalogs");
        assert.ok(iContVisibleElements === 2, "Check that now we have 2 visible groups");
        assert.ok(oCatalogsContainer.indexingMaps.onScreenPathIndexMap["catalogs/0"].aItemsRefrenceIndex === 2, "validate the the newly added group index refrence is 2");
        assert.ok(oCatalogsContainer.indexingMaps.onScreenPathIndexMap["catalogs/0"].isVisible === true, "validate the the newly added group is visible");
    });
});
