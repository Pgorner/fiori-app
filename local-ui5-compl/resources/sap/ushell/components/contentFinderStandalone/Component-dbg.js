//Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview ContentFinder standalone Component
 *
 * @version 1.132.1
 */

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    /**
     * Component of the ContentFinder standalone.
     *
     * @param {string} sId Component id.
     * @param {object} mSettings Optional map for component settings.
     * @class
     * @extends sap.ui.core.UIComponent
     * @private
     * @since 1.123.0
     * @alias sap.ushell.components.contentFinderStandalone.Component
     */
    return UIComponent.extend("sap.ushell.components.contentFinderStandalone.Component",
        /** @lends sap.ushell.components.contentFinderStandalone.Component.prototype */{
            metadata: {
                manifest: "json",
                library: "sap.ushell",
                interfaces: ["sap.ui.core.IAsyncContentCreation"]
            }
        });
});
