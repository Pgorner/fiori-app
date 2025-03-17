// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview Wrapper for a custom list item that can be used in the overflow area.
 */
sap.ui.define([
    "sap/m/CustomListItem",
    "sap/m/CustomListItemRenderer",
    "sap/ui/core/Element"
], function (
    CustomListItem,
    CustomListItemRenderer,
    Element
) {
    "use strict";

    /**
     * @alias sap.ushell.api.NewExperience.CustomOverflowListItem
     * @class
     * @description Wrapper for a custom list item that can be used in the overflow area.
     *
     * @since 1.124.0
     * @private
     */
    const CustomOverflowListItem = CustomListItem.extend("sap.ushell.api.NewExperience.CustomOverflowListItem", /** @lends ap.ushell.api.NewExperience.CustomOverflowListItem.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {
                contentId: { type: "string", group: "Misc", defaultValue: null }
            }
        },
        renderer: CustomListItemRenderer
    });

    /**
     * Returns the content of the custom list item.
     * @returns {sap.ui.core.Control[]} The content of the custom list item
     *
     * @since 1.124.0
     * @private
     */
    CustomOverflowListItem.prototype.getContent = function () {
        const oControl = Element.getElementById(this.getContentId());
        return [oControl];
    };

    return CustomOverflowListItem;

});
