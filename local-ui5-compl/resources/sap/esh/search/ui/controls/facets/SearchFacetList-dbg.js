/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "sap/m/IconTabFilter", "sap/m/Button", "../../error/errors", "./types/SearchFacetQuickSelectDataSource", "./types/SearchFacetHierarchyDynamic", "./types/SearchFacetHierarchyStatic", "./types/tabbarfacet/SearchFacetBarChart", "./types/tabbarfacet/SearchFacetPieChart", "sap/ui/core/Control", "./types/tabbarfacet/SearchFacetTabBar", "../../eventlogging/UserEvents", "../OpenShowMoreDialog", "sap/m/library", "./FacetTypeUI", "./types/tabbarfacet/SearchFacetSimpleList", "sap/m/FlexBox", "sap/m/Label"], function (__i18n, IconTabFilter, Button, __errors, __SearchFacetQuickSelectDataSource, __SearchFacetHierarchyDynamic, __SearchFacetHierarchyStatic, __SearchFacetBarChart, __SearchFacetPieChart, Control, __SearchFacetTabBar, ____eventlogging_UserEvents, ___OpenShowMoreDialog, sap_m_library, ___FacetTypeUI, __SearchFacetSimpleList, FlexBox, Label) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const errors = _interopRequireDefault(__errors);
  const SearchFacetQuickSelectDataSource = _interopRequireDefault(__SearchFacetQuickSelectDataSource);
  const SearchFacetHierarchyDynamic = _interopRequireDefault(__SearchFacetHierarchyDynamic);
  const SearchFacetHierarchyStatic = _interopRequireDefault(__SearchFacetHierarchyStatic);
  const SearchFacetBarChart = _interopRequireDefault(__SearchFacetBarChart);
  const SearchFacetPieChart = _interopRequireDefault(__SearchFacetPieChart);
  const SearchFacetTabBar = _interopRequireDefault(__SearchFacetTabBar);
  const UserEventType = ____eventlogging_UserEvents["UserEventType"];
  const openShowMoreDialog = ___OpenShowMoreDialog["openShowMoreDialog"];
  const ButtonType = sap_m_library["ButtonType"];
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const FlexJustifyContent = sap_m_library["FlexJustifyContent"];
  const FacetTypeUI = ___FacetTypeUI["FacetTypeUI"];
  const SearchFacetSimpleList = _interopRequireDefault(__SearchFacetSimpleList);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetList = Control.extend("sap.esh.search.ui.controls.SearchFacetList", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        const oSearchModel = oControl.getModel();

        // outer div
        oRm.openStart("div", oControl);
        oRm.class("sapUshellSearchFacetList");
        oRm.class("sapUshellSearchFacetFilter"); // deprecated
        oRm.openEnd();
        const facets = oControl.getAggregation("facets");
        for (let i = 0, len = facets.length; i < len; i++) {
          // ToDo
          const facet = facets[i];
          oControl.renderSectionHeader(oRm, facets, i);
          const facetModel = facet.getBindingContext().getObject();
          switch (facetModel.facetType) {
            case FacetTypeUI.Attribute:
              facet.switchFacetType(FacetTypeUI.Attribute);
              facet.attachSelectionChange(null, () => {
                // dont show the showAllBtn while the facet pane is empty
                const showAllBtn = oControl._getShowAllButton();
                const showAllBtnDomref = showAllBtn.getDomRef();
                if (showAllBtnDomref) {
                  jQuery(showAllBtnDomref).hide();
                } else {
                  // robustness
                }
              });
              if (facetModel.position <= 499) {
                facet.addStyleClass("sapUshellSearchFacetSearchInAttribute");
              }
              oRm.renderControl(facet);
              break;
            case FacetTypeUI.DataSource:
              facet.switchFacetType(FacetTypeUI.DataSource);
              facet.addStyleClass("sapUshellSearchFacetDataSource");
              oRm.renderControl(facet);
              break;
            case FacetTypeUI.QuickSelectDataSource:
              facet.addStyleClass("sapUshellSearchFacetQuickSelectDataSource");
              oRm.renderControl(facet);
              break;
            case FacetTypeUI.Hierarchy:
              if (facetModel.position <= 499) {
                facet.addStyleClass("sapUshellSearchFacetSearchInAttribute");
              }
              facet.addStyleClass("sapUshellSearchFacetHierarchyDynamic");
              oRm.renderControl(facet);
              break;
            case FacetTypeUI.HierarchyStatic:
              facet.addStyleClass("sapUshellSearchFacetHierarchyStatic");
              oRm.renderControl(facet);
              break;
            default:
              throw "program error: unknown facet type :" + facetModel.facetType;
          }
        }

        // show all filters button
        if (oSearchModel.getDataSource()?.type === "BusinessObject") {
          const hasDialogFacets = oSearchModel.oFacetFormatter.hasDialogFacetsFromMetaData(oSearchModel);
          const hasResultItems = oControl.getModel().getProperty("/boCount") > 0;
          if (hasDialogFacets && hasResultItems) {
            const showAllButton = oControl._getShowAllButton();
            if (showAllButton !== null) {
              oRm.openStart("div", oControl.getId() + "-showAllFilters");
              oRm.openEnd();
              showAllButton.setModel(oControl.getModel("i18n"));
              showAllButton.addStyleClass("sapUshellSearchFacetListShowAllFilterBtn");
              showAllButton.addStyleClass("sapUshellSearchFacetFilterShowAllFilterBtn"); // deprecated
              oRm.renderControl(showAllButton);
              oRm.close("div");
            }
          }
        }

        // close searchfacetlist div
        oRm.close("div");
      }
    },
    metadata: {
      aggregations: {
        facets: {
          singularName: "facet",
          bindable: "bindable",
          // -->> shorthand function 'bindFacets' generated -> leads to TS syntax errors and thus 'this.bindFacets' cannot be used
          multiple: true
          // visibility: "hidden", -->> bindAggregation is failing after activation of this line ?!?
        },
        _showAllBtn: {
          type: "sap.m.Button",
          multiple: false,
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings);

      // define group for F6 handling
      this.data("sap-ui-fastnavgroup", "true", true /* write into DOM */);
      this.bindFacets();
    },
    bindFacets: function _bindFacets() {
      if (!this.getBindingInfo("facets")) {
        this.bindAggregation("facets", {
          path: "/facets",
          factory: (id, oContext) => {
            const facet = oContext.getObject();
            const oModel = oContext.getModel();
            const config = oModel.config;
            switch (facet.facetType) {
              // attrbute facet (list/chart)
              case FacetTypeUI.Attribute:
                {
                  let sId = `${id}-attribute_facet`;
                  // DWC exit
                  if (typeof config?.getSpaceFacetId === "function") {
                    sId = config.getSpaceFacetId(facet.dimension, sId);
                  }
                  const oIconTabBar = new SearchFacetTabBar(sId, {
                    items: [new IconTabFilter({
                      text: i18n.getText("facetList"),
                      icon: "sap-icon://list",
                      key: `list${id}`,
                      content: new SearchFacetSimpleList(`list${id}`) // facetType: Default value is 'FacetTypeUI.DataSource'
                    }), new IconTabFilter({
                      text: i18n.getText("facetBarChart"),
                      icon: "sap-icon://horizontal-bar-chart",
                      key: `barChart${id}`,
                      content: new SearchFacetBarChart(`barChart${id}`)
                    }), new IconTabFilter({
                      text: i18n.getText("facetPieChart"),
                      icon: "sap-icon://pie-chart",
                      key: `pieChart${id}`,
                      content: new SearchFacetPieChart(`pieChart${id}`)
                    })]
                  });
                  oIconTabBar.addStyleClass("sapUshellSearchFacetIconTabBar");
                  return oIconTabBar;
                }
              case FacetTypeUI.DataSource:
                {
                  // do not use '${id}' for ID-generation, only one such facet exists
                  const dataSourceFacet = new SearchFacetSimpleList((config?.id ? config.id + "-" : "") + "dataSourceFacet", {
                    facetType: FacetTypeUI.DataSource
                  } // default value
                  );
                  if (config.exclusiveDataSource) {
                    dataSourceFacet.setVisible(false);
                  }
                  return dataSourceFacet;
                }
              // quick-select datasource facet
              case FacetTypeUI.QuickSelectDataSource:
                {
                  // do not use '${id}' for ID-generation, only one such facet exists
                  const quickSelectDataSourceList = new SearchFacetQuickSelectDataSource((config?.id ? config.id + "-" : "") + "sapUshellSearchFacetQuickSelectDataSource", {});
                  return quickSelectDataSourceList;
                }
              // hierarchy facet
              case FacetTypeUI.Hierarchy:
                {
                  const hierarchyId = `${id}-hierarchy_facet`;
                  const facet = new SearchFacetHierarchyDynamic(hierarchyId, {
                    openShowMoreDialogFunction: openShowMoreDialog // inject function because otherwise we have circular dependencies
                  });
                  return facet;
                }
              // static-hierarchy facet
              case FacetTypeUI.HierarchyStatic:
                {
                  const hierarchyStaticId = `${id}-hierarchyStatic_facet`;
                  return new SearchFacetHierarchyStatic(hierarchyStaticId, {});
                }
              default:
                {
                  const internalError = new Error(`Program error: Unknown facet type: '${facet.facetType}'`);
                  throw new errors.UnknownFacetType(internalError);
                }
            }
          }
        });
      }
    },
    getFirstFilterByFacet: function _getFirstFilterByFacet(facets) {
      for (const facet of facets) {
        const facetModel = facet.getBindingContext().getObject();
        if (facetModel.facetType === FacetTypeUI.Attribute || facetModel.facetType === FacetTypeUI.Hierarchy) {
          return facet;
        }
      }
    },
    doRenderSectionHeader: function _doRenderSectionHeader(oRm, title, showResetButton, styleClass) {
      const headerItems = [];
      // label
      const label = new Label({
        text: title
      });
      label.addStyleClass("sapUshellSearchFacetSectionHeader");
      headerItems.push(label);
      // reset button
      if (showResetButton) {
        const oSearchModel = this.getModel();
        let bFiltersExist = false;
        const rootCondition = oSearchModel.getProperty("/uiFilter/rootCondition");
        if (rootCondition.hasFilters()) {
          bFiltersExist = true;
          if (oSearchModel.filterWithoutFilterByConditions()) {
            bFiltersExist = false;
          }
          // DWC exit, remove after replacing space facet by folder
          if (typeof oSearchModel.config.hasSpaceFiltersOnly === "function") {
            if (oSearchModel.config.hasSpaceFiltersOnly(rootCondition) === true) {
              bFiltersExist = false;
            }
          }
        } else {
          bFiltersExist = false;
        }
        const oResetButton = new Button("", {
          icon: "sap-icon://clear-filter",
          tooltip: i18n.getText("resetFilterButton_tooltip"),
          type: ButtonType.Transparent,
          enabled: bFiltersExist,
          press: () => {
            oSearchModel.eventLogger.logEvent({
              type: UserEventType.CLEAR_ALL_FILTERS
            });
            oSearchModel.resetFilterByFilterConditions(true);
          }
        });
        oResetButton.addStyleClass("sapUshellSearchFilterByResetButton");
        headerItems.push(oResetButton);
      }
      // header
      const header = new FlexBox({
        justifyContent: FlexJustifyContent.SpaceBetween,
        alignItems: FlexAlignItems.Center,
        items: headerItems
      });
      if (styleClass) {
        header.addStyleClass(styleClass);
      }
      oRm.renderControl(header);
    },
    renderSectionHeader: function _renderSectionHeader(oRm, facets, facetIndex) {
      const facet = facets[facetIndex];
      if (facetIndex === 0) {
        this.doRenderSectionHeader(oRm, i18n.getText("searchIn"), false, "sapUshellSearchInSection");
        return;
      }
      if (this.getFirstFilterByFacet(facets) === facet) {
        this.doRenderSectionHeader(oRm, i18n.getText("filterBy"), true);
        return;
      }
    },
    onAfterRendering: function _onAfterRendering() {
      const $dataSource = $(".searchFacetList .searchFacet").first().find("ul"); // ToDo: JQuery
      const $dataSourceItems = $dataSource.find("li");
      $dataSource.attr("role", "tree");
      $dataSourceItems.attr("role", "treeitem");
    },
    _getShowAllButton: function _getShowAllButton() {
      if (this.getAggregation("_showAllBtn") === null) {
        const createOpenFacetDialogFn = async /* oEvent: Event */ () => {
          const oSearchModel = this.getModel();
          await openShowMoreDialog({
            searchModel: oSearchModel,
            dimension: undefined,
            selectedTabBarIndex: 0,
            tabBarItems: undefined,
            sourceControl: this
          });
        };
        const showAllBtn = new Button(`${this.getId()}-ShowMoreAll`, {
          text: "{showAllFilters}",
          press: createOpenFacetDialogFn,
          visible: true
        });
        this.setAggregation("_showAllBtn", showAllBtn);
      }
      return this.getAggregation("_showAllBtn");
    }
  });
  return SearchFacetList;
});
})();