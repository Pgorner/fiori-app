// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Defines the interface for extensions in the FloatingContainer ShellArea.
 *
 * This interface does NOT work when called from within a iframe.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/EventBus",
    "sap/ushell/Container"
], function (
    ManagedObject,
    EventBus,
    Container
) {
    "use strict";

    /**
     * @alias sap.ushell.services.FrameBoundExtension.FloatingContainer
     * @class
     * @classdesc The floating container.
     * To be instantiated by {@link sap.ushell.services.FrameBoundExtension}.
     *
     * <p><b>Restriction:</b> Does not work when called from within a iframe.
     * The calling function has to be in the 'same frame' as the launchpad itself.</p>
     *
     * @hideconstructor
     *
     * @extends sap.ui.base.ManagedObject
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    const FloatingContainer = ManagedObject.extend("sap.ushell.services.FrameBoundExtension.FloatingContainer", /** @lends sap.ushell.services.FrameBoundExtension.FloatingContainer.prototype */ {
        metadata: {
            library: "sap.ushell",
            events: {
                /**
                 * Is triggered after the floating container was docked or undocked.
                 * Happens either by user drag or by window resize.
                 * It might happen that the floating container is undocked while invisible.
                 */
                dockingStateUpdate: {
                    parameters: {
                        /**
                         * Indicates whether the floating container is currently visible.
                         */
                        visible: { type: "boolean" },
                        /**
                         * Indicates whether the floating container is currently docked.
                         */
                        docked: { type: "boolean" }
                    }
                }
            }
        },

        constructor: function () {
            ManagedObject.apply(this, arguments);

            this._oRenderer = Container.getRendererInternal();
            this._oEventDelegate = null;
            this._bDocked = null;

            EventBus.getInstance()
                .subscribe("launchpad", "shellFloatingContainerIsDocked", this._handleDocking, this)
                .subscribe("launchpad", "shellFloatingContainerIsUnDocked", this._handleDocking, this)
                .subscribe("launchpad", "shellFloatingContainerIsUnDockedOnResize", this._handleDocking, this);
        }
    });

    /**
     * Handles the docking.
     * @param {string} sChannelId Id of the EventBus channel
     * @param {string} sEventId Id of the EventBus event
     * @param {object} oData Additional data
     */
    FloatingContainer.prototype._handleDocking = function (sChannelId, sEventId, oData = {}) {
        const bVisible = !!oData.visible;
        if (sEventId === "shellFloatingContainerIsDocked" && this._bDocked !== true) {
            this._bDocked = true;
            this.fireDockingStateUpdate({ visible: bVisible, docked: this._bDocked });
        } else if ((sEventId === "shellFloatingContainerIsUnDocked" || sEventId === "shellFloatingContainerIsUnDockedOnResize") && this._bDocked !== false) {
            this._bDocked = false;
            this.fireDockingStateUpdate({ visible: bVisible, docked: this._bDocked });
        }
    };

    /**
     * Sets the content of the floating container.
     * @param {sap.ui.core.Control} control The actual content of the extension.
     * @param {string} dragSelector CSS selector describing the drag handle to enable drag and drop.
     * @returns {this} Reference to <code>this</code> for method chaining.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    FloatingContainer.prototype.setContent = function (control, dragSelector) {
        this._oRenderer.setFloatingContainerContent(control);
        this._oEventDelegate = {
            onAfterRendering: () => {
                this._oRenderer.setFloatingContainerDragSelector(dragSelector);
            }
        };
        control.addEventDelegate(this._oEventDelegate, this);
        return this;
    };

    /**
     * Shows the floating container.
     * @returns {this} Reference to <code>this</code> for method chaining.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    FloatingContainer.prototype.show = function () {
        this._oRenderer.setFloatingContainerVisibility(true);
        return this;
    };

    /**
     * Hides the floating container.
     * @returns {this} Reference to <code>this</code> for method chaining.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    FloatingContainer.prototype.hide = function () {
        this._oRenderer.setFloatingContainerVisibility(false);
        return this;
    };

    /**
     * Checks whether the floating container is docked.
     * @returns {Promise<boolean>} Whether the floating container is currently in <code>docked</code> state.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    FloatingContainer.prototype.isDocked = async function () {
        const sFloatingContainerState = this._oRenderer.getFloatingContainerState() || "";
        return sFloatingContainerState.startsWith("docked");
    };

    /**
     * Checks whether the floating container is docked.
     * @returns {Promise<boolean>} Whether the floating container is currently visible.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    FloatingContainer.prototype.isVisible = async function () {
        return !!this._oRenderer.getFloatingContainerVisiblity();
    };

    /**
     * SAPUI5 Lifecycle hook for destroy
     * @since 1.124.0
     * @private
     */
    FloatingContainer.prototype.exit = function () {
        EventBus.getInstance()
            .unsubscribe("launchpad", "shellFloatingContainerIsDocked", this._handleDocking, this)
            .unsubscribe("launchpad", "shellFloatingContainerIsUnDocked", this._handleDocking, this)
            .unsubscribe("launchpad", "shellFloatingContainerIsUnDockedOnResize", this._handleDocking, this);
    };

    return FloatingContainer;
});
