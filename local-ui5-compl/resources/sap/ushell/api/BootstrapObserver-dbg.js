// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Helper for sap.fl library to attach to FLP's bootstrap in cases where an FLP is expected to boot.
 */
sap.ui.define([
    "sap/base/util/Deferred"
    // DO NOT MAINTAIN ANY USHELL-LIB DEPENDENCIES! Only UI5 Core dependencies allowed...
], function (
    Deferred
) {
    "use strict";

    /**
     * @alias sap.ushell.api.BootstrapObserver
     * @namespace
     * @description  sap.fl wants to get notified when a FLP is bootstrapped.
     * However, fl lib might also be used without sap/ushell at all. Therefore, they need
     * a solution independent of an actual Container (sap.ui.require("sap/ushell/Container")
     * would not work as fl couldn't be sure that Container isn't instanciated later...).
     *
     * @since 1.130.0
     * @private
     * @ui5-restricted sap.fl
     */
    class BootstrapObserver {

        static #oReadyDeferred = new Deferred();

        /**
         * Sets the bootstrapped Container and resolves the ready promise.
         * To be called by the created sap.ushell.Container only.
         *
         * @private
         *
         * @param {sap.ushell.Container} oContainer The sap/ushell/Container instanced that got bootstrapped.
         */
        static resolveBootstrappedContainer (oContainer) {
            BootstrapObserver.#oReadyDeferred.resolve(oContainer);
        }

        /**
         * Returns a ready promise that resolves as soon as a Container
         * instance has been created and bootstrapped.
         *
         * @private
         * @ui5-restricted sap.fl
         *
         * @returns {Promise<sap.ushell.Container>} Promise that resolves the bootstrapped Container.
         */
        static async ready () {
            return BootstrapObserver.#oReadyDeferred.promise;
        }

        static __reset () {
            BootstrapObserver.#oReadyDeferred = new Deferred();
        }
    }

    return BootstrapObserver;
});
