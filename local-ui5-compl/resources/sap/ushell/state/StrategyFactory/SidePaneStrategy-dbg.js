// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Element"
], function (
    Log,
    Element
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StrategyFactory.SidePaneStrategy
     * @namespace
     * @description Strategy for adding items to the side pane area.
     *
     * @since 1.127.0
     * @private
     */
    class SidePaneStrategy {
        /**
         * Adds an item to the list.
         * Does not add the item:
         *  - if the control doesn't exist
         * @param {sap.ui.core.ID[]} aList The list.
         * @param {sap.ui.core.ID} sNewItem The item to add.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StrategyFactory.SidePaneStrategy#add
         */
        add (aList, sNewItem) {
            if (!Element.getElementById(sNewItem)) {
                Log.warning(`Failed to find control with id '${sNewItem}'`);
                return;
            }

            if (aList.includes(sNewItem)) {
                this.#removeSidePaneItem(aList, sNewItem);
            }

            this.#addSidePaneItem(aList, sNewItem);
        }

        /**
         * Removes the item from the list.
         * @param {sap.ui.core.ID[]} aList The list.
         * @param {sap.ui.core.ID} sItemToRemove The item to remove.
         *
         * @since 1.127.0
         * @private
         */
        #removeSidePaneItem (aList, sItemToRemove) {
            const iIndex = aList.indexOf(sItemToRemove);

            if (iIndex === -1) {
                return;
            }

            aList.splice(iIndex, 1);
        }

        /**
         * Adds the item to the list.
         * @param {sap.ui.core.ID[]} aList The list.
         * @param {sap.ui.core.ID} sNewItem The item to add.
         *
         * @since 1.127.0
         * @private
         */
        #addSidePaneItem (aList, sNewItem) {
            aList.push(sNewItem);
        }
    }

    return new SidePaneStrategy();

});
