// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Sample App for the home app feature.
 * The app does not fulfill the product standards!
 * The feature is configured via:
 * ushell/homeApp/component/name: "<component.namespace>"
 * ushell/homeApp/component/url: "<url/to/component>"
 *
 * or with the overwrite parameter
 * on  CDM: &sap-ushell-xx-overwrite-config=ushell/homeApp/component/name:sap.ushell.demo.HomeApp,ushell/homeApp/component/url:../../demoapps/HomeApp
 * on ABAP: &sap-ushell-xx-overwrite-config=ushell/homeApp/component/name:sap.ushell.demo.HomeApp,ushell/homeApp/component/url:/sap/bc/ui5_ui5/ui2/customhome
 */
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    // ===========================================================================================
    //       This app is only used for testing and shall not be used productively!
    // ===========================================================================================

    return UIComponent.extend("sap.ushell.demo.HomeApp.Component", {
        metadata: {
            manifest: "json"
        }
    });
});
