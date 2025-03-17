// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Element"
], function (
    Log,
    Element
) {
    "use strict";

    const iMaxLength = 3;

    /**
     * @alias sap.ushell.state.StrategyFactory.HeadItemsStrategy
     * @namespace
     * @description Strategy for adding items to the head item area.
     *
     * @since 1.127.0
     * @private
     */
    class HeadItemsStrategy {
        /**
         * Adds an item to the list.
         * Does not add the item:
         *  - if it is already in the list
         *  - if the control doesn't exist
         *  - if the max length would be exceeded
         * Applies a custom sorting.
         * @param {sap.ui.core.ID[]} aList The list.
         * @param {sap.ui.core.ID} sNewItem The item to add.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StrategyFactory.HeadItemsStrategy#add
         */
        add (aList, sNewItem) {
            if (aList.includes(sNewItem)) {
                return;
            }
            if (!Element.getElementById(sNewItem)) {
                Log.warning(`Failed to find control with id '${sNewItem}'`);
                return;
            }
            if (this.#exceedsMaxLength([...aList, sNewItem])) {
                Log.error("The maximum number of head items has been reached. The item could not be added.");
            } else {
                this.#addHeaderItems(aList, sNewItem);
            }
        }

        /**
         * Checks if the max length would be exceeded.
         * Reserved ids are not counted.
         * @param {sap.ui.core.ID} aList The list.
         * @returns {boolean} True if the max length would be exceeded, false otherwise.
         *
         * @since 1.127.0
         * @private
         */
        #exceedsMaxLength (aList) {
            const aListWithoutDuplicates = [...new Set(aList)];
            const aReservedIds = [
                "backBtn"
            ];

            const iCurrentLength = aListWithoutDuplicates.filter((sItem) => {
                return !aReservedIds.includes(sItem);
            }).length;

            return iCurrentLength > iMaxLength;
        }

        /**
         * Adds the item to the list.
         * Applies sorting based on a predefined scale.
         * @param {sap.ui.core.ID[]} aList The list.
         * @param {sap.ui.core.ID} sNewItem The item to add.
         *
         * @since 1.127.0
         * @private
         */
        #addHeaderItems (aList, sNewItem) {
            aList.push(sNewItem);

            /* eslint-disable quote-props */
            const oScale = {
                "backBtn": -1
                //0 custom items
            };
            /* eslint-enable quote-props */

            aList.sort((sItem1, sItem2) => {
                const iPriority1 = oScale[sItem1] || 0;
                const iPriority2 = oScale[sItem2] || 0;

                return iPriority1 - iPriority2;
            });
        }
    }

    return new HeadItemsStrategy();

});
