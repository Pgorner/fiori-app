/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/Select", "sap/ui/core/Item", "sap/ui/core/Element"], function (Select, Item, Element) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchSelectQuickSelectDataSource = Select.extend("sap.esh.search.ui.controls.SearchSelectQuickSelectDataSource", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, options) {
      Select.prototype.constructor.call(this, sId, options);
      this.attachChange(event => {
        const itemControl = event.getParameter("selectedItem");
        const item = itemControl.getBindingContext().getObject();
        this.handleSelectDataSource(item);
      });
      this.bindItems({
        path: "/config/quickSelectDataSources",
        template: new Item("", {
          key: "{id}",
          text: "{labelPlural}"
        })
      });
      this.bindProperty("maxWidth", {
        parts: [{
          path: "/config/optimizeForValueHelp"
        }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatter: optimizeForValueHelp => {
          if (optimizeForValueHelp) {
            this.addStyleClass("sapElisaSearchSelectQuickSelectDataSourceValueHelp");
          }
          return "100%";
        }
      });
      this.bindProperty("visible", {
        parts: [{
          path: "/config/optimizeForValueHelp"
        }, {
          path: "/config/quickSelectDataSources"
        }, {
          path: "/config/quickSelectDataSources/length"
        }, {
          path: "/count"
        }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatter: (optimizeForValueHelp, qds, qdsLength, count) => {
          if (optimizeForValueHelp) {
            // cannot be done in constructor (searchModel n.a.), control has no custom renderer -> thus put it here
            this.addStyleClass("sapElisaSearchSelectQuickSelectDataSourceValueHelp");
          }
          return qds?.length > 0;
        }
      });
    },
    handleSelectDataSource: function _handleSelectDataSource(dataSource) {
      const oModel = this.getModel();
      // reset search term (even if selected item gets pressed again)
      if (oModel.config.bResetSearchTermOnQuickSelectDataSourceItemPress) {
        oModel.setSearchBoxTerm("", false);
      }
      // DWC exit for handling SearchIn facets
      if (typeof oModel.config.cleanUpSpaceFilters === "function") {
        oModel.config.cleanUpSpaceFilters(oModel);
      }
      oModel.setDataSource(dataSource, false); // true does not trigger search (example: DWC entity list) ?!?
      const searchButtonElements = window.document.querySelectorAll('[id$="-searchInputHelpPageSearchFieldGroup-button"]');
      searchButtonElements.forEach(searchButton => {
        if (searchButton.id === this.getId().replace("-searchInputHelpPageSearchFieldGroup-selectQsDs", "-searchInputHelpPageSearchFieldGroup-button")) {
          const searchButtonUi5 = Element.getElementById(searchButton.id);
          searchButtonUi5["firePress"](); // ToDo - workaround, see above
        }
      });
    }
  });
  return SearchSelectQuickSelectDataSource;
});
})();