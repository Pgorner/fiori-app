// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/StandardTreeItem"
], function (StandardTreeItem) {
    "use strict";

    /**
     * @class
     * @classdesc The Content Node Tree Item is a custom implementation of sap.m.StandardTreeItem to make items unselectable.
     * Constructor for a new Content Node Tree Item.
     *
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @extends sap.m.StandardTreeItem
     *
     * @since 1.81
     *
     * @private
     */
    var ContentNodeTreeItem = StandardTreeItem.extend("sap.ushell.ui.bookmark.ContentNodeTreeItem", {
        metadata: {
            library: "sap.ushell",

            properties: {
                selectable: {
                    type: "boolean",
                    defaultValue: true,
                    group: "Behavior"
                }
            }
        },
        renderer: StandardTreeItem.getMetadata().getRenderer()
    });

    ContentNodeTreeItem.prototype.setSelected = function (selected) {
        // In Internet Explorer, the order in which the `selected` and `selectable` properties
        // are updated on binding change is reversed.
        // As the items are reused in sap.m.Tree, the old `selectable` property value prevents all
        // updates to the `selected` property. In the wrong order (like in IE), this leads to items
        // not being selected even though their bound model has the correct values.
        // This is circumvented by calling setSelected again in setSelectable with the previously set value.
        this._bSelected = selected;

        return StandardTreeItem.prototype.setSelected.apply(this, arguments);
    };

    ContentNodeTreeItem.prototype.setSelectable = function (selectable) {
        this.setProperty("selectable", selectable, false);

        if (selectable) {
            StandardTreeItem.prototype.setSelected.call(this, this._bSelected);
        }

        return this;
    };

    ContentNodeTreeItem.prototype.isSelectable = function () {
        return this.getSelectable();
    };

    ContentNodeTreeItem.prototype.getModeControl = function () {
        if (!this.getSelectable()) {
            return null;
        }

        return StandardTreeItem.prototype.getModeControl.apply(this, arguments);
    };

    return ContentNodeTreeItem;
});
