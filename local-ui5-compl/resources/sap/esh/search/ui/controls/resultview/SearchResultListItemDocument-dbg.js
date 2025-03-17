/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "./SearchResultListItem", "./SearchText", "sap/esh/search/ui/SearchHelper", "sap/ui/core/Icon", "sap/ui/core/IconPool", "sap/ui/core/format/DateFormat", "sap/ui/core/Locale", "sap/base/i18n/Localization"], function (__i18n, __SearchResultListItem, __SearchText, SearchHelper, Icon, IconPool, DateFormat, Locale, Localization) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SearchResultListItem = _interopRequireDefault(__SearchResultListItem);
  const SearchText = _interopRequireDefault(__SearchText);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultListItemDocument = SearchResultListItem.extend("sap.esh.search.ui.controls.SearchResultListItemDocument", {
    renderer: {
      apiVersion: 2
    },
    _renderContentContainer: function _renderContentContainer(oRm) {
      const oModel = this.getModel();
      oRm.openStart("div", this.getId() + "-content");
      oRm.class("sapUshellSearchResultListItem-Content");
      if (!oModel.config.optimizeForValueHelp) {
        oRm.class("sapUshellSearchResultListItem-ContentValueHelp");
      }
      oRm.openEnd();
      this._renderTitleContainer(oRm);
      this._renderAttributesContainer(oRm);
      oRm.close("div");
    },
    _renderTitleContainer: function _renderTitleContainer(oRm) {
      const oModel = this.getModel();
      if (!oModel.config.optimizeForValueHelp) {
        oRm.openStart("div", this.getId() + "-title-and-image-container");
        oRm.class("sapUshellSearchResultListItem-TitleAndImageContainer");
        oRm.openEnd();
      }
      oRm.openStart("div", this.getId() + "-title-container");
      oRm.class("sapUshellSearchResultListItem-TitleContainer");
      if (oModel.config.optimizeForValueHelp) {
        oRm.class("sapUshellSearchResultListItem-TitleContainerValueHelp");
      }
      oRm.openEnd();
      this._renderCheckbox(oRm);

      /// Title
      const titleURL = this.getProperty("additionalParameters").titleUrl;
      const titleLink = this.getAggregation("_titleLink");
      titleLink.setHref(titleURL);
      titleLink.setText(this.getProperty("title"));
      if (titleURL.length === 0) {
        titleLink.setEnabled(false);
      }
      oRm.renderControl(titleLink);

      /// Object Type
      const typeText = this.getAggregation("_typeText");
      typeText.setText(this.getProperty("type"));
      oRm.renderControl(typeText);
      // close div sapUshellSearchResultListItem-TitleContainer
      oRm.close("div");
      if (!oModel.config.optimizeForValueHelp) {
        this._renderImageForPhone(oRm);
        // close div sapUshellSearchResultListItem-TitleAndImageContainer
        oRm.close("div");
      }
    },
    _renderAttributesContainer: function _renderAttributesContainer(oRm) {
      oRm.openStart("div", this.getId() + "-attributes-expand-container");
      oRm.class("sapUshellSearchResultListItemDoc-AttributesExpandContainer");
      const expanded = this.getProperty("expanded");
      if (expanded) {
        oRm.class("sapUshellSearchResultListItem-AttributesExpanded");
      }
      oRm.openEnd();
      oRm.openStart("div", this.getId() + "-attributes-and-actions");
      oRm.class("sapUshellSearchResultListItem-AttributesAndActions");
      oRm.openEnd();
      oRm.openStart("ul", this.getId() + "-attributes");
      oRm.class("sapUshellSearchResultListItem-Attributes");
      oRm.openEnd();
      this._renderThumbnailSnippetContainer(oRm);
      this._renderDocAttributesContainer(oRm);

      // This is just a dummie attribute to store additional space information for the expand and collapse JavaScript function
      oRm.openStart("div", this.getId() + "-expand-spacer-attribute");
      oRm.class("sapUshellSearchResultListItem-ExpandSpacerAttribute");
      oRm.attr("aria-hidden", "true");
      oRm.openEnd();
      oRm.close("div");
      oRm.close("ul");
      this._renderRelatedObjectsToolbar(oRm);
      // close div sapUshellSearchResultListItem-AttributesAndActions
      oRm.close("div");
      // close div sapUshellSearchResultListItemDoc-AttributesExpandContainer
      oRm.close("div");
    },
    _renderThumbnailContainer: function _renderThumbnailContainer(oRm) {
      if (!this.getProperty("imageUrl")) {
        return;
      }
      if (this.getProperty("containsThumbnail") === true) {
        oRm.openStart("div", this.getId() + "-thumbnail-container");
        oRm.class("sapUshellSearchResultListItemDoc-ThumbnailContainer");
        oRm.openEnd();
        oRm.openStart("div", this.getId() + "-thumbnail-container-inner");
        oRm.class("sapUshellSearchResultListItemDoc-ThumbnailContainerInner");
        oRm.openEnd();
        const oZoomIcon = new Icon({
          src: IconPool.getIconURI("search"),
          useIconTooltip: false
        });
        if (this.getProperty("containsSuvFile") === true) {
          const pressHandler = function () {
            window.open(this.getSuvlink(), "_blank", "noopener,noreferrer");
          };
          oZoomIcon.attachPress(pressHandler);
        }
        oZoomIcon.addStyleClass("sapUshellSearchResultListItemDoc-ThumbnailZoomIcon");
        oRm.renderControl(oZoomIcon);
        if (this.getProperty("containsSuvFile") === true) {
          oRm.openStart("a", this.getId() + "-suv-link-1");
          oRm.attr("target", "_blank");
          oRm.attr("href", this.getProperty("suvlink"));
          oRm.attr("rel", "noopener noreferrer");
          oRm.openEnd();
        } else {
          oRm.openStart("a", this.getId() + "-suv-link-2");
          oRm.attr("target", "_blank");
          oRm.attr("rel", "noopener noreferrer");
          oRm.openEnd();
        }
        oRm.openStart("img", this.getId() + "-thumbnail");
        oRm.class("sapUshellSearchResultListItemDoc-Thumbnail");
        oRm.attr("src", this.getProperty("imageUrl"));
        oRm.openEnd();
        oRm.close("img");
        oRm.close("a");
        // close div for sapUshellSearchResultListItemDoc-ThumbnailContainerInner
        oRm.close("div");
        // close div for sapUshellSearchResultListItemDoc-ThumbnailContainer
        oRm.close("div");
      } else {
        oRm.openStart("div", this.getId() + "-thumbnail-container-hidden");
        oRm.class("sapUshellSearchResultListItemDoc-ThumbnailContainer-hidden");
        oRm.openEnd();
        oRm.close("div");
      }
    },
    _renderImageForPhone: function _renderImageForPhone(oRm) {
      if (this.getProperty("imageUrl") && this.getProperty("containsThumbnail") === true) {
        oRm.openStart("div", this.getId() + "-title-image");
        oRm.class("sapUshellSearchResultListItem-TitleImage");
        oRm.openEnd();
        oRm.openStart("div", this.getId() + "-image-container-alignment-helper");
        oRm.class("sapUshellSearchResultListItem-ImageContainerAlignmentHelper");
        oRm.openEnd();
        oRm.close("div");
        oRm.openStart("img", this.getId() + "-image");
        oRm.class("sapUshellSearchResultListItem-Image");
        oRm.attr("src", this.getProperty("imageUrl"));
        oRm.openEnd();
        oRm.close("img");
        oRm.close("div");
      }
    },
    _renderDocAttributesContainer: function _renderDocAttributesContainer(oRm) {
      oRm.openStart("div", this.getId() + "-attributes-container");
      oRm.class("sapUshellSearchResultListItemDoc-AttributesContainer");
      oRm.openEnd();
      const itemAttributes = this.getProperty("attributes");
      this._renderAllAttributes(oRm, itemAttributes);
      oRm.close("div");
    },
    _renderThumbnailSnippetContainer: function _renderThumbnailSnippetContainer(oRm) {
      oRm.openStart("div", this.getId() + "-thumbnail-snippet-container");
      oRm.class("sapUshellSearchResultListItemDoc-ThumbnailSnippetContainer");
      oRm.openEnd();
      this._renderThumbnailContainer(oRm);
      this._renderSnippetContainer(oRm);
      oRm.close("div");
    },
    _renderSnippetContainer: function _renderSnippetContainer(oRm) {
      const itemAttributes = this.getProperty("attributes");
      for (let i = 0; i < itemAttributes.length; i++) {
        const itemAttribute = itemAttributes[i];
        if (itemAttribute.longtext) {
          const value = new SearchText();
          value.setText(itemAttribute.value);
          value.addStyleClass("sapUshellSearchResultListItemDoc-Snippet");
          oRm.renderControl(value);
        }
      }
    },
    // render Attributes
    // ===================================================================
    _renderAllAttributes: function _renderAllAttributes(oRm, itemAttributes) {
      let itemAttribute;
      let labelText;
      let valueText;
      let value;
      let oProperty;

      // skip first attribute which is the title attribute for the table
      let numberOfMainAttributes = 8;
      if (this.getProperty("imageUrl")) {
        numberOfMainAttributes--;
      }
      const containsFileProertyAttribute = function (attributeList) {
        let attr;
        for (let i = 0; i < attributeList.length; i++) {
          attr = attributeList[i];
          if (attr.key === "FILE_PROPERTY" && attr.value) {
            return true;
          }
        }
        return false;
      };
      const bContainsFilePropertyAttribute = containsFileProertyAttribute(itemAttributes);
      this.destroyAggregation("_attributeValues");
      let i, j, k;
      for (; j < numberOfMainAttributes && i < itemAttributes.length; i++) {
        itemAttribute = itemAttributes[i];
        if (itemAttribute.isTitle || itemAttribute.longtext) {
          continue;
        }
        if (bContainsFilePropertyAttribute === true && itemAttribute.key !== "FILE_PROPERTY") {
          continue;
        }
        if (!itemAttribute.value) {
          continue;
        }
        if (bContainsFilePropertyAttribute === true) {
          const aFileProperties = JSON.parse(itemAttribute.value);
          for (; k < aFileProperties.length && k < 10; k++) {
            // currently the maximum limit for file properties is 10
            oProperty = aFileProperties[k];
            switch (oProperty.type) {
              case "date-time":
                {
                  // format date type
                  const oDate = new Date(oProperty.value);
                  const oDateFormat = DateFormat.getDateTimeInstance({
                    style: "medium"
                  }, new Locale(Localization.getLanguageTag().toString()));
                  valueText = oDateFormat.format(oDate);
                  break;
                }
              case "byte":
                valueText = SearchHelper.formatFileSize(Number(oProperty.value));
                break;
              case "integer":
                valueText = SearchHelper.formatInteger(Number(oProperty.value));
                break;
              default:
                valueText = oProperty.value;
            }
            labelText = oProperty.category + ": " + oProperty.name;
            if (valueText === undefined) {
              continue;
            }
            if (!valueText || valueText === "") {
              valueText = SearchResultListItem.noValue;
            }
            value = new SearchText();
            value.setText(valueText);
            value.addStyleClass("sapUshellSearchResultListItemDoc-AttributeValue");
            value.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
            oRm.renderControl(value);
            this.addAggregation("_attributeValues", value, true /* do not invalidate this object */);
          }
        } else {
          labelText = itemAttribute.name;
          valueText = itemAttribute.value;
          if (labelText === undefined || valueText === undefined) {
            continue;
          }
          if (!valueText || valueText === "") {
            valueText = SearchResultListItem.noValue;
          }
          value = new SearchText();
          value.setText(valueText);
          value.addStyleClass("sapUshellSearchResultListItemDoc-AttributeValue");
          value.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
          oRm.renderControl(value);
          this.addAggregation("_attributeValues", value, true /* do not invalidate this object */);
        }
        j++;
      }
    },
    _getExpandAreaObjectInfo: function _getExpandAreaObjectInfo() {
      const resultListItem = $(this.getDomRef());
      const attributesExpandContainer = resultListItem.find(".sapUshellSearchResultListItemDoc-AttributesExpandContainer");
      const relatedObjectsToolbar = resultListItem.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");
      let relatedObjectsToolbarHidden = false;
      if (relatedObjectsToolbar.css("display") === "none") {
        relatedObjectsToolbar.css("display", "block");
        relatedObjectsToolbarHidden = true;
      }
      const currentHeight = attributesExpandContainer.height();
      const expandedHeight = resultListItem.find(".sapUshellSearchResultListItem-AttributesAndActions").height();
      if (relatedObjectsToolbarHidden) {
        relatedObjectsToolbar.css("display", "");
      }
      const elementsToFadeInOrOut = [];
      resultListItem.find(".sapUshellSearchResultListItem-GenericAttribute").each(function () {
        const element = $(this);
        if (Number(element.css("order")) > 2) {
          elementsToFadeInOrOut.push(this);
        }
      });
      const expandAnimationDuration = 200;
      const fadeInOrOutAnimationDuration = expandAnimationDuration / 10;
      const expandAreaObjectInfo = {
        resultListItem: resultListItem,
        attributesExpandContainer: attributesExpandContainer,
        currentHeight: currentHeight,
        expandedHeight: expandedHeight,
        elementsToFadeInOrOut: elementsToFadeInOrOut,
        expandAnimationDuration: expandAnimationDuration,
        fadeInOrOutAnimationDuration: fadeInOrOutAnimationDuration,
        relatedObjectsToolbar: relatedObjectsToolbar
      };
      return expandAreaObjectInfo;
    },
    hideDetails: function _hideDetails() {
      const resultListItem = $(this.getDomRef());
      if (!this.isShowingDetails()) {
        return;
      }
      const expandAreaObjectInfo = this._getExpandAreaObjectInfo();
      const attributeHeight = resultListItem.find(".sapUshellSearchResultListItem-Attributes").outerHeight(true);
      let secondAnimationStarted = false;
      const deferredAnimation01 = expandAreaObjectInfo.attributesExpandContainer.animate({
        height: attributeHeight
      }, {
        duration: expandAreaObjectInfo.expandAnimationDuration,
        progress: function (animation, progress, remainingMs) {
          if (!secondAnimationStarted && remainingMs <= expandAreaObjectInfo.fadeInOrOutAnimationDuration) {
            secondAnimationStarted = true;
            const deferredAnimation02 = $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
              opacity: 0
            }, expandAreaObjectInfo.fadeInOrOutAnimationDuration).promise();
            jQuery.when(deferredAnimation01, deferredAnimation02).done(function () {
              // jQuery Deferred for jQuery Animation, Unable to convert to Promise
              this.setProperty("expanded", false, true);
              expandAreaObjectInfo.attributesExpandContainer.removeClass("sapUshellSearchResultListItem-AttributesExpanded");
              $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");
              const iconArrowDown = IconPool.getIconURI("slim-arrow-down");
              const expandButton = this.getAggregation("_expandButton");
              expandButton.setTooltip(i18n.getText("showDetailBtn_tooltip"));
              expandButton.setIcon(iconArrowDown);
              expandButton.rerender();
            });
          }
        }
      }).promise();
    }
  });
  return SearchResultListItemDocument;
});
})();