// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/ushell/utils/UriParameters",
    "sap/m/library",
    "sap/ui/core/EventBus",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/EventHub",
    "sap/ui/core/mvc/View",
    "sap/ushell/Container"
], function (
    Log,
    Localization,
    UriParameters,
    mobileLibrary,
    EventBus,
    Controller,
    JSONModel,
    jQuery,
    utils,
    Config,
    ushellLibrary,
    URLParsing,
    WindowUtils,
    EventHub,
    View,
    Container
) {
    "use strict";

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;

    // shortcut for sap.m.GenericTileMode
    var GenericTileMode = mobileLibrary.GenericTileMode;

    // shortcut for sap.ushell.AppType
    var AppType = ushellLibrary.AppType;

    /* global OData, hasher */

    return Controller.extend("sap.ushell.demotiles.abap.customTileDynamic.DynamicTile", {
        // handle to control/cancel browser's setTimeout()
        timer: null,

        // handle to control/cancel data.js OData.read()
        oDataRequest: null,

        onInit: function () {
            var oView = this.getView();
            var oViewData = oView.getViewData();
            var oTileApi = oViewData.chip;
            var oConfig = utils.getAppLauncherConfig(oTileApi, oTileApi.configurationUi.isEnabled(), false);
            var sNavigationTargetUrl = oConfig.navigation_target_url;
            var sizeBehavior = Config.last("/core/home/sizeBehavior") || "Responsive";

            this.bIsRequestCompleted = false;
            var sSystem = oTileApi.url.getApplicationSystem();
            if (sSystem) { // propagate system to target application
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                if (URLParsing.isIntentUrl(sNavigationTargetUrl)) {
                    var oHash = URLParsing.parseShellHash(sNavigationTargetUrl);
                    if (!oHash.params) {
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sNavigationTargetUrl = "#" + URLParsing.constructShellHash(oHash);
                } else {
                    sNavigationTargetUrl += ((sNavigationTargetUrl.indexOf("?") < 0) ? "?" : "&") + "sap-system=" + sSystem;
                }
            }
            this.navigationTargetUrl = sNavigationTargetUrl;

            var oModel = new JSONModel({
                sizeBehavior: sizeBehavior,
                mode: oConfig.display_mode || GenericTileMode.ContentMode,
                backgroundImage: sap.ui.require.toUrl("sap/ushell/demotiles/abap/customTileDynamic/custom_tile.png"),
                config: oConfig,
                data: utils.getRtDataToDisplay(oConfig, {
                    number: (oTileApi.configurationUi.isEnabled() ? 1234 : "...")
                }),
                nav: { navigation_target_url: (oTileApi.configurationUi && oTileApi.configurationUi.isEnabled() ? "" : sNavigationTargetUrl) },
                search: { display_highlight_terms: [] }
            });
            oView.setModel(oModel);

            // implement types contact
            // default is "tile"
            if (oTileApi.types) {
                oTileApi.types.attachSetType(function (sType) {
                    // perform the change only if this is a different type then already set
                    // this.tileType can be undefined in the initialization flow
                    if (this.tileType !== sType) {
                        if (sType === "link") {
                            oModel.setProperty("/mode", GenericTileMode.LineMode);
                        } else {
                            oModel.setProperty("/mode", oModel.getProperty("/config/display_mode") || GenericTileMode.ContentMode);
                        }
                        this.tileType = sType;
                    }
                }.bind(this));
            }

            // if "tileType" is not set, it means that we did not set any content
            // and therefore we set it to the default value which is "tile"
            if (!this.tileType) {
                var oTileControl = this.getView().getTileControl();
                this.getView().addContent(oTileControl);
                this.tileType = "tile";
            }

            // implement search contract
            if (oTileApi.search) {
                // split and clean keyword string (may be comma + space delimited)
                var aKeywords = oView.getModel().getProperty("/config/display_search_keywords")
                    .split(/[, ]+/)
                    .filter(function (n, i) { return n && n !== ""; });

                // add title and subtitle (if present) to keywords for better FLP searching
                if (oConfig.display_title_text && oConfig.display_title_text !== "" &&
                    aKeywords.indexOf(oConfig.display_title_text) === -1) {
                    aKeywords.push(oConfig.display_title_text);
                }
                if (oConfig.display_subtitle_text && oConfig.display_subtitle_text !== "" &&
                    aKeywords.indexOf(oConfig.display_subtitle_text) === -1) {
                    aKeywords.push(oConfig.display_subtitle_text);
                }
                if (oConfig.display_info_text && oConfig.display_info_text !== "" &&
                    aKeywords.indexOf(oConfig.display_info_text) === -1) {
                    aKeywords.push(oConfig.display_info_text);
                }

                // defined in search contract:
                oTileApi.search.setKeywords(aKeywords);
                oTileApi.search.attachHighlight(
                    function (aHighlightWords) {
                        // update model for highlighted search term
                        oView.getModel().setProperty("/search/display_highlight_terms", aHighlightWords);
                    }
                );
            }

            // implement bag update handler
            if (oTileApi.bag && oTileApi.bag.attachBagsUpdated) {
                // is only called by the FLP for bookmark tiles which have been updated via bookmark service
                oTileApi.bag.attachBagsUpdated(function (aUpdatedBagIds) {
                    if (aUpdatedBagIds.indexOf("tileProperties") > -1) {
                        utils._updateTilePropertiesTexts(oView, oTileApi.bag.getBag("tileProperties"));
                    }
                });
            }

            // implement configuration update handler
            if (oTileApi.configuration && oTileApi.configuration.attachConfigurationUpdated) {
                // is only called by the FLP for bookmark tiles which have been updated via bookmark service
                oTileApi.configuration.attachConfigurationUpdated(function (aUpdatedConfigKeys) {
                    if (aUpdatedConfigKeys.indexOf("tileConfiguration") > -1) {
                        utils._updateTileConfiguration(oView, oTileApi.configuration.getParameterValueAsString("tileConfiguration"));
                    }
                });
            }

            // implement preview contract
            if (oTileApi.preview) {
                oTileApi.preview.setTargetUrl(sNavigationTargetUrl);
                oTileApi.preview.setPreviewIcon(oConfig.display_icon_url);
                oTileApi.preview.setPreviewTitle(oConfig.display_title_text);
                if (oTileApi.preview.setPreviewSubtitle && typeof oTileApi.preview.setPreviewSubtitle === "function") {
                    oTileApi.preview.setPreviewSubtitle(oConfig.display_subtitle_text);
                }
            }

            // implement refresh contract
            if (oTileApi.refresh) {
                oTileApi.refresh.attachRefresh(this.refreshHandler.bind(null, this));
            }

            // attach the refresh handler also for the visible contract, as we would like
            // on setting visible to true, to directly go and call the oData call
            if (oTileApi.visible) {
                oTileApi.visible.attachVisible(this.visibleHandler.bind(this));
            }

            // implement configurationUi contract: setup configuration UI
            if (oTileApi.configurationUi.isEnabled()) {
                oTileApi.configurationUi.setAsyncUiProvider(function () {
                    // attach configuration UI provider, which is essentially a components.tiles.applauncher.Configuration
                    var oConfigurationUi = View.create({
                        type: "XML",
                        viewData: this.getView().getViewData(),
                        viewName: "sap.ushell.demotiles.abap.customTileDynamic.Configuration"
                    }).then(function (oConfigurationView) {
                        oTileApi.configurationUi.attachCancel(this.onCancelConfiguration.bind(null, oConfigurationView));
                        oTileApi.configurationUi.attachSave(this.onSaveConfiguration.bind(null, oConfigurationView));
                        oConfigurationView.setModel(oModel);
                        return oConfigurationView;
                    });
                    return oConfigurationUi;
                }.bind(this));

                this.getView().getContent()[0].setTooltip(
                    utils.getResourceBundleModel().getResourceBundle()
                        .getText("edit_configuration.tooltip")
                );
            } else if (!oTileApi.preview || !oTileApi.preview.isEnabled()) {
                if (!sSystem) {
                    Container.addRemoteSystemForServiceUrl(oConfig.service_url);
                } // else registration is skipped because registration has been done already
                // outside this controller (e.g. remote catalog registration)

                // start fetching data from backend service if not in preview or admin mode
                this.onUpdateDynamicData();
            }

            // attach the tile actions provider for the actions contract
            if (oTileApi.actions) {
                var aExtendedActions;
                var aActions = oConfig.actions;
                if (aActions) {
                    aExtendedActions = aActions.slice();
                } else {
                    aExtendedActions = [];
                }

                var tileSettingsAction = utils.getTileSettingsAction(oModel, this.onSaveRuntimeSettings.bind(this));
                aExtendedActions.push(tileSettingsAction);

                oTileApi.actions.setActionsProvider(function () {
                    return aExtendedActions;
                });
            }
            EventBus.getInstance().subscribe("launchpad", "sessionTimeout", this.stopRequests, this);
        },

        // convenience function to stop browser's timeout and OData calls
        stopRequests: function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (this.oDataRequest) {
                try {
                    // marking the flow as in-request-abort-flow
                    // reason for it is that the line below (oDataRequest.abort();) invokes the errorHandlerFn method
                    // and inside it we need to know if we reached the errorHandler due to real request failure OR request was aborted
                    this.bIsAbortRequestFlow = true;

                    // actual request abort
                    this.oDataRequest.abort();
                } catch (e) {
                    Log.warning(e.name, e.message);
                }

                // remove the flag
                this.bIsAbortRequestFlow = undefined;
            }
        },

        // destroy handler stops requests
        onExit: function () {
            this.stopRequests();
            EventBus.getInstance().unsubscribe("launchpad", "sessionTimeout", this.stopRequests, this);
        },

        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function (oEvent) {
            var oView = this.getView();
            var oViewData = oView.getViewData();
            var oModel = oView.getModel();
            var sTargetUrl = oModel.getProperty("/nav/navigation_target_url");
            var oTileApi = oViewData.chip;
            var oTileConfig = oModel.getProperty("/config");

            // scope is property of generic tile. It's default value is "Display"
            if (oEvent.getSource().getScope && oEvent.getSource().getScope() === GenericTileScope.Display) {
                if (oTileApi.configurationUi.isEnabled()) {
                    oTileApi.configurationUi.display();
                } else if (sTargetUrl) {
                       EventHub.emit("UITracer.trace", {
                        reason: "LaunchApp",
                        source: "Tile",
                        data: {
                            targetUrl: sTargetUrl
                        }
                    });
                    if (sTargetUrl[0] === "#") {
                        hasher.setHash(sTargetUrl);
                    } else {
                        var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                        if (bLogRecentActivity) {
                            var oRecentEntry = {
                                title: oTileConfig.display_title_text,
                                appType: AppType.URL,
                                url: oTileConfig.navigation_target_url,
                                appId: oTileConfig.navigation_target_url
                            };
                            Container.getRendererInternal("fiori2").logRecentActivity(oRecentEntry);
                        }

                        WindowUtils.openURL(sTargetUrl, "_blank");
                    }
                }
            }
        },

        // dynamic data updater
        onUpdateDynamicData: function () {
            var oView = this.getView();
            var oConfig = oView.getModel().getProperty("/config");
            var nservice_refresh_interval = oConfig.service_refresh_interval;
            if (!nservice_refresh_interval) {
                nservice_refresh_interval = 0;
            } else if (nservice_refresh_interval < 10) {
                // log in English only
                Log.warning(
                    "Refresh Interval " + nservice_refresh_interval
                    + " seconds for service URL " + oConfig.service_url
                    + " is less than 10 seconds, which is not supported. "
                    + "Increased to 10 seconds automatically.",
                    null,
                    "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller"
                );
                nservice_refresh_interval = 10;
            }
            if (oConfig.service_url) {
                this.loadData(nservice_refresh_interval);
            }
        },

        extractData: function (oData) {
            var name;
            var aKeys = [
                "results", "icon", "title", "number", "numberUnit",
                "info", "infoState", "infoStatus", "targetParams",
                "subtitle", "stateArrow", "numberState", "numberDigits", "numberFactor"
            ];

            if (typeof oData === "object" && Object.keys(oData).length === 1) {
                name = Object.keys(oData)[0];
                if (aKeys && Array.prototype.indexOf.call(aKeys, name) === -1) {
                    return oData[name];
                }
            }
            return oData;
        },

        // tile settings action UI save handler
        onSaveRuntimeSettings: function (oSettingsView) {
            var oViewModel = oSettingsView.getModel();
            var oTileApi = this.getView().getViewData().chip;
            var oConfigToSave = this.getView().getModel().getProperty("/config");

            oConfigToSave.display_title_text = oViewModel.getProperty("/title");
            oConfigToSave.display_subtitle_text = oViewModel.getProperty("/subtitle");
            oConfigToSave.display_info_text = oViewModel.getProperty("/info");
            oConfigToSave.display_search_keywords = oViewModel.getProperty("/keywords");

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag("tileProperties");
            tilePropertiesBag.setText("display_title_text", oConfigToSave.display_title_text);
            tilePropertiesBag.setText("display_subtitle_text", oConfigToSave.display_subtitle_text);
            tilePropertiesBag.setText("display_info_text", oConfigToSave.display_info_text);
            tilePropertiesBag.setText("display_search_keywords", oConfigToSave.display_search_keywords);

            function logErrorAndReject (oError) {
                Log.error(oError, null, "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");
            }

            // saving the relevant properties
            tilePropertiesBag.save(
                // success handler
                function () {
                    Log.debug("property bag 'tileProperties' saved successfully");

                    // update the local tile's config - saving changes on the Model
                    this.getView().getModel().setProperty("/config", oConfigToSave);

                    // update tile's model for changes to appear immediately
                    // (and not wait for the refresh handler which happens every 10 seconds)
                    this.getView().getModel().setProperty("/data/display_title_text", oConfigToSave.display_title_text);
                    this.getView().getModel().setProperty("/data/display_subtitle_text", oConfigToSave.display_subtitle_text);
                    this.getView().getModel().setProperty("/data/display_info_text", oConfigToSave.display_info_text);

                    // call to refresh model which (due to the binding) will refresh the tile
                    this.getView().getModel().refresh();
                }.bind(this),
                logErrorAndReject // error handler
            );
        },

        // configuration save handler
        onSaveConfiguration: function (oConfigurationView) {
            // the deferred object required from the configurationUi contract
            var oDeferred = jQuery.Deferred();
            var oModel = oConfigurationView.getModel();
            // tile model placed into configuration model by getConfigurationUi
            var oTileModel = oModel.getProperty("/tileModel");
            var oTileApi = oConfigurationView.getViewData().chip;
            var aTileNavigationActions = utils.tileActionsRows2TileActionsArray(oModel.getProperty("/config/tile_actions_rows"));
            // get the configuration to save from the model
            var configToSave = {
                display_icon_url: oModel.getProperty("/config/display_icon_url"),
                display_number_unit: oModel.getProperty("/config/display_number_unit"),
                service_url: oModel.getProperty("/config/service_url"),
                service_refresh_interval: oModel.getProperty("/config/service_refresh_interval"),
                navigation_use_semantic_object: oModel.getProperty("/config/navigation_use_semantic_object"),
                navigation_target_url: oModel.getProperty("/config/navigation_target_url"),
                navigation_semantic_object: String.prototype.trim(oModel.getProperty("/config/navigation_semantic_object")),
                navigation_semantic_action: String.prototype.trim(oModel.getProperty("/config/navigation_semantic_action")),
                navigation_semantic_parameters: String.prototype.trim(oModel.getProperty("/config/navigation_semantic_parameters")),
                display_search_keywords: oModel.getProperty("/config/display_search_keywords")
            };
            // If the input fields icon, semantic object and action are failing the input validations,
            // then through an error message requesting the user to enter/correct those fields
            var bReject = utils.checkInputOnSaveConfig(oConfigurationView);
            if (!bReject) {
                bReject = utils.checkTileActions(oConfigurationView);
            }
            if (bReject) {
                oDeferred.reject("mandatory_fields_missing");
                return oDeferred.promise();
            }
            // overwrite target URL in case of semantic object navigation
            if (configToSave.navigation_use_semantic_object) {
                configToSave.navigation_target_url = utils.getSemanticNavigationUrl(configToSave);
                oModel.setProperty("/config/navigation_target_url", configToSave.navigation_target_url);
            }

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag("tileProperties");
            tilePropertiesBag.setText("display_title_text", oModel.getProperty("/config/display_title_text"));
            tilePropertiesBag.setText("display_subtitle_text", oModel.getProperty("/config/display_subtitle_text"));
            tilePropertiesBag.setText("display_info_text", oModel.getProperty("/config/display_info_text"));
            tilePropertiesBag.setText("display_search_keywords", configToSave.display_search_keywords);

            var tileNavigationActionsBag = oTileApi.bag.getBag("tileNavigationActions");
            // forward populating of tile navigation actions array into the bag, to Utils
            utils.populateTileNavigationActionsBag(tileNavigationActionsBag, aTileNavigationActions);

            function logErrorAndReject (oError, oErrorInfo) {
                Log.error(oError, null, "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");
                oDeferred.reject(oError, oErrorInfo);
            }

            // use configuration contract to write parameter values
            oTileApi.writeConfiguration.setParameterValues(
                { tileConfiguration: JSON.stringify(configToSave) },
                // success handler
                function () {
                    var oConfigurationConfig = utils.getAppLauncherConfig(oTileApi, false, false);
                    // get tile config data in admin mode
                    var oTileConfig = utils.getAppLauncherConfig(oTileApi, true, false);
                    // switching the model under the tile -> keep the tile model
                    oConfigurationView.setModel(new JSONModel({
                        config: oConfigurationConfig,
                        // keep tile model
                        tileModel: oTileModel
                    }));

                    // update tile model
                    oTileModel.setData({ data: oTileConfig, nav: { navigation_target_url: "" } }, false);
                    if (oTileApi.preview) {
                        oTileApi.preview.setTargetUrl(oConfigurationConfig.navigation_target_url);
                        oTileApi.preview.setPreviewIcon(oConfigurationConfig.display_icon_url);
                        oTileApi.preview.setPreviewTitle(oConfigurationConfig.display_title_text);
                        if (oTileApi.preview.setPreviewSubtitle && typeof oTileApi.preview.setPreviewSubtitle === "function") {
                            oTileApi.preview.setPreviewSubtitle(oConfigurationConfig.display_subtitle_text);
                        }
                    }

                    tilePropertiesBag.save(
                        // success handler
                        function () {
                            Log.debug("property bag 'tileProperties' saved successfully");
                            // update possibly changed values via contracts
                            if (oTileApi.title) {
                                oTileApi.title.setTitle(
                                    oConfigurationConfig.display_title_text,
                                    // success handler
                                    function () {
                                        oDeferred.resolve();
                                    },
                                    logErrorAndReject // error handler
                                );
                            } else {
                                oDeferred.resolve();
                            }
                        },
                        logErrorAndReject // error handler
                    );

                    tileNavigationActionsBag.save(
                        // success handler
                        function () {
                            Log.debug("property bag 'navigationProperties' saved successfully");
                        },
                        logErrorAndReject // error handler
                    );
                },
                logErrorAndReject // error handler
            );

            return oDeferred.promise();
        },

        successHandleFn: function (oResult) {
            this.bIsRequestCompleted = true;

            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var oData = oResult;

            if (typeof oResult === "object") {
                var oUriParameters = UriParameters.fromURL(oConfig.service_url);
                var uriParamInlineCount = oUriParameters.get("$inlinecount");
                if (uriParamInlineCount && uriParamInlineCount === "allpages") {
                    oData = { number: oResult.__count };
                } else {
                    oData = this.extractData(oData);
                }
            } else if (typeof oResult === "string") {
                oData = { number: oResult };
            }

            if ((this.getView().getViewData().properties) && (this.getView().getViewData().properties.info)) {
                if (typeof oData === "object") {
                    oData.info = this.getView().getViewData().properties.info;
                }
            }

            var oDataToDisplay = utils.getDataToDisplay(oConfig, oData);

            // set data to display
            this.getView().getModel().setProperty("/data", oDataToDisplay);

            // Update this.navigationTargetUrl in case that oConfig.navigation_target_url was changed
            this.navigationTargetUrl = oConfig.navigation_target_url;

            // rewrite target URL
            this.getView().getModel().setProperty("/nav/navigation_target_url",
                utils.addParamsToUrl(this.navigationTargetUrl, oDataToDisplay));
        },

        // error handler
        errorHandlerFn: function (oMessage) {
            // only in case the invocation of errorHandlerFn was not due to explicit request abort we mark
            // the request as completed. In case it WAS due to request abort we do not mark the request as
            // completed, in order for the visibleHandler to resend a request when marked visible again
            // according to the respective logic (see visibleHandler method)
            if (!this.bIsAbortRequestFlow) {
                this.bIsRequestCompleted = true;
            }

            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var sMessage = (oMessage && oMessage.message) || oMessage;
            var oResourceBundle = utils.getResourceBundleModel().getResourceBundle();

            if (sMessage === "Request aborted") {
                // Display abort information in English only
                Log.info("Data request from service " + oConfig.service_url + " was aborted",
                    null, "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile");
            } else {
                if (oMessage.response) {
                    sMessage += " - " + oMessage.response.statusCode + " " + oMessage.response.statusText;
                }

                // Display error in English only
                Log.error("Failed to update data via service " + oConfig.service_url + ": " + sMessage,
                    null, "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile");
            }

            if (!this.bIsAbortRequestFlow) {
                this.getView().getModel().setProperty("/data",
                    utils.getDataToDisplay(oConfig, {
                        number: "???",
                        info: oResourceBundle.getText("dynamic_data.error"),
                        infoState: "Critical"
                    })
                );
            }
        },

        // configuration cancel handler
        onCancelConfiguration: function (oConfigurationView, successHandler, errorHandle) {
            // reload old configuration and display
            var oViewData = oConfigurationView.getViewData();
            var oModel = oConfigurationView.getModel();
            // tile model placed into configuration model by getConfigurationUi
            var oTileModel = oModel.getProperty("/tileModel");
            var oTileApi = oViewData.chip;
            var oCurrentConfig = utils.getAppLauncherConfig(oTileApi, false, false);
            oConfigurationView.getModel().setData({ config: oCurrentConfig, tileModel: oTileModel }, false);
        },

        // loads data from backend service
        loadData: function (nservice_refresh_interval) {
            var oDynamicTileView = this.getView();
            var oConfig = oDynamicTileView.getModel().getProperty("/config");
            var sUrl = oConfig.service_url;
            var oTileApi = this.getView().getViewData().chip;
            if (!sUrl) {
                return;
            }
            if (/;o=([;/?]|$)/.test(sUrl)) { // URL has placeholder segment parameter ;o=
                sUrl = oTileApi.url.addSystemToServiceUrl(sUrl);
            }
            //set the timer if required
            if (nservice_refresh_interval > 0) {
                // log in English only
                Log.info(
                    "Wait " + nservice_refresh_interval + " seconds before calling "
                    + oConfig.service_url + " again",
                    null,
                    "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller"
                );
                // call again later
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(this.loadData.bind(this, nservice_refresh_interval, false), (nservice_refresh_interval * 1000));
            }

            // Verify the the Tile visibility is "true" in order to issue an oData request`
            if (oTileApi.visible.isVisible() && !this.oDataRequest) {
                var sLang = Localization.getSAPLogonLanguage();
                if ((sLang) && (sUrl.indexOf("sap-language=") === -1)) {
                    sUrl = sUrl + (sUrl.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sLang;
                }
                this.oDataRequest = OData.read(
                    {
                        requestUri: sUrl,
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            Pragma: "no-cache",
                            Expires: "0"
                        }
                    },
                    // success handler
                    this.successHandleFn.bind(this),
                    this.errorHandlerFn.bind(this)
                );
            }
        },

        refreshHandler: function (oDynamicTileController, iInterval) {
            var oTileApi = oDynamicTileController.getView().getViewData().chip;
            if (!oTileApi.configurationUi.isEnabled()) {
                iInterval = iInterval || 0;
                oDynamicTileController.loadData(iInterval);
            } else {
                oDynamicTileController.stopRequests();
            }
        },

        // load data in place in case setting visibility from false to true
        // with no additional timer registered
        visibleHandler: function (isVisible) {
            var oView = this.getView();
            var oConfig = oView.getModel().getProperty("/config");
            var nservice_refresh_interval = oConfig.service_refresh_interval;
            if (isVisible) {
                if (nservice_refresh_interval > 0) {
                    // tile is visible and the refresh interval isn't set to 0
                    this.refreshHandler(this, Math.max(nservice_refresh_interval, 10));
                } else if (!this.bIsRequestCompleted) {
                    // tile is visible and data should be updated
                    this.refreshHandler(this, 0);
                }
            } else {
                this.stopRequests();
            }
        },

        formatters: {
            urlToExternal: function (sUrl) {
                // Any subsequent FLP tab/window should be opened with the appState=lean URL parameter.
                // append appState only in the case when URL starts with "#".
                if ((sUrl || "").charAt(0) !== "#") {
                    return sUrl;
                }

                var sQuery = window.location.search;
                if (!sQuery) {
                    sQuery = "?appState=lean";
                } else if (sQuery.indexOf("appState=") >= -1) { // avoid duplicates: lean FLP opens a link again
                    sQuery += "&appState=lean";
                }
                return window.location.origin + window.location.pathname + sQuery + sUrl;
            }
        }
    });
});
