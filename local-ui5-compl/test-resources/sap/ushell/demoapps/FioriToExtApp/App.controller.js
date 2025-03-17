// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], function (
    Controller,
    History,
    UIComponent,
    JSONModel,
    Container
) {
    "use strict";

    var sTarget = (window["sap-ushell-config"].ui5appruntime ? "FioriToExtAppTargetIsolated" : "FioriToExtAppTarget"),
        sXKey,
        sIKey;
    var bUseBookmarkV2 = true;

    return Controller.extend("sap.ushell.demo.FioriToExtApp.App", {
        onInit: function () {
            var oData = {
                    param1: "value1",
                    param2: "value2",
                    param3: "0",

                    param_hrefForAppSpecificHash: "",
                    param_isInitialNavigation: "",
                    param_expandCompactHash: "",
                    param_getDistinctSemanticObjects: "",
                    param_getLinks: "",
                    param_getPrimaryIntent: "",
                    param_getSemanticObjectLinks: "",
                    param_hrefForExternal: "",
                    param_isIntentSupported: "",
                    param_isNavigationSupported: "",

                    param_addBookmark: "",
                    param_getGroupsIdsForBookmarks: "",
                    param_addBookmarkByGroupId: "",
                    param_getFLPUrl: "",
                    param_addCatalogTileToGroup: "",
                    param_countBookmarks: "",
                    param_deleteBookmarks: "",
                    param_updateBookmarks: ""
                },
                oModel,
                oState;

            this.oBookmarkPromise = Container.getServiceAsync("BookmarkV2");
            Container.getServiceAsync("AppState").then(function (oService) {
                oModel = new JSONModel(oData);
                this.getView().setModel(oModel);

                oState = oService.createEmptyAppState(undefined, false);
                oState.setData({num: 1, str: "this is xapp-state string #1", date: new Date()});
                oState.save();
                sXKey = oState.getKey();
                oState = oService.createEmptyAppState(undefined, false);
                oState.setData({num: 2, str: "this is iapp-state string #2", date: new Date()});
                oState.save();
                sIKey = oState.getKey();
            }.bind(this));

            this.getView().byId("txtDirection").setValue(History.getInstance().getDirection() || "undefined");
        },

        onSubmitToMain: function () {
            var param1Value = this.getView().getModel().getProperty("/param1"),
                param2Value = this.getView().getModel().getProperty("/param2"),
                param3Value = this.getView().getModel().getProperty("/param3");

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal({
                    target: {
                        semanticObject: sTarget,
                        action: "Action"
                    },
                    params: {
                        param1: param1Value,
                        param2: param2Value,
                        param3: param3Value,
                        "sap-xapp-state": sXKey,
                        "sap-iapp-state": sIKey
                    }
                });
            });
        },

        onSubmitToSecond: function () {
            var param1Value = this.getView().getModel().getProperty("/param1"),
                param2Value = this.getView().getModel().getProperty("/param2"),
                param3Value = this.getView().getModel().getProperty("/param3");

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.toExternal(

                    {
                        target: {
                            semanticObject: sTarget,
                            action: "Action"
                        },
                        params: {
                            param1: param1Value,
                            param2: param2Value,
                            param3: param3Value,
                            "sap-xapp-state": sXKey,
                            "sap-iapp-state": sIKey
                        },
                        appSpecificRoute: "&/Second/" + param3Value
                    }
                );
            });
        },

        /**
         * @deprecated As of version 1.120
         */
        on_getGroupsIdsForBookmarks: function () {
            var that = this;

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.getShellGroupIDs().then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = JSON.stringify(result);
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_getGroupsIdsForBookmarks", actResult);
                });
            });
        },

        on_getFLPUrl: function () {
            var that = this,
                sHash;

            sHash = window.hasher.getHash().split("&/")[0];
            sHash += "&/param1=1234/param2=5678";
            window.hasher.replaceHash(sHash);

            setTimeout(function () {
                Container.getFLPUrl(true).done(function (result) {
                    that.getView().getModel().setProperty("/param_getFLPUrl", result);
                });
            }, 50);
        },

        on_addBookmarkByGroupId: function () {
            var that = this;
            var oParameters = { title: "AddedById", url: "#FioriToExtAppTarget-Action" },
                groupId = "group_0";

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.addBookmarkByGroupId(oParameters, groupId).then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = JSON.stringify(result);
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_addBookmarkByGroupId", actResult);
                });
            });
        },

        on_addBookmark: function () {
            var that = this;
            var oParameters = { title: "AAA", url: "#FioriToExtAppTarget-Action" };

            // eslint-disable-next-line max-len
            var oGroup = JSON.parse('{"id":"group_0","title":"KPIs","isPreset":true,"isVisible":true,"isDefaultGroup":true,"isGroupLocked":false,"tiles":[{"id":"tile_01","title":"Test App","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_30","properties":{"title":"Test App","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"NON ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#AppNotIsolated-Action"}},{"id":"tile_02","title":"Test App","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_31","properties":{"title":"Test App","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#Action-todefaultapp"}},{"id":"tile_03","title":"Letter Box","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_34","properties":{"title":"Letter Box","numberValue":100.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#Action-toLetterBoxing"}},{"id":"tile_04","title":"Letter Box","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_35","properties":{"title":"App Nav Sample","numberValue":44,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#Action-toappnavsample"}},{"id":"tile_08","title":"Test ToExternal App","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_30","properties":{"title":"Test ToExternal App","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"NON ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#FioriToExtApp-Action"}},{"id":"tile_09","title":"Test ToExternal App Target","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_30","properties":{"title":"Test ToExternal App Target","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"NON ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#FioriToExtAppTarget-Action"}},{"id":"tile_10","title":"Test UI5 To External App Isolated","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_30","properties":{"title":"Test UI5 Isolated App","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#FioriToExtAppIsolated-Action"}},{"id":"tile_11","title":"Test UI5 To External App Isolated","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_30","properties":{"title":"Test UI5 Target Isolated App","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#FioriToExtAppTargetIsolated-Action"}},{"id":"tile_12","title":"Bookmarks Isolated","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_12","properties":{"title":"Bookmarks Isolated","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#BookmarksIsolated-Action"}},{"id":"tile_13","title":"State Isolated","size":"1x1","tileType":"sap.ushell.ui.tile.DynamicTile","keywords":["profit","profit margin","sales"],"formFactor":"Desktop","chipId":"catalogTile_13","properties":{"title":"State Isolated","numberValue":24.8,"info":"","infoState":"Positive","numberFactor":"%","numberUnit":"ISOLATED","numberDigits":1,"numberState":"Positive","stateArrow":"Up","targetURL":"#Action-toappcontextsample"}},{"title":"AAA","size":"1x1","chipId":"tile_010","tileType":"sap.ushell.ui.tile.StaticTile","id":"tile_010","isLinkPersonalizationSupported":true,"keywords":[],"properties":{"icon":"sap-icon://time-entry-request","title":"AAA","targetURL":"#FioriToExtAppTarget-Action"}},{"title":"AAA","size":"1x1","chipId":"tile_011","tileType":"sap.ushell.ui.tile.StaticTile","id":"tile_011","isLinkPersonalizationSupported":true,"keywords":[],"properties":{"icon":"sap-icon://time-entry-request","title":"AAA","targetURL":"#FioriToExtAppTarget-Action"}}]}');

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.addBookmark(oParameters, oGroup).then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = JSON.stringify(result);
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_addBookmark", actResult);
                });
            });
        },

        on_addCatalogTileToGroup: function () {
            var that = this;
            var sCatalogTileId = "tile_01",
                sGroupId = "test_catalog_00",
                oCatalogData = {
                    baseUrl: "/test/base/path",
                    remoteId: "test_catalog_01"
                };

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.addCatalogTileToGroup(sCatalogTileId, sGroupId, oCatalogData).then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_addCatalogTileToGroup", actResult);
                });
            });
        },

        on_countBookmarks: function () {
            var that = this;
            var sUrl = "#FioriToExtAppTarget-Action";

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.countBookmarks(sUrl).then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_countBookmarks", actResult);
                });
            });
        },

        on_deleteBookmarks: function () {
            var that = this;
            var sUrl = "#FioriToExtAppTarget-Action";

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.deleteBookmarks(sUrl).then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_deleteBookmarks", actResult);
                });
            });
        },

        on_updateBookmarks: function () {
            var that = this;
            var sUrl = "#FioriToExtAppTarget-Action";
            var oParameters = {
                title: "BBB"
            };

            this.oBookmarkPromise.then(function (oBookmarkService) {
                oBookmarkService.updateBookmarks(sUrl, oParameters).then(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_updateBookmarks", actResult);
                });
            });
        },

        on_backToPreviousApp: function() {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.backToPreviousApp({});
            });
        },

        on_expandCompactHash: function () {
            var that = this;

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.expandCompactHash("#SO-action?AAA=444&sap-intent-param=&AAA=333&CCC=DDD").done(function (sExpandedHash) {
                    that.getView().getModel().setProperty("/param_expandCompactHash", sExpandedHash);
                    //equal(sExpandedHash,"#SO-action?AAA=444&AAA=333&CCC=DDD", "expanded OK");
                });
            });
        },

        on_getDistinctSemanticObjects: function () {
            var that = this;
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.getDistinctSemanticObjects().done(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_getDistinctSemanticObjects", actResult);
                });
            });
        },

        on_getLinks: function () {
            var that = this;
            var params = {
                    param1: "value1",
                    param2: "value2",
                    param3: 0
                },
                oObject = {};
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.getLinks({
                    semanticObject: "FioriToExtAppTarget",
                    params: params,
                    paramsOptions: [],
                    ignoreFormFactor: true,
                    ui5Component: oObject
                }).done(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result[0].intent;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_getLinks", actResult);
                });
            });

        },

        on_getPrimaryIntent: function () {
            var that = this;
            var SO = "FioriToExtAppTarget",
                params = {
                    param1: "value1",
                    param2: "value2",
                    param3: 0
                };

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.getPrimaryIntent(SO, params).done(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result.intent;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_getPrimaryIntent", actResult);
                });
            });
        },

        on_getSemanticObjectLinks: function () {
            var that = this;
            var mParameters = {
                    param1: "value1",
                    param2: "value2",
                    param3: 0
                },
                sAppState = "ANAPSTATE",
                oObject = {};

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.getSemanticObjectLinks(
                    "FioriToExtAppTarget", mParameters, true, oObject, sAppState).done(function (result) {
                    var actResult;
                    if (result) {
                        actResult = result[0].intent;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_getSemanticObjectLinks", actResult);
                });
            });
        },

        on_historyBack: function() {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.historyBack({});
            });
        },

        on_hrefForAppSpecificHash: function () {
            var hash = "View1/";

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                var res = oCrossApplicationNavigation.hrefForAppSpecificHash(hash);
                this.getView().getModel().setProperty("/param_hrefForAppSpecificHash", res);
            }.bind(this));
        },

        on_hrefForExternal: function () {
            var oComponent = new UIComponent();
            var oArgs = { target: { shellHash: "#" } };

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                var res = oCrossApplicationNavigation.hrefForExternal(oArgs, oComponent, false);
                this.getView().getModel().setProperty("/param_hrefForExternal", res);
                //equal(oRes,"#","parameter not added!");
                //ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1," parameter added");
            }.bind(this));
        },

        on_isInitialNavigation: function() {
            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                var res = oCrossApplicationNavigation.isInitialNavigation();
                this.getView().getModel().setProperty("/param_isInitialNavigation", res);
            }.bind(this));
        },

        on_isIntentSupported: function () {
            var that = this;
            var oComponent = new UIComponent();
            var aIntents = ["#SO-act2?sap-system=CC2"];

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.isIntentSupported(aIntents, oComponent).done(function (result) {
                    //that.getView().getModel().setProperty("/param_isIntentSupported", "promise resolved"); //result[0].description); //"promise resolved");
                    var actResult;
                    if (result) {
                        actResult = Object.keys(result)[0] + " - " + result[Object.keys(result)[0]].supported;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_isIntentSupported", actResult);
                });
            });
        },

        on_isNavigationSupported: function () {
            var that = this;
            var oComponent = new UIComponent();
            var aIntents = ["#SO-act2?sap-system=CC2"];

            Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossApplicationNavigation) {
                oCrossApplicationNavigation.isNavigationSupported(aIntents, oComponent).done(function (result) {
                    //that.getView().getModel().setProperty("/param_isNavigationSupported", "promise resolved"); //result[0].description); //"promise resolved");
                    var actResult;
                    if (result) {
                        actResult = result[0].supported;
                    } else {
                        actResult = "No result";
                    }
                    that.getView().getModel().setProperty("/param_isNavigationSupported", actResult);
                });
            });
        },

        onUseV2Service: function () {
            var oButton = this.getView().byId("useV2Service");
            if (bUseBookmarkV2) {
                oButton.setText("'Bookmark' Service is now used. Change to 'BookmarkV2'");
                this.oBookmarkPromise = Container.getServiceAsync("Bookmark");
            } else {
                oButton.setText("'BookmarkV2' Service is now used. Change to old 'Bookmark'");
                this.oBookmarkPromise = Container.getServiceAsync("BookmarkV2");
            }
            bUseBookmarkV2 = !bUseBookmarkV2;
        }
    });
}, /* bExport= */ false);
