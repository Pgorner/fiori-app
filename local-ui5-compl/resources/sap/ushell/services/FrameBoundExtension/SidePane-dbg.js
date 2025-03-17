// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Defines the interface for extensions in the SidePane ShellArea.
 *
 * This interface does NOT work when called from within a iframe.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/services/FrameBoundExtension/Item",
    "sap/ushell/Container",
    "sap/ushell/utils"
], function (
    Element,
    ExtensionItem,
    Container,
    ushellUtils
) {
    "use strict";

    /**
     * @alias sap.ushell.services.FrameBoundExtension.SidePane
     * @class
     * @classdesc The side pane extension point is positioned next the launchpad content.
     * To be instantiated by {@link sap.ushell.services.FrameBoundExtension}.
     *
     * <p><b>Restriction:</b> Does not work when called from within a iframe.
     * The calling function has to be in the 'same frame' as the launchpad itself.</p>
     *
     * @hideconstructor
     *
     * @since 1.124.0
     * @public
     */
    class SidePane {
        #renderer = Container.getRendererInternal();

        /**
         * @param {boolean} visible
         *   Whether the item shall be visible or not.
         * @param {boolean} currentState
         *   Whether the new visibility shall be applied only to the 'currentState'.
         * @param {sap.ushell.renderer.Renderer.LaunchpadState} launchpadState
         *   To which launchpad state the new visibility shall be applied.
         *   Is only Considered if <code>currentState</code> is <code>false</code>.
         * @returns {Promise} Resolves after visibility was changed.
         */
        #visibilityHandler = async (visible, currentState, launchpadState) => {
            const aArgs = [
                launchpadState,
                visible
            ];

            await ushellUtils.promisify(this.#renderer.setLeftPaneVisibility(...aArgs));
        };

        /**
         * Creates an item in the side pane.
         *
         * The <code>controlType</code> can be any control and is by default a {@link sap.m.Button}.
         * The <code>controlProperties</code> are passed to the constructor of the control.
         *
         * @example
         *
         *   SidePane.createItem({
         *       id: "sidePaneContent1",
         *       text: "SidePaneContent Button",
         *       press: () => {
         *           MessageToast.show("Press SidePaneContent Button");
         *       }
         *   }, {
         *       controlType: "sap.m.Button"
         *   });
         *
         * @param {object} controlProperties The properties that will be passed to the created control.
         * @param {object} [parameters] Additional parameters.
         * @param {string} [parameters.controlType=sap.m.Button] Defines the <code>controlType</code> of the item.
         * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created item.
         *
         * @since 1.124.0
         * @public
         */
        async createItem (controlProperties, parameters) {
            const aCreateArgs = [{
                controlType: parameters.controlType,
                oControlProperties: controlProperties,
                bIsVisible: false,
                bCurrentState: undefined,
                aStates: undefined
            }];
            const fnCreate = this.#renderer.addSidePaneContent.bind(this.#renderer);
            const fnShow = this.#renderer.showLeftPaneContent.bind(this.#renderer);
            const fnHide = this.#renderer.hideLeftPaneContent.bind(this.#renderer);

            const bControlWasPreCreated = !!Element.getElementById(controlProperties.id);
            const oControl = await ushellUtils.promisify(fnCreate(...aCreateArgs));

            async function visibilityHandler (visible, currentState, state) {
                const states = state ? [state] : undefined;
                if (visible) {
                    await ushellUtils.promisify(fnShow(oControl.getId(), currentState, states));
                    return;
                }
                await ushellUtils.promisify(fnHide(oControl.getId(), currentState, states));
            }

            return new ExtensionItem(oControl, visibilityHandler, bControlWasPreCreated);
        }

        /**
         * @param {sap.ushell.renderer.Renderer.LaunchpadState} launchpadState Whether the area should be visible this or not
         * @param {boolean} visible Whether the side pane should be visible or not
         *
         * @since 1.124.0
         * @private
         */
        setVisibilityForLaunchpadState (launchpadState, visible) {
            this.#visibilityHandler(visible, false, launchpadState);
        }

        /**
         * Shows the side pane for all applications.
         * Does not change the visibility of the side pane for the launchpad "home".
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.124.0
         * @public
         */
        showForAllApps () {
            this.setVisibilityForLaunchpadState("app", true);
            return this;
        }

        /**
         * Shows the side pane for all applications.
         * Does not change the visibility of the side pane for the launchpad "home".
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.124.0
         * @public
         */
        hideForAllApps () {
            this.setVisibilityForLaunchpadState("app", false);
            return this;
        }

        /**
         * Shows the side pane for launchpad "home".
         * Does not change the visibility of the side pane within applications.
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.124.0
         * @public
         */
        showOnHome () {
            this.setVisibilityForLaunchpadState("home", true);
            return this;
        }

        /**
         * Hides the area for launchpad "home".
         * Does not change the visibility of the area within applications.
         * @returns {this} Reference to <code>this</code> for method chaining.
         *
         * @since 1.124.0
         * @public
         */
        hideOnHome () {
            this.setVisibilityForLaunchpadState("home", false);
            return this;
        }
    }

    return SidePane;
});
