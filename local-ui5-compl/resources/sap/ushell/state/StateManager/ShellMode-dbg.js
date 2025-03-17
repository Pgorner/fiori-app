// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
], function (
) {
    "use strict";

    /**
     * @alias sap.ushell.state.StateManager.ShellMode
     * @enum {string}
     *
     * @since 1.127.0
     * @private
     */
    const ShellMode = {
        // ======================== Publicly documented modes ========================

        /**
         * Default mode does not set any restrictions.
         *
         * @since 1.127.0
         * @private
         */
        Default: "",

        /**
         * Removes some standard items from the user action menu.
         *
         * @since 1.127.0
         * @private
         */
        Standalone: "standalone",

        /**
         * Sames as <code>Standalone</code> but without the logo.
         *
         * @since 1.127.0
         * @private
         */
        Embedded: "embedded",

        /**
         * Disables the personalization feature and removes the logo.
         *
         * @since 1.127.0
         * @private
         */
        Merged: "merged",

        /**
         * Disables the header of the launchpad and the personalization feature.
         *
         * @since 1.127.0
         * @private
         */
        Headerless: "headerless",

        // ======================== Technical modes ========================

        /**
         * Same as <code>Default</code> but with some changes to the loading behavior.
         *
         * @since 1.127.0
         * @private
         */
        Lean: "lean",

        /**
         * Disables the personalization feature.
         *
         * @since 1.127.0
         * @private
         */
        Blank: "blank",

        /**
         * Same as <code>Default</code> but only shows the back navigation once there is a custom back navigation.
         *
         * @since 1.127.0
         * @private
         */
        Minimal: "minimal"
    };

    return ShellMode;
});
