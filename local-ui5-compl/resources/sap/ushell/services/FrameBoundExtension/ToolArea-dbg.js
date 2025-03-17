// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Defines the interface for extensions in the ToolArea ShellArea.
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
     * @alias sap.ushell.services.FrameBoundExtension.ToolArea
     * @class
     * @classdesc The tool area extension point is positioned next the launchpad content.
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
    class ToolArea {
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

            await ushellUtils.promisify(this.#renderer.showToolArea(...aArgs));
        };

        /**
         * Creates an item in the tool area.
         *
         * @example
         *
         *   ToolArea.createItem({
         *       id: "toolAreaItem1",
         *       icon: "sap-icon://documents",
         *       text: "My ToolArea Item 1",
         *       expandable: true,
         *       press: (evt) => {
         *           MessageToast.show("Press toolAreaItem1");
         *       },
         *       expand: (evt) => {
         *           MessageToast.show("Expand toolAreaItem1");
         *       }
         *   });
         *
         * @param {object} controlProperties The properties that will be passed to the {@link sap.ushell.ui.shell.ToolAreaItem}.
         * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created item.
         *
         * @see sap.ushell.ui.shell.ToolAreaItem
         *
         * @since 1.124.0
         * @public
         */
        async createItem (controlProperties) {
            const aCreateArgs = [
                controlProperties,
                null, // isVisible
                undefined, // currentState
                undefined // states
            ];
            const fnCreate = this.#renderer.addToolAreaItem.bind(this.#renderer);
            const fnShow = this.#renderer.showToolAreaItem.bind(this.#renderer);
            const fnHide = this.#renderer.removeToolAreaItem.bind(this.#renderer);

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
         * @param {sap.ushell.renderer.Renderer.LaunchpadState} launchpadState Whether the area should be visible or not
         * @param {boolean} visible Whether the tool area should be visible or not
         *
         * @since 1.124.0
         * @private
         */
        setVisibilityForLaunchpadState (launchpadState, visible) {
            this.#visibilityHandler(visible, false, launchpadState);
        }

        /**
         * Shows the tool area for all applications.
         * Does not change the visibility of the tool area for the launchpad "home".
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
         * Shows the tool area for all applications.
         * Does not change the visibility of the tool area for the launchpad "home".
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
         * Shows the tool area for launchpad "home".
         * Does not change the visibility of the tool area within applications.
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
         * Hides the tool area for launchpad "home".
         * Does not change the visibility of the tool area within applications.
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

    return ToolArea;
});
