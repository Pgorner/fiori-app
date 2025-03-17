// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Utility functions for the New Experience switch of the shell header.
 */
sap.ui.define([
    "sap/ui/base/EventProvider",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/api/NewExperience/CustomOverflowListItem"
], function (
    EventProvider,
    JSONModel,
    CustomOverflowListItem
) {
    "use strict";

    const STATES = {
        Header: "Header",
        Overflow: "Overflow"
    };

    /**
     * @alias sap.ushell.api.NewExperience
     * @namespace
     * @description The New Experience API provides a way of embedding a switch in the shell header to allow switching apps to their "New Version".
     * The expected behavior is that, once the switch is enabled, navigation to the predecessor (old) app shall be redirected to the successor (new) app.
     * Note that this switch behavior is not implemented by the shell itself, which only places the switch control in the shell header.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted ux.eng.newexperience
     */
    class NewExperience {
        #eventProvider = new EventProvider();
        #shellHeaderControl = null;
        #overflowControl = null;
        #model = null;

        constructor () {
            this.#initModel();
            this.#overflowControl = this.#createOverflowControl();
        }

        /**
         * Resets the New Experience API.
         * Shall only used by tests.
         *
         * @since 1.124.0
         * @private
         */
        reset () {
            this.#model.destroy();
            this.#eventProvider.destroy();
            this.#overflowControl.destroy();

            this.#eventProvider = new EventProvider();
            this.#shellHeaderControl = null;
            this.#initModel();
            this.#overflowControl = this.#createOverflowControl();
        }

        /**
         * Initializes the model.
         *
         * @since 1.124.0
         * @private
         */
        #initModel () {
            this.#model = new JSONModel({
                active: false,
                isVisible: false,
                currentState: STATES.Header,
                shellHeaderControlId: null,

                // used in the shell header
                showInShellHeader: false
            });
        }

        /**
         * Creates the overflow control.
         * The overflow control is a list item that wraps the shell header control.
         * @returns {sap.ushell.api.NewExperience.CustomOverflowListItem} The overflow control
         *
         * @since 1.124.0
         * @private
         */
        #createOverflowControl () {
            return new CustomOverflowListItem({
                visible: {
                    parts: ["/isVisible", "/currentState"],
                    formatter: (bIsVisible, sCurrentState) => bIsVisible && (sCurrentState === STATES.Overflow)
                },
                contentId: "{/shellHeaderControlId}"
            })
                .addStyleClass("newExperienceSwitchListItem")
                .setModel(this.#model)
                .data("help-id", "ushell-new-experience-switch", true);
        }

        /**
         * Returns the model.
         * @returns {sap.ui.model.json.JSONModel} The model
         *
         * @since 1.124.0
         * @private
         */
        getModel () {
            return this.#model;
        }

        /**
         * Returns the generic item id for the new experience button.
         * Note: this id is not the control id, but some placeholder to get the sorting right.
         * @returns {string} The item id
         *
         * @since 1.124.0
         * @private
         */
        getOverflowItemId () {
            return this.#overflowControl.getId();
        }

        /**
         * Is true when a control was set.
         * Can be used to determine if the switch should be rendered.
         * Note: this does not mean that the switch is actually visible.
         * @returns {boolean} Whether the switch is active
         *
         * @since 1.124.0
         * @private
         */
        isActive () {
            return this.#model.getProperty("/active");
        }

        /**
         * Returns the switch control.
         * @returns {sap.ui.core.Control} The switch control
         *
         * @since 1.124.0
         * @private
         */
        getShellHeaderControl () {
            return this.#shellHeaderControl;
        }

        /**
         * Returns the overflow item control.
         * The overflow item is wrapping the shell header control.
         * @returns {sap.m.ListItemBase} The overflow item control
         *
         * @since 1.124.0
         * @private
         */
        getOverflowItemControl () {
            return this.#overflowControl;
        }

        /**
         * Shows the switch control in the overflow and hides it in the shell header.
         *
         * @since 1.124.0
         * @private
         */
        showInOverflow () {
            this.#model.setProperty("/currentState", STATES.Overflow);

            this.#updateShellHeaderVisibility();
        }

        /**
         * Shows the switch control in the shell header and hides it in the overflow.
         *
         * @since 1.124.0
         * @private
         */
        showInShellHeader () {
            this.#model.setProperty("/currentState", STATES.Header);

            this.#updateShellHeaderVisibility();
        }

        /**
         * Registers a handler for the "activeChanged" event.
         *
         * @private
         * @since 1.124.0
         */
        attachActiveChanged (...args) {
            this.#eventProvider.attachEvent("activeChanged", ...args);
        }

        /**
         * Deregisters a handler for the "activeChanged" event.
         *
         * @since 1.124.0
         * @private
         */
        detachActiveChanged (...args) {
            this.#eventProvider.detachEvent("activeChanged", ...args);
        }

        /**
         * Updates the visibility of the switch control both in the shell header and its overflow.
         * Applies the active state and the current state (header or overflow) and stores it into the model.
         *
         * @since 1.124.0
         * @private
         */
        #updateShellHeaderVisibility () {
            const bActive = this.isActive();
            const bInHeaderState = this.#model.getProperty("/currentState") === STATES.Header;

            if (bActive) {
                this.#model.setProperty("/showInShellHeader", bInHeaderState);
            } else {
                this.#model.setProperty("/showInShellHeader", false);
            }
        }

        /**
         * Sets the switch control.
         * In the shell header, the switch control is placed directly "as is".
         * In the shell header overflow, the switch control is wrapped.
         * Because of this wrapping, whenever toggling the visibility of the switch control, it is also necessary to call {@link #setSwitchVisibility}.
         * @param {sap.ui.core.Control} oShellHeaderControl The shell header switch control
         *
         * @since 1.124.0
         * @private
         * @ui5-restricted ux.eng.newexperience
         * @alias sap.ushell.api.NewExperience#setSwitchControl
         */
        setSwitchControl (oShellHeaderControl) {
            const bActiveBefore = this.isActive();

            this.#shellHeaderControl = oShellHeaderControl;
            this.#model.setProperty("/shellHeaderControlId", oShellHeaderControl?.getId?.());

            this.#model.setProperty("/active", !!oShellHeaderControl);
            this.#model.setProperty("/isVisible", !!oShellHeaderControl);

            if (bActiveBefore !== this.isActive()) {
                this.#eventProvider.fireEvent("activeChanged", { active: this.isActive() });
            }

            this.#updateShellHeaderVisibility();
        }

        /**
         * Sets the visibility of the switch control in the shell header overflow.
         * Note: in order to change the visibility of the switch control, two actions must be performed:
         *   1. Change the visibility of the switch control itself;
         *   2. Call {@link #setSwitchVisibility} to make the new visibility consistent also in the shell header overflow.
         * @param {boolean} bVisible Whether the switch control is currently visible in the shell header overflow
         *
         * @since 1.124.0
         * @private
         * @ui5-restricted ux.eng.newexperience
         * @alias sap.ushell.api.NewExperience#setSwitchVisibility
         */
        setSwitchVisibility (bVisible) {
            this.#model.setProperty("/isVisible", bVisible);
        }
    }

    const NewExperienceInstance = new NewExperience();

    return NewExperienceInstance;
});
