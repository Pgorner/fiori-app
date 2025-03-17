// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ui/core/EventBus",
    "sap/ushell/Container"
], function (
    Log,
    Component,
    EventBus,
    Container
) {
    "use strict";

    return Component.extend("sap.ushell.demo.PluginAddFloatingContainer.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            manifest: "json"
        },

        init: function () {
            // register
            EventBus.getInstance().subscribe("launchpad", "shellFloatingContainerIsDocked", this._onDock, this);
            EventBus.getInstance().subscribe("launchpad", "shellFloatingContainerIsAccessible", this._onAccessible);
            EventBus.getInstance().subscribe("launchpad", "shellFloatingContainerIsUnDocked", this._onUnDock, this);

            this.bContainerVisible = false;

            if (Container.getRendererInternal("fiori2")) {
                // fiori renderer already loaded, apply extensions directly
                this.applyRenderer();
            } else {
                // fiori renderer not yet loaded, register handler for the loaded event
                EventBus.getInstance().subscribe("sap.ushell", "rendererLoaded", this.applyRenderer, this);
            }
        },

        exit: function () {
            EventBus.getInstance().unsubscribe("sap.ushell", "rendererLoaded", this.applyRenderer, this);
            EventBus.getInstance().unsubscribe("launchpad", "shellFloatingContainerIsDocked", this._onDock, this);
            EventBus.getInstance().unsubscribe("launchpad", "shellFloatingContainerIsAccessible", this._onAccessible);
            EventBus.getInstance().unsubscribe("launchpad", "shellFloatingContainerIsUnDocked", this._onUnDock, this);
        },

        applyRenderer: function () {
            const oRenderer = Container.getRendererInternal("fiori2");
            if (oRenderer) {
                this.bContainerVisible = oRenderer.getFloatingContainerVisiblity();
                // A shell header button that controls the visibility of the Floating Container
                oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                    id: "FloatingContainerButton",
                    icon: "sap-icon://S4Hana/S0011",
                    press: function (oEvent) {
                        oRenderer.setFloatingContainerDragSelector("#ContentPage-intHeader");
                        oRenderer.setFloatingContainerVisibility(!this.bContainerVisible);
                        this.bContainerVisible = !this.bContainerVisible;
                        const oState = oRenderer.getFloatingContainerState();
                        if (oState.indexOf("docked") !== -1) {
                            this._onDock();
                        }
                    }.bind(this)
                }, true, false, ["home", "app"]);

                sap.ui.require([
                    "sap/m/ActionListItem",
                    "sap/m/List",
                    "sap/m/Page"
                ], function (
                    ActionListItem,
                    List,
                    Page
                ) {
                    const oFloatingContainerPage = new Page({
                        id: "ContentPage",
                        content: [
                            new List({
                                id: "ContentList",
                                items: [
                                    new ActionListItem({
                                        id: "ExitButton",
                                        text: "Exit",
                                        press: function () {
                                            // On click, the toggles the FloatingContainer's visibility (i.e. closes the container)
                                            oRenderer.setFloatingContainerVisibility(!this.bContainerVisible);
                                            this.bContainerVisible = !this.bContainerVisible;
                                        }.bind(this)
                                    })
                                ]
                            })
                        ],
                        title: "Header of a Page",
                        showHeader: true
                    }).addStyleClass("listCSSClass");
                    const oStyleElement = document.createElement("style");
                    oStyleElement.innerHTML = ".listCSSClass {background: rgba(187, 230, 211, .25); height: 220px; padding: 5px; }";
                    oStyleElement.innerHTML += ".listCSSClass section {position: relative}";
                    document.head.appendChild(oStyleElement);
                    oRenderer.setFloatingContainerContent(oFloatingContainerPage, false);
                }.bind(this));

            } else {
                Log.error("BootstrapPluginSample - failed to apply renderer extensions, because the Renderer is not available");
            }
        },

        // This function implements logic for un-dock event
        _onUnDock: function () {
            const oContentPage = document.getElementById("ContentPage");
            oContentPage.classList.remove("sapUshellShellFloatingContainerFullHeight");
        },

        // This function implements logic for dock event
        _onDock: function () {
            const oContentPage = document.getElementById("ContentPage");
            oContentPage.classList.add("sapUshellShellFloatingContainerFullHeight");
        },

        // This function implements logic for accessibility events
        _onAccessible: function () {
            const oFloatingContainer = document.getElementById("shell-floatingContainer");
            oFloatingContainer.focus();
        }
    });
});
