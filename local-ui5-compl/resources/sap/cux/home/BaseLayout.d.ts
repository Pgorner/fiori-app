declare module "sap/cux/home/BaseLayout" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import { Event } from "jquery";
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import Page from "sap/m/Page";
    import Control from "sap/ui/core/Control";
    import { MetadataOptions } from "sap/ui/core/Element";
    import BaseContainer from "sap/cux/home/BaseContainer";
    import { $BaseLayoutSettings } from "sap/cux/home/BaseLayout";
    import BaseLayoutRenderer from "sap/cux/home/BaseLayoutRenderer";
    import BasePanel from "sap/cux/home/BasePanel";
    import BaseSettingsPanel from "sap/cux/home/BaseSettingsPanel";
    interface FullScreenElementConfig {
        fullScreenName: string;
        sourceElements: (BaseContainer | BasePanel)[];
        targetContainer: BaseContainer;
    }
    /**
     *
     * Abstract base class for My Home layout control.
     *
     * @extends Page
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @abstract
     * @private
     *
     * @alias sap.cux.home.BaseLayout
     */
    export default abstract class BaseLayout extends Page {
        protected _i18nBundle: ResourceBundle;
        private _settingsPanels;
        private _domSnapshot;
        private _sourceElementClone;
        private _scrollPosition;
        private _currentExpandedElementIndex;
        private _fullScreenContainer;
        private _slideDurationInSeconds;
        private _layoutLoaded;
        private _hashChanger;
        private _currentExpandedElement;
        private _previousExpandedElement;
        private _elementConfigs;
        constructor(id?: string | $BaseLayoutSettings);
        constructor(id?: string, settings?: $BaseLayoutSettings);
        static readonly metadata: MetadataOptions;
        static renderer: typeof BaseLayoutRenderer;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * onBeforeRendering lifecycle method
         *
         * @private
         * @override
         */
        onBeforeRendering(event: Event): void;
        /**
         * onAfterRendering lifecycle method.
         *
         * @private
         */
        onAfterRendering(): void;
        /**
         * Retrieves the content of the BaseLayout.
         * Overridden to return the items aggregation during inner page rendering.
         *
         * @private
         * @override
         * @returns An array of Control objects representing the content.
         */
        getContent(): Control[];
        /**
         * Extracts URL search parameters from a given hash string.
         *
         * @private
         * @param {string} hash - The hash string containing the URL parameters.
         * @returns {URLSearchParams} An instance of URLSearchParams containing the parsed parameters.
         */
        private _getURLParams;
        /**
         * Loads full screen mode from URL hash if enabled.
         *
         * @private
         * @param {string} hash - The URL hash string.
         * @param {boolean} [hashChanged=false] - Indicates if the hash has changed.
         */
        private _loadFullScreenFromHash;
        /**
         * Toggles full screen mode for the specified element.
         *
         * @private
         * @param {FullScreenElementConfig} expandedElement - The configuration of the element to be expanded.
         * @param {boolean} [hashChanged=false] - Indicates if the hash has changed, affecting the toggle behavior.
         */
        private _toggleFullScreenForElement;
        /**
         * Opens the settings dialog and navigate to the panel
         * specified by the selected key.
         *
         * @private
         * @param {string} selectedKey The key of the panel to navigate to
         */
        openSettingsDialog(selectedKey?: string, context?: object): void;
        /**
         * Adds a settings panel to the list of settings panels associated
         * with the layout's settings dialog.
         *
         * @param {BaseSettingsPanel} settingsPanel - The settings panel to be added.
         * @private
         */
        _addSettingsPanel(settingsPanel: BaseSettingsPanel | BaseSettingsPanel[] | undefined, override?: boolean): void;
        /**
         * Adds a settings panel to the list of settings panels associated
         * with the layout's settings dialog.
         *
         * @param {BaseSettingsPanel} settingsPanel - The settings panel to be added.
         * @private
         */
        _getSettingsPanels(): BaseSettingsPanel[];
        /**
         * Extracts the configuration necessary for handling full-screen functionality of an element.
         *
         * @private
         * @param {BaseContainer | BasePanel} element - The element for which to extract the full-screen configuration.
         * @returns {FullScreenElementConfig} Full screen element configuration.
         */
        private _extractElementConfig;
        /**
         * Configures an element for full-screen functionality by extracting and storing its configuration.
         * Only stores the configuration if a full-screen name is provided and layout is not currently expanded.
         *
         * @private
         * @param {BaseContainer | BasePanel} element - The element to configure for full-screen.
         */
        registerFullScreenElement(element: BaseContainer | BasePanel): void;
        /**
         * Removes an element's full-screen configuration based on its full-screen name.
         * Only removes the configuration if a full-screen name is provided and layout is not currently expanded.
         *
         * @private
         * @param {BaseContainer | BasePanel} element - The element to remove from full-screen configuration.
         */
        deregisterFullScreenElement(element: BaseContainer | BasePanel): void;
        /**
         * Adds or updates a URL parameter in the given hash string.
         *
         * @private
         * @param {string} hash - The original hash string.
         * @param {string} key - The parameter key to add or update.
         * @param {string} value - The value for the parameter.
         * @returns {string} The updated hash string with the new or updated parameter.
         */
        private _addURLParam;
        /**
         * Removes a specified parameter from the URL hash string.
         *
         * @private
         * @param {string} hash - The original hash string.
         * @param {string} key - The parameter key to remove.
         * @returns {string} The updated hash string without the specified parameter.
         */
        private _removeURLParam;
        /**
         * Toggles the full-screen state of a given element, handling layout adjustments, visibility, and scroll position.
         *
         * @private
         * @param {BaseContainer | BasePanel} element - The element to toggle full-screen state for.
         * @param {boolean} [hashChanged=false] - Indicates if the hash has changed.
         */
        toggleFullScreen(element: BaseContainer | BasePanel, hashChanged?: boolean): void;
        /**
         * Place actual element in the full screen container and hide all other panels in the container, if not in side-by-side layout
         *
         * @private
         * @param {BaseContainer} targetContainer - Container that is to be displayed in full-screen mode
         * @param {number} panelIndex - Index of the panel to remain visible if not in side-by-side layout.
         */
        private _modifyContainer;
        /**
         * Checks if the toggle requirements are met for the given element configuration.
         *
         * @private
         * @param {FullScreenElementConfig} elementConfig - The configuration of the element to check.
         * @returns {boolean} `true` if toggling is allowed, otherwise `false`.
         */
        private _checkToggleRequirements;
        /**
         * Adjusts the current expanded element if required based on the new target container.
         *
         * @private
         * @param {boolean} isTargetContainerDifferent - Indicates whether the target container is different from the current expanded element's container.
         */
        private _adjustPreviousExpandedElementIfRequired;
        /**
         * Resets the scroll position to that of the collapsed element in the original container.
         *
         * @private
         * @param {BaseContainer | BasePanel} element - The element for which to reset the scroll position.
         */
        private _resetScrollPosition;
        /**
         * Toggles visibility of inner panels, except one specified by index.
         * Applicable only for panels not in SideSide layout.
         *
         * @private
         * @param {BaseContainer} element - Container with inner panels.
         * @param {boolean} visibility - Desired visibility state for panels.
         * @param {number} [indexOfVisiblePanel] - Index of panel to exclude from toggle.
         */
        private _toggleInnerPanelVisibility;
        /**
         * Updates the full-screen button text for a control (or all controls in a side-by-side layout) based on expanded state.
         *
         * @private
         * @param {BaseContainer | BasePanel} control - The control to update or the parent of controls to update.
         * @param {boolean} expanded - Indicates if the text should reflect an expanded or collapsed state.
         */
        private _toggleFullScreenButtonText;
        /**
         * Retrieves the full-screen button associated with a control.
         *
         * @private
         * @param {BaseContainer | BasePanel} control - The control to find the full-screen button for.
         * @returns {Button} The full-screen button associated with the control.
         */
        private _getFullScreenButton;
        /**
         * Retrieves the Full screen menu item associated with a control.
         *
         * @private
         * @param {BaseContainer | BasePanel} control - The control to find the full-screen button for.
         * @returns {MenuItem} The "Show More" menu item associated with the control.
         */
        private _getFullScreenMenuItem;
        /**
         * Retrieves the full-screen container from the current aggregation.
         *
         * @private
         * @returns {Page} The Page instance used as the full-screen container.
         */
        _getFullScreenContainer(): Page;
        /**
         * Gets the first child node of a control's DOM reference.
         *
         * @private
         * @param {Control} element - The control to get the child node for.
         * @returns {Node | Element} The first child node of the control's DOM reference.
         */
        private _getSectionRef;
        /**
         * Clones and places an element into a target container for full-screen transitions.
         *
         * @private
         * @param {BaseContainer} targetElement - Element to clone or containing the element to clone.
         * @param {boolean} expanded - True to expand (clone and place), false to collapse (restore from snapshot).
         * @param {number} panelIndex - Index of the panel to clone if not in side-by-side layout.
         */
        private _placeClonedElement;
        /**
         * Retrieves the name of the currently expanded element, if any.
         *
         * @private
         * @returns {string | undefined} - The full screen name of the currently expanded element, if any.
         */
        _getCurrentExpandedElementName(): string | undefined;
        /**
         * Retrieves the currently expanded element config, if any
         *
         * @private
         * @returns {FullScreenElementConfig | undefined} - The full screen name of the currently expanded element, if any.
         */
        _getCurrentExpandedElement(): FullScreenElementConfig | undefined;
    }
}
//# sourceMappingURL=BaseLayout.d.ts.map