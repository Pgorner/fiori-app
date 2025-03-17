/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject"], function (___SinaObject) {
  "use strict";

  const SinaObject = ___SinaObject["SinaObject"];
  class NavigationTarget extends SinaObject {
    targetUrl;
    targetFunction;
    targetFunctionCustomData;
    customWindowOpenFunction;
    text;
    icon;
    tooltip;
    target;
    parent;
    constructor(properties) {
      super(properties);
      this.targetUrl = properties.targetUrl ?? this.targetUrl;
      this.targetFunction = properties.targetFunction ?? this.targetFunction;
      this.targetFunctionCustomData = properties.targetFunctionCustomData ?? this.targetFunctionCustomData;
      this.customWindowOpenFunction = properties.customWindowOpenFunction;
      this.text = properties.text ?? this.text;
      this.icon = properties.icon ?? this.icon;
      this.tooltip = properties.tooltip ?? this.tooltip;
      this.target = properties.target ?? this.target ?? "_self";
    }
    trackNavigation() {
      const navigationTrackers = this.sina?.configuration?.navigationTrackers;
      if (!navigationTrackers) {
        return;
      }
      for (const navigationTracker of navigationTrackers) {
        navigationTracker(this);
      }
    }
    performNavigation(params) {
      params = params || {};
      const trackingOnly = params.trackingOnly || false;
      this.trackNavigation();
      if (trackingOnly) {
        return;
      }
      if (this.targetFunction) {
        // 1) js target function
        this.targetFunction(params?.event);
      } else {
        // 2) url
        if (this.customWindowOpenFunction) {
          this.customWindowOpenFunction();
          return;
        }
        if (this.target) {
          window.open(this.targetUrl, this.target, "noopener,noreferrer");
        } else {
          window.open(this.targetUrl, "_blank", "noopener,noreferrer");
        }
      }
    }
    isEqualTo(otherNavigationObject) {
      if (!otherNavigationObject) {
        return false;
      }
      return this.targetUrl == otherNavigationObject.targetUrl && this.targetFunction === otherNavigationObject.targetFunction;
    }
    toJson() {
      return {
        targetUrl: this.targetUrl,
        text: this.text,
        icon: this.icon,
        tooltip: this.tooltip,
        target: this.target
      };
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.NavigationTarget = NavigationTarget;
  return __exports;
});
})();