/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/ToggleButton", "sap/ui/core/IconPool", "../i18n", "sap/ui/Device", "sap/m/OverflowToolbarLayoutData", "sap/m/library", "sap/m/OverflowToolbar", "sap/m/OverflowToolbarButton", "../controls/SearchSpreadsheet", "../eventlogging/UserEvents", "sap/m/ToolbarSpacer", "sap/m/ToolbarSeparator", "../error/errors", "sap/m/Button", "sap/m/ActionSheet", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/m/SegmentedButton", "sap/m/SegmentedButtonItem", "sap/ui/model/BindingMode", "sap/m/ViewSettingsDialog", "sap/ui/core/Element"], function (ToggleButton, IconPool, __i18n, Device, OverflowToolbarLayoutData, sap_m_library, OverflowToolbar, OverflowToolbarButton, __SearchSpreadsheet, ___eventlogging_UserEvents, ToolbarSpacer, ToolbarSeparator, __errors, Button, ActionSheet, IconTabBar, IconTabFilter, SegmentedButton, SegmentedButtonItem, BindingMode, ViewSettingsDialog, Element) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ButtonType = sap_m_library["ButtonType"];
  const OverflowToolbarPriority = sap_m_library["OverflowToolbarPriority"];
  const PlacementType = sap_m_library["PlacementType"];
  const URLHelper = sap_m_library["URLHelper"];
  const SearchSpreadsheet = _interopRequireDefault(__SearchSpreadsheet);
  const UserEventType = ___eventlogging_UserEvents["UserEventType"];
  const errors = _interopRequireDefault(__errors);
  class ToolbarAssembler {
    compositeControl;
    constructor(compositeControl) {
      this.compositeControl = compositeControl;
    }
    assembleFilterButton() {
      const oModel = this.compositeControl.getModelInternal();
      const filterBtn = new ToggleButton(this.compositeControl.getId() + "-searchBarFilterButton", {
        icon: IconPool.getIconURI("filter"),
        tooltip: {
          parts: [{
            path: "/facetVisibility"
          }],
          formatter: facetVisibility => {
            return facetVisibility ? i18n.getText("hideFacetBtn_tooltip") : i18n.getText("showFacetBtn_tooltip");
          }
        },
        pressed: {
          path: "/facetVisibility"
        },
        press: oEvent => {
          const oModel = this.compositeControl.getModelInternal();
          // open/close facet panel
          this.compositeControl.searchContainer.setProperty("animateFacetTransition", true);
          oModel.setFacetVisibility(oEvent.getParameter("pressed"));
          this.compositeControl.searchContainer.setProperty("animateFacetTransition", false);
          setTimeout(() => this.compositeControl.adjustSearchbarCustomGenericButtonWidth(), 100); // see this._resizeHandler();
        },
        visible: {
          parts: [{
            path: "/businessObjSearchEnabled"
          }, {
            path: "/count"
          }],
          formatter: (businessObjSearchEnabled, count) => {
            if (count === 0) {
              return false;
            }
            return (
              // do not show button on phones
              // do not show in value-help mode
              // only show, if business obj. search is active
              !Device.system.phone && !oModel.config.optimizeForValueHelp && businessObjSearchEnabled
            );
          }
        }
      });
      filterBtn.addStyleClass("searchBarFilterButton");
      filterBtn.setLayoutData(new OverflowToolbarLayoutData({
        priority: OverflowToolbarPriority.NeverOverflow
      }));
      return filterBtn;
    }
    assembleGenericButtonsToolbar() {
      const oModel = this.compositeControl.getModelInternal();

      // table data export button
      const dataExportButton = this.assembleExportButton();
      dataExportButton.setLayoutData(new OverflowToolbarLayoutData({
        priority: OverflowToolbarPriority.High
      }) // 'high': Custom buttons can choose 'Low' or 'NeverOverflow' to make their button more/less important than ours
      );

      // display-switch tap strips
      this.assembleResultViewSwitch();

      // sort button
      const sortButton = new OverflowToolbarButton((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "tableSortButton", {
        icon: "sap-icon://sort",
        text: "{i18n>sortTable}",
        tooltip: "{i18n>sortTable}",
        type: ButtonType.Transparent,
        visible: {
          parts: [{
            path: "/count"
          }, {
            path: "/sortableAttributes"
          }],
          formatter: (count, sortAttributes) => {
            const oModel = this.compositeControl.getModelInternal();
            if (oModel && oModel.isHomogenousResult() && count > 0 && sortAttributes.length > 0) {
              return true;
            } else {
              return false;
            }
          }
        },
        press: () => {
          this.compositeControl.openSortDialog();
        }
      });
      sortButton.addStyleClass("sapUshellSearchTableSortButton");
      sortButton.setLayoutData(new OverflowToolbarLayoutData({
        priority: OverflowToolbarPriority.High
      }) // 'high': Custom buttons can choose 'Low' or 'NeverOverflow' to make their button more/less important than ours
      );

      // sort dialog
      this.compositeControl.sortDialog = this.assembleSearchResultSortDialog();

      // table personalize button
      const tablePersonalizeButton = new OverflowToolbarButton((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "tablePersonalizeButton", {
        icon: "sap-icon://action-settings",
        text: "{i18n>personalizeTable}",
        tooltip: "{i18n>personalizeTable}",
        type: ButtonType.Transparent,
        enabled: {
          parts: [{
            path: "/resultViewType"
          }],
          formatter: resultViewType => resultViewType === "searchResultTable"
        },
        visible: {
          parts: [{
            path: "/count"
          }, {
            path: "/tableColumns"
          }],
          formatter: (count, columns) => {
            const oModel = this.compositeControl.getModelInternal();
            if (oModel && oModel.isHomogenousResult() && count > 0 && columns.length > 0) {
              return true;
            } else {
              return false;
            }
          }
        },
        press: () => {
          this.compositeControl.searchResultTable?.tablePersonalizer?.openDialog();
          const oModel = this.compositeControl.getModelInternal();
          const userEventTableConfigOpen = {
            type: UserEventType.TABLE_CONFIG_OPEN
          };
          oModel.eventLogger.logEvent(userEventTableConfigOpen);
        }
      });
      tablePersonalizeButton.addStyleClass("sapUshellSearchTablePersonalizeButton");
      tablePersonalizeButton.setLayoutData(new OverflowToolbarLayoutData({
        priority: OverflowToolbarPriority.High
      }) // 'high': Custom buttons can choose 'Low' or 'NeverOverflow' to make their button more/less important than ours
      );
      let toolbarContent = [];
      // standard buttons (export, sort, table personalization)
      toolbarContent.push(dataExportButton);
      toolbarContent.push(sortButton);
      toolbarContent.push(tablePersonalizeButton);
      // share button
      const bWithShareButton = oModel?.config?.isUshell;
      if (bWithShareButton) {
        const shareButton = this.assembleShareButton();
        shareButton.setLayoutData(new OverflowToolbarLayoutData({
          priority: OverflowToolbarPriority.High
        }) // 'high': Custom buttons can choose 'Low' or 'NeverOverflow' to make their button more/less important than ours
        );
        toolbarContent.push(shareButton);
      }
      toolbarContent.push(this.compositeControl.resultViewSwitch);
      let hasCustomButtons = false;
      try {
        let customToolbar = [new ToolbarSpacer()];
        const customToolbarContent = oModel?.config?.getCustomToolbar();
        if (customToolbarContent?.length > 0) {
          hasCustomButtons = true;
          customToolbarContent.push(new ToolbarSeparator("", {
            visible: {
              parts: [{
                path: "/resultViewSwitchVisibility"
              }, {
                path: "/count"
              }],
              formatter: (resultViewSwitchVisibility, count) => {
                return resultViewSwitchVisibility && count !== 0;
              }
            }
          }));
        }
        customToolbar = customToolbar.concat(customToolbarContent);
        toolbarContent = customToolbar.concat(toolbarContent);
      } catch (err) {
        const oError = new errors.ConfigurationExitError("getCustomToolbar", oModel.config.applicationComponent, err);
        this.compositeControl.errorHandler.onError(oError);
        // do not throw oError, just do not any custom buttons to 'toolbar'
      }
      // put toobar buttons in a separate overflow toolbar to control its width independently of datasource tab strip
      const toolbar = new OverflowToolbar(this.compositeControl.getId() + "-searchBar--genericButtonsToolbar", {
        content: toolbarContent
      });
      toolbar.addStyleClass("sapElisaSearchGenericButtonsToolbar");
      return {
        toolbar: toolbar,
        hasCustomButtons: hasCustomButtons
      };
    }
    assembleSearchResultSortDialog() {
      const sortDialogId = this.compositeControl.getId() + "-sortDialog";

      // destroy old sort dialog
      const oldSortDialog = Element.getElementById(sortDialogId);
      if (oldSortDialog) {
        oldSortDialog.destroy();
      }
      const sortDialog = new ViewSettingsDialog(sortDialogId, {
        sortDescending: {
          parts: [{
            path: "/orderBy"
          }],
          formatter: orderBy => {
            return Object.keys(orderBy).length === 0 || orderBy.sortOrder === "DESC";
          }
        },
        confirm: oEvent => {
          const paramsSortItem = oEvent.getParameter("sortItem");
          const paramsSortDescending = oEvent.getParameter("sortDescending");
          const oModel = this.compositeControl.getModelInternal();
          const attributeId = paramsSortItem.getBindingContext().getObject().attributeId;
          if (typeof paramsSortItem === "undefined" || attributeId === "DEFAULT_SORT_ATTRIBUTE") {
            sortDialog.setSortDescending(true);
            oModel.resetOrderBy(true);
          } else {
            oModel.setOrderBy({
              orderBy: attributeId,
              sortOrder: paramsSortDescending === true ? "DESC" : "ASC"
            }, true);
          }
          // sortDialog.unbindAggregation("sortItems", true);
        },
        cancel: () => {
          // sortDialog.unbindAggregation("sortItems", true);
        },
        resetFilters: () => {
          // issue: default sort item can't be set, multiple reset selection in UI5
          // workaround: set sort item after time delay
          setTimeout(() => {
            sortDialog.setSortDescending(true);
            sortDialog.setSelectedSortItem("searchSortAttributeKeyDefault");
          }, 500);
        }
      });
      sortDialog.addStyleClass("sapUshellSearchResultSortDialog"); // obsolete
      sortDialog.addStyleClass("sapElisaSearchResultSortDialog");
      this.compositeControl.addDependent(sortDialog);
      return sortDialog;
    }
    assembleExportButton() {
      return new OverflowToolbarButton((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "ushell-search-result-dataExportButton", {
        icon: "sap-icon://download",
        text: "{i18n>exportData}",
        tooltip: "{i18n>exportData}",
        type: ButtonType.Transparent,
        visible: {
          parts: [{
            path: "/count"
          }, {
            path: "/tableColumns"
          }],
          formatter: (count, columns) => {
            const oModel = this.compositeControl.getModelInternal();
            if (oModel && oModel.isHomogenousResult() && count > 0 && columns.length > 0) {
              return true;
            } else {
              return false;
            }
          }
        },
        press: () => {
          if (this.compositeControl.searchSpreadsheet === undefined) {
            this.compositeControl.searchSpreadsheet = new SearchSpreadsheet("ushell-search-spreadsheet");
          }
          const oModel = this.compositeControl.getModelInternal();
          this.compositeControl.searchSpreadsheet.onExport(oModel);
        }
      }).addStyleClass("sapUshellSearchTableDataExportButton");
    }
    assembleShareButton() {
      // create action sheet
      const oActionSheet = new ActionSheet((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "shareActionSheet", {
        placement: PlacementType.Bottom,
        buttons: []
      });
      oActionSheet.addStyleClass("sapUshellSearchResultShareActionSheet");
      this.compositeControl.addDependent(oActionSheet); // -> destroys action sheet if SearchCompositeControl gets destroyed

      // fill action sheet async with buttons
      const oModel = this.compositeControl.getModelInternal();
      sap.ui.require(["sap/ushell/ui/footerbar/AddBookmarkButton"], AddBookmarkButton => {
        // 1) bookmark button (entry in action sheet)
        const oBookmarkButton = new AddBookmarkButton((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "bookmarkButton", {
          width: "auto",
          beforePressHandler: () => {
            const oAppData = {
              url: document.URL,
              title: oModel.getDocumentTitle(),
              icon: IconPool.getIconURI("search")
            };
            oBookmarkButton.setAppData(oAppData);
          }
        });
        oActionSheet.addButton(oBookmarkButton);
        // 2) email button
        const oEmailButton = new Button((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "emailButton", {
          icon: "sap-icon://email",
          text: i18n.getText("eMailFld"),
          width: "auto",
          press: () => {
            URLHelper.triggerEmail(null, oModel.getDocumentTitle(), document.URL);
          }
        });
        oActionSheet.addButton(oEmailButton);
      });

      // share button which opens the action sheet
      const oShareButton = new OverflowToolbarButton((this.compositeControl.getId() ? this.compositeControl.getId() + "-" : "") + "shareButton", {
        icon: "sap-icon://action",
        text: i18n.getText("shareBtn"),
        tooltip: i18n.getText("shareBtn"),
        type: ButtonType.Transparent,
        press: () => {
          oActionSheet.openBy(oShareButton);
        }
      });
      return oShareButton;
    }
    assembleDataSourceTabBar() {
      const dataSourceTabBar = new IconTabBar(`${this.compositeControl.getId()}-dataSourceTabBar`, {
        // tabDensityMode: "Compact", // not working, we have IconTabBar in left container of another bar -> see search.less
        // headerMode: "Inline",   // do not use, confuses css when used on sap.m.Bar
        expandable: false,
        stretchContentHeight: false,
        // selectedKey: "{/tabStrips/strips/selected/id}", // id of selected data source -> does not work, special logic see below, addEventDelegate -> onBeforeRendering
        // backgroundDesign: BackgroundDesign.Transparent  // not relevant, content container is not in use
        // content: -> not needed, we only need the 'switcher' for data source change (triggers new search to update search container)
        visible: {
          parts: [{
            path: "/facetVisibility"
          }, {
            path: "/count"
          }, {
            path: "/businessObjSearchEnabled"
          }],
          formatter: (facetVisibility, count, bussinesObjSearchEnabled) => {
            const oModel = this.compositeControl.getModelInternal();
            if (oModel.config.exclusiveDataSource) {
              return false;
            }
            return !facetVisibility && count > 0 && bussinesObjSearchEnabled;
          }
        },
        selectedKey: {
          path: "/tabStrips/selected/id",
          mode: BindingMode.OneWay
        },
        select: oEvent => {
          const oModel = this.compositeControl.getModelInternal();
          if (oModel.config.searchScopeWithoutAll) {
            return;
          }
          if (oModel.getDataSource() !== oEvent.getParameter("item").getBindingContext().getObject()) {
            // selection has changed
            oModel.setDataSource(oEvent.getParameter("item").getBindingContext().getObject());
          }
        }
      });
      // define group for F6 handling
      dataSourceTabBar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
      dataSourceTabBar.addStyleClass("searchDataSourceTabStripBar");
      dataSourceTabBar.addStyleClass("sapUiSmallMarginBegin");
      dataSourceTabBar.setAriaTexts({
        headerLabel: i18n.getText("dataSources"),
        headerDescription: i18n.getText("dataSources")
      });
      dataSourceTabBar.bindAggregation("items", {
        path: "/tabStrips/strips",
        template: new IconTabFilter("", {
          key: "{id}",
          // data source id, only needed for indicator (bottom). We use bindingContext().getObject to switch search container content
          text: "{labelPlural}"
        })
      });
      return dataSourceTabBar;
    }
    assembleResultViewSwitch() {
      if (this.compositeControl.resultViewSwitch !== undefined) {
        return;
      }
      this.compositeControl.resultViewSwitch = new SegmentedButton(this.compositeControl.getId() + "-ResultViewType", {
        selectedKey: "{/resultViewType}",
        visible: {
          parts: [{
            path: "/resultViewSwitchVisibility"
          }, {
            path: "/count"
          }],
          formatter: (resultViewSwitchVisibility, count) => {
            return resultViewSwitchVisibility && count !== 0;
          }
        },
        selectionChange: oEvent => {
          const resultViewType = oEvent.getParameter("item").getKey();
          this.compositeControl.setResultViewType(resultViewType);
          this.compositeControl.assignDragDropConfig();
          const oModel = this.compositeControl.getModelInternal();
          const userEventResultViewSwitch = {
            type: UserEventType.RESULT_VIEW_SWITCH,
            resultViewType: resultViewType
          };
          oModel.eventLogger.logEvent(userEventResultViewSwitch);
        }
      });
      this.compositeControl.resultViewSwitch.bindAggregation("items", {
        path: "/resultViewTypes",
        factory: (id, context) => {
          const oButton = new SegmentedButtonItem("", {
            visible: true
          });
          switch (context.getObject()) {
            case "searchResultList":
              oButton.setIcon("sap-icon://list");
              oButton.setTooltip(i18n.getText("displayList"));
              oButton.setKey("searchResultList");
              break;
            case "searchResultTable":
              oButton.setIcon("sap-icon://table-view");
              oButton.setTooltip(i18n.getText("displayTable"));
              oButton.setKey("searchResultTable");
              break;
            case "searchResultGrid":
              oButton.setIcon("sap-icon://grid");
              oButton.setTooltip(i18n.getText("displayGrid"));
              oButton.setKey("searchResultGrid");
              break;
            default:
              oButton.setVisible(false);
          }
          return oButton;
        }
      });
      this.compositeControl.resultViewSwitch.addStyleClass("sapUshellSearchResultViewSwitch");
      this.compositeControl.resultViewSwitch.setLayoutData(new OverflowToolbarLayoutData({
        priority: OverflowToolbarPriority.High
      }) // 'high': Custom buttons can choose 'Low' or 'NeverOverflow' to make their button more/less important than ours
      );
    }
  }
  return ToolbarAssembler;
});
})();