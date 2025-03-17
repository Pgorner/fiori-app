/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log","sap/esh/search/ui/eventlogging/UsageAnalyticsConsumerSina","sap/esh/search/ui/flp/UsageAnalyticsConsumerFlp"],function(e,s,t){"use strict";class n{consumers=[];searchModel;sinaNext;log=(()=>e.getLogger("sap.esh.search.ui.eventlogging.EventLogger"))();static eventNumber=0;static sessionId=(()=>(new Date).getTime().toString())();constructor(e){this.searchModel=e.searchModel;this.sinaNext=e.sinaNext;for(const s of e.eventConsumers){this.addConsumer(s)}}async initAsync(){try{if(this.searchModel.config.isUshell){const e=new t;await e.initAsync();this.addConsumer(e)}}catch(e){this.log.debug("Couldn't initialize flp user event consumer",e)}try{const e=new s(this.sinaNext);await e.initAsync();this.addConsumer(e)}catch(e){this.log.debug("Couldn't initialize sina user event consumer",e)}}addConsumer(e){this.consumers.push(e);this.log.debug(`[${e.label}] Event consumer added`)}setConsumers(e){for(const s of e){this.addConsumer(s)}}logEvent(e){e.sessionId=n.sessionId;e.timeStamp=e.timeStamp??(new Date).getTime().toString();e.eventNumber=n.eventNumber++;for(let s=0;s<this.consumers.length;++s){const t=this.consumers[s];try{t.logEvent(e);this.log.debug(`[${t.label}] Logged user event ${e.type}`)}catch(s){this.log.debug(`[${t.label}] Error while logging user event ${e.type}`,s.stack||s)}}}}return n})})();
//# sourceMappingURL=EventLogger.js.map