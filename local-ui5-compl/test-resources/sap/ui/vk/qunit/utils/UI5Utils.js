/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

 /**
  * Provides utility methods to find all registered ui5 controls by name.
  * This helps to track controls that are left un-destroyed.
  */
sap.ui.define([
    "sap/ui/core/ElementRegistry"
], function(
    ElementRegistry
) {
    "use strict";

    var UI5Utils = {};

    /**
     *
     * @param {string} className e.g. sap.ui.vk.ViewGalleryThumbnail
     * @returns {array} An array of strings containing the names of all registered ui5 managed objects
     */
    UI5Utils.getAllUI5ObjectsByName = function(className) {
        return Object.entries(ElementRegistry.all())
                    .map(function(item){ return item[1].getMetadata().getName(); })
                    .filter(function(item) { return item.startsWith(className); });
    };

    return UI5Utils;
});
