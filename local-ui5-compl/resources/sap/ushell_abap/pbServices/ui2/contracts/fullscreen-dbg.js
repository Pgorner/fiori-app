// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The <code>fullscreen</code> contract.
 */
 sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Chip"
], function (
    Chip
) {
    "use strict";

    /**
     * @namespace chip.fullscreen
     * @description The namespace for the CHIP API's <code>fullscreen</code> contract, which allows you
     * to deal with toggling of fullscreen mode.
     * @since 1.2.0
     */
    Chip.addContract("fullscreen", function (oChipInstance) {
        /**
         * Tells whether fullscreen mode is currently turned on.
         *
         * @name chip.fullscreen.getFullscreen
         * @function
         * @since 1.2.0
         * @returns {boolean}
         *   whether fullscreen mode is turned on
         */
        this.getFullscreen = function () {
            return oChipInstance.getFullscreen();
        };

        /**
         * Turns fullscreen mode on as specified.
         *
         * @name chip.fullscreen.setFullscreen
         * @function
         * @since 1.2.0
         * @param {boolean} bOn
         *   whether fullscreen mode is turned on
         */
        this.setFullscreen = function (bOn) {
            oChipInstance.setFullscreen(bOn);
        };

        /**
         * Attaches the given event handler to the "fullscreen" event which is fired
         * whenever fullscreen mode is toggled.
         *
         * Use <code>Function.prototype.bind()</code> to determine the event handler's
         * <code>this</code> or some of its arguments.
         *
         * Note: Without such an event handler, the CHIP will simply continue to display the
         * same content, no matter whether fullscreen mode is on or off.
         *
         * @name chip.fullscreen.attachFullscreen
         * @function
         * @since 1.2.0
         * @param {function} fnEventHandler
         *   the event handler for the "fullscreen" event
         */
        this.attachFullscreen = function (fnEventHandler) {
            oChipInstance.attachFullscreen(fnEventHandler);
        };
    });
});
