// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/playground/controller/BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("sap.ushell.playground.controller.SysInfoBar", {

        onInit: function () {
            this.oSysInfoBar = this.byId("sysInfoBar");
        },

        onApply: function () {
            var sColor = this.byId("selectColor").getSelectedKey();
            var sColorPicker = this.byId("colorPicker").getColorString();
            var sText = this.byId("inputText").getValue();
            var sSubText = this.byId("inputSubText").getValue();
            var sIcon = this.byId("inputSubIcon").getValue();
            // Apply to SysInfoBar
            this.oSysInfoBar.setText(sText);
            this.oSysInfoBar.setSubText(sSubText);
            this.oSysInfoBar.setIcon(sIcon);
            if (sColor === "custom") {
                this.oSysInfoBar.setColor(sColorPicker);
            } else {
                this.oSysInfoBar.setColor(sColor);
            }
        }
    });
});
