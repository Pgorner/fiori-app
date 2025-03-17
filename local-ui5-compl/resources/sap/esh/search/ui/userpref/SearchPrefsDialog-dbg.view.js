/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/Button", "sap/m/CheckBox", "sap/m/FlexBox", "sap/m/FlexItemData", "sap/m/Label", "sap/m/library", "sap/m/List", "sap/m/MessageBox", "sap/m/StandardListItem", "sap/m/Title", "sap/m/VBox", "sap/ui/core/mvc/View", "sap/ui/model/BindingMode", "../i18n"], function (Button, CheckBox, FlexBox, FlexItemData, Label, sap_m_library, List, MessageBox, StandardListItem, Title, VBox, View, BindingMode, __i18n) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ListMode = sap_m_library["ListMode"];
  const i18n = _interopRequireDefault(__i18n);
  /**
   * @namespace sap.esh.search.ui.userpref
   */
  const SearchPrefsDialog = View.extend("sap.esh.search.ui.userpref.SearchPrefsDialog", {
    createContent: function _createContent() {
      this.firstTimeBeforeRendering = true;
      const oSearchPrefsVBox = new VBox({
        items: [this.createSearchPersonalizationContent(), this.createMyFavoritesContent(), this.createNlqContent()]
      });
      return [oSearchPrefsVBox];
    },
    createSearchPersonalizationContent: function _createSearchPersonalizationContent() {
      // *********** upper area (always visilble) ******************

      // Title for Personalized Search
      const oTitlePersSearch = new Title({
        text: i18n.getText("sp.personalizedSearch")
      });

      // CheckBox for Track Search Activities
      const oPersSearchCheckBox = new CheckBox("personalizedSearchCheckbox", {
        selected: {
          path: "/personalizedSearch",
          mode: BindingMode.TwoWay
        },
        text: i18n.getText("sp.trackPersonalizedSearch"),
        enabled: {
          path: "/isPersonalizedSearchEditable"
        },
        layoutData: new FlexItemData({
          growFactor: 1
        })
      });

      // Reset button
      const oResetButton = new Button("", {
        text: i18n.getText("sp.deleteSearchTracks"),
        press: this.resetHistory.bind(this),
        enabled: {
          parts: [{
            path: "/isPersonalizedSearchEditable"
          }, {
            path: "/resetButtonWasClicked"
          }],
          formatter: (isPersonalizedSearchEditable, resetButtonWasClicked) => {
            return isPersonalizedSearchEditable && !resetButtonWasClicked;
          }
        }
      });
      const oPersSearchFlexBox = new FlexBox({
        items: [oPersSearchCheckBox, oResetButton]
      });
      return new VBox("", {
        items: [oTitlePersSearch, oPersSearchFlexBox],
        visible: {
          path: "/isPersonalizedSearchAreaVisible"
        }
      });
    },
    createMyFavoritesContent: function _createMyFavoritesContent() {
      // *********** lower area - Not always visilble depending on isMyFavoritesAvailable ******************

      // Title for Default Search Scope
      const oTitleDefaultSearch = new Title({
        text: i18n.getText("sp.defaultSearchScope")
      });

      // Checkbox for using Personalized Search Scope (switch on/off)
      const oCheckBoxScope = new CheckBox("defaultSearchScopeCheckbox", {
        selected: {
          path: "/favActive",
          mode: BindingMode.TwoWay
        },
        text: i18n.getText("sp.usePersSearchScope")
      });

      // Headline for connector list
      const oListLabel = new Label("connectorListLabel", {
        text: i18n.getText("sp.connectorList"),
        visible: {
          path: "/favActive"
        },
        layoutData: new FlexItemData({
          growFactor: 1
        })
      }).addStyleClass("sapUiSmallMarginTop");

      // Display selected count and total count of connectors in headline
      const oListCount = new Label("", {
        text: {
          parts: [{
            path: "/selectedDataSourceCount"
          }, {
            path: "/dataSourceCount"
          }],
          formatter: (selectedDataSourceCount, dataSourceCount) => {
            return i18n.getText("sp.connectorListCount", [selectedDataSourceCount, dataSourceCount]);
          }
        },
        visible: {
          path: "/favActive"
        }
      }).addStyleClass("sapUiSmallMarginTop");
      const oListHeadlineFlexBox = new FlexBox({
        items: [oListLabel, oListCount]
      });

      // Connector list
      const oList = new List("connectorListId", {
        mode: ListMode.MultiSelect,
        visible: {
          path: "/favActive"
        },
        //    visible: "{/favActive}",
        selectionChange: oEvent => {
          this.onListItemSelectionChange(oEvent);
        },
        growing: true,
        growingThreshold: 1000
        //  growingScrollToLoad: true,
      }).addStyleClass("sapUiTinyMarginTop");
      oList.bindAggregation("items", {
        path: "/subDataSources",
        factory: () => {
          const oListItem = new StandardListItem("", {
            title: {
              path: "label"
            },
            selected: {
              path: "selected"
            }
          });
          return oListItem;
        }
      });

      // assemble
      const oDefaultSearchVBox = new VBox("", {
        items: [oTitleDefaultSearch, oCheckBoxScope, oListHeadlineFlexBox, oList],
        visible: {
          path: "/isMyFavoritesAvailable"
        }
      }).addStyleClass("sapUiSmallMarginTop");
      return oDefaultSearchVBox;
    },
    createNlqContent: function _createNlqContent() {
      const nlqTitle = new Title({
        text: i18n.getText("sp.nlqTitle")
      });
      const nlqCheckBox = new CheckBox("", {
        selected: {
          path: "/nlqActive",
          mode: BindingMode.TwoWay
        },
        text: i18n.getText("sp.nlqSwitch"),
        layoutData: new FlexItemData({
          growFactor: 1
        })
      });
      nlqCheckBox.addStyleClass("sapUshellSearchPrefsNlq");
      const nlqContent = new VBox("", {
        items: [nlqTitle, nlqCheckBox],
        visible: {
          path: "/isNlqAreaVisible"
        }
      });
      nlqContent.addStyleClass("sapUiSmallMarginTop");
      return nlqContent;
    },
    onBeforeRendering: function _onBeforeRendering() {
      // first -> no model reload
      if (this.firstTimeBeforeRendering) {
        this.firstTimeBeforeRendering = false;
        return;
      }
      // reload model data
      this.getModel().reload();
    },
    resetHistory: function _resetHistory() {
      this.getModel().resetProfile().then(() => {
        // success: nothing to do here
      }, response => {
        // error: display error popup
        let errorText = i18n.getText("sp.resetFailed");
        errorText += "\n" + response;
        MessageBox.show(errorText, {
          title: i18n.getText("sp.resetFailedTitle"),
          icon: MessageBox.Icon.ERROR,
          actions: [MessageBox.Action.OK]
        });
      });
    },
    // event: select listItem in connector list
    onListItemSelectionChange: function _onListItemSelectionChange(oEvent) {
      this.getModel().setProperty("/selectedDataSourceCount", oEvent.getSource().getSelectedItems().length);
    }
  });
  return SearchPrefsDialog;
});
})();