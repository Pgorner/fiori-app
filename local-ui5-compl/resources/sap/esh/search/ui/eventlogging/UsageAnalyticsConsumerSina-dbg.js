/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log", "./EventConsumer"], function (Log, __EventConsumer) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const EventConsumer = _interopRequireDefault(__EventConsumer);
  /**
   * Sina Usage Analytics Event Consumer.
   * Currently implementations are only available for abap_odata and InAV2 providers.
   * It is up to other sina providers to implement the logUserEvent method.
   */
  class UsageAnalyticsConsumerSina extends EventConsumer {
    label = "sina";
    isLoggingEnabled = false;
    log = (() => Log.getLogger("sap.esh.search.ui.eventlogging.UsageAnalyticsConsumerSina"))();
    constructor(sinaNext) {
      super();
      this.sinaNext = sinaNext;
    }
    async initAsync() {
      const sinaConfig = await this.sinaNext.getConfigurationAsync();
      if (sinaConfig.personalizedSearch) {
        this.isLoggingEnabled = true;
        this.log.debug("sina usage analytics consumer is enabled");
      } else {
        this.log.debug("sina usage analytics consumer is disabled");
      }
    }
    logEvent(event) {
      if (this.isLoggingEnabled) {
        this.sinaNext.logUserEvent(event);
        this.log.debug(`[${this.label}] Logged user event ${event.type}`);
      }
    }
  }
  return UsageAnalyticsConsumerSina;
});
})();