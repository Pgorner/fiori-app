// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The <code>refresh</code> contract.
 */
 sap.ui.require([
    "sap/ushell_abap/pbServices/ui2/Chip"
], function (
    Chip
) {
    "use strict";

    /**
     * @namespace chip.refresh
     * @description The namespace for the CHIP API's <code>refresh</code> contract, which allows you to
     * handle refresh events.
     * @since 1.2.0
     */
    Chip.addContract("refresh", function (oChipInstance) {
        /**
         * Attaches the given event handler to the "refresh" event which is fired
         * whenever the user requests a refresh of this CHIP's content.
         *
         * Use <code>Function.prototype.bind()</code> to determine the event handler's
         * <code>this</code> or some of its arguments.
         *
         * Note: Without such an event handler, the CHIP will be recreated to enforce a refresh!
         *
         * @name chip.refresh.attachRefresh
         * @function
         * @since 1.2.0
         * @param {function} fnEventHandler
         *   the event handler for the "refresh" event
         */
        this.attachRefresh = function (fnEventHandler) {
            oChipInstance.attachRefresh(fnEventHandler);
        };
    });
});
