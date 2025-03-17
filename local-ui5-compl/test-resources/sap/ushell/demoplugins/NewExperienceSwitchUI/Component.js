// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/HBox",
    "sap/m/Label",
    "sap/m/Switch",
    "sap/ui/core/Component",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/api/NewExperience"
], function (
    HBox,
    Label,
    Switch,
    Component,
    JSONModel,
    NewExperience
) {
    "use strict";

    var sComponentName = "sap.ushell.demoplugins.NewExperienceSwitchUI";

    return Component.extend(sComponentName + ".Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            const oModel = new JSONModel({
                active: false
            });
            const oNewExperienceSwitch = new HBox({
                id: "newExperienceSwitch",
                alignItems: "Center",
                items: [
                    new Label({
                        labelFor: "newExperienceSwitch-switch",
                        text: "New Version",
                        vAlign: "Middle",
                        design: "Bold"
                    }),
                    new Switch({
                        id: "newExperienceSwitch-switch",
                        state: "{/active}",
                        customTextOn: " ",
                        customTextOff: " ",
                        change: function (oEvent) {
                            this.rerender();
                        }
                    })
                ]
            }).setModel(oModel);
            oNewExperienceSwitch.addDelegate({
                onclick: function (oEvent) {
                    const oSwitchControl = this.getItems()[1];
                    if (oEvent.srcControl !== oSwitchControl) {
                        const currentState = oSwitchControl.getState();
                        oSwitchControl.setState(!currentState);
                        oSwitchControl.rerender();
                    }
                }
            }, oNewExperienceSwitch);

            // NewExperience.setSwitchControl();
            NewExperience.setSwitchControl(oNewExperienceSwitch);

            // set visibility of the switch
            // NewExperience.setSwitchVisibility(true);
            // NewExperience.setSwitchVisibility(false);
        }
    });
});
