// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Defines a generic interface for extension items in ShellAreas.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (
    AppRuntimeService
) {
    "use strict";
    /**
     * @alias sap.ushell.appRuntime.ui5.services.Extension.Item
     * @class
     * @classdesc Item wrapping an item positioned in an extension point.
     * To be instantiated by {@link sap.ushell.services.Extension}.
     *
     * @hideconstructor
     *
     * @since 1.123.0
     * @private
     */
    class Item {
        #id = null;
        #eventHandlers = null;

        constructor (sId, oEventHandlers) {
            this.#id = sId;
            this.#eventHandlers = oEventHandlers;
        }

        /**
         * Destroys the item and it's related content.
         * @returns {Promise} Resolves once the item was destroyed.
         *
         * @since 1.123.0
         * @private
         */
        async destroy () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.destroy", {
                itemId: this.#id
            });
        }

        /**
         * Shows the item for the current application.
         * The item will be hidden after the user navigates away from this application.
         * The item will <b>not<b> be added again if the user navigates back to the application.
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.123.0
         * @private
         */
        showForCurrentApp () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.showForCurrentApp", {
                itemId: this.#id
            });
            return this;
        }

        /**
         * Hides the item for the current application.
         * Note: The item will not be hidden if it was set visible for all apps {@link #showForAllApps}
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.123.0
         * @private
         */
        hideForCurrentApp () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.hideForCurrentApp", {
                itemId: this.#id
            });
            return this;
        }

        /**
         * Shows the item for all applications.
         * Does not change the visibility of the item for the launchpad "home".
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.123.0
         * @private
         */
        showForAllApps () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.showForAllApps", {
                itemId: this.#id
            });
            return this;
        }

        /**
         * Shows the item for all applications.
         * Does not change the visibility of the item for the launchpad "home".
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.123.0
         * @private
         */
        hideForAllApps () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.hideForAllApps", {
                itemId: this.#id
            });
            return this;
        }

        /**
         * Shows the item for launchpad "home".
         * Does not change the visibility of the item within applications.
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.123.0
         * @private
         */
        showOnHome () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.showOnHome", {
                itemId: this.#id
            });
            return this;
        }

        /**
         * Hides the item for launchpad "home".
         * Does not change the visibility of the item within applications.
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.124.0
         * @private
         */
        hideOnHome () {
            AppRuntimeService.postMessageToFLP("sap.ushell.services.Extension.Item.hideOnHome", {
                itemId: this.#id
            });
            return this;
        }

        /**
         * Handles an event.
         * @param {string} sEventName The event name.
         *
         * @since 1.124.0
         * @private
         */
        handleEvent (sEventName) {
            if (this.#eventHandlers[sEventName]) {
                this.#eventHandlers[sEventName]();
            }
        }
    }

    return Item;
});
