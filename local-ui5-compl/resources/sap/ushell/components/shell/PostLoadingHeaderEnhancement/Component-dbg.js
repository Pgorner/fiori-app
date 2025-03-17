// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/Device",
    "sap/ui/core/Component",
    "sap/ui/core/CustomData",
    "sap/ui/core/Element",
    "sap/ui/core/IconPool",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/Container",
    "sap/ushell/utils/UrlParsing"
], function (
    Localization,
    Device,
    Component,
    CustomData,
    Element,
    IconPool,
    Config,
    EventHub,
    ushellLibrary,
    resources,
    ShellHeadItem,
    ShellModel,
    StateManager,
    Container,
    UrlParsing
) {
    "use strict";

    // shortcut for sap.ushell.AppTitleState
    var AppTitleState = ushellLibrary.AppTitleState;

    // shortcut for sap.ushell.FloatingNumberType
    var FloatingNumberType = ushellLibrary.FloatingNumberType;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;
    const {
        Default,
        Standalone,
        Embedded,
        Lean,
        Merged
    } = ShellMode;

    var aCreatedControlIds = [];

    return Component.extend("sap.ushell.components.shell.PostLoadingHeaderEnhancement.Component", {
        metadata: {
            library: "sap.ushell"
        },
        init: function () {
            var oShellConfig = Container.getRendererInternal("fiori2").getShellConfig();

            aCreatedControlIds.push(this._createBackButton());
            aCreatedControlIds.push(this._createOverflowButton());

            if (oShellConfig.moveAppFinderActionToShellHeader && Config.last("/core/catalog/enabled") && !oShellConfig.disableAppFinder) {
                aCreatedControlIds.push(this._createAppFinderButton());
            }

            if (oShellConfig.moveContactSupportActionToShellHeader) {
                this._createSupportButton().then(function (sBtnId) {
                    aCreatedControlIds.push(sBtnId);
                });
            }

            this._createShellNavigationMenu();

            var oShellHeader = Element.getElementById("shell-header");
            oShellHeader.updateAggregation("headItems");
            oShellHeader.updateAggregation("headEndItems");
        },

        _createBackButton: function () {
            var sBackButtonIcon = Localization.getRTL() ? "feeder-arrow" : "nav-back";
            const sCurrentShellMode = StateManager.getShellMode();

            var oBackButton = new ShellHeadItem({
                id: "backBtn",
                tooltip: resources.i18n.getText("backBtn_tooltip"),
                ariaLabel: resources.i18n.getText("backBtn_tooltip"),
                icon: IconPool.getIconURI(sBackButtonIcon),
                press: function () {
                    EventHub.emit("navigateBack", Date.now());
                }
            });

            if ([Default, Standalone, Embedded, Merged].includes(sCurrentShellMode)) {
                StateManager.updateBaseStates([LaunchpadState.App], "header.headItems", Operation.Add, oBackButton.getId());
            } else if (sCurrentShellMode === Lean) {
                // only show btn after a navigation happened
                this._boundSetBackButtonVisibilityAfterHashChanged = this._setBackButtonVisibilityAfterHashChanged.bind(this);
                window.addEventListener("hashchange", this._boundSetBackButtonVisibilityAfterHashChanged);
            }
            /*
             * minimal:
             * only show btn in case a custom back navigation was registered
             * handled in Shell.controller@_onBackNavigationChanged
             */

            return oBackButton.getId();
        },

        _setBackButtonVisibilityAfterHashChanged: function (oHashChangeEvent) {
            const { oldURL, newURL } = oHashChangeEvent;
            const sOldHash = UrlParsing.getHash(oldURL);
            const sNewHash = UrlParsing.getHash(newURL);
            const sOldInnerAppRoute = UrlParsing.parseShellHash(sOldHash).appSpecificRoute;
            const sNewInnerAppRoute = UrlParsing.parseShellHash(sNewHash).appSpecificRoute;

            const bInnerAppNavigationOccurred = sOldInnerAppRoute !== sNewInnerAppRoute;

            if (bInnerAppNavigationOccurred) {
                StateManager.updateBaseStates([LaunchpadState.App], "header.headItems", Operation.Add, "backBtn");

                window.removeEventListener("hashchange", this._boundSetBackButtonVisibilityAfterHashChanged);
                delete this._boundSetBackButtonVisibilityAfterHashChanged;
            }
        },

        _createOverflowButton: function () {
            var oEndItemsOverflowBtn = new ShellHeadItem({
                id: "endItemsOverflowBtn",
                tooltip: {
                    path: "configModel>/notificationsCount",
                    formatter: function (notificationsCount) {
                        return this.tooltipFormatter(notificationsCount);
                    }
                },
                ariaLabel: resources.i18n.getText("shellHeaderOverflowBtn_tooltip"),
                ariaHaspopup: "dialog",
                icon: "sap-icon://overflow",
                floatingNumber: "{configModel>/notificationsCount}",
                floatingNumberMaxValue: Device.system.phone ? 99 : 999, // according to the UX specification
                floatingNumberType: FloatingNumberType.OverflowButton,
                press: function (oEvent) {
                    EventHub.emit("showEndItemOverflow", oEvent.getSource().getId(), true);
                }
            });
            oEndItemsOverflowBtn.setModel(ShellModel.getConfigModel(), "configModel");
            return oEndItemsOverflowBtn.getId();
        },

        _createAppFinderButton: function () {
            var oOpenCatalogButton = new ShellHeadItem({
                id: "openCatalogBtn",
                text: resources.i18n.getText("open_appFinderBtn"),
                ariaLabel: resources.i18n.getText("open_appFinderBtn"),
                tooltip: resources.i18n.getText("open_appFinderBtn"),
                icon: "sap-icon://sys-find",
                press: function () {
                    Container.getServiceAsync("Navigation").then(function (oNavService) {
                        oNavService.navigate({
                            target: {
                                semanticObject: "Shell",
                                action: "appfinder"
                            }
                        });
                    });
                }
            });
            if (Config.last("/core/extension/enableHelp")) {
                oOpenCatalogButton.addStyleClass("help-id-openCatalogActionItem"); // xRay help ID
            }

            // Add to userActions. The actual move happens within the state management
            StateManager.updateAllBaseStates("userActions.items", Operation.Add, oOpenCatalogButton.getId());
            return oOpenCatalogButton.getId();
        },

        _createSupportButton: function () {
            return new Promise(function (fnResolve) {
                sap.ui.require(["sap/ushell/ui/footerbar/ContactSupportButton"], function (ContactSupportButton) {
                    var sButtonName = "ContactSupportBtn";
                    var oSupportButton = Element.getElementById(sButtonName);
                    if (!oSupportButton) {
                        // Create an ActionItem from UserActionsMenu (ContactSupportButton)
                        // in order to to take its text and icon
                        // and fire the press method when the shell header item is pressed,
                        // but don't render this control
                        var oTempButton = new ContactSupportButton("tempContactSupportBtn", {
                            visible: true
                        });

                        var sIcon = oTempButton.getIcon();
                        var sText = oTempButton.getText();
                        oSupportButton = new ShellHeadItem({
                            id: sButtonName,
                            icon: sIcon,
                            tooltip: sText,
                            text: sText,
                            ariaHaspopup: "dialog",
                            press: function () {
                                oTempButton.firePress();
                            }
                        });
                    }

                    // Add to userActions. The actual move happens within the state management
                    StateManager.updateAllBaseStates("userActions.items", Operation.Add, sButtonName);
                    fnResolve(sButtonName);
                });
            });
        },

        _createShellNavigationMenu: function () {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/m/StandardListItem",
                    "sap/ushell/ui/shell/NavigationMiniTile",
                    "sap/ushell/ui/shell/ShellNavigationMenu"
                ], function (StandardListItem, NavigationMiniTile, ShellNavigationMenu) {
                    var sMenuId = "shellNavigationMenu";

                    var oHierarchyTemplateFunction = function (sId, oContext) {
                        var sIcon = oContext.getProperty("icon") || "sap-icon://circle-task-2",
                            sTitle = oContext.getProperty("title"),
                            sSubtitle = oContext.getProperty("subtitle"),
                            sIntent = oContext.getProperty("intent");

                        var oListItem = (new StandardListItem({
                            type: "Active", // Use string literal to avoid dependency from sap.m.library
                            title: sTitle,
                            description: sSubtitle,
                            icon: sIcon,
                            wrapping: true,
                            customData: [new CustomData({
                                key: "intent",
                                value: sIntent
                            })],
                            press: function () {
                                if (sIntent && sIntent[0] === "#") {
                                    EventHub.emit("navigateFromShellApplicationNavigationMenu", sIntent, true);
                                }
                            }
                        })).addStyleClass("sapUshellNavigationMenuListItems");

                        return oListItem;
                    };

                    var oRelatedAppsTemplateFunction = function (sId, oContext) {
                        // default icon behavior
                        var sIcon = oContext.getProperty("icon"),
                            sTitle = oContext.getProperty("title"),
                            sSubtitle = oContext.getProperty("subtitle"),
                            sIntent = oContext.getProperty("intent");
                        return new NavigationMiniTile({
                            title: sTitle,
                            subtitle: sSubtitle,
                            icon: sIcon,
                            intent: sIntent,
                            press: function () {
                                var sTileIntent = this.getIntent();
                                if (sTileIntent && sTileIntent[0] === "#") {
                                    EventHub.emit("navigateFromShellApplicationNavigationMenu", sTileIntent, true);
                                }
                            }
                        });
                    };

                    var oShellNavigationMenu = new ShellNavigationMenu(sMenuId, {
                        showRelatedApps: StateManager.getShellMode() !== Lean,
                        items: {
                            path: "shellModel>/application/hierarchy",
                            factory: oHierarchyTemplateFunction.bind(this)
                        },
                        miniTiles: {
                            path: "shellModel>/application/relatedApps",
                            factory: oRelatedAppsTemplateFunction.bind(this)
                        },
                        visible: {
                            path: "configModel>/shellAppTitleState",
                            formatter: function (sCurrentState) {
                                return sCurrentState === AppTitleState.ShellNavMenu;
                            }
                        }
                    });

                    oShellNavigationMenu.setModel(ShellModel.getModel(), "shellModel");
                    oShellNavigationMenu.setModel(ShellModel.getConfigModel(), "configModel");

                    var oShellAppTitle = Element.getElementById("shellAppTitle");
                    if (oShellAppTitle) {
                        oShellAppTitle.setNavigationMenu(oShellNavigationMenu);
                    }
                    aCreatedControlIds.push(sMenuId);

                    resolve(oShellNavigationMenu);
                }.bind(this));
            });
        },

        exit: function () {
            aCreatedControlIds.forEach(function (sControl) {
                var oControl = Element.getElementById(sControl);
                if (oControl) {
                    oControl.destroy();
                }
            });
            aCreatedControlIds = [];

            if (this._boundSetBackButtonVisibilityAfterHashChanged) {
                window.removeEventListener("hashchange", this._boundSetBackButtonVisibilityAfterHashChanged);
            }
        }
    });
});
