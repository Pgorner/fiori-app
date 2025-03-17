/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/List", "sap/ui/core/ResizeHandler"], function (List, ResizeHandler) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultList = List.extend("sap.esh.search.ui.controls.SearchResultList", {
    renderer: {
      apiVersion: 2
    },
    constructor: function _constructor(sId, options) {
      List.prototype.constructor.call(this, sId, options);
      this.addStyleClass("searchResultList");
    },
    onAfterRendering: function _onAfterRendering(...args) {
      // first let the original sap.m.List do its work
      List.prototype.onAfterRendering.apply(this, args);
      const model = this.getModel();
      const multiSelectionEnabled = model.getProperty("/multiSelectionEnabled");
      if (multiSelectionEnabled) {
        this.enableSelectionMode(false);
      }
      this._prepareResizeHandler();
    },
    _prepareResizeHandler: function _prepareResizeHandler() {
      const resizeThresholds = [768, 1151];
      const windowWidthIndex = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth < resizeThresholds[0]) {
          return 0;
        }
        for (let i = 0; i < resizeThresholds.length - 1; i++) {
          if (windowWidth >= resizeThresholds[i] && windowWidth < resizeThresholds[i + 1]) {
            return i + 1;
          }
        }
        return resizeThresholds.length;
      };
      let lastWindowWidthIndex = windowWidthIndex();
      this._resizeHandler = forceResize => {
        const currentWindowWidthIndex = windowWidthIndex();
        if (currentWindowWidthIndex != lastWindowWidthIndex || forceResize) {
          lastWindowWidthIndex = currentWindowWidthIndex;
          const aMyListItems = this.getItems();
          for (const listItem of aMyListItems) {
            const listItemContent = listItem.getContent(); // ToDo
            if (listItemContent?.length > 0) {
              if (typeof listItemContent[0]?.resizeEventHappened === "function") {
                listItemContent[0]?.resizeEventHappened();
              }
            }
          }
        }
      };
      ResizeHandler.register(this, () => {
        // similar to $(window).on("resize", this._resizeHandler)
        this._resizeHandler();
      });
    },
    resize: function _resize() {
      if (typeof this._resizeHandler !== "undefined") {
        this._resizeHandler(true /* forceResize */);
      }
    },
    enableSelectionMode: function _enableSelectionMode(animated) {
      const deferredReturn = jQuery.Deferred(); // jQuery Deferred for jQuery Animation und Non-Animation

      animated = animated === undefined ? true : animated;
      const searchResultList = $(this.getDomRef());
      if (!animated) {
        searchResultList.addClass("sapUshellSearchResultList-ShowMultiSelection");
        deferredReturn.resolve();
        return deferredReturn.promise();
      }
      const animationDuration = 200;
      const checkBoxExpandContainers = searchResultList.find(".sapUshellSearchResultListItem-CheckboxExpandContainer");
      const attributesContainers = searchResultList.find(".sapUshellSearchResultListItem-Attributes");
      const currentAttributesPadding = parseFloat(attributesContainers.css("padding-left"));
      const checkBoxContainer = checkBoxExpandContainers.find(".sapUshellSearchResultListItem-CheckboxContainer");
      const checkBoxWidth = checkBoxContainer.width();
      if (!searchResultList.hasClass("sapUshellSearchResultList-ShowMultiSelection")) {
        checkBoxExpandContainers.css("width", "0");
        checkBoxExpandContainers.css("opacity", "0");
        attributesContainers.css("padding-left", currentAttributesPadding);
        searchResultList.addClass("sapUshellSearchResultList-ShowMultiSelection");
        const newPadding = currentAttributesPadding + checkBoxWidth;
        checkBoxExpandContainers.animate({
          width: checkBoxWidth,
          opacity: 1
        }, animationDuration, () => {
          $(this).css("width", "");
          $(this).css("opacity", "");
        });
        attributesContainers.animate({
          "padding-left": newPadding
        }, animationDuration, () => {
          $(this).css("padding-left", "");
        });
      }
    },
    disableSelectionMode: function _disableSelectionMode(animated) {
      const deferredReturn = jQuery.Deferred(); // jQuery Deferred for jQuery Animation und Non-Animation

      animated = animated === undefined ? true : animated;
      const searchResultList = $(this.getDomRef());
      if (!animated) {
        searchResultList.removeClass("sapUshellSearchResultList-ShowMultiSelection");
        deferredReturn.resolve();
        return deferredReturn.promise();
      }
      const animationDuration = 200;
      const checkBoxExpandContainers = searchResultList.find(".sapUshellSearchResultListItem-CheckboxExpandContainer");
      const attributesContainers = searchResultList.find(".sapUshellSearchResultListItem-Attributes");
      const currentAttributesPadding = parseFloat(attributesContainers.css("padding-left"));
      const checkBoxContainer = checkBoxExpandContainers.find(".sapUshellSearchResultListItem-CheckboxContainer");
      const checkBoxWidth = checkBoxContainer.width();
      if (searchResultList.hasClass("sapUshellSearchResultList-ShowMultiSelection")) {
        const newPadding = currentAttributesPadding - checkBoxWidth;
        const animation01 = checkBoxExpandContainers.animate({
          width: 0,
          opacity: 0
        }, animationDuration).promise();
        const animation02 = attributesContainers.animate({
          "padding-left": newPadding
        }, animationDuration).promise();
        jQuery.when(animation01, animation02).done(() => {
          // jQuery Deferred for jQuery Animation, Unable to convert to Promise
          searchResultList.removeClass("sapUshellSearchResultList-ShowMultiSelection");
          checkBoxExpandContainers.css("width", "");
          checkBoxExpandContainers.css("opacity", "");
          attributesContainers.css("padding-left", "");
        });
      }
    }
  });
  return SearchResultList;
});
})();