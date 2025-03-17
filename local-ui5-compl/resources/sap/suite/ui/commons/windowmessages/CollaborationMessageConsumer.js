/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log"],function(e){"use strict";let n=e.getLogger("sap.suite.ui.commons.windowmessages.CollaborationMessageConsumer");let o;let t;const i="sap-suite-ui-commons-collaboration-client-appruntime";const s="collaboration-channel";var a="get-provider-config";const r=[{channelId:s,version:"1.0"}];const c=["sap-suite-ui-commons-collaboration-message-broker"];var u=function(e,i,s,r){n.info("Message Received from CLIENT_ID: "+e+" on CHANNEL_ID: "+i);if(s===a){o=JSON.parse(r);t(o)}else{n.info("Message: '"+s+"' is not supported")}};return{getProviderConfiguration:function(){return new Promise(async function(e){if(o){e(o);return}t=e;const l=sap.ui.require("sap/ushell/Container");if(!l){n.info("UShell Container instance doesn't exist");o={};e(o);return}try{var f=await l.getServiceAsync("MessageBroker");try{await f.connect(i)}catch{o={};e(o)}n.info("Client ID: "+i+" is connected successfully");await f.subscribe(i,r,u,Function.prototype);await f.publish(s,i,Date.now().toString(),a,c);try{f.disconnect(i)}catch(n){e(o)}}catch(t){n.info("Provider Configuration doesn't exist");f.disconnect(i);o={};e(o)}})}}});
//# sourceMappingURL=CollaborationMessageConsumer.js.map