// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(
  [
    "../Category",
    "sap/ushell/services/VisualizationInstantiation",
    "sap/m/Text",
    "sap/m/Link",
    "sap/m/FlexBox",
    "sap/m/library",
    "sap/ui/base/Event",
    "sap/ushell/Container"
  ],
  function (
    Category,
    VisualizationInstantiation,
    Text,
    Link,
    FlexBox,
    mobileLibrary,
    Event,
    Container
  ) {
    "use strict";

    const LinkAccessibleRole = mobileLibrary.LinkAccessibleRole;

    var Application = Category.extend(
      "sap.ushell.components.cepsearchresult.app.util.controls.categories.Application", /** @lends sap.ushell.components.cepsearchresult.app.util.controls.categories.Application.prototype */ {
      renderer: Category.getMetadata().getRenderer()
    }
    );

    var oInstanceFactory = new VisualizationInstantiation();
    var iTileActivationTime = 500;

    Application.prototype.getViewSettings = function () {
      return {
        views: [
          {
            key: "list",
            icon: "sap-icon://text-align-justified"
          },
          {
            key: "tile",
            icon: "sap-icon://grid"
          }
        ],
        default: "tile"
      };
    };

    Application.prototype.createListItemTemplate = function () {
      var oListItem = Category.prototype.createListItemTemplate.apply(this).addStyleClass("sapMLIBHoverable");

      // add description as text
      oListItem.getContent()[0].addItem(
        new Text({
          visible: "{= !!${data>longDescription}}",
          text: "{= ${data>longDescription}}"
        })
        .addStyleClass("diminishedText")
        .addStyleClass("sapUiSmallMarginBeginEnd")
        .addStyleClass("sapUiTinyMarginTop")
        .addStyleClass("resetHighlight") // not in searchTerm, avoid highlighting
      );
      oListItem.getContent()[0].addItem(
        new FlexBox({
          items: {
            path: "data>visualization/keywords",
            templateShareable: true,
            template: new Text({
              visible: "{= !!${data>}}",
              text: "{= ${data>}}"
            })
            .addStyleClass("diminishedText")
            .addStyleClass("keywordText")
            .addStyleClass("sapUiTinyMarginEnd")
          }
        }).addStyleClass("sapUiSmallMarginBeginEnd")
      );
      oListItem.attachModelContextChange(this.addTile.bind(this));
      return oListItem;
    };

    Application.prototype.createCardItemTemplate = function () {
      var oListItem = Category.prototype.createListItemTemplate.apply(this);
      oListItem.attachModelContextChange(this.addTile.bind(this));
      return oListItem;
    };

    Application.prototype.createTileItemTemplate = function () {
      var oListItem = new Category.CustomListItem({
        type: "Active",
        press: this.itemNavigate.bind(this)
      });
      oListItem.attachModelContextChange(this.addTile.bind(this));
      return oListItem;
    };

    Application.prototype.addTile = function (oEvent) {
      var oItem = oEvent.getSource();
      if (oItem.getBindingContext("data")) {
        var oContextData = oItem.getBindingContext("data").getObject(),
          oVizData = oContextData.visualization;
        if (!oVizData) {
          return;
        }
        if (oItem._oViz) {
          oItem._oViz.destroy();
        }
        var oViz = oInstanceFactory.instantiateVisualization(oVizData);
        oViz.addStyleClass(oVizData.displayFormatHint);
        oItem._oViz = oViz;
        if (this.getCurrentView() === "tile") {
          oItem.destroyContent();
          oItem.addContent(oViz);
          this.activateTile(oViz, true, iTileActivationTime);
        } else {
          // render a hidden tile to trigger event in itemNavigate
          oItem.getContent()[0].getItems()[0].addItem(oViz.addStyleClass("hiddentile"));
          var oAvatar = oItem.getContent()[0].getItems()[0].getItems()[0];
          // Ugly hack to force the avatar to rerender as the data binding does not work properly
          oItem.addDelegate({
            onAfterRendering: function () {
              setTimeout(function () {
                oAvatar.setSrc(oAvatar.getSrc());
                oAvatar.invalidate();
              }, 5);
            }
          });
        }
      }
    };

    Application.prototype.activateTile = function (oViz, bActivate, iTime) {
      setTimeout(function () {
        Container.getServiceAsync("ReferenceResolver").then(function () {
          if (!oViz.isDestroyed()) {
            oViz.setActive(bActivate, false);
            this.activateTile(oViz, false, 1000);
          }
        }.bind(this));
      }.bind(this), iTime);
    };

    Application.prototype.onsapenter = function (oEvent) {
      // this custom event is needed for keyboard navigation
      const oCustomEvent = new Event("customEventOnEnter", oEvent.srcControl, {});
      this.itemNavigate(oCustomEvent);
    };

    Application.prototype.itemNavigate = function (oEvent) {
      if (this.bIgnoreNextItemNavigation) {
        this.bIgnoreNextItemNavigation = false;
        return;
      }
      if (this.isLoading()) {
        return;
      }
      var oItem = oEvent.getSource();
      // trigger a tap event on the hidden tile
      this.bIgnoreNextItemNavigation = oItem.isA("sap.m.CustomListItem");
      while (oItem && !oItem.isA("sap.m.CustomListItem")) {
        oItem = oItem.getParent();
      }
      if (!oItem && !oItem._oViz) {
        return;
      }

      // replaced old anchor click, because it caused redirect to page with config lean
      const sTarget = oItem._oViz.mProperties.targetURL;
      Container.getServiceAsync("Navigation").then(
        (oService) => {
          oService.navigate({
            target: { shellHash: sTarget }
          });
        }
      );
    };

    Application.prototype.getItemObjectIdentifier = function () {
      const oLink = new Link({
        text: "{data>title}",
        press: this.itemNavigate.bind(this),
        accessibleRole: LinkAccessibleRole.Button
       }).addStyleClass("appTitleText");
      // removes the href from List item
      oLink.setHref();

      return new FlexBox({
        direction: "Column",
        items: [
          new FlexBox({
            items: [
              oLink,
              new Text({ text: "–", visible: "{= !!${data>title} && !!${data>description}}"}).addStyleClass("appTitleSeparator"),
              new Text({ text: "{data>description}" }).addStyleClass("appDescriptionText")
            ]
          }).addStyleClass("appTitle"),
          new FlexBox({
            items: [
              new Text({ text: "{data>contentProviderLabel}" }).addStyleClass("appProviderText").addStyleClass("diminishedText"),
              new Text({ text: " • ", visible: "{= !!${data>contentProviderLabel} && !!${data>visualization/info}}"}).addStyleClass("appProviderInfoSeparator").addStyleClass("diminishedText"),
              new Text({ text: "{data>visualization/info}", visible: "{= !!${data>visualization/info}}"}).addStyleClass("appInfoText").addStyleClass("diminishedText")
            ]
          }).addStyleClass("appProvider")
        ]
      }).addStyleClass("appObjectIdentifier");
    };

    Application.prototype._getSearchParameters = function (sSearchTerm, iSkip, iTop) {
      return {
        includeAppsWithoutVisualizations: false,
        enableVisualizationPreview: false,
        searchTerm: sSearchTerm,
        skip: iSkip,
        top: iTop,
        filter: {
          filters: [
            {
              path: "technicalAttributes",
              operator: "NotContains",
              value1: "APPTYPE_SEARCHAPP"
            },
            {
              path: "technicalAttributes",
              operator: "NotContains",
              value1: "APPTYPE_HOMEPAGE"
            }
          ],
          and: true
        },
        sort: {
          path: "title",
          descending: false
        }
      };
    };

    Application.prototype.fetchData = function (sSearchTerm, iSkip, iTop) {
      return this.getMaxRowItemsAsync().then(function (iMaxRowItems) {
        var iMaxTop = Math.ceil(iTop / iMaxRowItems) * iMaxRowItems;
        return this.getData(this._getSearchParameters(sSearchTerm, iSkip, iMaxTop)).then(function (oData) {
          var aData = oData.data;
          aData.forEach(function (o, i) {
            if (aData.length > iTop && o.visualization.displayFormatHint === "standardWide") {
              aData.pop();
            }
          });
          oData.pageGap = aData.length - iTop;
          return oData;
        });
      }.bind(this));
    };

    Application.prototype.fetchCount = function (sSearchTerm, iSkip, iTop) {
      return this.getData(this._getSearchParameters(sSearchTerm, iSkip, iTop));
    };

    Application.prototype.getPlaceholderData = function () {
      return {
        title: new Array(10).join("\u00A0"),
        description: new Array(35).join("\u00A0"),
        keywords: "",
        icon: "sap-icon://person-placeholder",
        label: new Array(17).join("\u00A0"),
        url: ""
      };
    };

    Application.prototype.getData = function (oSearchParameters) {
      // embedded in flp
        return Container.getServiceAsync("SearchCEP")
          .then(function (oSearchCEPService) {
            return oSearchCEPService.search(oSearchParameters);
          });
    };
    return Application;
  });
