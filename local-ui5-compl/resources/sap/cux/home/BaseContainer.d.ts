declare module "sap/cux/home/BaseContainer" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    import FlexBox from "sap/m/FlexBox";
    import HBox from "sap/m/HBox";
    import IconTabBar, { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
    import Control from "sap/ui/core/Control";
    import type { MetadataOptions } from "sap/ui/core/Element";
    import { $BaseContainerSettings } from "sap/cux/home/BaseContainer";
    import BaseContainerRenderer from "sap/cux/home/BaseContainerRenderer";
    import BaseLayout from "sap/cux/home/BaseLayout";
    import BasePanel from "sap/cux/home/BasePanel";
    import MenuItem from "sap/cux/home/MenuItem";
    import { DeviceType } from "sap/cux/home/utils/Device";
    /**
     *
     * Abstract base class for My Home layout control container.
     *
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @abstract
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.BaseContainer
     */
    export default abstract class BaseContainer extends Control {
        protected _i18nBundle: ResourceBundle;
        private _controlMap;
        private _wrapper;
        private _iconTabBar;
        private _commonHeaderElementStates;
        private _resizeObserver;
        private _deviceType;
        adjustLayout(): void;
        constructor(id?: string | $BaseContainerSettings);
        constructor(id?: string, settings?: $BaseContainerSettings);
        static readonly metadata: MetadataOptions;
        static renderer: typeof BaseContainerRenderer;
        /**
         * Init lifecycle method
         *
         * @private
         * @override
         */
        init(): void;
        /**
         * Creates and returns header for both container as well as panels
         *
         * @private
         * @param {BaseContainer | BasePanel} control - can be a container or a panel
         * @returns {HBox} header for the given container or panel
         */
        private _createHeader;
        /**
         * Returns container header
         *
         * @private
         * @returns {Object} container header
         */
        _getHeader(): HBox;
        /**
         * Returns inner control corresponding to the specified layout
         *
         * @private
         * @returns {IconTabBar | FlexBox} inner control based on the layout
         */
        _getInnerControl(): IconTabBar | FlexBox;
        /**
         * Handler for selection of panel in SideBySide layout
         *
         * @private
         * @param {Event} event - event object
         */
        protected _onPanelSelect(event: IconTabBar$SelectEvent): void;
        /**
         * Updates the count information of IconTabFilter of IconTabBar inner control
         * in case of SideBySide layout
         *
         * @private
         * @param {BasePanel} panel - associated panel
         * @param {string} count - updated count
         */
        _setPanelCount(panel: BasePanel, count?: string): void;
        /**
         * Adds corresponding control to panel. The control would be added to the
         * corresponding target inner control based on the layout.
         *
         * @private
         * @param {BasePanel} panel - panel to which control must be added
         * @param {Control} control - control to be added
         */
        _addToPanel(panel: BasePanel, control: Control): void;
        /**
         * Creates and returns IconTabBarFilter for the specified panel to be placed
         * in the IconTabBar inner control in case of SideBySide layout
         *
         * @private
         * @param {BasePanel} panel - panel whose icon tab filter must be fetched
         * @returns {IconTabFilter} IconTabFilter for the specified panel
         */
        private _getIconTabFilter;
        /**
         * onBeforeRendering lifecycle method
         *
         * @private
         * @override
         */
        onBeforeRendering(): void;
        /**
         * onAfterRendering lifecycle method
         *
         * @private
         * @override
         */
        onAfterRendering(): void;
        /**
         * Attaches a resize handler to the container to adjust
         * the layout based on device size changes.
         *
         * @private
         */
        private _attachResizeHandler;
        /**
         * Create inner control for storing content from panel
         *
         * @private
         */
        private _createInnerControl;
        /**
         * Update container header information
         *
         * @private
         */
        _updateContainerHeader(control: BaseContainer | BasePanel): void;
        /**
         * Updates header information of a specified container or a panel
         *
         * @private
         * @param {BaseContainer | BasePanel} control - can be container or panel
         */
        private _updateHeader;
        /**
         * Attaches common header elements like settings menu and full screen action to each
         * panel in the container, if enabled.
         *
         * @private
         */
        private _addCommonHeaderElements;
        /**
         * Retrieves the my home settings menu item for a given panel.
         *
         * @private
         * @param {BaseContainer | BasePanel} panel - The panel for which to retrieve the home settings menu item.
         * @returns {MenuItem} The settings menu item for the given panel.
         */
        private _getHomeSettingsMenuItem;
        /**
         * Retrieves the full screen menu item for a given panel.
         *
         * @private
         * @param {BaseContainer | BasePanel} panel - The panel for which to retrieve the home settings menu item.
         * @returns {MenuItem} The settings menu item for the given panel.
         */
        private _getFullScreenMenuItem;
        /**
         * Generates a full screen action button for a given control, which can be a panel or a container.
         *
         * @private
         * @param {BaseContainer | BasePanel} control - The control for which the full screen button is generated.
         * @returns {Button} A Button instance configured to toggle full screen mode for the specified control.
         */
        private _getFullScreenButton;
        /**
         * Returns the selected panel in the IconTabBar inner control in
         * case of SideBySide layout
         *
         * @private
         * @returns {BasePanel} selected panel
         */
        _getSelectedPanel(): BasePanel;
        /**
         * Add content from all panels to the layout-specific inner control
         *
         * @private
         */
        private _addAllPanelContent;
        /**
         * Creates and returns a wrapper for containing the specified panel
         * content in case of Horizontal and Vertical layout
         *
         * @private
         * @param {BasePanel} panel - panel for which wrapper has to created
         * @returns {FlexBox} wrapper container for the given panel
         */
        protected _getPanelContentWrapper(panel: BasePanel): FlexBox;
        /**
         * Returns header of the specified panel after updating it
         *
         * @private
         * @param {BasePanel} panel - panel to be updated
         * @returns {HBox} header associated with the panel
         */
        private _updatePanelHeader;
        /**
         * Setter for container title
         *
         * @private
         * @param {string} title - updated title
         * @returns {BaseContainer} BaseContainer instance for chaining
         */
        _setTitle(title: string): BaseContainer;
        /**
         * Adds menu items to a control and sets up a menu button to display them.
         * If the menu for the control doesn't exist, it creates a new one.
         *
         * @private
         * @param {BaseContainer | BasePanel} control - The control to which the menu items will be added.
         * @param {MenuItem[]} menuItems - An array of menu items to be added to the menu.
         */
        private _addMenuItems;
        /**
         * Creates and returns a button for the corresponding header ActionButton
         *
         * @private
         * @param {Button} headerButton - ActionButton element
         * @returns {Button} Button instance created for the header element
         */
        private _getHeaderButton;
        /**
         * Retrieves the layout associated with the container, if available.
         *
         * @private
         * @returns {BaseLayout} The layout associated with the BaseContainer.
         */
        _getLayout(): BaseLayout;
        /**
         * Retrieves or creates a menu list item for a given menu item.
         *
         * @private
         * @param {MenuItem} menuItem - The menu item for which to retrieve or create a list item.
         * @returns {StandardListItem} The menu list item associated with the provided menu item.
         */
        private _getMenuListItem;
        /**
         * Toggles the visibility of menu Item.
         *
         * @private
         * @param {boolean} show - Indicates whether to show or hide the menu item.
         * @returns {void}
         */
        toggleMenuListItem(menuItem: MenuItem, show: boolean): void;
        /**
         * Toggles the visibility of action buttons within the container and/or its inner panels.
         *
         * @private
         * @param {boolean} show - Indicates whether to show or hide the action buttons.
         * @returns {void}
         */
        toggleActionButtons(show: boolean): void;
        /**
         * Toggles the visibility of the full screen button for the specified element.
         *
         * @private
         * @param {BaseContainer | BasePanel} element - The element for which to toggle the full screen button.
         * @param {boolean} show - Indicates whether to show or hide the full screen button.
         * @param {boolean} isElementExpanded - Indicates whether the element is expanded.
         */
        toggleFullScreenElements(element: BaseContainer | BasePanel, show: boolean, isElementExpanded: boolean): void;
        /**
         * Sets the device type based on the width of the container element.
         *
         * @private
         * @param {ResizeObserverEntry[]} entries - The entries returned by the ResizeObserver.
         * @returns {void}
         */
        private _setDeviceType;
        /**
         * Retrieves the device type for the current instance.
         *
         * @private
         * @returns {DeviceType} - The device type. If the device type is not set, it calculates
         * and returns the device type based on the current device width.
         */
        getDeviceType(): DeviceType;
    }
}
//# sourceMappingURL=BaseContainer.d.ts.map