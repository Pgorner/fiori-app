// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function (
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StrategyFactory.FloatingContainerStrategy
     * @namespace
     * @description Strategy for adding items to the floating container area.
     *
     * @since 1.129.0
     * @private
     */
    class FloatingContainerStrategy {
        /**
         * Replaces the item in the list.
         * @param {sap.ui.core.ID[]} aList The list.
         * @param {sap.ui.core.ID} sNewItem The item to add.
         *
         * @since 1.129.0
         * @private
         * @alias sap.ushell.state.StrategyFactory.FloatingContainerStrategy#add
         */
        add (aList, sNewItem) {
            // empty the list
            aList.splice(0, aList.length);
            // add the new item
            aList.push(sNewItem);
        }
    }

    return new FloatingContainerStrategy();

});
