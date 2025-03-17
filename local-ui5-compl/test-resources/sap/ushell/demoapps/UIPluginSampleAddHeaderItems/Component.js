// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Panel",
    "sap/m/Switch",
    "sap/m/VBox",
    "sap/ui/core/Component",
    "sap/ui/core/IconPool",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ui/shell/ToolAreaItem"
], function (
    Log,
    ObjectPath,
    Button,
    Label,
    MessageToast,
    Panel,
    Switch,
    VBox,
    Component,
    IconPool,
    jQuery,
    ToolAreaItem
) {
    "use strict";

    var sComponentName = "sap.ushell.demo.UIPluginSampleAddHeaderItems";

    return Component.extend(sComponentName + ".Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * Returns the shell renderer instance in a reliable way,
         * i.e. independent from the initialization time of the plug-in.
         * This means that the current renderer is returned immediately, if it
         * is already created (plug-in is loaded after renderer creation) or it
         * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
         * before the renderer is created).
         *
         *  @returns {object}
         *      a jQuery promise, resolved with the renderer instance, or
         *      rejected with an error message.
         */
        _getRenderer: function () {
            var oDeferred = new jQuery.Deferred();
            var oRenderer;

            this._oShellContainer = sap.ui.require("sap/ushell/Container");
            if (!this._oShellContainer) {
                oDeferred.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
            } else {
                oRenderer = this._oShellContainer.getRendererInternal();
                if (oRenderer) {
                    oDeferred.resolve(oRenderer);
                } else {
                    // renderer not initialized yet, listen to rendererCreated event
                    this._onRendererCreated = function (oEvent) {
                        oRenderer = oEvent.getParameter("renderer");
                        if (oRenderer) {
                            oDeferred.resolve(oRenderer);
                        } else {
                            oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
                        }
                    };
                    this._oShellContainer.attachRendererCreatedEvent(this._onRendererCreated);
                }
            }
            return oDeferred.promise();
        },

        init: function () {
            this._getRenderer()
                .fail(function (sErrorMessage) {
                    Log.error(sErrorMessage, undefined, sComponentName);
                })
                .done(function (oRenderer) {
                    var oUriParameters = new URLSearchParams(window.location.search);
                    var bFull = oUriParameters.get("plugin-full");
                    if (bFull) {
                        oRenderer.addSubHeader("sap.m.Bar",
                            {
                                contentLeft: [new Button({
                                    text: "Button left"
                                })],
                                contentRight: [new Button({
                                    text: "Button right"
                                })],
                                contentMiddle: [new Button({
                                    text: "Button center"
                                })]
                            }, true, true);
                        oRenderer.setFooterControl("sap.m.Bar",
                            {
                                contentLeft: [new Button({
                                    text: "Button left"
                                })],
                                contentRight: [new Button({
                                    text: "Button right"
                                })],
                                contentMiddle: [new Button({
                                    text: "Button center"
                                })]
                            }, true, true);

                        var button1 = new ToolAreaItem({
                            icon: "sap-icon://business-card"
                        });
                        oRenderer.showToolAreaItem(button1.getId(), false, ["home", "app"]);

                        oRenderer.setHeaderTitle("Custom Header Title");

                        oRenderer.addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
                            id: "testBtn",
                            icon: "sap-icon://pdf-attachment"
                        }, true, true);

                        oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                            id: "testBtn1",
                            icon: "sap-icon://documents"
                        }, true, true);

                        oRenderer.addActionButton("sap.m.Button", {
                            id: "testBtn3",
                            text: "Custom button",
                            icon: "sap-icon://action"
                        }, true, true);

                        var oEntry = {
                            title: "My custom settings",
                            icon: "sap-icon://wrench",
                            value: function () {
                                return jQuery.Deferred().resolve("more specific description");
                            },
                            content: function () {
                                return jQuery.Deferred().resolve(new Panel({
                                    content: [
                                        new VBox({
                                            items: [
                                                new Label({ text: "Some feature switch" }),
                                                new Switch("userPrefEntryButton")
                                            ]
                                        })
                                    ]
                                }));
                            },
                            onSave: function () {
                                return jQuery.Deferred().resolve();
                            }
                        };
                        oRenderer.addUserPreferencesEntry(oEntry);
                        return;
                    }
                    var oPluginParameters = this.getComponentData().config, // obtain plugin parameters
                        sRendererExtMethod;

                    if (oPluginParameters.position === "end") {
                        sRendererExtMethod = "addHeaderEndItem";
                    } else if (oPluginParameters.position === "begin") {
                        sRendererExtMethod = "addHeaderItem";
                    } else {
                        Log.warning("Invalid 'position' parameter, must be one of <begin, end>. Defaulting to 'end'.", undefined, sComponentName);
                        sRendererExtMethod = "addHeaderEndItem";
                    }

                    if (typeof oRenderer[sRendererExtMethod] === "function") {
                        oRenderer[sRendererExtMethod](
                            {
                                text: oPluginParameters.text || "UI Plugin Sample",
                                tooltip: oPluginParameters.tooltip || "UI Plugin Sample",
                                ariaLabel: oPluginParameters.tooltip || "UI Plugin Sample",
                                icon: IconPool.getIconURI(oPluginParameters.icon || "question-mark"),
                                press: function () {
                                    MessageToast.show(oPluginParameters.message || "Default Toast Message");
                                }
                            },
                            true,
                            false
                        );
                    } else {
                        Log.error("Extension method '" + sRendererExtMethod + "' not supported by shell renderer", undefined, sComponentName);
                        return;
                    }
                }.bind(this));
        },

        exit: function () {
            if (this._oShellContainer && this._onRendererCreated) {
                this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
            }
        }
    });
});
