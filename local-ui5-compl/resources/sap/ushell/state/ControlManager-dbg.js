// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/deepClone",
    "sap/ui/core/Element"
], function (
    deepClone,
    Element
) {
    "use strict";

    /**
     * @alias sap.ushell.state.ControlManager
     * @namespace
     * @description This class handles the lifecycle of controls created by the launchpad.
     * The controls are destroyed in sync with the application lifecycle.
     *
     * @since 1.127.0
     * @private
     */
    class ControlManager {
        /**
         * List of all managed controls.
         * @type {sap.ui.core.ID[]}
         */
        #aAllControls = [];
        /**
         * List of all managed controls in the current state.
         * @type {sap.ui.core.ID[]}
         */
        #aCurrentStateControls = [];
        /**
         * List of all managed controls in the base state.
         * @type {sap.ui.core.ID[]}
         */
        #aBaseStateControls = [];

        /**
         * Adds a control to the list of managed controls.
         * Only controls related to the current state are destroyed.
         * Once a control is added related to the base state, it is not destroyed.
         * @param {sap.ui.core.ID} sId The ID of the control.
         * @param {boolean} bCurrentState Indicates whether the control is in the current state.
         * @param {sap.ushell.state.StateManager.LaunchpadState} [sCurrentLaunchpadState] The current launchpad state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#addManagedControl
         */
        addManagedControl (sId, bCurrentState, sCurrentLaunchpadState) {
            if (!this.#aAllControls.includes(sId)) {
                this.#aAllControls.push(sId);
            }

            // any control that is created while the state is home should is considered as base state control
            if (sCurrentLaunchpadState === "home") {
                bCurrentState = false;
            }

            const bRelatedToBaseStates = this.#aBaseStateControls.includes(sId);
            const bRelatedToCurrentState = this.#aCurrentStateControls.includes(sId);

            if (bCurrentState && !bRelatedToCurrentState) {
                this.#aCurrentStateControls.push(sId);
            } else if (!bCurrentState && !bRelatedToBaseStates) {
                this.#aBaseStateControls.push(sId);
            }
        }

        /**
         * Updates the control in the list of managed controls.
         * Only updates the control if it is already managed.
         * @param {sap.ui.core.ID} sId The ID of the control.
         * @param {boolean} bCurrentState Indicates whether the control is in the current state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#addManagedControl
         */
        updateManagedControl (sId, bCurrentState) {
            if (!this.#aAllControls.includes(sId)) {
                return;
            }

            this.addManagedControl(sId, bCurrentState);
        }

        /**
         * Removes a control from the list of managed controls.
         * @param {sap.ui.core.ID} sId The ID of the control to remove.
         *
         * @since 1.128.0
         * @private
         * @alias sap.ushell.state.ControlManager#removeManagedControl
         */
        removeManagedControl (sId) {
            this.#aAllControls = this.#aAllControls.filter((sControlId) => sControlId !== sId);
            this.#aCurrentStateControls = this.#aCurrentStateControls.filter((sControlId) => sControlId !== sId);
            this.#aBaseStateControls = this.#aBaseStateControls.filter((sControlId) => sControlId !== sId);
        }

        /**
         * Destroys all controls related to the current state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#destroyManagedControls
         */
        destroyManagedControls () {
            this.#aCurrentStateControls.forEach((sId) => {
                if (this.#aBaseStateControls.includes(sId)) {
                    return;
                }
                this.destroyManagedControl(sId);
            });
            this.#aCurrentStateControls = [];
        }

        /**
         * Destroys all controls known to the control manager.
         *
         * @since 1.127.0
         * @private
         */
        #destroyAllManagedControls () {
            // shall only be called during flp destroy
            this.#aAllControls.forEach((sId) => {
                this.destroyManagedControl(sId);
            });
            this.#aAllControls = [];
        }

        /**
         * Destroys the control with the given ID.
         * It does not remove the control from the list of managed controls.
         * @param {sap.ui.core.ID} sId The ID of the control.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#destroyManagedControl
         */
        destroyManagedControl (sId) {
            const oControl = Element.getElementById(sId);
            if (oControl) {
                oControl.destroy();
            }
        }

        /**
         * Stores the list of managed controls in the given storage entry.
         * The stored list is used to restore the controls when the application is restarted.
         *
         * Once an application is stored the related controls are not directly managed anymore.
         * Any other application reusing the same control without keep-alive will destroy the control implicitly on navigation.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#storeList
         */
        storeList (oStorageEntry = {}) {
            oStorageEntry.controlManager = {
                currentControls: deepClone(this.#aCurrentStateControls)
            };
        }

        /**
         * Restores the list of managed controls from the given storage entry.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#restoreList
         */
        restoreList (oStorageEntry = {}) {
            const { currentControls } = oStorageEntry.controlManager || {};
            if (currentControls) {
                this.#aCurrentStateControls = deepClone(currentControls);
            } else {
                this.#aCurrentStateControls = [];
            }
        }

        /**
         * Flushes the list of managed controls.
         * The controls are not destroyed.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#flushList
         */
        flushList () {
            this.#aCurrentStateControls = [];
        }

        /**
         * Destroys the managed controls based on the storage entry.
         * @param {object} oStorageEntry The storage entry.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#destroyFromStorage
         */
        destroyFromStorage (oStorageEntry = {}) {
            const { currentControls } = oStorageEntry.controlManager || {};

            if (Array.isArray(currentControls)) {
                currentControls.forEach((sId) => {
                    this.destroyManagedControl(sId);
                });
            }
        }

        /**
         * ONLY FOR TESTING!
         * Resets the control manager.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#reset
         */
        reset () {
            this.destroy();

            this.#aCurrentStateControls = [];
            this.#aBaseStateControls = [];
        }

        /**
         * Destroys all managed controls.
         * Shall only be called by the state manager.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.ControlManager#destroy
         */
        destroy () {
            this.#destroyAllManagedControls();
        }
    }

    return new ControlManager();

});
