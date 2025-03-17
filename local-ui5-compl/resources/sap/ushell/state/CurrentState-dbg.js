// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/base/EventProvider",
    "sap/ushell/state/StrategyFactory"
], function (
    deepClone,
    EventProvider,
    StrategyFactory
) {
    "use strict";

    /**
     * @typedef {object} sap.ushell.state.CurrentState.Command
     * A command that should be executed to update the state.
     * @property {sap.ushell.state.StateManager.Path} path The path to the property that should be updated.
     * @property {sap.ushell.state.StateManager.Operation} operation The operation that should be performed.
     * @property {any} value The value that should be set.
     *
     * @since 1.127.0
     * @private
     */

    /**
     * @alias sap.ushell.state.CurrentState
     * @namespace
     * @description This class manages the current state of applications.
     *
     * @since 1.127.0
     * @private
     */
    class CurrentState {
        /**
         * The list of commands that should be executed to update the state.
         * @type {sap.ushell.state.CurrentState.Command[]}
         */
        #aCommandList = [];
        /**
         * The event provider that is used to notify listeners about state changes.
         * @type {sap.ui.base.EventProvider}
         */
        #oEventProvider = new EventProvider();

        /**
         * Attaches an event handler to the state change event.
         * The handler is called when the state changes e.g. when the state is restored or flushed.
         * @param {object} oData An object that will be passed to the handler along with the event object when the event is fired
         * @param {function} fnHandler The handler function to call when the event occurs.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#attachStateChange
         */
        attachStateChange (...args) {
            this.#oEventProvider.attachEvent("stateChange", ...args);
        }

        /**
         * Detaches an event handler from the state change event.
         * @param {function} fnHandler The handler function.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#detachStateChange
         */
        detachStateChange (...args) {
            this.#oEventProvider.detachEvent("stateChange", ...args);
        }

        /**
         * Updates the state with the given operation and value.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property that should be updated.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation that should be performed.
         * @param {any} vValue The value that should be set.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#updateState
         */
        updateState (sPath, sOperation, vValue) {
            this.#aCommandList.push({
                path: sPath,
                value: vValue,
                operation: sOperation
            });
        }

        /**
         * Flushes the state and prepares it for a new current state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#flushState
         */
        flushState () {
            this.#aCommandList = [];
            this.#oEventProvider.fireEvent("stateChange");
        }

        /**
         * Stores the current state in the given storage entry.
         * The stored state is used to restore the state when the application is restarted.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#storeState
         */
        storeState (oStorageEntry) {
            oStorageEntry.currentState = {
                commandList: deepClone(this.#aCommandList)
            };
        }

        /**
         * Restores the state from the given storage entry.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#restoreState
         */
        restoreState (oStorageEntry) {
            const { commandList } = oStorageEntry.currentState || {};
            if (commandList) {
                this.#aCommandList = deepClone(commandList);
            } else {
                this.#aCommandList = [];
            }
            this.#oEventProvider.fireEvent("stateChange");
        }

        /**
         * Applies the current state to the given state data.
         * The current state is applied in-place.
         * @param {object} oStateData The state data.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#applyState
         */
        applyState (oStateData) {
            this.#aCommandList.forEach(({ path, value, operation }) => {
                StrategyFactory.perform(oStateData, path, operation, value);
            });
        }

        /**
         * ONLY FOR TESTING!
         * Resets the current state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#reset
         */
        reset () {
            this.destroy();

            this.#aCommandList = [];
            this.#oEventProvider = new EventProvider();
        }

        /**
         * Destroys the current state.
         * Should only be called by the state manager.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.CurrentState#destroy
         */
        destroy () {
            this.#oEventProvider.destroy();
        }
    }

    return new CurrentState();
});
