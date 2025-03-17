// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function (
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StrategyFactory.DefaultStrategy
     * @namespace
     * @description Default strategy for adding, removing and setting values.
     *
     * @since 1.127.0
     * @private
     */
    class DefaultStrategy {
        /**
         * Adds a value to a list.
         * <code>null</code>, <code>undefined</code> and duplicated values are ignored.
         * @param {any[]} aList The list.
         * @param {any} vValue The value to add.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StrategyFactory.DefaultStrategy#add
         */
        add (aList, vValue) {
            if (vValue === undefined || vValue === null) {
                return;
            }

            if (aList.includes(vValue)) {
                return;
            }
            aList.push(vValue);
        }

        /**
         * Removes a value from a list.
         * Does not fail if the value is not in the list.
         * @param {any[]} aList The list.
         * @param {any} vValue The value to remove.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StrategyFactory.DefaultStrategy#remove
         */
        remove (aList, vValue) {
            const iIndex = aList.indexOf(vValue);
            if (iIndex === -1) {
                return;
            }
            aList.splice(iIndex, 1);
        }

        /**
         * Sets a value on an object.
         * Also sets nested properties, but does not merge objects.
         * @param {object} oNode The object.
         * @param {string} sKey The key.
         * @param {any} vValue The value.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StrategyFactory.DefaultStrategy#set
         */
        set (oNode, sKey, vValue) {
            oNode[sKey] = vValue;
        }
    }

    return new DefaultStrategy();

});
