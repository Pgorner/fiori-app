/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Column", "sap/m/ColumnListItem", "sap/m/HBox", "sap/m/ObjectIdentifier", "sap/m/Table", "sap/m/ToggleButton", "sap/ui/core/CustomData", "sap/ui/core/dnd/DragDropInfo", "sap/ui/core/Element", "sap/ui/core/Icon", "./BaseSettingsPanel", "./flexibility/Layout.flexibility", "./utils/Constants"], function (Column, ColumnListItem, HBox, ObjectIdentifier, Table, ToggleButton, CustomData, DragDropInfo, Element, Icon, __BaseSettingsPanel, ___flexibility_Layoutflexibility, ___utils_Constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const CHANGE_TYPES = ___flexibility_Layoutflexibility["CHANGE_TYPES"];
  const KEYUSER_SETTINGS_PANELS_KEYS = ___utils_Constants["KEYUSER_SETTINGS_PANELS_KEYS"];
  /**
   *
   * Class for Layout Settings Panel for KeyUser Settings Dialog.
   *
   * @extends BaseSettingsPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.KeyUserLayoutSettingsPanel
   */
  const KeyUserLayoutSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.KeyUserLayoutSettingsPanel", {
    metadata: {
      library: "sap.cux.home"
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      BaseSettingsPanel.prototype.init.call(this);

      //setup panel
      this.setProperty("key", KEYUSER_SETTINGS_PANELS_KEYS.LAYOUT);
      this.setProperty("title", this._i18nBundle.getText("editModeTitle"));

      // //setup layout content
      this.addAggregation("content", this.getContent());

      //fired every time on panel navigation
      this.attachPanelNavigated(() => {
        const layout = this._getPanel();
        layout.resetSections();
        void this.loadSections();
      });
    },
    /**
     * Returns the content for the Layout Settings Panel.
     *
     * @private
     * @returns {VBox} The control containing the Layout Settings Panel content.
     */
    getContent: function _getContent() {
      if (!this.layoutTable) {
        this.layoutTable = new Table(this.getId() + "--idLayoutSettingsTable", {
          width: "calc(100% - 2rem)",
          items: [],
          columns: [new Column(this.getId() + "--idSectionTitleColumn", {
            width: "100%"
          })],
          dragDropConfig: new DragDropInfo(this.getId() + "--idLayoutSettingsDragInfo", {
            sourceAggregation: "items",
            targetAggregation: "items",
            groupName: "LayoutSettingsItems",
            dropPosition: "On",
            drop: event => {
              this.onDropLayoutSettings(event);
            }
          })
        }).addStyleClass("layoutSettingsTable sapContrastPlus sapUiSmallMarginBegin");
      }
      return this.layoutTable;
    },
    /**
     * Method to load the sections
     *
     * @private
     */
    loadSections: function _loadSections() {
      try {
        const _this = this;
        const layout = _this._getPanel();
        return Promise.resolve(layout._calculateSectionsState()).then(function () {
          _this.orderedSections = layout.getSections() || [];
          const keyUserSettingsDialog = _this.getParent();
          _this.layoutTable.removeAllItems();
          _this.orderedSections.forEach(section => {
            _this.layoutTable.addItem(new ColumnListItem({
              type: _this.getParent()?.hasDetailsPage?.(section.completeId) ? "Navigation" : "Inactive",
              cells: [new HBox({
                alignItems: "Center",
                items: [new Icon({
                  src: "sap-icon://vertical-grip"
                }).addStyleClass("sapUiSmallMarginEnd"), new HBox({
                  justifyContent: "SpaceBetween",
                  alignItems: "Center",
                  width: "100%",
                  items: [new ObjectIdentifier({
                    title: section.title,
                    text: section.text,
                    tooltip: section.title
                  }), new ToggleButton({
                    tooltip: section.visible ? _this._i18nBundle.getText("hideBtn") : _this._i18nBundle.getText("showBtn"),
                    icon: "sap-icon://show",
                    type: "Emphasized",
                    enabled: !section.blocked,
                    press: event => _this.createShowHideChangeFile(event, section),
                    pressed: !section.visible,
                    ariaLabelledBy: ["selectLabel"]
                  }).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop")]
                }).addStyleClass("sapUiTinyMarginBegin")],
                width: "100%"
              })],
              press: () => keyUserSettingsDialog?.navigateToPage?.(keyUserSettingsDialog.getDetailsPage(section.completeId)),
              customData: new CustomData({
                key: "sectionObject",
                value: section
              })
            })).addStyleClass("insightsListItem insightsListMargin");
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Function to execute drag and drop among sections
     *
     * @private
     */
    onDropLayoutSettings: function _onDropLayoutSettings(event) {
      const wrapper = this._getPanel();
      const wrapperId = wrapper.getId();
      const dragItem = event.getParameter?.("draggedControl") || event.draggedControl;
      const dragItemIndex = dragItem.getParent()?.indexOfItem(dragItem);
      const dropItem = event.getParameter?.("droppedControl") || event.droppedControl;
      const dropItemIndex = dragItem.getParent()?.indexOfItem(dropItem);
      if (dragItemIndex !== dropItemIndex) {
        const sectionOrder = this.orderedSections;
        const dragObject = dragItem.data("sectionObject");
        const dropObject = dropItem.data("sectionObject");
        const actualDragItemIndex = this._getActualIndex(dragObject.completeId);
        const actualDropItemIndex = this._getActualIndex(dropObject.completeId);
        this._rearrangeLayoutElements(actualDragItemIndex, actualDropItemIndex);
        sectionOrder.splice(dragItemIndex, 1);
        sectionOrder.splice(dropItemIndex, 0, dragObject);
        wrapper.setSections(sectionOrder);
        this.addKeyUserChanges({
          selectorControl: wrapper,
          changeSpecificData: {
            changeType: CHANGE_TYPES.MOVE,
            content: {
              movedElements: [{
                id: dragObject.completeId,
                sourceIndex: actualDragItemIndex,
                targetIndex: actualDropItemIndex
              }],
              source: {
                id: wrapperId,
                aggregation: "items"
              },
              target: {
                id: wrapperId,
                aggregation: "items"
              }
            }
          }
        });
        void this.loadSections();
      }
    },
    /**
     * Retrieves the actual index of a layout element by its ID.
     *
     * @private
     * @param {string} id - The ID of the layout element to find.
     * @returns {number} The index of the layout element.
     */
    _getActualIndex: function _getActualIndex(id) {
      const layout = this._getPanel();
      this._allLayoutElements = this._allLayoutElements || [...layout.getItems()];
      const isLayoutExpanded = layout.getProperty("expanded");
      const expandedElementConfig = layout._getCurrentExpandedElement();
      if (isLayoutExpanded && expandedElementConfig) {
        // add the expanded element if it isn't already in the list
        if (!this._allLayoutElements.some(element => element.getId() === expandedElementConfig.targetContainer.getId())) {
          this._allLayoutElements.splice(layout.indexOfItem(expandedElementConfig.targetContainer), 0, expandedElementConfig.targetContainer);
        }
      }
      return this._allLayoutElements.findIndex(element => element.getId() === id);
    },
    /**
     * Rearranges the layout elements by moving an element from the source index to the target index.
     *
     * @private
     * @param {number} sourceIndex - The index of the element to move.
     * @param {number} targetIndex - The index to move the element to.
     */
    _rearrangeLayoutElements: function _rearrangeLayoutElements(sourceIndex, targetIndex) {
      const container = this._allLayoutElements.splice(sourceIndex, 1)[0];
      this._allLayoutElements.splice(targetIndex, 0, container);
    },
    /**
     * Method to set visibility of the container sections
     * Toggle button pressed event handler
     *
     * @private
     */
    createShowHideChangeFile: function _createShowHideChangeFile(oControlEvent, section) {
      const isCheckBoxSelected = !oControlEvent.getParameter("pressed");
      const keyUserChanges = this.getKeyUserChanges();
      const changeType = isCheckBoxSelected ? CHANGE_TYPES.UNHIDE : CHANGE_TYPES.HIDE;
      const oExistingChange = keyUserChanges.find(oChange => {
        return oChange.selectorControl.getId() === section.completeId;
      });

      //Check if the change already exists
      if (oExistingChange) {
        oExistingChange.changeSpecificData.changeType = changeType;
      } else {
        this.addKeyUserChanges({
          selectorControl: Element.getElementById(section.completeId),
          changeSpecificData: {
            changeType
          }
        });
      }
    }
  });
  return KeyUserLayoutSettingsPanel;
});
//# sourceMappingURL=KeyUserLayoutSettingsPanel-dbg-dbg.js.map
