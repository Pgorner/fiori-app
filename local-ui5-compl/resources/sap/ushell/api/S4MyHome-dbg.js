// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Utility functions for S/4 My Home.
 */
sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/ui/core/EventBus",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Container",
    "sap/ushell/utils",
    "sap/ushell/resources" // required for formatDate
], function (
    EventProvider,
    EventBus,
    hasher,
    Container,
    ushellUtils
) {
    "use strict";

    const sHomeRouteName = "home";
    const sHomeHash = "Shell-home";
    var oEventBus = EventBus.getInstance();

    /**
     * @alias sap.ushell.api.S4MyHome#routeMatched
     * @event
     * The <code>routeMatched</code> event is fired, when any flp route matched.
     * The event is used to activate and deactivate tiles on the My Home app and to change the visibility of the My Home specific buttons.
     * @param {sap.ui.base.Event} oEvent
     * @param {sap.ui.base.EventProvider} oEvent.getSource
     * @param {object} oEvent.getParameters
     * @param {boolean} oEvent.getParameters.isMyHomeRoute Whether the current route is the My Home route
     *
     * @since 1.129.0
     * @private
     * @ui5-restricted ux.eng.s4producthomes1
     */

    /**
     * @alias sap.ushell.api.S4MyHome
     * @namespace
     * @description The utility functions for the S/4 My Home app.
     *
     * @since 1.129.0
     * @private
     * @ui5-restricted ux.eng.s4producthomes1
     */
    class S4MyHome {
        #oRouter;
        #bInitialized = false;
        #oEventProvider = new EventProvider();

        #init () {
            if (this.#bInitialized) {
                return;
            }

            this.#bInitialized = true;
            this.#oRouter = Container.getRendererInternal("fiori2").getRouter();
            this.#oRouter.attachRouteMatched(this.#handleRouteMatched.bind(this));

            oEventBus.subscribe("sap.ushell", "navigated", this.#handleShellNavigated, this);
        }

        /**
         * Handles the routeMatched event of the my home route.
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @since 1.129.0
         * @private
         */
        #handleRouteMatched (oEvent) {
            const bIsHomeRoute = oEvent.getParameter("name") === sHomeRouteName;

            this.#oEventProvider.fireEvent("routeMatched", {
                isMyHomeRoute: bIsHomeRoute
            });
        }

        /**
         * Handles the navigated event of the shell.
         *
         * @since 1.130.0
         * @private
         */
        #handleShellNavigated () {
            const sHash = hasher.getHash();
            const bIsHomeHash = sHash === sHomeHash;
            const bFlpManagedHash = this.#oRouter.match(sHash);

            if (!bIsHomeHash && !bFlpManagedHash) { // navigation away from flp routes
                this.#oEventProvider.fireEvent("routeMatched", {
                    isMyHomeRoute: false
                });
            }
            // the event is also fired in the routeMatched handler,
            //    when navigating back to the home route
            //    when navigating to other flp routes
        }

        /**
         * Attaches a handler to the routeMatched event.
         * The event is used to activate and deactivate tiles on the My Home app and to change the visibility of the My Home specific buttons.
         * @param {object} [oData] An application-specific payload object that will be passed to the event handler along with the event object when firing the event.
         * @param {function} fnFunction The handler function to call when the event occurs.
         * @param {object} [oListener] The object that wants to be notified when the event occurs.
         *
         * @since 1.129.0
         * @private
         * @ui5-restricted ux.eng.s4producthomes1
         */
        attachRouteMatched (...args) {
            this.#init();
            this.#oEventProvider.attachEvent("routeMatched", ...args);
        }

        /**
         * Detaches a handler from the routeMatched event.
         * @param {function} fnFunction The handler function to detach from the event.
         * @param {object} [oListener] The object that wanted to be notified when the event occurred.
         *
         * @since 1.129.0
         * @private
         * @ui5-restricted ux.eng.s4producthomes1
         */
        detachRouteMatched (...args) {
            this.#init();
            this.#oEventProvider.detachEvent("routeMatched", ...args);
        }

        /**
         * Formats the date to easy human readable format.
         * @param {string} sCreatedAt a stringified date
         * @returns {string} The formatted date e.g. 'Just now' or '10 minutes ago'
         *
         * @since 1.129.0
         * @private
         * @ui5-restricted ux.eng.s4producthomes1
         */
        formatDate (sCreatedAt) {
            return ushellUtils.formatDate(sCreatedAt);
        }

        /**
         * Resets the state of the API.
         * For testing purposes only.
         *
         * @since 1.129.0
         * @private
         */
        reset () {
            oEventBus.unsubscribe("sap.ushell", "navigated", this.#handleShellNavigated, this);
            this.#oEventProvider.destroy();
            this.#oEventProvider = new EventProvider();
            this.#bInitialized = false;
            this.#oRouter = null;
        }
    }

    return new S4MyHome();
});
