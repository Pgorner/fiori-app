/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/esh/search/ui/SearchHelper", "sap/f/GridContainer", "sap/m/ImageContent", "sap/m/GenericTile", "sap/m/TileContent", "sap/m/CheckBox", "sap/m/HBox", "sap/m/VBox", "sap/m/Toolbar", "./SearchText", "../SearchLink", "sap/ui/base/ManagedObject"], function (SearchHelper, GridContainer, ImageContent, GenericTile, TileContent, CheckBox, HBox, VBox, Toolbar, __SearchText, __SearchLink, ManagedObject) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchText = _interopRequireDefault(__SearchText);
  const SearchLink = _interopRequireDefault(__SearchLink);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultGrid = GridContainer.extend("sap.esh.search.ui.controls.SearchResultGrid", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, options) {
      GridContainer.prototype.constructor.call(this, sId, options);
      this.bindAggregation("items", {
        path: "publicSearchModel>/results/items",
        factory: (id, context) => {
          const item = context.getObject();
          let checkboxContent;
          let headerToolbar;
          let imageContent;
          let tileContainer;
          let title;
          let titleDescription;
          const contentItems = [];
          if (item.data.attributes) {
            headerToolbar = new Toolbar({
              design: "Transparent",
              content: []
            }).addStyleClass("sapUiTinyMarginBottom");
            contentItems.push(headerToolbar);
            const imageUrls = item.data.attributes.filter(attr => {
              return attr?.metadata?.type === "ImageUrl"; // ToDo -> attribute 'HASHIERARCHYNODECHILD' has no property 'metadata'
            });
            checkboxContent = new CheckBox(`${id}--tileCheckBox`, {
              selected: {
                path: "publicSearchModel>selected"
              },
              select: () => {
                this.ignoreNextTilePress = true; // prevent navigation when selecting checkbox
              },
              enabled: {
                path: "publicSearchModel>selectionEnabled"
              }
            });
            headerToolbar.addContent(checkboxContent);
            if (imageUrls.length > 0 && typeof imageUrls[0].value === "string") {
              imageContent = new ImageContent(`${id}-Image`, {
                src: ManagedObject.escapeSettingsValue(imageUrls[0].value)
              }).addStyleClass("sapUiMediumMarginBegin");
              const imageFormat = imageUrls[0].metadata.format;
              if (imageFormat === "round") {
                imageContent.addStyleClass("sapUshellResultListGrid-ImageContainerRound");
              }
            }
            // link
            if (item.data?.defaultNavigationTarget) {
              if (item.data.titleAttributes.length > 0) {
                title = new SearchLink(`${id}-Title`, {
                  text: ManagedObject.escapeSettingsValue(item.data.defaultNavigationTarget.text),
                  navigationTarget: item.data.defaultNavigationTarget
                });
                contentItems.push(title);
              }
            } else if (item.data.titleAttributes.length > 0) {
              title = new SearchText("", {
                text: ManagedObject.escapeSettingsValue(item.data.titleAttributes[0].valueFormatted)
              });
              contentItems.push(title);
            }
            if (imageContent) {
              contentItems.push(imageContent);
            }
            tileContainer = new VBox({
              items: [headerToolbar, new VBox({
                items: contentItems
              })]
            });
          } else {
            // robustness for app search tiles (grid not rendered but updated based on search results!!!)
            if (item.data["title"]) {
              title = item.data["title"];
              titleDescription = item.data["subtitle"];
            }
            contentItems.push(new VBox({
              items: [title, titleDescription]
            }));
            tileContainer = new HBox({
              items: contentItems
            });
          }
          const oTile = new GenericTile(`${id}-resultItemTile`, {
            tileContent: new TileContent(`${id}-resultItemTileContent`, {
              content: tileContainer
            }),
            press: oEvent => {
              if (this.ignoreNextTilePress) {
                this.ignoreNextTilePress = false;
                return;
              }
              const data = this.getModel("publicSearchModel").getProperty(oEvent.getSource().getBindingContext("publicSearchModel").getPath()).data;
              const defaultNavigationTarget = data.defaultNavigationTarget;
              if (typeof defaultNavigationTarget?.performNavigation === "function") {
                defaultNavigationTarget.performNavigation({
                  event: oEvent
                });
              }
              const titleNavigation = data.titleNavigation;
              if (typeof titleNavigation?.performNavigation === "function") {
                titleNavigation.performNavigation({
                  event: oEvent
                });
              }
            }
          }).addStyleClass("sapElisaGridTile");
          return oTile;
        }
      });
      this.addStyleClass("sapUshellResultListGrid");
    },
    onAfterRendering: function _onAfterRendering(oEvent) {
      GridContainer.prototype.onAfterRendering.call(this, oEvent);
      // unescape bold tags
      SearchHelper.boldTagUnescaper(this.getDomRef());
      // apply custom style class to all result items based on property 'customItemStyleClass'
      SearchHelper.resultItemCustomStyleClassSetter(this);
    }
  });
  return SearchResultGrid;
});
})();