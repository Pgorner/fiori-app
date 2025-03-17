// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ushell/utils/WindowUtils",
    "sap/ui/core/format/DateFormat",
    "sap/ushell/utils/UrlParsing",
    "sap/ui/core/library",
    "sap/ushell/Container"
], function (Controller, MessageToast, JSONModel, ResourceModel, WindowUtils, DateFormat, UrlParsing, library, Container) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = library.ValueState;
    var bUseBookmarkV2 = true;

    return Controller.extend("sap.ushell.demo.bookmark.controller.App", {
        TIMESTAMP_PLACEHOLDER: "<use timestamp>",

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
            var i18nModel = new ResourceModel({
                bundleName: "sap.ushell.demo.bookmark.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");

            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            this.oBookmarkPromise = Container.getServiceAsync("BookmarkV2");
            var oView = this.getView();
            var oHash = UrlParsing.parseShellHash(location.hash);
            var oModel = new JSONModel({
                current: "standard",
                standard: {
                    // create + update:
                    bookmarkedUrl: "#" + oHash.semanticObject + "-" + oHash.action,
                    title: oBundle.getText("defaultTitle"),
                    subtitle: this.TIMESTAMP_PLACEHOLDER,
                    info: "",
                    icon: "sap-icon://world",
                    numberUnit: "EUR",
                    serviceUrl: "",
                    dataSource: {
                        type: "OData",
                        settings: {
                            odataVersion: "4.0"
                        }
                    },
                    serviceRefreshInterval: 0,

                    // modify:
                    identificationUrl: "#" + oHash.semanticObject + "-" + oHash.action,
                    contentProviderId: "",
                    bookmarkCount: null,
                    bookmarkDeleteCount: null,
                    bookmarkUpdateCount: null
                },
                custom: {
                    // create + update:
                    vizType: "sap.ushell.demotiles.cdm.newstile",
                    bookmarkedUrl: location.hash,
                    title: oBundle.getText("defaultTitle"),
                    subtitle: this.TIMESTAMP_PLACEHOLDER,
                    icon: "sap-icon://newspaper",
                    feed1: "../../../../sap/ushell/test/feeds/fakenews.rss",
                    feed2: "../../../../sap/ushell/test/feeds/fakenews1.rss",
                    feed3: "",
                    feed4: "",

                    // modify:
                    identificationVizType: "sap.ushell.demotiles.cdm.newstile",
                    identificationUrl: location.hash,
                    contentProviderId: "",
                    bookmarkCount: null,
                    bookmarkDeleteCount: null,
                    bookmarkUpdateCount: null
                }
            });

            oView.setModel(oModel);

            // add a unique number to the title
            this._setNumberInTitle();
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
        },

        _getMode: function (sFragmentKey) {
            switch (sFragmentKey) {
                case "addBookmark":
                    return "standard";
                case "modifyBookmark":
                    return "standard";
                case "addCustomBookmark":
                    return "custom";
                case "modifyCustomBookmark":
                    return "custom";
                default:
                    return "standard";
            }
        },

        _getStringOrTimestamp: function (sText) {
            if (sText === this.TIMESTAMP_PLACEHOLDER) {
                var oFormat = DateFormat.getInstance({
                    format: "yyyyMMddHHmmss"
                });
                return oFormat.format(new Date());
            }
            return sText;
        },

        _setNumberInTitle: function () {
            var oModel = this.getView().getModel();
            var sPath = "/" + oModel.getProperty("/current");
            var sCurrentTitle = oModel.getProperty(sPath + "/title");
            var sUrl = oModel.getProperty(sPath + "/bookmarkedUrl");
            var sVizType = oModel.getProperty(sPath + "/vizType");
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            if (sCurrentTitle.startsWith(oBundle.getText("defaultTitle"))) {
                this._countBookmarks(sUrl, sVizType)
                    .then(function (iCount) {
                        // add a unique number to the title
                        oModel.setProperty(sPath + "/title", oBundle.getText("defaultTitle") + " #" + (iCount + 1));
                    });
            }
        },

        _getSelectedContentNodes: function () {
            var oView = this.getView();
            var sContentNodeSelectorId = oView.getModel().getProperty("/current") === "standard" ? "standardSelectedNodesComboBox" : "customSelectedNodesComboBox";
            var aContentNodes = oView.byId(sContentNodeSelectorId).getSelectedContentNodes();
            return aContentNodes.length ? aContentNodes : undefined;
        },

        _countBookmarks: function (sUrl, sVizType, sContentProviderId) {
            var oModel = this.getView().getModel();
            var sMode = oModel.getProperty("/current");

            return this.oBookmarkPromise.then(function (oBookmarkService) {
                if (sMode === "standard") {
                    return oBookmarkService.countBookmarks(sUrl, sContentProviderId);
                }
                var oIdentifier = {
                    url: sUrl,
                    vizType: sVizType,
                    contentProviderId: sContentProviderId
                };
                return oBookmarkService.countCustomBookmarks(oIdentifier);
            });
        },

        onTabSelect: function (oEvent) {
            var sFragmentKey = oEvent.getParameters().key;
            this.getView().getModel().setProperty("/current", this._getMode(sFragmentKey));
            this._setNumberInTitle();
        },

        onTargetChanged: function () {
            this._setNumberInTitle();
        },

        onAddBookmark: function () {
            var oData = this.getView().getModel().getProperty("/standard");
            var vSelectedContentNodes = this._getSelectedContentNodes();

            this.oBookmarkPromise
                .then(function (oBookmarkService) {
                    return oBookmarkService.addBookmark({
                            title: oData.title,
                            url: oData.bookmarkedUrl,
                            icon: oData.icon,
                            info: oData.info,
                            subtitle: this._getStringOrTimestamp(oData.subtitle),
                            serviceUrl: oData.serviceUrl,
                            dataSource: oData.dataSource,
                            serviceRefreshInterval: oData.serviceRefreshInterval,
                            numberUnit: oData.numberUnit
                        }, vSelectedContentNodes, oData.contentProviderId);
                    }.bind(this))
                .then(function () {
                    MessageToast.show("Bookmark added", { duration: 5000 });
                    this._setNumberInTitle();
                }.bind(this))
                .catch(function (sMessage) {
                    MessageToast.show("Failed to add bookmark: " + sMessage, { duration: 5000 });
                });
        },

        onAddCustomBookmark: function () {
            var oData = this.getView().getModel().getProperty("/custom");
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var vSelectedContentNodes = this._getSelectedContentNodes();
            var oContentNodeSelector = this.getView().byId("customSelectedNodesComboBox");

            if (vSelectedContentNodes === undefined) {
                oContentNodeSelector.setValueState(ValueState.Error);
                oContentNodeSelector.setValueStateText(oBundle.getText("custom.MissingContentNode"));
                return;
            }
            oContentNodeSelector.setValueState(ValueState.None);
            oContentNodeSelector.setValueStateText("");

            this.oBookmarkPromise.then(function (oBookmarkService) {
                return oBookmarkService.addCustomBookmark("sap.ushell.demotiles.cdm.newstile", // this is the custom tile with banner
                    {
                        title: oData.title,
                        url: oData.bookmarkedUrl,
                        icon: oData.icon,
                        info: oData.info,
                        subtitle: this._getStringOrTimestamp(oData.subtitle),
                        serviceUrl: oData.serviceUrl,
                        serviceRefreshInterval: oData.serviceRefreshInterval,
                        numberUnit: oData.numberUnit,
                        vizConfig: {
                            "sap.ui5": {
                                componentName: "sap.ushell.demotiles.cdm.newstile", // should not be needed
                                config: {
                                    defaultImage: "",
                                    useDefaultImage: false,
                                    cycleInterval: 7000,
                                    refreshInterval: 0, //oData.serviceRefreshInterval,
                                    feed1: oData.feed1, //"../../../../sap/ushell/test/feeds/fakenews.rss", // different URL then in chip
                                    feed2: oData.feed2, //"",
                                    feed3: oData.feed3, //"",
                                    feed4: oData.feed4, //"",
                                    feed5: "",
                                    feed6: "",
                                    feed7: "",
                                    feed8: "",
                                    feed9: "",
                                    feed10: "",
                                    eFilter1: "",
                                    eFilter2: "",
                                    eFilter3: "",
                                    eFilter4: "",
                                    eFilter5: "",
                                    iFilter1: "",
                                    iFilter2: "",
                                    iFilter3: "",
                                    iFilter4: "",
                                    iFilter5: ""
                                }
                            },
                            "sap.flp": {
                                type: "tile",
                                tileSize: "1x2"
                            }
                        },
                        chipConfig: {
                            chipId: "X-SAP-UI2-CHIP:/UI2/AR_SRVC_NEWS",
                            bags: {
                                tileProperties: { // bag id
                                    texts: {
                                        display_title_text: "Foo"
                                    }
                                }
                            },
                            configuration: {
                                newsTitle: oData.title,
                                cycleInterval: "7000",
                                defaultImage: "",
                                eFilter1: "",
                                eFilter2: "",
                                eFilter3: "",
                                eFilter4: "",
                                eFilter5: "",
                                feed1: oData.feed1, //"/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/test/feeds/fakenews.rss", // different URL then in chip
                                feed2: oData.feed2, //"",
                                feed3: oData.feed3, //"",
                                feed4: oData.feed4, //"",
                                feed5: "",
                                feed6: "",
                                feed7: "",
                                feed8: "",
                                feed9: "",
                                feed10: "",
                                iFilter1: "",
                                iFilter2: "",
                                iFilter3: "",
                                iFilter4: "",
                                iFilter5: "",
                                refreshInterval: "15 Minutes",
                                useDefaultImage: "false",
                                row: "1", // TODO: read the default value exists in CHIP XML
                                col: "2" // TODO: default value exists in CHIP XML
                            }
                        }
                    }, vSelectedContentNodes, oData.contentProviderId)
                    .then(function () {
                        MessageToast.show("Bookmark added", { duration: 5000 });
                        this._setNumberInTitle();
                    }.bind(this))
                    .catch(function (sMessage) {
                        MessageToast.show("Failed to add bookmark: " + sMessage, { duration: 5000 });
                    });
            }.bind(this));
        },

        onCountBookmark: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/standard");

            this._countBookmarks(oData.identificationUrl, undefined, oData.contentProviderId)
                .then(function (iCount) {
                    MessageToast.show(iCount + " bookmarks found", { duration: 5000 });
                    oModel.setProperty("/standard/bookmarkCount", iCount);
                })
                .catch(function (sMessage) {
                    MessageToast.show("Count failed : " + sMessage, { duration: 5000 });
                    oModel.setProperty("/standard/bookmarkCount", "ERROR");
                });
        },

        onCountCustomBookmark: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/custom");

            this._countBookmarks(oData.identificationUrl, oData.identificationVizType, oData.contentProviderId)
                .then(function (iCount) {
                    MessageToast.show(iCount + " bookmarks found", { duration: 5000 });
                    oModel.setProperty("/custom/bookmarkCount", iCount);
                })
                .catch(function (sMessage) {
                    MessageToast.show("Count failed : " + sMessage, { duration: 5000 });
                    oModel.setProperty("/custom/bookmarkCount", "ERROR");
                });
        },

        onDeleteBookmark: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/standard");

            this.oBookmarkPromise
                .then(function (oBookmarkService) {
                    return oBookmarkService.deleteBookmarks(oData.identificationUrl, oData.contentProviderId);
                })
                .then(function (iCount) {
                    MessageToast.show(iCount + " bookmarks deleted", { duration: 5000 });
                    oModel.setProperty("/standard/bookmarkDeleteCount", iCount);
                })
                .catch(function (sMessage) {
                    MessageToast.show("Delete failed: " + sMessage, { duration: 5000 });
                    oModel.setProperty("/standard/bookmarkDeleteCount", "ERROR");
                });
        },

        onDeleteCustomBookmark: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/custom");

            var oIdentifier = {
                url: oData.identificationUrl,
                vizType: oData.identificationVizType,
                contentProviderId: oData.contentProviderId
            };

            this.oBookmarkPromise.then(function (oBookmarkService) {
                return oBookmarkService.deleteCustomBookmarks(oIdentifier);
            })
                .then(function (iCount) {
                    MessageToast.show(iCount + " bookmarks deleted", { duration: 5000 });
                    oModel.setProperty("/custom/bookmarkDeleteCount", iCount);
                })
                .catch(function (sMessage) {
                    MessageToast.show("Delete failed: " + sMessage, { duration: 5000 });
                    oModel.setProperty("/custom/bookmarkDeleteCount", "ERROR");
                });
        },

        onUpdateBookmark: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/standard");

            this.oBookmarkPromise
                .then(function (oBookmarkService) {
                    return oBookmarkService.updateBookmarks(oData.identificationUrl, {
                            title: oData.title,
                            url: oData.bookmarkedUrl,
                            icon: oData.icon,
                            info: oData.info,
                            subtitle: this._getStringOrTimestamp(oData.subtitle),
                            serviceUrl: oData.serviceUrl,
                            serviceRefreshInterval: oData.serviceRefreshInterval,
                            numberUnit: oData.numberUnit
                        }, oData.contentProviderId);
                }.bind(this))
                .then(function (iCount) {
                    MessageToast.show(iCount + " bookmarks updated.", { duration: 5000 });
                    oModel.setProperty("/standard/bookmarkUpdateCount", iCount);
                })
                .catch(function (sMessage) {
                    MessageToast.show("Failed to update bookmarks for target '" + oData.identificationUrl + "': " + sMessage, { duration: 5000 });
                    oModel.setProperty("/standard/bookmarkUpdateCount", "ERROR");
                });
        },

        onUpdateCustomBookmark: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/custom");

            var oIdentifier = {
                url: oData.identificationUrl,
                vizType: oData.identificationVizType,
                contentProviderId: oData.contentProviderId
            };

            this.oBookmarkPromise.then(function (oBookmarkService) {
                return oBookmarkService.updateCustomBookmarks(oIdentifier, {
                    title: oData.title,
                    url: oData.bookmarkedUrl,
                    icon: oData.icon,
                    info: oData.info,
                    subtitle: this._getStringOrTimestamp(oData.subtitle),
                    serviceUrl: oData.serviceUrl,
                    serviceRefreshInterval: oData.serviceRefreshInterval,
                    numberUnit: oData.numberUnit,
                    vizConfig: {
                        "sap.ui5": {
                            componentName: "sap.ushell.demotiles.cdm.newstile", // should not be needed
                            config: {
                                defaultImage: "",
                                useDefaultImage: false,
                                cycleInterval: 1000,
                                refreshInterval: 0, //oData.serviceRefreshInterval,
                                feed1: oData.feed1 || "", //"../../../../sap/ushell/test/feeds/fakenews.rss", // different URL then in chip
                                feed2: oData.feed2 || "", //"",
                                feed3: oData.feed3 || "", //"",
                                feed4: oData.feed4 || "", //"",
                                feed5: "",
                                feed6: "",
                                feed7: "",
                                feed8: "",
                                feed9: "",
                                feed10: "",
                                eFilter1: "",
                                eFilter2: "",
                                eFilter3: "",
                                eFilter4: "",
                                eFilter5: "",
                                iFilter1: "",
                                iFilter2: "",
                                iFilter3: "",
                                iFilter4: "",
                                iFilter5: ""
                            }
                        },
                        "sap.flp": {
                            type: "tile",
                            tileSize: "1x2"
                        }
                    },
                    chipConfig: {
                        chipId: "X-SAP-UI2-CHIP:/UI2/AR_SRVC_NEWS",
                        bags: {
                            tileProperties: { // bag id
                                texts: {
                                    display_title_text: "Foo"
                                }
                            }
                        },
                        configuration: {
                            newsTitle: oData.title,
                            cycleInterval: "7000",
                            defaultImage: "",
                            eFilter1: "",
                            eFilter2: "",
                            eFilter3: "",
                            eFilter4: "",
                            eFilter5: "",
                            feed1: oData.feed1 || "", //"/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/test/feeds/fakenews.rss", // different URL then in chip
                            feed2: oData.feed2 || "", //"",
                            feed3: oData.feed3 || "", //"",
                            feed4: oData.feed4 || "", //"",
                            feed5: "",
                            feed6: "",
                            feed7: "",
                            feed8: "",
                            feed9: "",
                            feed10: "",
                            iFilter1: "",
                            iFilter2: "",
                            iFilter3: "",
                            iFilter4: "",
                            iFilter5: "",
                            refreshInterval: "15 Minutes",
                            useDefaultImage: "false",
                            row: "1", // TODO: read the default value exists in CHIP XML
                            col: "2" // TODO: default value exists in CHIP XML
                        }
                    }
                });
            }.bind(this))
                .then(function (iCount) {
                    MessageToast.show(iCount + " bookmarks updated.", { duration: 5000 });
                    oModel.setProperty("/custom/bookmarkUpdateCount", iCount);
                })
                .catch(function (sMessage) {
                    MessageToast.show("Failed to update bookmarks for target '" + oData.identificationUrl + "': " + sMessage, { duration: 5000 });
                    oModel.setProperty("/custom/bookmarkUpdateCount", "ERROR");
                });
        },

        onSyncUrls: function () {
            var oModel = this.getView().getModel();
            var sPath = "/" + oModel.getProperty("/current");
            oModel.setProperty(sPath + "/identificationUrl", oModel.getProperty(sPath + "/bookmarkedUrl"));
        },

        onResetSubtitle: function () {
            var oModel = this.getView().getModel();
            var sPath = "/" + oModel.getProperty("/current");
            oModel.setProperty(sPath + "/subtitle", this.TIMESTAMP_PLACEHOLDER);
        },

        onOpenIconExplorer: function () {
            WindowUtils.openURL("https://ui5.sap.com/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/overview/SAP-icons");
        }
    });
});
