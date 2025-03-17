// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/Panel",
    "sap/m/Switch",
    "sap/m/VBox",
    "sap/ui/core/Component",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/ushell/Container"
], function (Button, Label, MessageToast, Panel, Switch, VBox, Component, jQuery, ToolAreaItem, Container) {
    "use strict";

    var sComponentName = "sap.ushell.demoplugins.FullUIExtensionPluginSample";

    return Component.extend(sComponentName + ".Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            var oRenderer = Container.getRendererInternal();
            var oUriParameters = new URLSearchParams(window.location.search);
            var sFull = oUriParameters.get("plugin-full");
            var sMessage = "UI Extension contributed from demo plug-in";
            var sTooltip = "UI Extension";
            var oToolAreaItem;
            var oUserPreferencesEntry;

            function onPress () {
                MessageToast.show(sMessage);
            }

            // only add extensions if query parameter "plugin-full" is set
            if (sFull !== null && sFull !== undefined && sFull.toLowerCase() !== "false") {
                // TODO: the design for the sap.m.Bar does not fit anymore to the groups anchor bar or space menu navigation (uses a different background color)
                oRenderer.addShellSubHeader({
                    controlType: "sap.m.Bar",
                    oControlProperties: {
                        contentLeft: [new Button({
                            text: "Button left",
                            press: onPress
                        })],
                        contentRight: [new Button({
                            text: "Button right",
                            press: onPress
                        })],
                        contentMiddle: [new Button({
                            text: "Button center",
                            press: onPress
                        })]
                    },
                    bIsVisible: true
                });

                // TODO: this does not work anymore (since 1.84.6!)
                oRenderer.setShellFooter({
                    controlType: "sap.m.Bar",
                    oControlProperties: {
                        contentLeft: [new Button({
                            text: "Button left",
                            press: onPress
                        })],
                        contentRight: [new Button({
                            text: "Button right",
                            press: onPress
                        })],
                        contentMiddle: [new Button({
                            text: "Button center",
                            press: onPress
                        })]
                    },
                    bIsVisible: true
                });

                oToolAreaItem = new ToolAreaItem({
                    tooltip: "Custom tool area item",
                    icon: "sap-icon://business-card",
                    press: onPress
                });
                oRenderer.showToolAreaItem(oToolAreaItem.getId(), false, ["home", "app"]);

                oRenderer.setHeaderTitle("Custom Header Title");

                oRenderer.addHeaderItem({
                    tooltip: sTooltip,
                    ariaLabel: sTooltip,
                    icon: "sap-icon://pdf-attachment",
                    press: onPress
                }, true, false);

                oRenderer.addHeaderEndItem({
                    tooltip: sTooltip,
                    ariaLabel: sTooltip,
                    icon: "sap-icon://documents",
                    press: onPress
                }, true, false);

                oRenderer.addUserAction({
                    controlType: "sap.m.Button",
                    oControlProperties: {
                        id: "testBtn3",
                        text: "Custom button",
                        icon: "sap-icon://action",
                        press: onPress
                    },
                    bIsVisible: true,
                    bCurrentState: false
                });

                // TODO: this replaces all standard settings!
                oUserPreferencesEntry = {
                    title: "My custom settings",
                    icon: "sap-icon://wrench",
                    value: function () {
                        return jQuery.Deferred().resolve("Added by UI extension demo plug-in");
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
                oRenderer.addUserPreferencesEntry(oUserPreferencesEntry);
            }
        }
    });
});
