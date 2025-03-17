/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/esh/search/ui/SearchHelper", "sap/ui/core/Icon", "sap/m/Link", "../sinaNexTS/sina/NavigationTarget", "../uiConstants"], function (SearchHelper, Icon, Link, ___sinaNexTS_sina_NavigationTarget, ___uiConstants) {
  "use strict";

  const NavigationTarget = ___sinaNexTS_sina_NavigationTarget["NavigationTarget"];
  const initialValueUnicode = ___uiConstants["initialValueUnicode"]; // reduced sina-NavigationTarget ()
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchLink = Link.extend("sap.esh.search.ui.controls.SearchLink", {
    renderer: {
      apiVersion: 2,
      render: (rm, control) => {
        rm.openStart("span", control.getId());
        rm.class("sapUshellSearchLink");
        if (!control.getWrapping()) {
          rm.class("sapUshellSearchLink-nowrap");
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
        rm.renderControl(control.getAggregation("_link"));
        rm.close("span");
      }
    },
    metadata: {
      properties: {
        href: {
          type: "sap.ui.core.URI",
          defaultValue: ""
        },
        enabled: {
          type: "boolean",
          defaultValue: true
        },
        target: {
          type: "string",
          defaultValue: "_self"
        },
        text: {
          type: "string",
          defaultValue: ""
        },
        wrapping: {
          type: "boolean",
          defaultValue: false
        },
        navigationTarget: {
          type: "object",
          group: "Data"
        }
      },
      aggregations: {
        // link aggregation is needed to be able to call the renderer of the link
        _link: {
          type: "sap.m.Link",
          multiple: false
        },
        icon: {
          type: "sap.ui.core.Icon",
          multiple: false
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Link.prototype.constructor.call(this, sId, settings);
      this._pressHandlerAttached = false;
    },
    init: function _init() {
      this.setAggregation("_link", new Link(this.getId() + "-Link", {
        text: this.getProperty("text"),
        href: this.getProperty("href"),
        target: this.getProperty("target"),
        wrapping: this.getProperty("wrapping"),
        enabled: this.getProperty("enabled")
      }).addStyleClass("sapUshellSearchLinkLink"));
    },
    pressHandlerSearchLink: function _pressHandlerSearchLink(oEvent) {
      const navTarget = this.getNavigationTarget();
      if (navTarget.targetUrl) {
        // 1) navigation target has target url
        // - navigation itself is performed by clicking on <a> tag
        // - performNavigation is just called for tracking
        navTarget.performNavigation({
          trackingOnly: true,
          event: oEvent
        });
      } else {
        // 2) no target url instead there is a js target function
        // performNavigation does tracking + navigation (window.open...)
        oEvent.preventDefault(); // really necessary?
        navTarget.performNavigation({
          event: oEvent
        });
      }
      // oEvent.preventDefault does work for
      // -desktop
      // -mobile in case targetUrl=empty
      // oEvent.preventDefault does not work for mobile in case targetUrl is filled
      // reason: for mobile there is a UI5 async event simulation so preventDefault does not work
      // for sap.m.Link this a special logic which makes preventDefault working for mobile in case
      // targetUrl=empty (href='#')
    },
    setNavigationTarget: function _setNavigationTarget(navigationTarget) {
      this.setProperty("navigationTarget", navigationTarget);

      // calculate enabled
      const text = this.getAggregation("_link").getText();
      if ((typeof navigationTarget?.targetUrl !== "string" || navigationTarget?.targetUrl?.length === 0) && typeof navigationTarget?.targetFunction !== "function" || !(typeof text === "string" && text !== initialValueUnicode) // dash
      ) {
        this.setProperty("enabled", false);
        this.getAggregation("_link").setProperty("enabled", false);
      } else {
        this.setProperty("enabled", true);
        this.getAggregation("_link").setProperty("enabled", true);
      }

      // set href
      const navigationTargetHref = navigationTarget?.targetUrl;
      if (typeof navigationTargetHref === "string" && navigationTargetHref?.length > 0) {
        this.setProperty("href", navigationTargetHref);
        this.getAggregation("_link").setProperty("href", navigationTargetHref);
      } else {
        this.setProperty("href", "");
        this.getAggregation("_link").setProperty("href", "");
      }

      // set target
      const navigationTargetTarget = navigationTarget?.target;
      if (typeof navigationTargetTarget === "string" && navigationTargetTarget?.length > 0) {
        this.setProperty("target", navigationTargetTarget);
        this.getAggregation("_link").setProperty("target", navigationTargetTarget);
      } else {
        this.setProperty("target", "_self");
        this.getAggregation("_link").setProperty("target", "_self");
      }

      // set icon
      const navigationTargetIcon = navigationTarget?.icon;
      if (!(this.getAggregation("icon") instanceof Icon) && typeof navigationTargetIcon === "string" && navigationTargetIcon?.length > 0) {
        this.setIcon(new Icon(`${this.getId()}--Icon`, {
          src: navigationTargetIcon
        }));
      }

      // set icon
      const navigationTargetTooltip = navigationTarget?.tooltip;
      if (!this.getTooltip() && typeof navigationTargetTooltip === "string" && navigationTargetTooltip?.length > 0) {
        this.setTooltip(navigationTargetTooltip);
      }
      return this;
    },
    setHref: function _setHref(sHref) {
      this.setProperty("href", sHref);
      this.getAggregation("_link").setProperty("href", sHref);
      return this;
    },
    setTooltip: function _setTooltip(sTooltip) {
      this.getAggregation("_link").setTooltip(sTooltip);
      return this;
    },
    setWrapping: function _setWrapping(bWrapping) {
      this.setProperty("wrapping", bWrapping);
      this.getAggregation("_link").setProperty("wrapping", bWrapping);
      return this;
    },
    setText: function _setText(sText) {
      this.setProperty("text", sText);
      this.getAggregation("_link").setProperty("text", sText);
      const navigationTarget = this.getNavigationTarget();
      if (!(navigationTarget instanceof NavigationTarget)) {
        return this;
      }
      if ((typeof navigationTarget?.targetUrl !== "string" || navigationTarget?.targetUrl?.length === 0) && typeof navigationTarget?.targetFunction !== "function" || !(typeof sText === "string" && sText !== initialValueUnicode) // dash
      ) {
        this.setProperty("enabled", false);
        this.getAggregation("_link").setProperty("enabled", false);
      }
      return this;
    },
    getNavigationTarget: function _getNavigationTarget() {
      return this.getProperty("navigationTarget");
    },
    setEnabled: function _setEnabled(bEnabled) {
      if (bEnabled === true) {
        const navigationTarget = this.getNavigationTarget();
        const text = this.getAggregation("_link").getText();
        if (navigationTarget instanceof NavigationTarget && (typeof navigationTarget.targetUrl !== "string" || navigationTarget.targetUrl?.length === 0) && typeof navigationTarget.targetFunction !== "function" || !(typeof text === "string" && text !== initialValueUnicode) // dash
        ) {
          this.setProperty("enabled", false);
          this.getAggregation("_link").setProperty("enabled", false);
          return this;
        }
      }
      this.setProperty("enabled", bEnabled);
      this.getAggregation("_link").setProperty("enabled", bEnabled);
      return this;
    },
    setIcon: function _setIcon(icon) {
      if (icon instanceof Icon) {
        icon.addStyleClass("sapUshellSearchLinkIcon");
        this.setAggregation("icon", icon);
      }
      return this;
    },
    onAfterRendering: function _onAfterRendering(oEvent) {
      Link.prototype.onAfterRendering.call(this, oEvent);
      if (this.isDestroyed()) {
        return;
      }
      if (!this._pressHandlerAttached) {
        this.attachPress(this.pressHandlerSearchLink, this);
        this.getAggregation("_link").attachPress(this.pressHandlerSearchLink, this);
        this._pressHandlerAttached = true;
      }

      // move icon to the front of the text
      const iconDomRef = this.getAggregation("icon")?.getDomRef();
      const linkDomRef = this.getAggregation("_link")?.getDomRef();
      if (iconDomRef) {
        linkDomRef.insertBefore(iconDomRef, linkDomRef.firstChild);
      }

      // recover bold tag with the help of text() in a safe way
      SearchHelper.boldTagUnescaper(linkDomRef);
    },
    _handlePress: function _handlePress(oEvent) {
      // in case of highlighting the target property of the event is a <b> element inside the Link.
      // therefore setting it manually to Links DomRef / parentElement of the target.
      if (oEvent.target.localName === "b") {
        const oTarget = this.getDomRef() ? this.getDomRef() : oEvent.target.parentElement;
        oEvent.target = oTarget;
      }
      // eslint-disable-next-line prefer-rest-params
      Link.prototype["_handlePress"].apply(this, arguments);
    },
    addAriaDescribedBy: function _addAriaDescribedBy(sId) {
      this.getAggregation("_link").addAriaDescribedBy(sId);
      return this;
    },
    /**
     * Assigns the given css class to the inner link control, because that's the way
     * it worked before the control was refactored to be a composite control. Now
     * an additional span element is added around the link control, see renderer method.
     * @param sStyleClass name of the css class to be added
     * @returns this
     */
    addStyleClass: function _addStyleClass(sStyleClass) {
      this.getAggregation("_link").addStyleClass(sStyleClass);
      return this;
    },
    // overwrite necessary because in sap.m.Link: Link.prototype.onsapenter = Link.prototype._handlePress;
    onsapenter: function _onsapenter(oEvent) {
      this._handlePress(oEvent);
    },
    // overwrite necessary because in sap.m.Link: Link.prototype.onsapenter = Link.prototype._handlePress;
    onclick: function _onclick(oEvent) {
      this._handlePress(oEvent);
    }
  });
  return SearchLink;
});
})();