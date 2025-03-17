/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 * @fileOverview This file handles the resource bundles for ovp framework.
 */
sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/ovp/app/OVPLogger",
    "sap/ui/core/Lib"
], function (
    ResourceModel, 
    OVPLogger,
    CoreLib
) {
    "use strict";

    //Until resources.pResourcePromise is resolved, the corresponding resource bundles should not be read
    var resources = {};
    resources.oResourceBundle = null;
    resources.oResourceModel = null;

    var oLogger = new OVPLogger("OVP.app.resources");
    //CoreLib.getResourceBundleFor("sap.ovp", /*Async*/true) returns a promise
    //Promise.then again returns a promise

    resources.pResourcePromise = new Promise(function (resolve, reject) {
        try {
            var oBundle = CoreLib.getResourceBundleFor("sap.ovp");

            if (!oBundle) {
                return reject("Bundle creation failure");
            }

            resources.oResourceBundle = oBundle;
            resources.oResourceModel = new ResourceModel({
                bundleUrl: oBundle.oUrlInfo.url,
                bundle: oBundle  //Reuse created bundle to stop extra network calls
            });
            resolve(oBundle);
        } catch (oError) {
            oLogger.error("sap.ovp resource library bundle error:" + oError);
            return reject("Bundle creation failure");
        }
    });

    /**
     * Users of this file (as return Module) can retrieve the text values using any of the following options
     * Module.getText(key)
     * Module.getProperty(key)
     * Module.oResourceBundle.getText(key)
     * Module.oResourceModel.getProperty(key)
     */
    resources.getText = function (sTextKey, aStrings) {
        if (aStrings && aStrings.length > 0) {
            return this.oResourceBundle ? this.oResourceBundle.getText(sTextKey, aStrings) : null;
        } else {
            return this.oResourceBundle ? this.oResourceBundle.getText(sTextKey) : null;
        }
    };
    resources.getProperty = function (sTextKey) {
        return this.oResourceModel ? this.oResourceModel.getProperty(sTextKey) : null;
    };
    return resources;
}, /* bExport= */ true);