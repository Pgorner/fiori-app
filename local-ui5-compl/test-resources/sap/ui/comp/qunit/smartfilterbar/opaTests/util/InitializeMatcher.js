/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

sap.ui.define([
    'sap/ui/test/matchers/Matcher'
], function (
    Matcher
) {
    "use strict";

    /**
     * @class
     * Ensures a SmartFilterBar is initialized and ready for testing.
     *
     * @extends sap.ui.test.matchers.Matcher
     * @param {object} [mSettings] optional map/JSON-object with initial settings for the new PropertyStrictEquals
     * @private
     * @name sap.ui.comp.qunit.smartfilterbar.opaTests.util.InitializeMatcher
     * @author SAP SE
     */
    return Matcher.extend("sap.ui.comp.qunit.smartfilterbar.opaTests.util.InitializeMatcher",
        /** @lends sap.ui.comp.qunit.smartfilterbar.opaTests.util.InitializeMatcher */ {

        metadata: {
            publicMethods: ["isMatching"],
            properties: {}
        },

        /**
         * Checks if the control has a property that matches the value
         *
         * @param {sap.ui.comp.smartfilterbar.SmartFilterBar} oControl the
         * control that is checked by the matcher
         * @return {boolean} true if the control is initialized and ready.
         * @public
         */
        isMatching: function (oControl) {
            // We wait for the SmartFilterBar to initialise it's metadata so
            // the test will be stable and will not execute on the control
            // first rendering when metadata might not be processed yet.
            // NOTE: This should be done on the first test on this page
            return oControl.isInitialised();
        }
    });
});