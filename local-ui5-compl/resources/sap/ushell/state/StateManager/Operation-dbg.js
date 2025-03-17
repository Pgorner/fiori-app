// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function (
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StateManager.Operation
     * @enum {string}
     *
     * @since 1.127.0
     * @private
     */
    const Operation = {
        /**
         * Adds an item to a list.
         *
         * @since 1.127.0
         * @private
         */
        Add: "add",

        /**
         * Removes an item from a list.
         *
         * @since 1.127.0
         * @private
         */
        Remove: "remove",

        /**
         * Sets a property on an object.
         *
         * @since 1.127.0
         * @private
         */
        Set: "set"
    };

    return Operation;
});
