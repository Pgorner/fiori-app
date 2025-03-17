// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/state/ControlManager",
    "sap/ushell/state/CurrentState"
], function (
    ControlManager,
    CurrentState
) {
    "use strict";

    /**
     * @alias sap.ushell.state.KeepAlive
     * @namespace
     * @description This module is a facade for the keep-alive mechanism in the state management.
     *
     * @since 1.127.0
     * @private
     */
    class KeepAlive {
        /**
         * Stores the current state of the application.
         * The stored state is used to restore the application when it is restarted.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.KeepAlive#store
         */
        store (oStorageEntry) {
            CurrentState.storeState(oStorageEntry);
            // Store controls list and empty it afterwards because the keep-alive app still need them in future
            ControlManager.storeList(oStorageEntry);
        }

        /**
         * Restores the state of the application.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.KeepAlive#restore
         */
        restore (oStorageEntry) {
            CurrentState.restoreState(oStorageEntry);
            ControlManager.restoreList(oStorageEntry);
        }

        /**
         * Flushes the current state of the application.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.KeepAlive#flush
         */
        flush () {
            CurrentState.flushState();
            ControlManager.flushList();
        }

        /**
         * Destroys the managed controls based on the storage entry.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.KeepAlive#destroy
         */
        destroy (oStorageEntry) {
            ControlManager.destroyFromStorage(oStorageEntry);
        }
    }

    return new KeepAlive();
});
