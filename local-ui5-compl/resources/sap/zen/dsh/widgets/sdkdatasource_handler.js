/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/sac/df/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/sdk_handler","sap/zen/dsh/widgets/sdkcontrol"],function(jQuery,e,s,t,a,r){"use strict";var d=function(){a.getClass().apply(this,arguments);this.create=function(e,s,t){var a=s["id"];var d=new r(a);d.storeProperties(s,t);d.widget.init();d.widget.dispatchProperties(s,t);return d};this.getType=function(){return"sdkdatasource"}};var i=new d;t.dispatcher.addHandlers(i.getType(),i);return i});
//# sourceMappingURL=sdkdatasource_handler.js.map