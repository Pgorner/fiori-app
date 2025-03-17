// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/EventBus",
    "sap/ui/core/IconPool",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Component,
    ComponentContainer,
    EventBus,
    IconPool,
    Device,
    jQuery,
    Container
) {
    "use strict";

    return Component.extend("sap.ushell.demo.PluginAddDummyCopilot.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            EventBus.getInstance()
                .subscribe("launchpad", "shellFloatingContainerIsDocked", this._handleDocking, this)
                .subscribe("launchpad", "shellFloatingContainerIsUnDocked", this._handleDocking, this)
                .subscribe("launchpad", "shellFloatingContainerIsUnDockedOnResize", this._handleDocking, this);

            this._addCopilotButton(this._openCopilot);
        },

        _handleDocking: function (sChannelId, sEventId, oData) {
            if (sChannelId === "launchpad") {
                if (sEventId === "shellFloatingContainerIsDocked" || sEventId === "shellFloatingContainerIsUnDocked" || sEventId === "shellFloatingContainerIsUnDockedOnResize") {
                    if (this._oCopilotCoreComponentContainer && this._oCopilotCoreComponentContainer.getParent()) {
                        this._oCopilotCoreComponentContainer.setHeight(this._calculateCopilotContainerHeight());
                    }
                }
            }
        },

        _openCopilot: function () {
            const oRenderer = this._getFioriRenderer();

            if (oRenderer.getFloatingContainerVisiblity()) {
                oRenderer.setFloatingContainerVisibility(false);
                return;
            }

            Component.create({
                name: "sap.ushell.demo.PluginAddDummyCopilot.component"
            }).then(function (oComponent) {
                this._oCopilotCoreComponentContainer = new ComponentContainer({
                    height: this._calculateCopilotContainerHeight(),
                    width: this._calculateCopilotContainerWidth(),
                    component: oComponent
                });

                oRenderer.setFloatingContainerContent(this._oCopilotCoreComponentContainer);
                oRenderer.setFloatingContainerVisibility(true);
                setTimeout(function () {
                    oRenderer.setFloatingContainerDragSelector(".copilotDragableHandle");
                }, 1000);
            }.bind(this));
        },

        _addCopilotButton: function (pressHandler) {
            const oRenderer = this._getFioriRenderer();
            oRenderer.addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem", {
                    tooltip: "Dummy copilot",
                    ariaLabel: "Dummy copilot",
                    text: "Dummy copilot",
                    icon: IconPool.getIconURI("co"),
                    id: "copilotBtn",
                    press: pressHandler.bind(this)
                },
                true,
                false
            );
        },

        _getFioriRenderer: function () {
            return Container.getRendererInternal("fiori2");
        },

        _calculateCopilotContainerWidth: function () {
            if (Device.system.phone) {
                return Math.min(jQuery(window).width() / parseFloat(jQuery("html").css("font-size")), 26) + "rem";
            }
            return "100%";
        },

        _isDocked: function () {
            const sDockingState = this._getFioriRenderer().getFloatingContainerState();
            return sDockingState === "docked:left" || sDockingState === "docked:right";
        },

        _calculateCopilotContainerHeight: function () {
            if (Device.system.phone) {
                return (jQuery(window).height() / parseFloat(jQuery("html").css("font-size"))) + "0rem";
            }

            if (this._isDocked()) {
                return "100%";
            }

            const nWindowREMHeight = parseInt(jQuery(window).height() / parseFloat(jQuery("html").css("font-size")), 10) - 8; // -8 because the copilot window starts top:8rem
            return Math.min(nWindowREMHeight, 46) + "0rem";
        },

        exit: function () { }
    });
});
