// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The <code>search</code> contract.
 */
sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Chip",
    "sap/ushell_abap/pbServices/ui2/Error",
    "sap/ushell_abap/pbServices/ui2/Utils"
], function (
    Chip,
    SrvcError,
    Utils
) {
    "use strict";

    /**
     * @namespace chip.search
     * @description The namespace for the CHIP API's <code>search</code> contract with
     * CHIP search-related functionality. With this contract, the CHIP can provide CHIP-specific
     * search keywords. In addition, it can highlight words from the search in its UI.
     * @since 1.11.0
     */
    Chip.addContract("search", function (oChipInstance) {
        var fnHighlight,
            aKeywords;

        /**
         * Determines specific keywords with which the CHIP wants to be found in a search over all
         * CHIPs from the page builder. If not set, the page builder executing a CHIP search can only
         * search based on CHIP metadata like the CHIP title.
         *
         * @name chip.search.setKeywords
         * @function
         * @since 1.11.0
         * @param {string[]} aNewKeywords
         *   the keywords of this CHIP
         */
        this.setKeywords = function (aNewKeywords) {
            if (!Utils.isArray(aNewKeywords)) {
                throw new SrvcError("Not an array: " + aNewKeywords, "chip.search");
            }
            aKeywords = aNewKeywords.slice();
        };

        /**
         * Attaches the given event handler to the "highlight" event which is fired whenever the user
         * executes a search over all CHIPs using specific search terms. The event handler takes a
         * string array as parameter, containing the highlight words. These are derived from the
         * search terms. The CHIP can then highlight these in its UI.
         *
         * @name chip.search.attachHighlight
         * @function
         * @since 1.11.0
         * @param {function(string[])} fnEventHandler
         *   event handler for highlighting words in the CHIP UI which takes a string array with the
         *   highlight words as parameter
         */
        this.attachHighlight = function (fnEventHandler) {
            if (typeof fnEventHandler !== "function") {
                throw new SrvcError("Not a function: " + fnEventHandler,
                    "chip.search");
            }
            fnHighlight = fnEventHandler;
        };

        /**
         * @namespace contract.search
         * @description The namespace for the contract interface (to be used by a page builder) for
         * the <code>search</code> contract. This contract interface allows the pagebuilder to get
         * the CHIP-specific search keywords. In addition, it can have the CHIP highlight words
         * in its UI based on the search terms used.
         * @since 1.11.0
         */
        return {
            /**
             * Returns the CHIP-specific search keywords.
             *
             * @name contract.search.getKeywords
             * @function
             * @since 1.11.0
             * @returns {string[]}
             *   CHIP-specific search keywords. Empty array if the CHIP has not set any keywords.
             *
             * @see chip.search.setKeywords
             */
            getKeywords: function () {
                return aKeywords ? aKeywords.slice() : [];
            },

            /**
             * Fires the "highlight" event which takes a string array with the words to
             * be highlighted as parameters.
             *
             * @name contract.search.fireHighlight
             * @function
             * @since 1.11.0
             * @param {string[]} aHighlightWords
             *   words to be highlighted
             *
             * @see chip.search.attachHighlight
             */
            fireHighlight: function (aHighlightWords) {
                if (fnHighlight) {
                    fnHighlight(aHighlightWords);
                }
            }
        };
    });
});
