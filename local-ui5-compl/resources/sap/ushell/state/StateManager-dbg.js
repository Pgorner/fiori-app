// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ushell/state/BaseState",
    "sap/ushell/state/ControlManager",
    "sap/ushell/state/CurrentState",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateRules",
    "sap/ushell/state/StateManager/LaunchpadState",
    "sap/ushell/state/StateManager/Operation",
    "sap/ushell/state/StateManager/ShellMode",
    "sap/ushell/utils"
], function (
    Log,
    Config,
    BaseState,
    ControlManager,
    CurrentState,
    ShellModel,
    StateRules,
    LaunchpadState,
    Operation,
    ShellMode,
    ushellUtils
) {
    "use strict";

    const {
        Default,
        Standalone,
        Lean,
        Minimal
    } = ShellMode;

    /**
     * @typedef {string} sap.ushell.state.StateManager.Path
     * A dot separated path to a property in the state model.
     * It follows the same definition as the path in {@link sap.base.util.ObjectPath}.
     *
     * @since 1.127.0
     * @private
     */

    /**
     * @typedef {object} sap.ushell.state.StateManager.PendingChange
     * A pending change to be applied or discarded later.
     * @property {function} handler The handler function to call.
     * @property {function} [flushHandler] The flush handler function to call.
     * @property {any[]} args The arguments to pass to the handler.
     *
     * @see sap.ushell.state.StateManager.stallChanges
     * @see sap.ushell.state.StateManager.applyStalledChanges
     * @see sap.ushell.state.StateManager.discardStalledChanges
     *
     * @since 1.127.0
     * @private
     */

    /**
     * @alias sap.ushell.state.StateManager
     * @namespace
     * @description Interface for managing the state of the shell.
     * The state consists of the current state and the base state.
     *
     * @since 1.127.0
     * @private
     */
    class StateManager {
        /**
         * The base state of the shell.
         * @type {object}
         */
        #oModelProperties = ushellUtils.deepFreeze({
            sidePane: {
                visible: false,
                items: []
            },
            toolArea: {
                visible: false,
                items: []
            },
            rightFloatingContainer: {
                visible: false,
                items: []
            },
            floatingContainer: {
                visible: false,
                state: "floating",
                dragSelector: "",
                items: []
            },
            userActions: {
                items: []
            },
            floatingActions: {
                items: []
            },
            header: {
                visible: true,
                home: {
                    showLogo: false
                },
                secondTitle: "",
                headItems: [],
                centralAreaElement: null,
                headEndItems: []
            },
            subHeader: {
                items: []
            },
            footer: {
                content: ""
            },
            application: {
                title: "",
                icon: "",
                subTitle: "",
                relatedApps: [],
                hierarchy: []
            }
        });

        /**
         * Whether the StateManager is initialized.
         * @type {boolean}
         */
        #bInitialized = false;
        /**
         * The launchpad state of the shell.
         * @type {sap.ushell.state.StateManager.LaunchpadState}
         */
        #sLaunchpadState = LaunchpadState.Home;
        /**
         * The default shell mode defined by the configuration or URL parameter.
         * @type {sap.ushell.state.StateManager.ShellMode}
         */
        #sDefaultShellMode = ShellMode.Default;
        /**
         * The current shell mode.
         * @type {sap.ushell.state.StateManager.ShellMode}
         */
        #sShellMode = ShellMode.Default;
        /**
         * The base state of the shell.
         * @type {sap.ushell.state.BaseState}
         */
        #oBaseState = null;
        /**
         * The current state of the shell.
         * @type {sap.ushell.state.CurrentState}
         */
        #oCurrentState = CurrentState; // store current state for easy debugging

        /**
         * Prevents model updates during batch changes.
         * @type {boolean}
         */
        #bPreventModelUpdate = false;

        /**
         * Whether changes are stalled and should not be applied directly.
         * Changes are stored and can be applied or discarded later.
         * @type {boolean}
         */
        #bStallChanges = false;
        /**
         * The list of pending changes to be applied or discarded later.
         * @type {sap.ushell.state.StateManager.PendingChange[]}
         */
        #aPendingChanges = [];

        // Expose Enums
        LaunchpadState = LaunchpadState;
        ShellMode = ShellMode;
        Operation = Operation;

        constructor () {
            this.#constructorCallback();
        }

        /**
         * Initializes the StateManager.
         *
         * @private
         */
        #constructorCallback () {
            const sInitialShellMode = this.#getInitialShellMode();
            this.#sShellMode = sInitialShellMode;
            this.#sDefaultShellMode = sInitialShellMode;
            // initialize based on current hash
            this.#sLaunchpadState = ushellUtils.isFlpHomeIntent() ? LaunchpadState.Home : LaunchpadState.App;

            this.#oBaseState = new BaseState(this.#oModelProperties);
            this.#oCurrentState.attachStateChange(this.#updateModel, this);

            // initialize model with all properties
            this.#updateModel();
        }

        /**
         * Initializes the StateManager.
         * @param {object} oShellConfig The configuration of the shell view.
         * @throws {Error} if the StateManager is already initialized.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#init
         */
        init (oShellConfig) {
            if (this.#bInitialized) {
                throw new Error("State Manager is already initialized!");
            }

            this.#bInitialized = true;

            StateRules.setShellConfig(oShellConfig);
        }

        /**
         * Returns the current shell mode.
         * @returns {sap.ushell.state.StateManager.ShellMode} The current shell mode.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#getShellMode
         */
        getShellMode () {
            return this.#sShellMode;
        }

        /**
         * Returns the current launchpad state.
         * @returns {sap.ushell.state.StateManager.LaunchpadState} The current launchpad state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#getLaunchpadState
         */
        getLaunchpadState () {
            return this.#sLaunchpadState;
        }

        /**
         * Switches the state of the shell.
         * When the state is switched, the model is recalculated and updated.
         * If no shell mode is provided, the default shell mode is used again.
         * @param {sap.ushell.state.StateManager.LaunchpadState} sLaunchpadState The new launchpad state.
         * @param {sap.ushell.state.StateManager.ShellMode} [sShellModeOverride] The new shell mode.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#switchState
         */
        switchState (sLaunchpadState, sShellModeOverride) {
            this.#validateLaunchpadState(sLaunchpadState);

            // ShellMode might be overridden based on app type
            // default to the url parameter
            const sShellMode = sShellModeOverride ?? this.#sDefaultShellMode;

            this.#validateShellMode(sShellMode);

            this.#sShellMode = sShellMode;
            this.#sLaunchpadState = sLaunchpadState;

            this.#updateModel();
        }

        /**
         * Updates the base state of the shell.
         * @param {sap.ushell.state.StateManager.LaunchpadState[]} aLaunchpadStates The list of launchpad states to update.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property to update.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation to perform.
         * @param {any} vValue The value to set.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#updateBaseStates
         */
        updateBaseStates (aLaunchpadStates, sPath, sOperation, vValue) {
            this.#validateOperation(sOperation);
            this.#validateLaunchpadStateList(aLaunchpadStates);

            if (this.#bStallChanges) {
                this.#aPendingChanges.push({
                    handler: this.updateBaseStates.bind(this),
                    args: arguments
                });
                return;
            }

            aLaunchpadStates.forEach((sLaunchpadState) => {
                this.#oBaseState.updateState(sLaunchpadState, sPath, sOperation, vValue);
            });

            this.#updateModel();
        }

        /**
         * Updates the base state of the shell for all launchpad states.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property to update.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation to perform.
         * @param {any} vValue The value to set.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#updateAllBaseStates
         */
        updateAllBaseStates (sPath, sOperation, vValue) {
            this.updateBaseStates(Object.values(LaunchpadState), sPath, sOperation, vValue);
        }

        /**
         * Updates the current state of the shell.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the property to update.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation to perform.
         * @param {any} vValue The value to set.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#updateCurrentState
         */
        updateCurrentState (sPath, sOperation, vValue) {
            this.#validateOperation(sOperation);

            if (this.#bStallChanges) {
                this.#aPendingChanges.push({
                    handler: this.updateCurrentState.bind(this),
                    args: arguments
                });
                return;
            }

            this.#oCurrentState.updateState(sPath, sOperation, vValue);

            this.#updateModel();
        }

        /**
         * Updates only the provided path and its sub paths.
         * Alternative to the {@link sap.ui.model.Model#refresh} method.
         * @param {sap.ushell.state.StateManager.Path} sPath The path to the data that should be refreshed.
         *
         * @since 1.130.0
         * @private
         */
        refreshState (sPath) {
            const oModel = ShellModel.getModel();
            const aBindings = oModel.getBindings();
            const sBindingPath = `/${sPath.replace(/\./g, "/")}`;

            const aRelevantBindings = aBindings.filter((oBinding) => {
                const sResolvedPath = oBinding.getResolvedPath();
                if (!sResolvedPath) {
                    // the binding is not resolved (yet).
                    // e.g. relative binding before parent context is set
                    return false;
                }
                return sResolvedPath.startsWith(sBindingPath);
            });

            aRelevantBindings.forEach(function (oBinding) {
                oBinding.refresh(true);
            });
        }

        /**
         * Adds a control to the list of managed controls.
         * Managed controls are destroyed in sync with the application.
         * @param {sap.ui.core.ID} sId The ID of the control to add.
         * @param {boolean} [bForBaseState] Whether the control is related to the base state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#addManagedControl
         */
        addManagedControl (sId, bForBaseState) {
            if (this.#bStallChanges) {
                this.#aPendingChanges.push({
                    handler: this.addManagedControl.bind(this),
                    flushHandler: (sId, bForBaseState) => {
                        ControlManager.destroyManagedControl(sId);
                    },
                    args: arguments
                });
                return;
            }

            ControlManager.addManagedControl(sId, !bForBaseState, this.#sLaunchpadState);
        }

        /**
         * Updates a control in the list of managed controls.
         * Only updates a control if it is already managed.
         * @param {sap.ui.core.ID} sId The ID of the control to add.
         * @param {boolean} [bForBaseState] Whether the control is related to the base state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#updateManagedControl
         */
        updateManagedControl (sId, bForBaseState) {
            if (this.#bStallChanges) {
                this.#aPendingChanges.push({
                    handler: this.updateManagedControl.bind(this),
                    args: arguments
                });
                return;
            }

            ControlManager.updateManagedControl(sId, !bForBaseState);
        }

        /**
         * Removes a control from the list of managed controls.
         * @param {sap.ui.core.ID} sId The ID of the control to remove.
         *
         * @since 1.128.0
         * @private
         * @alias sap.ushell.state.StateManager#removeManagedControl
         */
        removeManagedControl (sId) {
            if (this.#bStallChanges) {
                this.#aPendingChanges.push({
                    handler: this.removeManagedControl.bind(this),
                    args: arguments
                });
                return;
            }

            ControlManager.removeManagedControl(sId);
        }

        /**
         * Destroys all managed controls related to the current state.
         * Controls which are related to the base state are not destroyed.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#destroyManagedControls
         */
        destroyManagedControls () {
            ControlManager.destroyManagedControls();
        }

        /**
         * Recalculates the model.
         *  1. Fetches the state data from the base state.
         *  2. Applies the current state.
         *  3. Applies the state rules.
         *  4. Updates the shell model.
         *
         * Skips recalculating the model if changes are stalled.
         *
         * @since 1.127.0
         * @private
         */
        #updateModel () {
            // prevent model updates when suspended
            if (this.#bStallChanges || this.#bPreventModelUpdate) {
                return;
            }

            const oStateData = this.#oBaseState.getStateData(this.#sShellMode, this.#sLaunchpadState);

            this.#oCurrentState.applyState(oStateData);

            StateRules.applyRules(oStateData, this.#sShellMode, this.#sLaunchpadState);

            ShellModel.updateModel(oStateData);
        }

        /**
         * Calculates the initial shell mode based on the URL parameters and configuration.
         * @returns {sap.ushell.state.StateManager.ShellMode} The initial shell mode.
         *
         * @since 1.127.0
         * @private
         */
        #getInitialShellMode () {
            let sShellMode;
            const oSearchParams = new URLSearchParams(window.location.search);

            if (oSearchParams.has("sap-ushell-config")) {
                sShellMode = oSearchParams.get("sap-ushell-config");
            } else {
                sShellMode = Config.last("/core/state/shellMode");

                /**
                 * code shall be automatically removed by tooling
                 * @deprecated since 1.120.0
                 */
                (() => {
                    if (oSearchParams.has("appState")) {
                        sShellMode = oSearchParams.get("appState");
                        if (sShellMode) {
                            Log.error("URL parameter 'appState' is given, but deprecated. Please use 'sap-ushell-config' instead!", "sap.ushell.renderer.Renderer");
                        }
                    } else {
                        sShellMode = Config.last("/core/state/shellMode");
                    }
                })();
            }

            sShellMode = sShellMode?.toLowerCase() ?? ShellMode.Default;

            try {
                this.#validateShellMode(sShellMode);
            } catch (oError) {
                Log.error(`Error occurred during validation: "${oError.message}", Defaulting to default ShellMode`);
                sShellMode = ShellMode.Default;
            }

            return sShellMode;
        }

        /**
         * Stops all changes from being applied directly. Instead, they are stored and can be applied or discarded later.
         * This is useful when the application is not yet fully initialized and changes should not be applied yet.
         * In case of successful initialization, the changes can be applied using {@link sap.ushell.state.StateManager#applyStalledChanges}.
         * In case of failure, the changes can be discarded using {@link sap.ushell.state.StateManager#discardStalledChanges}.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#stallChanges
         */
        stallChanges () {
            this.#bStallChanges = true;
        }

        /**
         * Applies all pending changes and continues regular processing.
         * Calls the handler of each pending change.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#applyStalledChanges
         */
        applyStalledChanges () {
            // continue regular processing
            this.#bStallChanges = false;

            this.#bPreventModelUpdate = true;

            this.#aPendingChanges.forEach(({ handler, args }) => {
                handler(...args);
            });
            this.#aPendingChanges = [];

            this.#bPreventModelUpdate = false;

            // update model after applying all pending changes
            this.#updateModel();
        }

        /**
         * Discards all pending changes and continues regular processing.
         * Calls the flushHandler of each pending change.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#discardStalledChanges
         */
        discardStalledChanges () {
            // continue regular processing
            this.#bStallChanges = false;

            this.#aPendingChanges.forEach(({ flushHandler, args }) => {
                if (flushHandler) {
                    flushHandler(...args);
                }
            });
            this.#aPendingChanges = [];
        }

        /**
         * ONLY FOR TESTING!
         * Resets the StateManager to its initial state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#reset
         */
        reset () {
            this.#oCurrentState.detachStateChange(this.#updateModel, this);

            this.#constructorCallback();

            // reset flags
            this.#bInitialized = false;
            this.#bPreventModelUpdate = false;
            this.#bStallChanges = false;
            this.#aPendingChanges = [];
        }

        /**
         * ONLY FOR TESTING!
         * Resets the StateManager and all related dependencies.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#resetAll
         */
        resetAll () {
            this.reset();
            StateRules.reset();
            ControlManager.reset();
            ShellModel.reset();
            this.#oCurrentState.reset();
        }

        /**
         * Calls the destroy routine of the StateManager and all its dependencies.
         *
         * since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#destroy
         */
        destroy () {
            this.#oCurrentState.detachStateChange(this.#updateModel, this);
            this.#oCurrentState.destroy();
            ShellModel.destroy();
            ControlManager.destroy();
        }

        /**
         * Validates a shell mode.
         * @param {sap.ushell.state.StateManager.ShellMode} sShellMode The shell mode to validate.
         * @throws {Error} if the shell mode is invalid.
         *
         * @since 1.127.0
         * @private
         */
        #validateShellMode (sShellMode) {
            if (!Object.values(ShellMode).includes(sShellMode)) {
                throw new Error(`Invalid shell mode: ${sShellMode}`);
            }
        }

        /**
         * Validates an operation.
         * @param {sap.ushell.state.StateManager.Operation} sOperation The operation to validate.
         * @throws {Error} if the operation is invalid.
         *
         * @since 1.127.0
         * @private
         */
        #validateOperation (sOperation) {
            if (!Object.values(Operation).includes(sOperation)) {
                throw new Error(`Invalid operation: ${sOperation}`);
            }
        }

        /**
         * Validates a launchpad state.
         * @param {sap.ushell.state.StateManager.LaunchpadState} sLaunchpadState The launchpad state to validate.
         * @throws {Error} if the launchpad state is invalid.
         *
         * @since 1.127.0
         * @private
         */
        #validateLaunchpadState (sLaunchpadState) {
            if (!Object.values(LaunchpadState).includes(sLaunchpadState)) {
                throw new Error(`Invalid launchpad state: ${sLaunchpadState}`);
            }
        }

        /**
         * Validates a list of launchpad states.
         * @param {sap.ushell.state.StateManager.LaunchpadState[]} aLaunchpadStates The list of launchpad states to validate.
         * @throws {Error} if the launchpad states are invalid.
         *
         * @since 1.127.0
         * @private
         */
        #validateLaunchpadStateList (aLaunchpadStates) {
            if (!Array.isArray(aLaunchpadStates)) {
                throw new Error("Launchpad states must be provided as an array!");
            }
            if (aLaunchpadStates.length === 0) {
                throw new Error("No launchpad states provided!");
            }
            aLaunchpadStates.forEach((sLaunchpadState) => {
                this.#validateLaunchpadState(sLaunchpadState);
            });
        }

        /**
         * The legacy state management did not have dedicated home states for
         * all LaunchpadState.Home and ShellMode combinations. Some were combined
         * together in a legacy "home" state.
         * @returns {boolean} Whether the current state is a legacy home state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateManager#isLegacyHome
         */
        isLegacyHome () {
            if (this.getLaunchpadState() !== LaunchpadState.Home) {
                return false;
            }

            // Previously the states resulted in the stateName "home" for the home state and not in
            // a dedicated state (e.g. embedded-home)
            const aUnmappedHomeStates = [
                Default,
                Standalone,
                Lean,
                Minimal
            ];

            return aUnmappedHomeStates.includes(this.getShellMode());
        }
    }

    return new StateManager();

});
