// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
], function () {
    "use strict";

    // these constants are exposed through the Personalization prototype

    /**
     * @alias sap.ushell.services.PersonalizationV2.KeyCategory
     * @enum {string}
     *
     * @since 1.124.0
     * @public
     */
    const oKeyCategory = {
        /**
         * A static hard-coded key which does not change. This value is required for caching to take place.
         * @public
         */
        FIXED_KEY: "FIXED_KEY",
        /**
         * For all other cases.
         * @public
         */
        GENERATED_KEY: "GENERATED_KEY"
    };

    /**
     * @alias sap.ushell.services.PersonalizationV2.WriteFrequency
     * @enum {string}
     *
     * @since 1.124.0
     * @public
     */
    const oWriteFrequency = {
        /**
         * @public
         */
        HIGH: "HIGH",
        /**
         * The key is typically rarely updated, for example in explicit table personalization by end users.
         * @public
         */
        LOW: "LOW"
    };


    return {
        keyCategory: oKeyCategory,
        writeFrequency: oWriteFrequency
    };
});
