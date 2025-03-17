/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchFacetSimpleListItem", "sap/m/List", "sap/m/library", "../../FacetTypeUI", "../../../../eventlogging/UserEvents", "../../../../error/errors", "sap/ui/core/Element"], function (__SearchFacetSimpleListItem, List, sap_m_library, ____FacetTypeUI, ______eventlogging_UserEvents, __errors, Element) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchFacetSimpleListItem = _interopRequireDefault(__SearchFacetSimpleListItem);
  const ListMode = sap_m_library["ListMode"];
  const ListSeparators = sap_m_library["ListSeparators"];
  const FacetTypeUI = ____FacetTypeUI["FacetTypeUI"];
  const UserEventType = ______eventlogging_UserEvents["UserEventType"];
  const errors = _interopRequireDefault(__errors);
  /**
   * Generic facet to be used for 'data sources' or 'attributes' (see property `facetType`)
   */
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetSimpleList = List.extend("sap.esh.search.ui.controls.SearchFacetSimpleList", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      properties: {
        facetType: {
          type: "string",
          defaultValue: FacetTypeUI.DataSource
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      let facetListGenericSettings;
      if (settings?.facetType) {
        facetListGenericSettings = {
          facetType: settings?.facetType
        };
        delete settings.facetType;
      }
      List.prototype.constructor.call(this, sId, settings);
      if (facetListGenericSettings?.facetType) {
        this.setProperty("facetType", facetListGenericSettings.facetType);
      }
      this.setMode(ListMode.SingleSelectMaster);
      this.setShowSeparators(ListSeparators.None);
      this.setIncludeItemInSelection(true);
      this.attachSelectionChange(oEvent => {
        if (this.getProperty("facetType") === FacetTypeUI.Attribute) {
          this.handleItemPress(oEvent);
        }
      });
      this.attachItemPress(oEvent => {
        const oModel = this.getModel();
        if (oModel.config.searchScopeWithoutAll) {
          return;
        }
        if (this.getProperty("facetType") === FacetTypeUI.DataSource) {
          this.handleItemPress(oEvent);
        }
      });
      this.addStyleClass("sapUshellSearchFacet");

      // define group for F6 handling
      this.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
    },
    handleItemPress: function _handleItemPress(oEvent) {
      const listItem = oEvent.getParameter("listItem");
      const oSelectedItem = listItem.getBindingContext().getObject();
      const oModel = this.getModel();
      const filterCondition = oSelectedItem.filterCondition;
      if (listItem.getSelected()) {
        // exit for handling SearchIn facets
        if (typeof oModel.config.cleanUpSpaceFilters === "function") {
          oModel.config.cleanUpSpaceFilters(oModel, filterCondition);
        }
        oModel.addFilterCondition(filterCondition);
        oModel.eventLogger.logEvent({
          type: UserEventType.FACET_FILTER_ADD,
          referencedAttribute: oSelectedItem.facetAttribute,
          clickedValue: oSelectedItem.value,
          clickedLabel: oSelectedItem.label,
          clickedPosition: listItem.getList().getItems().indexOf(listItem)
        });
      } else {
        oModel.removeFilterCondition(oSelectedItem.filterCondition);
        oModel.eventLogger.logEvent({
          type: UserEventType.FACET_FILTER_DEL,
          referencedAttribute: oSelectedItem.facetAttribute,
          clickedValue: oSelectedItem.value,
          clickedLabel: oSelectedItem.label,
          clickedPosition: listItem.getList().getItems().indexOf(listItem)
        });
      }
    },
    onAfterRendering: function _onAfterRendering(oEvent) {
      List.prototype.onAfterRendering.call(this, oEvent);
      const infoZeile = jQuery(this.getDomRef()).closest(".sapUshellSearchFacetIconTabBar").find(".sapUshellSearchFacetInfoZeile")[0];
      if (infoZeile) {
        const oInfoZeile = Element.getElementById(infoZeile.id);
        oInfoZeile.setVisible(false);
      }
      const oModel = this.getModel();
      if (oModel.config.searchInAreaOverwriteMode && typeof oModel.config.setQuickSelectDataSourceAllAppearsNotSelected === "function") {
        try {
          oModel.config.setQuickSelectDataSourceAllAppearsNotSelected(oModel, this);
        } catch (err) {
          const oError = new errors.ConfigurationExitError("setQuickSelectDataSourceAllAppearsNotSelected", oModel.config.applicationComponent, err);
          throw oError;
        }
      }
    },
    switchFacetType: function _switchFacetType(facetType) {
      const items = {
        path: "items",
        // children of "/facets" (see SearchModel "/facets/items")
        template: new SearchFacetSimpleListItem("", {
          isDataSource: facetType === FacetTypeUI.DataSource
        })
      };
      switch (facetType) {
        // attribute facet
        case FacetTypeUI.Attribute:
          {
            const oModel = this.getModel();
            let listMode;
            if (oModel.config && typeof oModel.config.getSearchInFacetListMode === "function") {
              const currentItemData = oModel.getProperty(this.getBindingContext().getPath());
              try {
                listMode = oModel.config.getSearchInFacetListMode(currentItemData);
              } catch (err) {
                const oError = new errors.ConfigurationExitError("getSearchInFacetListMode", oModel.config.applicationComponent, err);
                throw oError;
              }
            }
            this.setMode(listMode || ListMode.MultiSelect);
            break;
          }
        // datasource facet
        case FacetTypeUI.DataSource:
          this.setMode(ListMode.SingleSelectMaster);
          break;
        default:
          // unknown facet type
          throw new Error(`unknown facet type ${facetType}.`);
      }
      this.bindItems(items);
      this.setProperty("facetType", facetType, true); // this validates and stores the new value
    }
  });
  return SearchFacetSimpleList;
});
})();