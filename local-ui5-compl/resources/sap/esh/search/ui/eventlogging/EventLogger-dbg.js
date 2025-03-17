/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log", "sap/esh/search/ui/eventlogging/UsageAnalyticsConsumerSina", "sap/esh/search/ui/flp/UsageAnalyticsConsumerFlp"], function (Log, UsageAnalyticsConsumerSina, UsageAnalyticsConsumerFlp) {
  "use strict";

  class EventLogger {
    consumers = [];
    searchModel;
    sinaNext;
    log = (() => Log.getLogger("sap.esh.search.ui.eventlogging.EventLogger"))();
    static eventNumber = 0;
    static sessionId = (() => new Date().getTime().toString())();
    constructor(properties) {
      this.searchModel = properties.searchModel;
      this.sinaNext = properties.sinaNext;
      for (const consumer of properties.eventConsumers) {
        this.addConsumer(consumer);
      }
    }

    /**
     * Async initialization of "internal" event consumers sina and flp
     */
    async initAsync() {
      try {
        if (this.searchModel.config.isUshell) {
          const consumerFlp = new UsageAnalyticsConsumerFlp();
          await consumerFlp.initAsync();
          this.addConsumer(consumerFlp);
        }
      } catch (e) {
        this.log.debug("Couldn't initialize flp user event consumer", e);
      }
      try {
        const sinaConsumer = new UsageAnalyticsConsumerSina(this.sinaNext);
        await sinaConsumer.initAsync();
        this.addConsumer(sinaConsumer);
      } catch (e) {
        this.log.debug("Couldn't initialize sina user event consumer", e);
      }
    }
    addConsumer(consumer) {
      this.consumers.push(consumer);
      this.log.debug(`[${consumer.label}] Event consumer added`);
    }
    setConsumers(consumers) {
      for (const consumer of consumers) {
        this.addConsumer(consumer);
      }
    }
    logEvent(event) {
      event.sessionId = EventLogger.sessionId;
      event.timeStamp = event.timeStamp ?? new Date().getTime().toString();
      event.eventNumber = EventLogger.eventNumber++;
      for (let i = 0; i < this.consumers.length; ++i) {
        const consumer = this.consumers[i];
        try {
          consumer.logEvent(event);
          this.log.debug(`[${consumer.label}] Logged user event ${event.type}`);
        } catch (err) {
          this.log.debug(`[${consumer.label}] Error while logging user event ${event.type}`, err.stack || err);
        }
      }
    }
  }
  return EventLogger;
});
})();