/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/FlexBox", "sap/m/HBox", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/m/List", "sap/m/Popover", "sap/m/StandardListItem", "sap/m/Title", "sap/m/library", "sap/ui/core/Control", "sap/ui/core/CustomData", "sap/ui/core/Element", "sap/ui/core/Lib", "./BaseContainerRenderer", "./BasePanel", "./MenuItem", "./library", "./utils/Device", "./utils/FESRUtil"], function (Button, FlexBox, HBox, IconTabBar, IconTabFilter, List, Popover, StandardListItem, Title, sap_m_library, Control, CustomData, UI5Element, Lib, __BaseContainerRenderer, __BasePanel, __MenuItem, ___library, ___utils_Device, ___utils_FESRUtil) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BackgroundDesign = sap_m_library["BackgroundDesign"];
  const ButtonType = sap_m_library["ButtonType"];
  const PlacementType = sap_m_library["PlacementType"];
  const BaseContainerRenderer = _interopRequireDefault(__BaseContainerRenderer);
  const BasePanel = _interopRequireDefault(__BasePanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const LayoutType = ___library["LayoutType"];
  const calculateDeviceType = ___utils_Device["calculateDeviceType"];
  const DeviceType = ___utils_Device["DeviceType"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const FESR_EVENTS = ___utils_FESRUtil["FESR_EVENTS"];
  const getFESRId = ___utils_FESRUtil["getFESRId"];
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
  const BaseContainer = Control.extend("sap.cux.home.BaseContainer", {
    renderer: BaseContainerRenderer,
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Title of the container.
         */
        title: {
          type: "string",
          group: "Data",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Layout type of the container.
         */
        layout: {
          type: "sap.cux.home.LayoutType",
          group: "Data",
          defaultValue: LayoutType.SideBySide,
          visibility: "hidden"
        },
        /**
         * Key of the selected panel of the container.
         */
        selectedKey: {
          type: "string",
          group: "Data",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Width to be set for the container.
         * @public
         */
        width: {
          type: "sap.ui.core.CSSSize",
          group: "Appearance",
          defaultValue: "100%",
          visibility: "public"
        },
        /**
         * Height to be set for the container.
         * @public
         */
        height: {
          type: "sap.ui.core.CSSSize",
          group: "Appearance",
          visibility: "public"
        },
        /**
         * Whether the control is currently in blocked state.
         */
        blocked: {
          type: "boolean",
          group: "Appearance",
          defaultValue: false,
          visibility: "hidden"
        },
        /**
         * Whether the layout is currently in busy state.
         */
        busy: {
          type: "boolean",
          group: "Appearance",
          defaultValue: false,
          visibility: "hidden"
        },
        /**
         * The delay in milliseconds, after which the busy indicator will show up for this control.
         */
        busyIndicatorDelay: {
          type: "int",
          defaultValue: 1000,
          visibility: "hidden"
        },
        /**
         * The size of the BusyIndicator.
         */
        busyIndicatorSize: {
          type: "sap.ui.core.BusyIndicatorSize",
          defaultValue: "Medium",
          visibility: "hidden"
        },
        /**
         * The IDs of a logical field group that this control belongs to.
         */
        fieldGroupIds: {
          type: "string[]",
          defaultValue: [],
          visibility: "hidden"
        },
        /**
         * The visible property of the container.
         */
        visible: {
          type: "boolean",
          group: "Appearance",
          defaultValue: true,
          visibility: "hidden"
        },
        /**
         * Indicates whether home settings are enabled for this control.
         */
        enableSettings: {
          type: "boolean",
          group: "Misc",
          visibility: "hidden"
        },
        /**
         * Indicates whether full screen is enabled for this control.
         */
        enableFullScreen: {
          type: "boolean",
          group: "Misc",
          visibility: "hidden"
        },
        /**
         * The name of the URL parameter used to expand the container into full-screen mode.
         * This property specifies the parameter key expected in the URL query string
         * to identify the container to be expanded.
         */
        fullScreenName: {
          type: "string",
          group: "Misc",
          visibility: "hidden"
        }
      },
      defaultAggregation: "content",
      aggregations: {
        /**
         * The container content aggregation which should be of type BasePanel.
         *
         * @public
         */
        content: {
          type: "sap.cux.home.BasePanel",
          singularName: "content",
          multiple: true,
          visibility: "public"
        },
        /**
         * This aggregation contains the actions that should be displayed within the container.
         *
         * @public
         */
        actionButtons: {
          type: "sap.m.Button",
          multiple: true,
          singularName: "actionButton",
          visibility: "public"
        },
        /**
         * This aggregation holds the items that should be shown within the dropdown menu of the container.
         *
         * @public
         */
        menuItems: {
          type: "sap.cux.home.MenuItem",
          multiple: true,
          singularName: "menuItem",
          visibility: "public"
        }
      },
      associations: {
        layout: {
          type: "sap.cux.home.BaseLayout",
          multiple: false,
          singularName: "layout",
          visibility: "hidden"
        },
        fullScreenButton: {
          type: "sap.m.Button",
          multiple: false,
          singularName: "fullScreenButton",
          visibility: "hidden"
        },
        fullScreenMenuItem: {
          type: "sap.cux.home.MenuItem",
          multiple: false,
          singularName: "fullScreenMenuItem",
          visibility: "hidden"
        }
      },
      events: {
        /**
         * Event is fired before the container is expanded.
         */
        onExpand: {}
      },
      designtime: true
    },
    adjustLayout: function _adjustLayout() {},
    constructor: function _constructor(id, settings) {
      Control.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      this._controlMap = new Map();
      this._commonHeaderElementStates = new Map();
      this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n");
      this._createHeader(this);
    },
    /**
     * Creates and returns header for both container as well as panels
     *
     * @private
     * @param {BaseContainer | BasePanel} control - can be a container or a panel
     * @returns {HBox} header for the given container or panel
     */
    _createHeader: function _createHeader(control) {
      const controlId = control.getId();
      const id = `${controlId}-header`;
      const isPanel = control.isA("sap.cux.home.BasePanel");
      const hasContainerTitle = this.getProperty("title")?.trim().length > 0;
      if (!this._controlMap.get(id)) {
        //create header elements
        this._controlMap.set(`${controlId}-header-title`, new Title(`${controlId}-title`, {
          titleStyle: isPanel && hasContainerTitle ? "H6" : "H4"
        }));
        this._controlMap.set(`${controlId}-header-contentLeft`, new HBox(`${controlId}-contentLeft`, {
          renderType: "Bare"
        }).addStyleClass("sapCuxSectionContentArea"));
        this._controlMap.set(`${controlId}-header-contentRight`, new HBox(`${controlId}-contentRight`, {
          renderType: "Bare"
        }).addStyleClass("sapCuxSectionContentArea"));
        this._controlMap.set(`${controlId}-header-content`, new HBox(`${controlId}-content`, {
          width: "100%",
          justifyContent: "SpaceBetween",
          renderType: "Bare",
          items: [this._controlMap.get(`${controlId}-header-contentLeft`), this._controlMap.get(`${controlId}-header-contentRight`)]
        }).addStyleClass("sapUiTinyMarginBegin"));

        //create header container
        this._controlMap.set(id, new HBox(`${controlId}-header`, {
          alignItems: "Center",
          items: [this._controlMap.get(`${controlId}-header-title`), this._controlMap.get(`${controlId}-header-content`)]
        }));
        this.addDependent(this._controlMap.get(id));
      }

      //add control-specific styling
      this._controlMap.get(id)?.addStyleClass(isPanel && hasContainerTitle ? "sapCuxPanelHeader" : "sapUiContainerHeader");
      return this._controlMap.get(id);
    },
    /**
     * Returns container header
     *
     * @private
     * @returns {Object} container header
     */
    _getHeader: function _getHeader() {
      return this._controlMap.get(`${this.getId()}-header`);
    },
    /**
     * Returns inner control corresponding to the specified layout
     *
     * @private
     * @returns {IconTabBar | FlexBox} inner control based on the layout
     */
    _getInnerControl: function _getInnerControl() {
      return this.getProperty("layout") === LayoutType.SideBySide ? this._iconTabBar : this._wrapper;
    },
    /**
     * Handler for selection of panel in SideBySide layout
     *
     * @private
     * @param {Event} event - event object
     */
    _onPanelSelect: function _onPanelSelect(event) {
      //suppress invalidation to prevent container re-rendering. render the specific header element instead
      this.setProperty("selectedKey", event.getParameter("selectedKey"), true);
      this._updateContainerHeader(this);
    },
    /**
     * Updates the count information of IconTabFilter of IconTabBar inner control
     * in case of SideBySide layout
     *
     * @private
     * @param {BasePanel} panel - associated panel
     * @param {string} count - updated count
     */
    _setPanelCount: function _setPanelCount(panel, count) {
      if (this.getProperty("layout") === LayoutType.SideBySide) {
        this._getIconTabFilter(panel).setCount(count);
      }
    },
    /**
     * Adds corresponding control to panel. The control would be added to the
     * corresponding target inner control based on the layout.
     *
     * @private
     * @param {BasePanel} panel - panel to which control must be added
     * @param {Control} control - control to be added
     */
    _addToPanel: function _addToPanel(panel, control) {
      if (this.getProperty("layout") === LayoutType.SideBySide) {
        this._getIconTabFilter(panel)?.addContent(control);
      } else {
        this._controlMap.get(`${panel.getId()}-wrapper`)?.addItem(control);
      }
    },
    /**
     * Creates and returns IconTabBarFilter for the specified panel to be placed
     * in the IconTabBar inner control in case of SideBySide layout
     *
     * @private
     * @param {BasePanel} panel - panel whose icon tab filter must be fetched
     * @returns {IconTabFilter} IconTabFilter for the specified panel
     */
    _getIconTabFilter: function _getIconTabFilter(panel) {
      const id = `${panel.getId()}-tabFilter`;
      if (!this._controlMap.get(id)) {
        const iconTabFilter = new IconTabFilter(id, {
          key: panel.getProperty("key"),
          text: panel.getProperty("title"),
          tooltip: panel.getProperty("tooltip")
        });
        iconTabFilter.addCustomData(new CustomData({
          key: "sap-ui-fastnavgroup",
          value: "true",
          writeToDom: true
        }));
        this._controlMap.set(id, iconTabFilter);
        addFESRSemanticStepName(iconTabFilter, FESR_EVENTS.SELECT, panel.getProperty("key"));
      }

      //Add panel content to the created filter
      panel._getContent()?.forEach(content => this._controlMap.get(id).addContent(content));
      return this._controlMap.get(id);
    },
    /**
     * onBeforeRendering lifecycle method
     *
     * @private
     * @override
     */
    onBeforeRendering: function _onBeforeRendering() {
      //create layout-specific inner control
      this._createInnerControl();

      //fetch and update container header
      this._updateContainerHeader(this);

      //add content from all panels to inner control
      this._addAllPanelContent();
    },
    /**
     * onAfterRendering lifecycle method
     *
     * @private
     * @override
     */
    onAfterRendering: function _onAfterRendering() {
      this._attachResizeHandler();
    },
    /**
     * Attaches a resize handler to the container to adjust
     * the layout based on device size changes.
     *
     * @private
     */
    _attachResizeHandler: function _attachResizeHandler() {
      if (this.getDomRef()) {
        this._resizeObserver?.disconnect();
        this._resizeObserver = new ResizeObserver(entries => {
          this._setDeviceType(entries);
          this.adjustLayout();
        });
        this._resizeObserver?.observe(this.getDomRef());
      }
    },
    /**
     * Create inner control for storing content from panel
     *
     * @private
     */
    _createInnerControl: function _createInnerControl() {
      const layout = this.getProperty("layout");
      if (layout === LayoutType.Horizontal || layout === LayoutType.Vertical) {
        if (!this._wrapper) {
          this._wrapper = new FlexBox(`${this.getId()}-wrapper`, {
            width: "100%",
            renderType: "Bare"
          }).addStyleClass("sapCuxBaseWrapper");
          this.addDependent(this._wrapper);
        }
        this._wrapper.setDirection(layout === LayoutType.Horizontal ? "Row" : "Column");
      } else if (!this._iconTabBar) {
        this._iconTabBar = new IconTabBar(`${this.getId()}-iconTabBar`, {
          expandable: true,
          backgroundDesign: BackgroundDesign.Transparent,
          headerMode: "Inline",
          headerBackgroundDesign: BackgroundDesign.Transparent,
          select: event => this._onPanelSelect(event)
        });
        this.addDependent(this._iconTabBar);
      }
    },
    /**
     * Update container header information
     *
     * @private
     */
    _updateContainerHeader: function _updateContainerHeader(control) {
      //clear container header elements
      this._controlMap.get(control.getId() + "-header-contentLeft")?.removeAllItems();
      this._controlMap.get(control.getId() + "-header-contentRight")?.removeAllItems();

      //update container header elements
      this._updateHeader(control);
    },
    /**
     * Updates header information of a specified container or a panel
     *
     * @private
     * @param {BaseContainer | BasePanel} control - can be container or panel
     */
    _updateHeader: function _updateHeader(control) {
      const isSideBySideLayout = this.getProperty("layout") === LayoutType.SideBySide;
      const isContainer = control.isA("sap.cux.home.BaseContainer");

      //Update Title
      const headerTitle = this._controlMap.get(control.getId() + "-header-title");
      headerTitle?.setText(control.getProperty("title"));
      headerTitle?.setVisible(control.getProperty("title")?.trim().length > 0);

      //Add common header elements
      this._addCommonHeaderElements();
      const currentControl = isContainer && isSideBySideLayout ? this._getSelectedPanel() : control;
      const targetControl = !isContainer && isSideBySideLayout ? this : control;

      //Update Menu Items
      const menuItems = currentControl?.getAggregation("menuItems") || [];
      if (menuItems.length > 0) {
        this._addMenuItems(targetControl, menuItems);
      }

      //Update Action Buttons
      currentControl?.getAggregation("actionButtons")?.forEach(actionButton => {
        this._controlMap.get(targetControl.getId() + "-header-contentRight")?.addItem(this._getHeaderButton(actionButton));
      });
    },
    /**
     * Attaches common header elements like settings menu and full screen action to each
     * panel in the container, if enabled.
     *
     * @private
     */
    _addCommonHeaderElements: function _addCommonHeaderElements() {
      const attachHeaderElements = control => {
        const elements = [{
          property: "enableFullScreen",
          aggregation: "menuItems",
          headerElement: this._getFullScreenMenuItem(control)
        }, {
          property: "enableSettings",
          aggregation: "menuItems",
          headerElement: this._getHomeSettingsMenuItem(control)
        }, {
          property: "enableFullScreen",
          aggregation: "actionButtons",
          headerElement: this._getFullScreenButton(control)
        }];
        elements.forEach(_ref => {
          let {
            property,
            aggregation,
            headerElement
          } = _ref;
          const layout = this._getLayout();
          const currentPropertyValue = control.getProperty(property);
          const previousPropertyValue = this._commonHeaderElementStates.get(`${headerElement.getId()}-${property}`);

          //update common header elements only if there's a change in property value
          if (currentPropertyValue !== previousPropertyValue) {
            if (currentPropertyValue) {
              this._commonHeaderElementStates.set(`${headerElement.getId()}-${property}`, currentPropertyValue);
              control.addAggregation(aggregation, headerElement);

              //register full screen element with layout
              if (property === "enableFullScreen") {
                if (aggregation === "actionButtons") {
                  control.setAssociation("fullScreenButton", headerElement, true);
                }
                if (aggregation === "menuItems") {
                  control.setAssociation("fullScreenMenuItem", headerElement, true);
                }
                layout?.registerFullScreenElement(control);
              }
            } else {
              this._commonHeaderElementStates.set(`${headerElement.getId()}-${property}`, currentPropertyValue);
              control.removeAggregation(aggregation, headerElement);

              //deregister full screen element with layout
              if (property === "enableFullScreen") {
                if (aggregation === "actionButtons") {
                  control.removeAssociation("fullScreenButton", headerElement, true);
                }
                if (aggregation === "menuItems") {
                  control.removeAssociation("fullScreenMenuItem", headerElement, true);
                }
                layout?.deregisterFullScreenElement(control);
              }
            }
          }
        });
      };

      // Add common header elements for container
      attachHeaderElements(this);

      // Add common header elements for inner panels
      const panels = this.getContent() || [];
      panels.forEach(attachHeaderElements);
    },
    /**
     * Retrieves the my home settings menu item for a given panel.
     *
     * @private
     * @param {BaseContainer | BasePanel} panel - The panel for which to retrieve the home settings menu item.
     * @returns {MenuItem} The settings menu item for the given panel.
     */
    _getHomeSettingsMenuItem: function _getHomeSettingsMenuItem(panel) {
      const id = `${panel.getId()}-settings`;
      if (!this._controlMap.get(id)) {
        const menuItem = new MenuItem(id, {
          title: this._i18nBundle.getText("myHomeSettings"),
          icon: "sap-icon://user-settings",
          press: () => {
            //open settings dialog
            const layout = this._getLayout();
            layout?.openSettingsDialog();
          }
        });
        addFESRId(menuItem, "myHomeSettings");
        this._controlMap.set(id, menuItem);
      }
      return this._controlMap.get(id);
    },
    /**
     * Retrieves the full screen menu item for a given panel.
     *
     * @private
     * @param {BaseContainer | BasePanel} panel - The panel for which to retrieve the home settings menu item.
     * @returns {MenuItem} The settings menu item for the given panel.
     */
    _getFullScreenMenuItem: function _getFullScreenMenuItem(panel) {
      const id = `${panel.getId()}-showMore`;
      if (!this._controlMap.get(id)) {
        const fullScreenMenuItem = new MenuItem(id, {
          title: this._i18nBundle.getText("expand"),
          icon: "sap-icon://display-more",
          press: () => {
            const layout = this._getLayout();
            layout?.toggleFullScreen(panel);
          }
        });
        addFESRId(fullScreenMenuItem, "toggleFullScreen");
        this._controlMap.set(id, fullScreenMenuItem);
      }
      return this._controlMap.get(id);
    },
    /**
     * Generates a full screen action button for a given control, which can be a panel or a container.
     *
     * @private
     * @param {BaseContainer | BasePanel} control - The control for which the full screen button is generated.
     * @returns {Button} A Button instance configured to toggle full screen mode for the specified control.
     */
    _getFullScreenButton: function _getFullScreenButton(control) {
      const id = `${control.getId()}-fullScreen`;
      if (!this._controlMap.get(id)) {
        const fullScreenButton = new Button(id, {
          text: this._i18nBundle.getText("expand"),
          type: ButtonType.Transparent,
          press: () => {
            const layout = this._getLayout();
            layout?.toggleFullScreen(control);
          }
        });
        addFESRId(fullScreenButton, "toggleFullScreen");
        this._controlMap.set(id, fullScreenButton);
      }
      return this._controlMap.get(id);
    },
    /**
     * Returns the selected panel in the IconTabBar inner control in
     * case of SideBySide layout
     *
     * @private
     * @returns {BasePanel} selected panel
     */
    _getSelectedPanel: function _getSelectedPanel() {
      const panel = this.getContent()?.find(panel => panel.getProperty("key") === this.getProperty("selectedKey")) || this.getContent()?.[0];
      this.setProperty("selectedKey", panel?.getProperty("key"), true);
      return panel;
    },
    /**
     * Add content from all panels to the layout-specific inner control
     *
     * @private
     */
    _addAllPanelContent: function _addAllPanelContent() {
      const panels = this.getContent() || [];
      if (this.getProperty("layout") === LayoutType.SideBySide) {
        this._iconTabBar.removeAllItems();
        panels.forEach(panel => this._iconTabBar.addItem(this._getIconTabFilter(panel)));
        this._iconTabBar.setSelectedKey(this.getProperty("selectedKey"));
      } else {
        this._wrapper.removeAllItems();
        panels.forEach(panel => this._wrapper.addItem(this._getPanelContentWrapper(panel)));
      }
    },
    /**
     * Creates and returns a wrapper for containing the specified panel
     * content in case of Horizontal and Vertical layout
     *
     * @private
     * @param {BasePanel} panel - panel for which wrapper has to created
     * @returns {FlexBox} wrapper container for the given panel
     */
    _getPanelContentWrapper: function _getPanelContentWrapper(panel) {
      const id = `${panel.getId()}-contentWrapper`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new FlexBox(id, {
          direction: "Column",
          renderType: "Bare"
        }));
      }

      //Add header as the first item in case of Horizontal and Vertical layout
      this._controlMap.get(id).addItem(this._updatePanelHeader(panel));
      panel._getContent()?.forEach(content => this._controlMap.get(id).addItem(content));
      return this._controlMap.get(id);
    },
    /**
     * Returns header of the specified panel after updating it
     *
     * @private
     * @param {BasePanel} panel - panel to be updated
     * @returns {HBox} header associated with the panel
     */
    _updatePanelHeader: function _updatePanelHeader(panel) {
      const header = this._createHeader(panel);
      const isTitleVisible = panel.getProperty("title")?.trim().length > 0;
      const hasContainerTitle = this.getProperty("title")?.trim().length > 0;

      //update panel header elements
      this._updateContainerHeader(panel);

      //add header styling only if any of the header elements are visible
      header.toggleStyleClass("sapCuxPanelHeader", hasContainerTitle && (isTitleVisible || panel.getAggregation("menuItems")?.length > 0 || panel.getAggregation("actionButtons")?.length > 0));
      return header;
    },
    /**
     * Setter for container title
     *
     * @private
     * @param {string} title - updated title
     * @returns {BaseContainer} BaseContainer instance for chaining
     */
    _setTitle: function _setTitle(title) {
      //suppress invalidate to prevent container re-rendering. re-render only the concerned element
      this.setProperty("title", title, true);
      this._controlMap.get(`${this.getId()}-header-title`).setText(title);
      return this;
    },
    /**
     * Adds menu items to a control and sets up a menu button to display them.
     * If the menu for the control doesn't exist, it creates a new one.
     *
     * @private
     * @param {BaseContainer | BasePanel} control - The control to which the menu items will be added.
     * @param {MenuItem[]} menuItems - An array of menu items to be added to the menu.
     */
    _addMenuItems: function _addMenuItems(control, menuItems) {
      if (!this._controlMap.get(`${control.getId()}-menu`)) {
        //create menu list
        const list = new List(`${control.getId()}-list`, {
          itemPress: event => event.getSource().getParent().close()
        });
        this._controlMap.set(`${control.getId()}-menu`, list);

        //create menu popover
        const menuPopover = new Popover(`${control.getId()}-popover`, {
          placement: PlacementType.VerticalPreferredBottom,
          showHeader: false,
          content: [list]
        });

        //create menu button
        const menuButton = new Button(`${control.getId()}-menu-btn`, {
          icon: "sap-icon://slim-arrow-down",
          type: ButtonType.Transparent,
          press: event => menuPopover.openBy(event.getSource())
        });
        this._controlMap.set(`${control.getId()}-menu-btn`, menuButton);
      }

      //add menu button to header
      this._controlMap.get(control.getId() + "-header-contentLeft")?.addItem(this._controlMap.get(`${control.getId()}-menu-btn`));

      //Clear existing menu items and add new ones
      this._controlMap.get(`${control.getId()}-menu`).removeAllItems();
      menuItems.forEach(item => this._controlMap.get(`${control.getId()}-menu`).addItem(this._getMenuListItem(item)));
    },
    /**
     * Creates and returns a button for the corresponding header ActionButton
     *
     * @private
     * @param {Button} headerButton - ActionButton element
     * @returns {Button} Button instance created for the header element
     */
    _getHeaderButton: function _getHeaderButton(headerButton) {
      const id = `${headerButton.getId()}-btn`;
      if (!this._controlMap.get(id)) {
        this._controlMap.set(id, new Button(id, {
          type: ButtonType.Transparent,
          press: () => headerButton.firePress()
        }));
        addFESRSemanticStepName(this._controlMap.get(id), FESR_EVENTS.PRESS, getFESRId(headerButton));
      }

      //Update button details
      const button = this._controlMap.get(id);
      button.setText(headerButton.getText());
      button.setTooltip(headerButton.getTooltip());
      button.setIcon(headerButton.getIcon());
      button.setVisible(headerButton.getVisible());
      button.setEnabled(headerButton.getEnabled());
      return button;
    },
    /**
     * Retrieves the layout associated with the container, if available.
     *
     * @private
     * @returns {BaseLayout} The layout associated with the BaseContainer.
     */
    _getLayout: function _getLayout() {
      return UI5Element.getElementById(this.getAssociation("layout", null));
    },
    /**
     * Retrieves or creates a menu list item for a given menu item.
     *
     * @private
     * @param {MenuItem} menuItem - The menu item for which to retrieve or create a list item.
     * @returns {StandardListItem} The menu list item associated with the provided menu item.
     */
    _getMenuListItem: function _getMenuListItem(menuItem) {
      if (!this._controlMap.get(`${menuItem.getId()}-listItem`)) {
        this._controlMap.set(`${menuItem.getId()}-listItem`, new StandardListItem(`${menuItem.getId()}-listItem`, {
          type: "Active",
          icon: menuItem.getIcon(),
          title: menuItem.getTitle(),
          press: event => menuItem.firePress({
            button: event.getSource()
          })
        }));
        addFESRSemanticStepName(this._controlMap.get(`${menuItem.getId()}-listItem`), FESR_EVENTS.PRESS, getFESRId(menuItem));
      }
      //Update list item details
      const menuListItem = this._controlMap.get(`${menuItem.getId()}-listItem`);
      menuListItem.setIcon(menuItem.getIcon());
      menuListItem.setTitle(menuItem.getTitle());
      menuListItem.setVisible(menuItem.getVisible());
      return menuListItem;
    },
    /**
     * Toggles the visibility of menu Item.
     *
     * @private
     * @param {boolean} show - Indicates whether to show or hide the menu item.
     * @returns {void}
     */
    toggleMenuListItem: function _toggleMenuListItem(menuItem, show) {
      if (menuItem) {
        const menuListItem = this._getMenuListItem(menuItem);
        menuListItem?.setVisible(show);
      }
    },
    removeContent: function _removeContent(panel) {
      if (this.getProperty("selectedKey") && this.getProperty("selectedKey") === panel.getProperty("key")) {
        this.setProperty("selectedKey", undefined, true);
      }
      this.removeAggregation("content", panel);
    },
    /**
     * Gets current value of property "width".
     *
     * Default value is: "100%"
     * @returns {CSSSize} Value of property "width"
     */
    getWidth: function _getWidth() {
      return this.getProperty("width");
    },
    /**
     * Toggles the visibility of action buttons within the container and/or its inner panels.
     *
     * @private
     * @param {boolean} show - Indicates whether to show or hide the action buttons.
     * @returns {void}
     */
    toggleActionButtons: function _toggleActionButtons(show) {
      const isSideBySideLayout = this.getProperty("layout") === LayoutType.SideBySide;
      let visibilityChanged = false;
      const toggleActionButtons = control => {
        control.getActionButtons()?.forEach(actionButton => {
          const currentVisibility = actionButton.getVisible();
          if (currentVisibility !== show) {
            actionButton.setProperty("visible", show, true);
            visibilityChanged = true;
          }
        });
        if (!isSideBySideLayout && visibilityChanged) {
          this._updateContainerHeader(control);
        }
      };

      // Toggle action buttons for container
      toggleActionButtons(this);

      // Toggle action buttons for inner panels
      const panels = this.getContent() || [];
      panels.forEach(toggleActionButtons);

      // Update Header Container if required
      if (isSideBySideLayout && visibilityChanged) {
        this._updateContainerHeader(this);
      }
    },
    /**
     * Toggles the visibility of the full screen button for the specified element.
     *
     * @private
     * @param {BaseContainer | BasePanel} element - The element for which to toggle the full screen button.
     * @param {boolean} show - Indicates whether to show or hide the full screen button.
     * @param {boolean} isElementExpanded - Indicates whether the element is expanded.
     */
    toggleFullScreenElements: function _toggleFullScreenElements(element, show, isElementExpanded) {
      const fullScreenButton = UI5Element.getElementById(element.getAssociation("fullScreenButton", null));
      const fullScreenMenuButton = UI5Element.getElementById(element.getAssociation("fullScreenMenuItem", null));
      const isSideBySideLayout = this.getProperty("layout") === LayoutType.SideBySide;
      const isPhone = this.getDeviceType() === DeviceType.Mobile;
      let elementVisibilityChanged = false;
      [fullScreenButton, fullScreenMenuButton].forEach(fullScreenElement => {
        if (fullScreenElement && show !== fullScreenElement.getVisible()) {
          elementVisibilityChanged = true;
          show = !isPhone ? show : false;
          fullScreenElement.setProperty("visible", isElementExpanded ? true : show, true);
        }
      });
      const elementKey = element instanceof BasePanel && element.getKey();
      if (elementVisibilityChanged && (!isSideBySideLayout || isSideBySideLayout && this.getProperty("selectedKey") === elementKey)) {
        this._updateContainerHeader(element);
      }
    },
    /**
     * Sets the device type based on the width of the container element.
     *
     * @private
     * @param {ResizeObserverEntry[]} entries - The entries returned by the ResizeObserver.
     * @returns {void}
     */
    _setDeviceType: function _setDeviceType(entries) {
      const [entry] = entries;
      const width = entry?.contentRect.width;
      const deviceType = calculateDeviceType(width);
      if (this._deviceType !== deviceType) {
        this._deviceType = deviceType;
      }
    },
    /**
     * Retrieves the device type for the current instance.
     *
     * @private
     * @returns {DeviceType} - The device type. If the device type is not set, it calculates
     * and returns the device type based on the current device width.
     */
    getDeviceType: function _getDeviceType() {
      return this._deviceType || calculateDeviceType();
    }
  });
  return BaseContainer;
});
//# sourceMappingURL=BaseContainer-dbg-dbg.js.map
