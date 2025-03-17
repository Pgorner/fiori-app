/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/m/Text", "sap/ui/core/Icon", "sap/esh/search/ui/SearchHelper"], function (Text, Icon, SearchHelper) {
  "use strict";

  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchText = Text.extend("sap.esh.search.ui.controls.SearchText", {
    renderer: {
      apiVersion: 2,
      render: (rm, control) => {
        rm.openStart("span", control.getId());
        rm.class("sapUshellSearchText");
        if (!control.getWrapping()) {
          rm.class("sapUshellSearchText-nowrap");
        }
        const tooltip = control.getTooltip_AsString();
        if (tooltip) {
          rm.attr("title", tooltip);
        }
        rm.openEnd();
        const icon = control.getAggregation("icon");
        if (icon) {
          rm.renderControl(icon);
        }
        rm.renderControl(control.getAggregation("_text"));
        rm.close("span");
      }
    },
    metadata: {
      properties: {
        maxLines: {
          type: "int"
        },
        text: {
          type: "string",
          defaultValue: ""
        },
        wrapping: {
          type: "boolean",
          defaultValue: true
        }
      },
      aggregations: {
        _text: {
          type: "sap.m.Text",
          multiple: false
        },
        icon: {
          type: "sap.ui.core.Icon",
          multiple: false
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Text.prototype.constructor.call(this, sId, settings);
    },
    init: function _init() {
      this.setAggregation("_text", new Text(this.getId() + "-Text", {
        text: this.getProperty("text"),
        maxLines: this.getProperty("maxLines"),
        wrapping: this.getProperty("wrapping")
      }).addStyleClass("sapUshellSearchTextText"));
    },
    /**
     * Assigns the given css class to the inner text control, because that's the way
     * it worked before the control was refactored to be a composite control. Now
     * an additional span element is added around the text control, see renderer method.
     * @param sStyleClass name of the css class to be added
     * @returns SearchText
     */
    addStyleClass: function _addStyleClass(sStyleClass) {
      this.getAggregation("_text").addStyleClass(sStyleClass);
      return this;
    },
    setText: function _setText(sText) {
      this.setProperty("text", sText);
      this.getAggregation("_text").setText(sText);
      return this;
    },
    setMaxLines: function _setMaxLines(iMaxLines) {
      this.setProperty("maxLines", iMaxLines);
      this.getAggregation("_text").setMaxLines(iMaxLines);
      return this;
    },
    setWrapping: function _setWrapping(bWrapping) {
      this.setProperty("wrapping", bWrapping);
      this.getAggregation("_text").setWrapping(bWrapping);
      return this;
    },
    setIcon: function _setIcon(icon) {
      if (icon instanceof Icon) {
        icon.addStyleClass("sapUshellSearchTextIcon");
        this.setAggregation("icon", icon);
      }
      return this;
    },
    setTooltip: function _setTooltip(sTooltip) {
      this.getAggregation("_text").setTooltip(sTooltip);
      return this;
    },
    onAfterRendering: function _onAfterRendering(oEvent) {
      Text.prototype.onAfterRendering.call(this, oEvent);
      if (this.isDestroyed()) {
        return;
      }

      // move icon to the front of the text
      const iconDomRef = this.getAggregation("icon")?.getDomRef();
      const textDomRef = this.getAggregation("_text")?.getDomRef();
      if (iconDomRef) {
        textDomRef.insertBefore(iconDomRef, textDomRef.firstChild);
      }

      // recover bold tag with the help of text() in a safe way
      SearchHelper.boldTagUnescaper(textDomRef);
    }
  });
  return SearchText;
});
})();