/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/CustomListItem", "sap/m/Dialog", "sap/m/HBox", "sap/m/Image", "sap/m/Label", "sap/m/Link", "sap/m/List", "sap/m/Text", "sap/m/Title", "sap/m/VBox", "sap/ui/core/CustomData", "sap/ui/core/Element", "./BaseNewsItem"], function (Button, CustomListItem, Dialog, HBox, Image, Label, Link, List, Text, Title, VBox, CustomData, Element, __BaseNewsItem) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseNewsItem = _interopRequireDefault(__BaseNewsItem);
  /**
   *
   * Class for managing and storing News Group items.
   *
   * @extends sap.cux.home.BaseNewsItem
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.NewsGroup
   */
  const NewsGroup = BaseNewsItem.extend("sap.cux.home.NewsGroup", {
    metadata: {
      library: "sap.cux.home",
      aggregations: {
        /**
         * newsItems aggregation of the news. These items will be shown in a dialog on click of the news
         */
        newsItems: {
          type: "sap.cux.home.NewsItem",
          singularName: "newsItem",
          multiple: true
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BaseNewsItem.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @private
     * @override
     */
    init: function _init() {
      BaseNewsItem.prototype.init.call(this);
      this._oTile.attachPress(this, this.pressNewsItem.bind(this));
      this.createNewsGroupDialog();
    },
    /**
     * Handles the press event on the news item, opens the dialog.
     * @returns {void}
     */
    pressNewsItem: function _pressNewsItem() {
      void this.openNewsGroupDialog();
    },
    /**
     * Opens the dialog for news details
     * @returns {Promise<void>}
     */
    openNewsGroupDialog: function _openNewsGroupDialog() {
      try {
        const _this = this;
        _this.oNewsList.setBusy(true);
        const oNewsPanel = _this.getParent();
        const sImageUrl = _this.getImageUrl();
        const aFavNewsFeed = oNewsPanel.getFavNewsFeed();
        const oNewsConfig = {
          changeId: oNewsPanel.getCustomFeedKey(),
          title: _this.getTitle(),
          showAllPreparationRequired: !aFavNewsFeed ? true : aFavNewsFeed.showAllPreparationRequired
        };
        _this.oNewsGroupDialog.open();
        const sNewsFeedURL = oNewsPanel.getNewsFeedDetailsUrl(oNewsConfig);
        return Promise.resolve(oNewsPanel.getAuthNewsFeed(sNewsFeedURL)).then(function (_oNewsPanel$getAuthNe) {
          const aData = _oNewsPanel$getAuthNe;
          _this.oNewsGroupDialog.setTitle(_this.getTitle());
          _this.oNewsGroupImage.setSrc(sImageUrl);
          _this.loadNewsDetails(aData);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Iterate through the provided news details data and loads the news items
     * @param {ICustomNewsFeed[]} aNewsDetails array of news items to be shown in the list
     * @returns {void}
     */
    loadNewsDetails: function _loadNewsDetails(aNewsDetails) {
      this.oNewsList.destroyAggregation("items", true);
      (aNewsDetails || []).forEach((oItem, i) => {
        const oCustomListItem = this.generateNewsListTemplate(oItem, i);
        this.oNewsList.addItem(oCustomListItem);
      });
      this.oNewsList.setBusy(false);
    },
    /**
     * Generates the custom list item templates for the news details
     * @param {ICustomNewsFeed} oItem news feed item for binding the template
     * @param {number} i index of the item
     * @returns {CustomListItem} the template of list item to be shown in the dialog
     */
    generateNewsListTemplate: function _generateNewsListTemplate(oItem, i) {
      const oFieldVBox = new VBox(this.getId() + "--idNewsFieldsBox" + "--" + i).addStyleClass("newsListItemContainer");
      (oItem?.expandFields || []).forEach(oField => {
        oFieldVBox.addItem(new HBox("", {
          items: [new Label("", {
            text: oField.label + ":",
            tooltip: oField.label
          }), new Text("", {
            text: oField.value
          })]
        }).addStyleClass("newsListItemContainer"));
      });
      oFieldVBox.setVisible(false);
      return new CustomListItem(this.getId() + "--idNewsDetailItem" + "--" + i, {
        content: [new VBox("", {
          items: [new Title("", {
            text: oItem.Title.value,
            titleStyle: "H6"
          }), new Text("", {
            text: oItem.Description.value
          }), new HBox("", {
            items: [new Label("", {
              text: oItem.Type.label + ":",
              tooltip: oItem.Type.label
            }), new Text("", {
              text: oItem.Type.value
            })]
          }).addStyleClass("newsListItemContainer"), new HBox("", {
            items: [new Label("", {
              text: this._i18nBundle.getText("readMoreLink") + ":",
              tooltip: oItem.Link.value.label + ""
            }), new Link("", {
              href: oItem.Link.value.value + "",
              text: oItem.Link.text,
              target: "_blank"
            })]
          }).addStyleClass("newsListItemContainer"), oFieldVBox, new Button("", {
            text: this._i18nBundle.getText("expand"),
            press: this.handleShowNewsFeedDetails.bind(this),
            customData: new CustomData({
              key: "index",
              value: i
            })
          })]
        }).addStyleClass("newsListItemContainer")]
      }).addStyleClass("newsListItem");
    },
    /**
     * Creates the dialog which contains the news detail items
     * @returns {void}
     */
    createNewsGroupDialog: function _createNewsGroupDialog() {
      //create the dialog template without binding
      this.oNewsGroupImage = new Image(this.getId() + "custNewsImage", {
        width: "100%",
        height: "15rem",
        src: "/resources/sap/cux/home/img/CustomNewsFeed/SupplyChain/3.jpg"
      });
      this.oNewsList = new List(this.getId() + "custNewsList", {});
      this.oNewsGroupDialog = new Dialog(this.getId() + "custNewsFeedDetailsDialog", {
        title: this.getTitle(),
        contentWidth: "52rem",
        contentHeight: "100%",
        content: [this.oNewsGroupImage, this.oNewsList],
        buttons: [new Button(this.getId() + "custNewsFeedDetailsCloseBtn", {
          text: this._i18nBundle.getText("Close"),
          press: this.closeNewsGroupDialog.bind(this),
          type: "Transparent"
        })]
      });
    },
    /**
     * Closes the news details dialog
     * @returns {void}
     */
    closeNewsGroupDialog: function _closeNewsGroupDialog() {
      this.oNewsGroupDialog.close();
    },
    /**
     * Handles the click on the show more button of news detail items in news group dialog
     * @param {Event} oEvent
     * @returns {void}
     */
    handleShowNewsFeedDetails: function _handleShowNewsFeedDetails(oEvent) {
      const listItemIndex = oEvent.getSource().data("index");
      const fieldsVBox = Element.getElementById(this.getId() + "--idNewsFieldsBox" + "--" + listItemIndex);
      const fieldExpanded = fieldsVBox.getVisible();
      fieldsVBox.setVisible(!fieldExpanded);
      const sButtonShowText = fieldExpanded ? this._i18nBundle.getText("expand") : this._i18nBundle.getText("collapse");
      oEvent.getSource().setText(sButtonShowText);
    }
  });
  return NewsGroup;
});
//# sourceMappingURL=NewsGroup-dbg-dbg.js.map
