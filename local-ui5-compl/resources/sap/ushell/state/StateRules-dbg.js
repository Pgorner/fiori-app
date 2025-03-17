// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ushell/state/StateManager/LaunchpadState",
    "sap/ushell/state/StateManager/Operation",
    "sap/ushell/state/StateManager/ShellMode",
    "sap/ushell/state/StrategyFactory"
], function (
    Log,
    LaunchpadState,
    Operation,
    ShellMode,
    StrategyFactory
) {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const {
        Default,
        Standalone,
        Embedded,
        Merged,
        Headerless,
        Lean,
        Blank,
        Minimal
    } = ShellMode;

    /**
     * @alias sap.ushell.state.StateRules
     * @namespace
     * @description StateRules is a helper class that applies rules to the state object.
     * The rules are based on the shell configuration and the current shell mode.
     *
     * @since 1.127.0
     * @private
     */
    class StateRules {
        /**
         * The shell configuration.
         * @type {object}
         */
        #oShellConfig = null;

        /**
         * Sets the shell configuration.
         * @param {object} oShellConfig The shell configuration.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateRules#setShellConfig
         */
        setShellConfig (oShellConfig) {
            this.#oShellConfig = oShellConfig;
        }

        /**
         * Applies the rules to the state data.
         *  1. ShellMode
         *  2. Move of items to the shell header
         * The state rules are applied in-place.
         * @param {object} oStateData The state data.
         * @param {sap.ushell.state.StateManager.ShellMode} sShellMode The shell mode.
         * @param {sap.ushell.state.StateManager.LaunchpadState} sLaunchpadState The launchpad state.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateRules#applyRules
         */
        applyRules (oStateData, sShellMode, sLaunchpadState) {
            this.#applyShellMode(oStateData, sShellMode, sLaunchpadState);

            this.#moveItemsToShellHeader(oStateData);

            this.#ensureSingleSubHeader(oStateData);
            this.#ensureSingleSidePaneContent(oStateData);

            this.#ensureHeaderItemMaxLength(oStateData);
        }

        /**
         * Applies the shell mode to the state data.
         * @param {object} oStateData The state data.
         * @param {sap.ushell.state.StateManager.ShellMode} sShellMode The shell mode.
         * @param {sap.ushell.state.StateManager.LaunchpadState} sLaunchpadState The launchpad state.
         *
         * @since 1.127.0
         * @private
         */
        #applyShellMode (oStateData, sShellMode, sLaunchpadState) {
            // Header
            if (sShellMode === Headerless) {
                StrategyFactory.perform(oStateData, "header.visible", Operation.Set, false);
            }

            // Logo
            let bShowLogo;
            if (sLaunchpadState === LaunchpadState.Home) {
                bShowLogo = ![Headerless, Embedded, Merged].includes(sShellMode);
            } else { // app
                bShowLogo = ![Headerless, Standalone, Embedded, Merged].includes(sShellMode);
            }
            StrategyFactory.perform(oStateData, "header.home.showLogo", Operation.Set, bShowLogo);

            // Back Button
            if (sLaunchpadState === LaunchpadState.Home) {
                StrategyFactory.perform(oStateData, "header.headItems", Operation.Remove, "backBtn");
            } else { // app
                /*
                 * lean:    back button is allowed but not shown by default
                 * minimal: back button is allowed but not shown by default
                 */
                const bShowBackButton = [Default, Standalone, Embedded, Merged, Lean, Minimal].includes(sShellMode);
                if (!bShowBackButton) {
                    StrategyFactory.perform(oStateData, "header.headItems", Operation.Remove, "backBtn");
                }
            }

            // User Action Menu
            /*
             * merged: user action menu is allowed but not shown by default
             */
            const bShowUserActionMenu = [Default, Standalone, Minimal, Embedded, Lean, Blank, Merged].includes(sShellMode);
            if (!bShowUserActionMenu) {
                StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Remove, "userActionsMenuHeaderButton");
            }

            // AppFinder
            let bShowAppFinder;
            if (sLaunchpadState === LaunchpadState.Home) {
                bShowAppFinder = [Default, Standalone, Minimal, Lean].includes(sShellMode);
            } else { // app
                bShowAppFinder = [Default, Minimal].includes(sShellMode);
            }
            if (!bShowAppFinder) {
                StrategyFactory.perform(oStateData, "userActions.items", Operation.Remove, "openCatalogBtn");
            }

            // UserSettings
            let bShowUserSettings;
            if (sLaunchpadState === LaunchpadState.Home) {
                bShowUserSettings = [Default, Standalone, Minimal, Lean].includes(sShellMode);
            } else { // app
                bShowUserSettings = [Default, Minimal].includes(sShellMode);
            }
            if (!bShowUserSettings) {
                StrategyFactory.perform(oStateData, "userActions.items", Operation.Remove, "userSettingsBtn");
            }

            // NotificationsButton
            let bShowNotificationsButton;
            if (sLaunchpadState === LaunchpadState.Home) {
                bShowNotificationsButton = [Default, Standalone, Minimal, Lean].includes(sShellMode);
            } else { // app
                bShowNotificationsButton = [Default, Minimal].includes(sShellMode);
            }
            if (!bShowNotificationsButton) {
                StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Remove, "NotificationsCountButton");
            }
        }

        /**
         * Moves items to the shell header based on the shell configuration.
         * @param {object} oStateData The state data.
         *
         * @since 1.127.0
         * @private
         */
        #moveItemsToShellHeader (oStateData) {
            if (!this.#oShellConfig) {
                Log.warning("StateRules not initialized: Cannot move UserAction ShellHeader");
                return;
            }

            if (this.#oShellConfig.moveEditHomePageActionToShellHeader) {
                // handled in runtime controller
            }

            if (this.#oShellConfig.moveAppFinderActionToShellHeader) {
                if (oStateData.userActions.items.includes("openCatalogBtn")) {
                    StrategyFactory.perform(oStateData, "userActions.items", Operation.Remove, "openCatalogBtn");
                    StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Add, "openCatalogBtn");
                }
            }

            if (this.#oShellConfig.moveUserSettingsActionToShellHeader) {
                if (oStateData.userActions.items.includes("userSettingsBtn")) {
                    StrategyFactory.perform(oStateData, "userActions.items", Operation.Remove, "userSettingsBtn");
                    StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Add, "userSettingsBtn");
                }
            }

            if (this.#oShellConfig.moveContactSupportActionToShellHeader) {
                if (oStateData.userActions.items.includes("ContactSupportBtn")) {
                    StrategyFactory.perform(oStateData, "userActions.items", Operation.Remove, "ContactSupportBtn");
                    StrategyFactory.perform(oStateData, "header.headEndItems", Operation.Add, "ContactSupportBtn");
                }
            }
        }

        /**
         * Ensures that the subHeader contains only one item.
         * The last item is kept.
         * @param {object} oStateData The state data.
         *
         * @since 1.127.0
         * @private
         */
        #ensureSingleSubHeader (oStateData) {
            if (oStateData.subHeader.items.length > 1) {
                // remove all items except the last one
                const aShallowCopy = [...oStateData.subHeader.items];
                for (let i = 0; i < aShallowCopy.length - 1; i++) {
                    const sItem = aShallowCopy[i];
                    StrategyFactory.perform(oStateData, "subHeader.items", Operation.Remove, sItem);
                }
            }
        }

        /**
         * Ensures that the sidePane contains only one item.
         * The last item is kept.
         * @param {object} oStateData The state data.
         *
         * @since 1.127.0
         * @private
         */
        #ensureSingleSidePaneContent (oStateData) {
            if (oStateData.sidePane.items.length > 1) {
                // remove all items except the last one
                const aShallowCopy = [...oStateData.sidePane.items];
                for (let i = 0; i < aShallowCopy.length - 1; i++) {
                    const sItem = aShallowCopy[i];
                    StrategyFactory.perform(oStateData, "sidePane.items", Operation.Remove, sItem);
                }
            }
        }

        /**
         * Ensures that the header items do not exceed the maximum length.
         * The first items are kept. The back button is usually the first item {@link sap.ushell.state.StrategyFactory.HeadItemsStrategy}.
         * @param {object} oStateData The state data.
         *
         * @since 1.127.0
         * @private
         */
        #ensureHeaderItemMaxLength (oStateData) {
            const iHeaderItemMaxLength = 3;
            const aShallowCopy = [...oStateData.header.headItems];
            if (aShallowCopy.length > iHeaderItemMaxLength) {
                // only keep the first items
                for (let i = iHeaderItemMaxLength; i < aShallowCopy.length; i++) {
                    const sItem = aShallowCopy[i];
                    StrategyFactory.perform(oStateData, "header.headItems", Operation.Remove, sItem);
                }
            }
        }

        /**
         * ONLY FOR TESTING!
         * Resets the state rules.
         *
         * @since 1.127.0
         * @private
         * @alias sap.ushell.state.StateRules#reset
         */
        reset () {
            this.#oShellConfig = null;
        }
    }

    return new StateRules();

});
