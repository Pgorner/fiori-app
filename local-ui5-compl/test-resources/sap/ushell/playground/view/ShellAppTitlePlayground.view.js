// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Page",
    "sap/m/Panel",
    "sap/m/StandardListItem",
    "sap/m/Switch",
    "sap/ui/core/mvc/View",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/ui/shell/NavigationMiniTile",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellNavigationMenu",
    "sap/m/library",
    "sap/ushell/state/StateManager"
], function (
    Input,
    Label,
    MessageToast,
    Page,
    Panel,
    StandardListItem,
    Switch,
    View,
    SimpleForm,
    JSONModel,
    Config,
    NavigationMiniTile,
    ShellAppTitle,
    ShellNavigationMenu,
    mLibrary,
    StateManager
) {
    "use strict";

    // shortcut for sap.m.InputType
    var InputType = mLibrary.InputType;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    return View.extend("sap.ushell.playground.view.ShellAppTitlePlayground", {
        getControllerName: function () {
            return "sap.ushell.playground.controller.ShellAppTitlePlayground";
        },

        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oAllMyAppsView;
            var oData = {
                visible: true,
                navMenuVis: true,
                shellAppTitleText: "Shell App Title Text",
                shellAppTitletooltip: "Shell App Title tooltip",
                title: "Shell App Title",
                ShellAppTitleState: "",
                icon: "sap-icon://world",
                showTitle: false,
                showRelatedApps: true
            };

            StateManager.switchState(LaunchpadState.App);

            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            var oVisibleLabel = new Label({
                text: "Shell App Title Visible",
                labelFor: oVisibleSwitch
            });

            var oVisibleSwitch = new Switch({
                state: true,
                change: function (oEvent) {
                    oData.visible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oShellAppTitleTextLabel = new Label({
                text: "Shell App Title Text",
                labelFor: oShellAppTitleTextInput
            });

            var oShellAppTitleTextInput = new Input({
                type: InputType.Text,
                placeholder: "Enter a shell app title ..."
            });
            oShellAppTitleTextInput.bindValue("/shellAppTitleText");

            var oShellAppTitleTooltipLabel = new Label({
                text: "Shell App Title Tooltip Text",
                labelFor: oShellAppTitleTooltipTextInput
            });

            var oShellAppTitleTooltipTextInput = new Input({
                type: InputType.Text,
                placeholder: "Enter a shell app title tooltip ..."
            });
            oShellAppTitleTooltipTextInput.bindValue("/shellAppTitletooltip");

            var oShellAppTitleNavMenuLabel = new Label({
                text: "Shell App Title Navigation Menu",
                labelFor: oShellNavigationMenuVisibleSwitch
            });

            var oShellNavigationMenuVisibleSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oShellAppTitle.setNavigationMenu(oShellNavigationMenu);
                    } else {
                        oShellAppTitle.setNavigationMenu(null);
                    }
                }
            });

            var oShellNavigationMenu = new ShellNavigationMenu({
                title: "{/title}",
                icon: "{/icon}",
                showRelatedApps: "{/showRelatedApps}",
                visible: "{/navMenuVis}",
                items: [
                    new StandardListItem({
                        icon: "sap-icon://navigation-right-arrow",
                        title: "Navigation Item 1"
                    }),
                    new StandardListItem({
                        icon: "sap-icon://navigation-right-arrow",
                        title: "Navigation Item 2"
                    })
                ],
                miniTiles: [
                    new NavigationMiniTile({
                        title: "Hello",
                        subtitle: "Foo",
                        icon: "sap-icon://navigation-right-arrow",
                        intent: "Go-Anywhere"
                    })
                ]
            });

            var oAllMyAppsLabel = new Label({
                text: "Shell App Title All My Apps View",
                labelFor: oAllMyAppsSwitch
            });

            var oAllMyAppsSwitch = new Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oShellAppTitle.setAllMyApps(oAllMyAppsView);
                    } else {
                        oShellAppTitle.setAllMyApps(null);
                    }
                }
            });

            View.create({
                type: "XML",
                id: "allMyAppsView",
                viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
            }).then(function (allMyAppsView) {
                oAllMyAppsView = allMyAppsView;

                /*
                oAllMyAppsView.getController = function () {
                    return {};
                };
                */
            });

            var oShellAppTitle = new ShellAppTitle({
                text: "{/shellAppTitleText}",
                tooltip: "{/shellAppTitletooltip}",
                visible: "{/visible}",
                press: function () {
                    MessageToast.show("Shell App Title has been pressed");
                },
                textChanged: function () {
                    MessageToast.show("Shell App Title text has been changed");
                }
            });

            var oEditableSimpleForm = new SimpleForm({
                layout: "ColumnLayout",
                maxContainerCols: 2,
                editable: true,
                title: "Modify Shell App Title",
                content: [
                    oVisibleLabel,
                    oVisibleSwitch,
                    oShellAppTitleTextLabel,
                    oShellAppTitleTextInput,
                    oShellAppTitleTooltipLabel,
                    oShellAppTitleTooltipTextInput,
                    oShellAppTitleNavMenuLabel,
                    oShellNavigationMenuVisibleSwitch,
                    oAllMyAppsLabel,
                    oAllMyAppsSwitch
                ]
            });

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oShellAppTitle,
                height: "400px"
            });

            var oPage = new Page("shellAppTitlePage", {
                title: "Shell App Title Demo",
                content: [oControlPanel, oEditableSimpleForm]
            }).setModel(oModel);

            oShellAppTitle.addEventDelegate({
                onAfterRendering: function () {
                    var oDomRef = oShellAppTitle.getDomRef();
                    if (oDomRef) {
                        oDomRef.style.backgroundColor = "#354a5f";
                    }
                }
            }, oShellAppTitle);

            return oPage;
        }
    });
});
