// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ushell/state/StrategyFactory",
    "sap/ushell/state/StateManager/LaunchpadState"
], function (
    deepClone,
    StrategyFactory,
    LaunchpadState
) {
    "use strict";

    /**
     * @alias sap.ushell.state.BaseState
     * @class
     * @classdesc Manages the base state data.
     *
     * @since 1.127.0
     * @private
     */
    class BaseState {
        /**
         * A map of all state data.
         * @type {Object<sap.ushell.state.StateManager.LaunchpadState, object>}
         */
        #oStateData = {};

        /**
         * Constructor for BaseState.
         * @param {object} oModelProperties The model properties.
         */
        constructor (oModelProperties) {
            Object.values(LaunchpadState).forEach((sLaunchpadState) => {
                this.#oStateData[sLaunchpadState] = deepClone(oModelProperties);
            });
        }

        /**
         * Updates the base state.
         * @param {sap.ushell.state.StateManager.LaunchpadState|null} sLaunchpadState The launchpad state.
         * If null is provided, the operation is performed on all states.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property that should be updated.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation that should be performed.
         * @param {any} vValue The value that should be set.
         *
         * @since 1.127.0
         * @private
         */
        updateState (sLaunchpadState, sPath, sOperation, vValue) {
            // add to all states if undefined or null
            if (!sLaunchpadState) {
                Object.keys(this.#oStateData).forEach((sState) => {
                    StrategyFactory.perform(this.#oStateData[sState], sPath, sOperation, vValue);
                });
                return;
            }
            StrategyFactory.perform(this.#oStateData[sLaunchpadState], sPath, sOperation, vValue);
        }

        /**
         * Returns the state data for the given shell mode and launchpad state.
         * @param {sap.ushell.state.StateManager.ShellMode} sShellMode The shell mode.
         * @param {sap.ushell.state.StateManager.LaunchpadState} sLaunchpadState The launchpad state.
         * @returns {object} The cloned state data.
         *
         * @since 1.127.0
         * @private
         */
        getStateData (sShellMode, sLaunchpadState) {
            const oClonedState = deepClone(this.#oStateData[sLaunchpadState]);

            return oClonedState;
        }
    }

    return BaseState;

});
