// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function (
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StateManager.LaunchpadState
     * @enum {string}
     *
     * @since 1.127.0
     * @private
     */
    const LaunchpadState = {
        /**
         * Describes any view that is considered a home view.
         *  - Classic Homepage
         *  - Pages Runtime
         *  - (Custom)MyHome
         *
         * @since 1.127.0
         * @private
         */
        Home: "home",

        /**
         * Describes any view that is NOT a home view.
         * - App Finder
         * - Search
         * - Applications
         *
         * @since 1.127.0
         * @private
         */
        App: "app"
    };

    return LaunchpadState;
});
