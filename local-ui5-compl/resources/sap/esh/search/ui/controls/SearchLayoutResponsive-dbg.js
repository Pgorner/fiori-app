/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/ui/layout/ResponsiveSplitter", "sap/ui/layout/SplitterLayoutData", "sap/m/VBox", "sap/ui/layout/SplitPane", "sap/ui/layout/PaneContainer", "sap/ui/core/library", "sap/m/Text", "../UIEvents"], function (ResponsiveSplitter, SplitterLayoutData, VBox, SplitPane, PaneContainer, sap_ui_core_library, Text, __UIEvents) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Orientation = sap_ui_core_library["Orientation"];
  const UIEvents = _interopRequireDefault(__UIEvents);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchLayoutResponsive = ResponsiveSplitter.extend("sap.esh.search.ui.controls.SearchLayoutResponsive", {
    renderer: {
      apiVersion: 2
    },
    // private _postponedResultViewResizeTimer: any;
    metadata: {
      properties: {
        searchIsBusy: {
          type: "boolean"
        },
        busyDelay: {
          type: "int"
        },
        showFacets: {
          type: "boolean"
        },
        facetPanelResizable: {
          type: "boolean",
          defaultValue: false
        },
        facetPanelWidthInPercent: {
          type: "int",
          defaultValue: 25
        },
        facetPanelMinWidth: {
          type: "int",
          defaultValue: 288
        },
        animateFacetTransition: {
          type: "boolean",
          defaultValue: false
        }
      },
      aggregations: {
        resultPanelContent: {
          type: "object",
          multiple: false
        },
        facetPanelContent: {
          type: "object",
          multiple: false
        }
      }
    },
    constructor: function _constructor(sId, options) {
      ResponsiveSplitter.prototype.constructor.call(this, sId, options);

      // facets
      const facetsDummyContainer = new VBox("", {
        items: [new Text()] // dummy for initialization
      });
      this._paneLeft = new SplitPane({
        requiredParentWidth: 10,
        // use minimal width -> single pane mode disabled
        content: facetsDummyContainer
      });
      // pane right, content
      this._paneRight = new SplitPane({
        requiredParentWidth: 10,
        // use minimal width -> single pane mode disabled
        content: this._resultPanelContent
      });
      // facet panel "hidden"
      this._paneLeft.setLayoutData(new SplitterLayoutData({
        size: "0%",
        // width
        resizable: false
      }));
      // panes
      this._paneMainContainer = new PaneContainer({
        orientation: Orientation.Horizontal,
        panes: [this._paneLeft, this._paneRight],
        resize: () => {
          this.triggerUpdateLayout();
        }
      });
      this._paneMainContainer.setLayoutData(new SplitterLayoutData({
        size: "100%",
        // height
        resizable: false
      }));
      const paneContainer = this._paneMainContainer;
      this.setRootPaneContainer(paneContainer);
      this.setDefaultPane(this._paneRight); // not used
    },
    getFacetPanelContent: function _getFacetPanelContent() {
      const facetContainer = this._paneLeft;
      if (facetContainer?.getContent()) {
        return facetContainer.getContent();
      }
      return undefined;
    },
    setFacetPanelContent: function _setFacetPanelContent(oControl) {
      this._facetPanelContent = oControl;
      const facetContainer = this._paneLeft;
      if (facetContainer) {
        facetContainer.setContent(oControl);
      }
    },
    setResultPanelContent: function _setResultPanelContent(oSearchResultPanel) {
      this._resultPanelContent = oSearchResultPanel;
      if (this._paneRight) {
        this._paneRight.setContent(oSearchResultPanel);
      }
    },
    setSearchIsBusy: function _setSearchIsBusy(isBusy) {
      const searchModel = this.getModel();
      if (!searchModel) {
        return;
      }
      const searchCompositeControl = searchModel.getSearchCompositeControlInstanceByChildControl(this);
      if (!searchCompositeControl) {
        return;
      }
      searchCompositeControl.setBusyIndicatorDelay(this.getProperty("busyDelay"));
      searchCompositeControl.setBusy(isBusy);
    },
    /*setSearchIsBusy(isBusy: boolean): void {
        if (isBusy) {
            if (this._busyFlag) {
                return;
            }
            if (this._busyTimeout) {
                return;
            }
            this._busyTimeout = setTimeout(() => {
                this._busyTimeout = null;
                this._setIsBusy(isBusy);
            }, this.getProperty("busyDelay"));
        } else {
            if (this._busyFlag) {
                this._setIsBusy(isBusy);
                return;
            }
            if (this._busyTimeout) {
                clearTimeout(this._busyTimeout);
                this._busyTimeout = null;
                return;
            }
        }
    }
     _setIsBusy(isBusy: boolean): void {
        const oModel = this.getModel() as SearchModel;
        if (isBusy) {
            if (oModel.config.isUshell) {
                if (!this._busyIndicatorModal) {
                    this._busyIndicatorModal = new BusyDialog();
                }
                this._busyIndicatorModal.open();
            } else {
                this.setBusyIndicatorDelay(0); // delay handled in setSearchBusy
                this.setBusy(true);
            }
            this._busyFlag = true;
        } else if (this._busyFlag) {
            if (oModel.config.isUshell) {
                if (this._busyIndicatorModal) {
                    this._busyIndicatorModal.close();
                }
            } else {
                this.setBusy(false);
            }
            this._busyFlag = false;
        }
        this.setProperty("searchIsBusy", isBusy, true);
    }*/
    setShowFacets: function _setShowFacets(showFacets) {
      // const oModel = this.getModel() as SearchModel;
      if (!this._paneRight) {
        return;
      }
      this.updateLayout(showFacets);
      return this; // return "this" to allow method chaining
    },
    setFacetPanelWidthInPercent: function _setFacetPanelWidthInPercent(facetPanelWidthInPercentValue) {
      // the 3rd parameter supresses rerendering
      this.setProperty("facetPanelWidthInPercent", facetPanelWidthInPercentValue, true); // this validates and stores the new value
      this._facetPanelWidthSizeIsOutdated = true;
      return this; // return "this" to allow method chaining
    },
    /* call from i.e. result view after toolbar changes */triggerUpdateLayout: function _triggerUpdateLayout() {
      const paneLeftContainerLayoutData = this?._paneLeft.getLayoutData();
      const widthString = paneLeftContainerLayoutData.getProperty("size").replace("%", "");
      const facetPanelPaneWidth = parseInt(widthString);
      const facetsAreVisible = facetPanelPaneWidth > 0;
      this.updateLayout(facetsAreVisible);
    },
    updateLayout: function _updateLayout(facetsAreVisible) {
      // update facets
      // adjust the facet content
      const facetContainer = this._paneLeft;
      if (facetContainer?.getContent() instanceof VBox) {
        const vBoxItems = facetContainer.getContent().getItems();
        if (vBoxItems?.length > 0 && vBoxItems[0] instanceof Text) {
          facetContainer.setContent(this._facetPanelContent);
        }
      }
      // animation
      if (this._facetPanelContent) {
        // robustness when triggered by constructor
        if (this.getProperty("animateFacetTransition")) {
          this._facetPanelContent.addStyleClass("sapUshellSearchFacetAnimation");
        } else {
          this._facetPanelContent.removeStyleClass("sapUshellSearchFacetAnimation");
        }
      }
      // left pane - facets width / splitter position
      if (this?._paneLeft?.getContent()) {
        let currentFacetPanelWidthSize;
        const paneLeftContainerLayoutData = this?._paneLeft.getLayoutData();
        if (!facetsAreVisible) {
          this._paneLeft.getContent().setVisible(false);
          this._paneLeft.setLayoutData(new SplitterLayoutData({
            size: "0%",
            // width
            minSize: 0,
            resizable: false
          }));
        } else {
          this._paneLeft.getContent().setVisible(true);
          const oModel = this.getModel();
          let facetPanelMinWidth = this.getProperty("facetPanelMinWidth");
          if (oModel.config.optimizeForValueHelp) {
            currentFacetPanelWidthSize = 0.01; // facet panel currently needs to be visible/rendered to open filter dialog
            facetPanelMinWidth = 0;
          } else if (this._facetPanelWidthSizeIsOutdated) {
            currentFacetPanelWidthSize = this.getProperty("facetPanelWidthInPercent");
            this._facetPanelWidthSizeIsOutdated = false;
          } else {
            currentFacetPanelWidthSize = parseInt(paneLeftContainerLayoutData.getProperty("size").replace("%", ""));
            if (currentFacetPanelWidthSize < 1) {
              if (this._previousFacetPanelWidthSize) {
                currentFacetPanelWidthSize = this._previousFacetPanelWidthSize;
              } else {
                currentFacetPanelWidthSize = this.getProperty("facetPanelWidthInPercent");
              }
            }
          }
          this._paneLeft.setLayoutData(new SplitterLayoutData({
            size: currentFacetPanelWidthSize + "%",
            minSize: facetPanelMinWidth,
            resizable: this.getProperty("facetPanelResizable")
          }));
          this._previousFacetPanelWidthSize = currentFacetPanelWidthSize; // remember width to restore when showing facets (after having closed them before)
        }
      }
      this._paneMainContainer.setLayoutData(new SplitterLayoutData({
        size: "100%",
        resizable: false
      }));
      // }
      const handleAnimationEnd = () => {
        this.getModel().notifySubscribers(UIEvents.ESHSearchLayoutChanged);
      };
      const $searchFacets = jQuery(".sapUiFixFlexFixed"); // TODO: JQuery
      $searchFacets.one("transitionend", handleAnimationEnd); //  TODO: JQuery
    },
    convertRemToPixel: function _convertRemToPixel(remValue) {
      return remValue * parseFloat(getComputedStyle(document.documentElement).fontSize);
    },
    convertPixelToRem: function _convertPixelToRem(pxValue) {
      return pxValue / parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
  });
  return SearchLayoutResponsive;
});
})();