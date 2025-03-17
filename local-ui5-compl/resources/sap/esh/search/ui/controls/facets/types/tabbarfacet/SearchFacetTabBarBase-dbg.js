/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../../../i18n", "sap/m/Button", "sap/m/ActionSheet", "sap/m/Link", "sap/m/Label", "sap/m/VBox", "sap/m/library", "sap/ui/core/Control", "./SearchFacetPieChart", "./SearchFacetBarChart", "./SearchFacetSimpleList", "sap/ui/core/Element", "sap/m/FlexBox", "../../../OpenShowMoreDialog", "../../../../personalization/PersonalizationKeys"], function (__i18n, Button, ActionSheet, Link, Label, VBox, sap_m_library, Control, __SearchFacetPieChart, __SearchFacetBarChart, __SearchFacetSimpleList, Element, FlexBox, _____OpenShowMoreDialog, ______personalization_PersonalizationKeys) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ButtonType = sap_m_library["ButtonType"];
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const FlexJustifyContent = sap_m_library["FlexJustifyContent"];
  const PlacementType = sap_m_library["PlacementType"];
  const SearchFacetPieChart = _interopRequireDefault(__SearchFacetPieChart);
  const SearchFacetBarChart = _interopRequireDefault(__SearchFacetBarChart);
  const SearchFacetSimpleList = _interopRequireDefault(__SearchFacetSimpleList);
  const openShowMoreDialog = _____OpenShowMoreDialog["openShowMoreDialog"];
  const PersonalizationKeys = ______personalization_PersonalizationKeys["PersonalizationKeys"];
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchFacetTabBarBase = Control.extend("sap.esh.search.ui.controls.SearchFacetTabBarBase", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        const tabBarItems = oControl.getAggregation("items");
        if (tabBarItems.length === 0) {
          return;
        }
        const contentFacets = oControl.getContentFacets(tabBarItems);

        // outer div
        oRm.openStart("div", oControl);
        oRm.attr("aria-label", i18n.getText("filterBy"));
        oRm.class("sapUshellSearchFacetTabBar");
        oRm.openEnd();
        const dimension = oControl.getBindingContext().getObject()["dimension"]; // ToDo
        const dataType = oControl.getBindingContext().getObject()["dataType"]; // ToDo
        const title = oControl.getBindingContext().getObject()["title"]; // ToDo
        let selectedButtonParameters;
        const oSearchModel = oControl.getModel();
        const clickedTabInformation = oSearchModel.getPersonalizationStorageInstance().getItem(PersonalizationKeys.searchFacetPanelChartState);
        if (clickedTabInformation && Object.prototype.toString.call(clickedTabInformation) === "[object Array]") {
          for (const clickedTabInformationItem of clickedTabInformation) {
            if (clickedTabInformationItem.dimension === dimension) {
              selectedButtonParameters = clickedTabInformationItem;
              break;
            }
          }
        }
        let selectedButtonIndex = 0;
        if (selectedButtonParameters && selectedButtonParameters.buttonIndex) {
          const selectedButtonIndexString = selectedButtonParameters.buttonIndex;
          selectedButtonIndex = parseInt(selectedButtonIndexString, 10);
        }
        if (dataType != oSearchModel.sinaNext.AttributeType.String) {
          selectedButtonIndex = 0;
        }

        // also store information in model
        oControl.getBindingContext().getObject()["chartIndex"] = selectedButtonIndex;
        const chartSwitchButton = oControl.assembleChartSwitchButton(tabBarItems, selectedButtonIndex, dimension);

        // RENDERING

        let oFacetHeader;
        if (dataType === oSearchModel.sinaNext.AttributeType.String) {
          oFacetHeader = new FlexBox({
            justifyContent: FlexJustifyContent.SpaceBetween,
            alignItems: FlexAlignItems.Center,
            items: [new Label({
              text: title
            }), chartSwitchButton]
          });
        } else {
          oFacetHeader = new FlexBox({
            justifyContent: FlexJustifyContent.SpaceBetween,
            alignItems: FlexAlignItems.Center,
            items: [new Label({
              text: title
            })]
          });
        }
        oFacetHeader.addStyleClass("sapUshellSearchFacetHeader");
        oFacetHeader.data("facet-dimension", dimension, true);
        if (oSearchModel.config?.searchInAttibuteFacetPostion[dimension]) {
          if (dimension === oSearchModel.config?.dimensionNameSpace_Description) {
            // do not hide
          } else {
            oFacetHeader.addStyleClass("sapUshellSearchFacetTabBarHeader");
            oFacetHeader.addStyleClass("sapUshellSearchFacetTabBarHeaderHidden");
          }
        } else {
          oFacetHeader.addStyleClass("sapUshellSearchFacetTabBarHeader");
        }

        //---------------------
        let linkText = i18n.getText("showMore");
        // DWC space facet
        if (dimension === oSearchModel.config?.dimensionNameSpace_Description) {
          linkText = i18n.getText("showMoreDwcSpace");
        }
        const oShowMore = new Link("", {
          text: linkText,
          press: oControl.createOpenFacetDialogFn(selectedButtonIndex, tabBarItems).bind(oControl)
        });
        oShowMore.setModel(oControl.getModel("i18n"));
        oShowMore.addStyleClass("sapUshellSearchFacetShowMoreLink");
        const oInfoZeile = new Label("", {
          text: ""
        });
        oInfoZeile.addStyleClass("sapUshellSearchFacetInfoZeile");
        const oShowMoreSlot = new VBox("", {
          items: [oInfoZeile, oShowMore]
        });
        oShowMoreSlot.addStyleClass("sapUshellSearchFacetShowMore");
        const facet = new VBox("", {
          //  showSeparators: ListSeparators.None,
          items: [oFacetHeader, contentFacets[selectedButtonIndex], oShowMoreSlot]
        });
        facet.addStyleClass("sapUshellSearchFacetContainer");
        facet.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
        facet.setModel(oControl.getModel());
        //removeTabIndex(oList);
        oRm.renderControl(facet);
        tabBarItems[selectedButtonIndex].addContent(contentFacets[selectedButtonIndex]); // ToDo
        // the above line returns the control to the searchFacetTabBar - otherwise it is lost by being passed to another control

        oRm.close("div");
      }
    },
    metadata: {
      // the Control API
      properties: {
        facetType: "string",
        headerText: "string",
        // including data binding and type validation
        selectedButtonParameters: {
          type: "object",
          defaultValue: null
        }
      },
      aggregations: {
        items: {
          type: "sap.m.IconTabFilter",
          multiple: true
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings);
    },
    getSearchFacetTabBarAndDimensionById: function _getSearchFacetTabBarAndDimensionById(buttonId) {
      const returnOBj = {};
      returnOBj.index = 0;
      const button = document.getElementById(buttonId);
      const view = button.dataset.facetView;
      const buttonIndex = button.dataset.facetViewIndex;
      const actionSheet = $("#" + buttonId).parent()[0];
      const dimension = actionSheet.dataset.facetDimension;
      const ar = $(".sapUshellSearchFacetTabBar");
      for (let i = 0; i < ar.length; i++) {
        const currentHeader = $(".sapUshellSearchFacetTabBar .sapUshellSearchFacetTabBarHeader")[i];
        const headerDimension = currentHeader.dataset.facetDimension;
        if (headerDimension === dimension) {
          returnOBj.index = i;
          returnOBj.control = Element.getElementById(ar[i].id);
          returnOBj.view = view;
          returnOBj.buttonIndex = buttonIndex;
          returnOBj.dimension = dimension;
          break;
        }
      }
      return returnOBj;
    },
    storeClickedTabInformation: function _storeClickedTabInformation(oEvent) {
      const tabId = oEvent.getSource()["sId"]; // ToDo
      const searchFacetTabBarInfo = this.getSearchFacetTabBarAndDimensionById(tabId);
      const oSearchModel = searchFacetTabBarInfo.control.getModel();
      const previousClickedTabInformation = oSearchModel.getPersonalizationStorageInstance().getItem(PersonalizationKeys.searchFacetPanelChartState);
      const searchFacetTabBarDimension = searchFacetTabBarInfo.dimension;
      const searchFacetTabBarControl = searchFacetTabBarInfo.control;
      const searchFacetTabBarView = searchFacetTabBarInfo.view;
      const buttonIndex = searchFacetTabBarInfo.buttonIndex;
      const dimension = searchFacetTabBarControl.getBindingContext().getObject()["dimension"]; // ToDo

      const buttonId = oEvent.getSource().getId();
      const clickedTabInformation = [];
      const obj = {};
      obj.tabId = tabId;
      obj.buttonId = buttonId;
      obj.buttonIndex = buttonIndex;
      obj.dimension = dimension;
      obj.view = searchFacetTabBarView;
      clickedTabInformation.push(obj);
      if (previousClickedTabInformation && Object.prototype.toString.call(previousClickedTabInformation) === "[object Array]") {
        for (const previousClickedTabInformationItem of previousClickedTabInformation) {
          if (previousClickedTabInformationItem.dimension !== searchFacetTabBarDimension) {
            clickedTabInformation.push(previousClickedTabInformationItem);
          }
        }
      }
      oSearchModel.getPersonalizationStorageInstance().setItem(PersonalizationKeys.searchFacetPanelChartState, clickedTabInformation);

      // also store information in model
      searchFacetTabBarControl.getBindingContext().getObject()["chartIndex"] = buttonIndex; // ToDo
    },
    createOpenFacetDialogFn: function _createOpenFacetDialogFn(iSelectedTabBarIndex, aTabBarItems) {
      return async function () {
        let dimension;
        // since UI5 reuses the showMore link control, we have to traverse the DOM
        // to find our facets dimension.

        const oSearchModel = this.getModel();
        const node = $(this.getDomRef()).closest(".sapUshellSearchFacetTabBar")[0];
        const facet = Element.getElementById($(node).attr("id"));
        if (facet?.getBindingContext()?.getObject()["dimension"] // ToDo
        ) {
          dimension = facet.getBindingContext().getObject()["dimension"]; // ToDo
        }
        if (dimension === oSearchModel.config?.dimensionNameSpace_Description && oSearchModel.config?.openSpaceShowMoreDialog) {
          return oSearchModel.config?.openSpaceShowMoreDialog(dimension, oSearchModel);
        }
        await openShowMoreDialog({
          searchModel: oSearchModel,
          dimension: dimension,
          selectedTabBarIndex: iSelectedTabBarIndex,
          tabBarItems: aTabBarItems,
          sourceControl: this
        });
      };
    },
    assembleChartSwitchButtons: function _assembleChartSwitchButtons(tabBarItems, dimension) {
      const buttons = [];
      let button = null;
      let tabBarIndex = 0;
      for (const tabBarItem of tabBarItems) {
        const oFacet = tabBarItem.getContent()[0];
        if (
        // shall be always true (prevent type-cast)
        oFacet instanceof SearchFacetSimpleList || oFacet instanceof SearchFacetPieChart || oFacet instanceof SearchFacetBarChart) {
          button = new Button("", {
            text: tabBarItem.getText(),
            icon: tabBarItem.getIcon(),
            press: oEvent => {
              this.storeClickedTabInformation(oEvent);
              this.setProperty("selectedButtonParameters", oEvent.getParameters()); // needed to trigger rerender
            }
          });
          button.data("facet-view", tabBarItem.getText(), true);
          button.data("facet-view-index", "" + tabBarIndex, true);
          button.data("dimension", dimension, true);
          buttons.push(button);
        }
        tabBarIndex++;
      }
      return buttons;
    },
    assembleChartSwitchActionSheet: function _assembleChartSwitchActionSheet(tabBarItems, dimension) {
      const buttons = this.assembleChartSwitchButtons(tabBarItems, dimension);
      const chartSwitchActionSheet = new ActionSheet("", {
        showCancelButton: false,
        buttons: buttons,
        placement: PlacementType.Bottom,
        afterClose: () => {
          window.setTimeout(() => {
            const buttons = Array.from(document.querySelectorAll(".sapUshellSearchFacetTabBarButton"));
            for (const button of buttons) {
              const buttoneDimension = button.getAttribute("data-facet-dimension");
              if (dimension === buttoneDimension) {
                button.focus();
              }
            }
          }, 100);
        }
      });
      chartSwitchActionSheet.data("facet-dimension", dimension, true);
      return chartSwitchActionSheet;
    },
    assembleChartSwitchButton: function _assembleChartSwitchButton(tabBarItems, selectedButtonIndex, dimension) {
      const tabBarItem = tabBarItems[selectedButtonIndex];
      const chartSwitchActionSheet = this.assembleChartSwitchActionSheet(tabBarItems, dimension);
      const chartSwitchButton = new Button("", {
        icon: tabBarItem.getIcon(),
        type: ButtonType.Transparent
      });
      chartSwitchButton.data("facet-dimension", dimension, true);
      chartSwitchButton.addStyleClass("sapUshellSearchFacetTabBarButton");
      const asWhat = tabBarItem.getText();
      const displayAs = i18n.getText("displayAs", [asWhat]);
      chartSwitchButton.setTooltip(displayAs);
      chartSwitchButton.attachPress(() => {
        chartSwitchActionSheet.openBy(chartSwitchButton);
      });
      chartSwitchButton.onAfterRendering = () => {
        $(chartSwitchButton.getDomRef()).attr("aria-label", i18n.getText("dropDown"));
      };
      return chartSwitchButton;
    },
    getContentFacets: function _getContentFacets(tabBarItems) {
      const contentFacets = [];
      for (const tabBarItem of tabBarItems) {
        const oFacet = tabBarItem.getContent()[0];
        if (
        // shall be always true (prevent type-cast)
        oFacet instanceof SearchFacetSimpleList || oFacet instanceof SearchFacetPieChart || oFacet instanceof SearchFacetBarChart) {
          contentFacets.push(oFacet);
        }
      }
      return contentFacets;
    }
  });
  return SearchFacetTabBarBase;
});
})();