/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Lib"],function(e,n){"use strict";var o;var s=e.getLogger("sap.suite.ui.commons.windowmessages.CollaborationMessageBroker");function i(e){s.info("CollaborationMessageBroker instance is created");var n="sap-suite-ui-commons-collaboration-message-broker";var o="collaboration-channel";var i="get-provider-config";const t=sap.ui.require("sap/ushell/Container");if(!t){s.info("UShell Container instance doesn't exist");return}var r=[{channelId:o,version:"1.0"}];var a=function(r,a,c){s.info("Message Received from CLIENT_ID: "+r+" on CHANNEL_ID: "+a);if(c===i){t.getServiceAsync("MessageBroker").then(function(t){var a=JSON.stringify(e);t.publish(o,n,Date.now().toString(),i,[r],a).then(function(){s.info("Configuration published successfully to CLIENT_ID: "+r+" on CHANNEL_ID: "+o+" DATA: "+a)})})}else{s.info("Message: '"+c+"' is not supported")}};t.getServiceAsync("MessageBroker").then(function(e){e.connect(n).then(function(){s.info("Client ID: "+n+" is connected successfully");e.subscribe(n,r,a,Function.prototype)})})}return{startInstance:function(e){s.info("CollaborationMessageBroker=>startInstance method is being called");if(!o){o=new i(e)}}}});
//# sourceMappingURL=CollaborationMessageBroker.js.map