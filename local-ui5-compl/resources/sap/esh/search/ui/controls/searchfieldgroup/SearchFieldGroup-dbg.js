/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/core/InvisibleText", "sap/m/Button", "sap/m/library", "sap/m/Menu", "sap/m/MenuItem", "sap/m/FlexBox", "sap/m/FlexItemData", "./SearchInput", "./SearchButton", "sap/ui/core/Control", "./SearchSelect", "./SearchSelectQuickSelectDataSource", "../../i18n", "sap/m/Popover", "sap/m/FormattedText"], function (InvisibleText, Button, sap_m_library, Menu, MenuItem, FlexBox, FlexItemData, __SearchInput, __SearchButton, Control, __SearchSelect, __SearchSelectQuickSelectDataSource, __i18n, Popover, FormattedText) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ButtonType = sap_m_library["ButtonType"];
  const PlacementType = sap_m_library["PlacementType"];
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const SearchInput = _interopRequireDefault(__SearchInput);
  const SearchButton = _interopRequireDefault(__SearchButton);
  const SearchSelect = _interopRequireDefault(__SearchSelect);
  const SearchSelectQuickSelectDataSource = _interopRequireDefault(__SearchSelectQuickSelectDataSource);
  const i18n = _interopRequireDefault(__i18n);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFieldGroup = Control.extend("sap.esh.search.ui.controls.SearchFieldGroup", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        oRm.openStart("div", oControl);
        oRm.class("SearchFieldGroup");
        oRm.openEnd();
        oRm.renderControl(oControl.getAggregation("_topFlexBox"));
        oRm.renderControl(oControl.getAggregation("_flexBox"));
        oRm.renderControl(oControl.getAggregation("_buttonAriaText"));
        oRm.close("div");
      }
    },
    metadata: {
      properties: {
        selectActive: {
          defaultValue: true,
          type: "boolean"
        },
        selectQsDsActive: {
          defaultValue: false,
          type: "boolean"
        },
        inputActive: {
          defaultValue: true,
          type: "boolean"
        },
        buttonActive: {
          defaultValue: true,
          type: "boolean"
        },
        nlqExplainButtonActive: {
          defaultValue: false,
          type: "boolean"
        },
        cancelButtonActive: {
          defaultValue: true,
          type: "boolean"
        },
        actionsMenuButtonActive: {
          defaultValue: false,
          type: "boolean"
        }
      },
      aggregations: {
        _topFlexBox: {
          type: "sap.m.FlexBox",
          multiple: false,
          visibility: "hidden"
        },
        _flexBox: {
          type: "sap.m.FlexBox",
          multiple: false,
          visibility: "hidden"
        },
        _buttonAriaText: {
          type: "sap.ui.core.InvisibleText",
          multiple: false,
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(sId, options) {
      options = options || {};
      options.nlqExplainButtonActive = "{/isNlqActive}";
      Control.prototype.constructor.call(this, sId, options);
      this.initSelect();
      this.initSelectQsDs();
      this.initInput();
      this.initButton();
      this.initNlqExplainButton();
      this.initCancelButton();
      this.initActionsMenuButton();
      this.initFlexBox();
    },
    setCancelButtonActive: function _setCancelButtonActive(active) {
      if (active === this.getProperty("cancelButtonActive")) {
        return;
      }
      this.setProperty("cancelButtonActive", active);
      this.initFlexBox();
    },
    setNlqExplainButtonActive: function _setNlqExplainButtonActive(active) {
      if (active === this.getProperty("nlqExplainButtonActive")) {
        return;
      }
      this.setProperty("nlqExplainButtonActive", active);
      this.initFlexBox();
    },
    setActionsMenuButtonActive: function _setActionsMenuButtonActive(active) {
      if (active === this.getProperty("actionsMenuButtonActive")) {
        return;
      }
      this.setProperty("actionsMenuButtonActive", active);
      this.initFlexBox();
    },
    setSelectActive: function _setSelectActive(active) {
      if (active === this.getProperty("selectActive")) {
        return;
      }
      this.setProperty("selectActive", active);
      this.initFlexBox();
    },
    setSelectQsDsActive: function _setSelectQsDsActive(active) {
      if (active === this.getProperty("selectQsDsActive")) {
        return;
      }
      this.setProperty("selectQsDsActive", active);
      this.initFlexBox();
    },
    initFlexBox: function _initFlexBox() {
      if (!this.select) {
        return;
      }
      if (!this.selectQsDs) {
        return;
      }
      const topItems = [];
      const items = [];
      if (this.getProperty("selectActive")) {
        this.select.setLayoutData(new FlexItemData("", {
          growFactor: 0
        }));
        items.push(this.select);
      }
      if (this.getProperty("selectQsDsActive")) {
        this.selectQsDs.setLayoutData(new FlexItemData("", {
          growFactor: 1
        }));
        topItems.push(this.selectQsDs);
      }
      if (this.getProperty("inputActive")) {
        this.input.setLayoutData(new FlexItemData("", {
          growFactor: 1
        }));
        items.push(this.input);
      }
      if (this.getProperty("buttonActive")) {
        this.button.setLayoutData(new FlexItemData("", {
          growFactor: 0
        }));
        items.push(this.button);
      }
      if (this.getProperty("nlqExplainButtonActive")) {
        this.button.setLayoutData(new FlexItemData("", {
          growFactor: 0
        }));
        items.push(this.nlqExplainButton);
      }
      if (this.getProperty("cancelButtonActive")) {
        this.cancelButton.setLayoutData(new FlexItemData("", {
          growFactor: 0
        }));
        items.push(this.cancelButton);
      }
      if (this.getProperty("actionsMenuButtonActive")) {
        this.actionsMenuButton.setLayoutData(new FlexItemData("", {
          growFactor: 0
        }));
        items.push(this.actionsMenuButton);
      }
      if (this.getProperty("selectQsDsActive")) {
        let topFlexBox = this.getAggregation("_topFlexBox");
        if (!topFlexBox) {
          topFlexBox = new FlexBox("", {
            items: topItems
          });
          this.setAggregation("_topFlexBox", topFlexBox);
        } else {
          topFlexBox.removeAllAggregation("items");
          for (const topItem of topItems) {
            topFlexBox.addItem(topItem);
          }
        }
      }
      let flexBox = this.getAggregation("_flexBox");
      if (!flexBox) {
        flexBox = new FlexBox("", {
          alignItems: FlexAlignItems.Start,
          items: items
        });
        this.setAggregation("_flexBox", flexBox);
      } else {
        flexBox.removeAllAggregation("items");
        for (const item of items) {
          flexBox.addItem(item);
        }
      }
    },
    initSelect: function _initSelect() {
      this.select = new SearchSelect(this.getId() + "-select", {});
      this.select.attachChange(function () {
        if (this.getAggregation("input")) {
          const input = this.getAggregation("input");
          input.destroySuggestionRows();
        }
      });
    },
    initSelectQsDs: function _initSelectQsDs() {
      this.selectQsDs = new SearchSelectQuickSelectDataSource(this.getId() + "-selectQsDs", {});
      this.selectQsDs.attachChange(function () {
        if (this.getAggregation("input")) {
          const input = this.getAggregation("input");
          input.destroySuggestionRows();
        }
      });
    },
    initInput: function _initInput() {
      this.input = new SearchInput(this.getId() + "-input");
    },
    initButton: function _initButton() {
      this.button = new SearchButton(this.getId() + "-button", {
        tooltip: {
          parts: [{
            path: "/searchButtonStatus"
          }],
          formatter: searchButtonStatus => {
            return i18n.getText("searchButtonStatus_" + searchButtonStatus);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        press: event => {
          // searchterm is empty and datasource==all
          // do not trigger search instead close search field
          const model = this.button.getModel();
          if (model.config.isUshell) {
            if (this.input.getValue() === "" && model.getDataSource() === model.getDefaultDataSource()) {
              return;
            }
          }
          // trigger search
          model.invalidateQuery();
          this.input.destroySuggestionRows();
          this.input.triggerSearch();
        }
      });
      const oInvisibleText = new InvisibleText(this.getId() + "-buttonAriaText", {
        text: {
          parts: [{
            path: "/searchButtonStatus"
          }],
          formatter: searchButtonStatus => {
            return i18n.getText("searchButtonStatus_" + searchButtonStatus);
          }
        }
      });
      this.setAggregation("_buttonAriaText", oInvisibleText);
      this.button.addAriaLabelledBy(this.getAggregation("_buttonAriaText"));
    },
    initNlqExplainButton: function _initNlqExplainButton() {
      this.nlqExplainPopover = this.assembleNlqPopover();
      this.nlqExplainButton = new Button(this.getId() + "-nlqExplainButton", {
        icon: "sap-icon://ai",
        tooltip: "{i18n>nlqExplainButtonTooltip}",
        press: () => {
          this.nlqExplainPopover.setModel(this.getModel());
          this.nlqExplainPopover.setModel(this.getModel("i18n"), "i18n");
          this.nlqExplainPopover.openBy(this.input);
        },
        enabled: {
          parts: [{
            path: "/nlqResult/success"
          }, {
            path: "/isBusy"
          }],
          formatter: (success, isBusy) => {
            return !!success && !isBusy;
          }
        }
      });
      this.nlqExplainButton.addStyleClass("sapUshellSearchNlqExplainButton");
    },
    assembleNlqPopover: function _assembleNlqPopover() {
      const filterDescription = new FormattedText({
        htmlText: {
          parts: [{
            path: "/nlqResult/filterDescription"
          }],
          formatter: filterDescription => {
            if (!filterDescription) {
              return i18n.getText("nlqNoFilter");
            }
            return filterDescription;
          }
        }
      });
      filterDescription.addStyleClass("sapUiSmallMargin");
      const popover = new Popover({
        title: "{i18n>nlqPopoverTitle}",
        content: [filterDescription],
        placement: PlacementType.Bottom
      });
      popover.addStyleClass("sapUshellSearchNlqExplainPopover");
      this.input.attachBrowserEvent("focusin", () => {
        popover.close();
        this.input.focus(); // popover close sets focus to ai explain button therefore again set focus to input
      });
      return popover;
    },
    initCancelButton: function _initCancelButton() {
      this.cancelButton = new Button(this.getId() + "-buttonCancel", {
        text: "{i18n>cancelBtn}"
      });
      this.cancelButton.addStyleClass("sapUshellSearchCancelButton");
    },
    initActionsMenuButton: function _initActionsMenuButton() {
      const searchfieldGroupId = this.getId();
      this.actionsMenuButton = new Button(searchfieldGroupId + "-actionsMenuButton", {
        icon: "sap-icon://overflow",
        type: ButtonType.Emphasized,
        press: () => {
          if (!this.actionsMenu) {
            const menuItems = [];
            // sort
            const menuItemSort = new MenuItem(searchfieldGroupId + "-menuItemSort", {
              text: "{i18n>actionsMenuSort}",
              icon: "sap-icon://sort",
              press: (/* oEvent: Event */
              ) => {
                const searchModel = this.getModel();
                const searchCompositeControlInstance = searchModel.getSearchCompositeControlInstanceByChildControl(this.actionsMenuButton);
                if (searchCompositeControlInstance) {
                  searchCompositeControlInstance.openSortDialog();
                } else {
                  // not expected / robustness -> do not swhow sort popover
                }
              }
            });
            menuItems.push(menuItemSort);
            // filter
            const menuItemFilter = new MenuItem((this.getId() ? this.getId() + "-" : "") + "menuItemFilter", {
              text: "{i18n>actionsMenuFilter}",
              icon: "sap-icon://filter",
              press: (/* oEvent: any */
              ) => {
                const searchModel = this.getModel();
                const searchCompositeControlInstance = searchModel.getSearchCompositeControlInstanceByChildControl(this.actionsMenuButton);
                if (searchCompositeControlInstance) {
                  searchCompositeControlInstance.openShowMoreDialog();
                } else {
                  // not expected / robustness -> do not swhow sort popover
                }
              }
            });
            menuItems.push(menuItemFilter);
            this.actionsMenu = new Menu({
              items: menuItems
            });
            this.actionsMenu.setModel(this.getModel("i18n"), "i18n");
          }
          this.actionsMenu.openBy(this.actionsMenuButton, true);
        },
        visible: {
          parts: [{
            path: "/uiFilter/dataSource"
          }],
          formatter: dataSource => {
            return dataSource?.type === dataSource?.sina?.DataSourceType.BusinessObject;
          }
        }
      });
      this.actionsMenuButton.addStyleClass("sapUiTinyMarginBegin");
    },
    setModel: function _setModel(oModel, sName) {
      Control.prototype.setModel.call(this, oModel, sName);
      this.select.setModel(oModel, sName);
      this.input.setModel(oModel, sName);
      this.button.setModel(oModel, sName);
      this.cancelButton.setModel(oModel, sName);
      this.nlqExplainButton.setModel(oModel, sName);
      this.actionsMenuButton.setModel(oModel, sName);
      this.getAggregation("_buttonAriaText").setModel(oModel, sName);
      return this;
    },
    destroy: function _destroy() {
      Control.prototype.destroy.call(this);
      if (this.select) {
        this.select.destroy();
      }
      if (this.selectQsDs) {
        this.selectQsDs.destroy();
      }
      if (this.cancelButton) {
        this.cancelButton.destroy();
      }
      if (this.nlqExplainButton) {
        this.nlqExplainButton.destroy();
      }
      if (this.nlqExplainPopover) {
        this.nlqExplainPopover.destroy();
      }
      if (this.actionsMenuButton) {
        this.actionsMenuButton.destroy();
      }
      if (this.actionsMenu) {
        this.actionsMenu.destroy();
      }
    }
  });
  return SearchFieldGroup;
});
})();