/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(jQuery,e){sap.zen.Application_properties=function(){"use strict";e.apply(this,arguments);this.createAndAdd=function(e,t){var n=t.customCss;if(n){if(document.createStyleSheet){document.createStyleSheet(n)}else{jQuery("head").append(jQuery("<link rel='stylesheet' href='"+n+"' type='text/css' media='screen' />"))}}return null};this.updateComponent=function(){return null};this.getType=function(){return"application_properties"}};var t=new sap.zen.Application_properties;e.dispatcher.addHandlers(t.getType(),t,"Decorator");return t});
//# sourceMappingURL=hana_application_properties_handler.js.map