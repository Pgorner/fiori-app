/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/m/TextArea"],function(jQuery,e,t){"use strict";return t.extend("com.sap.ip.bi.TextArea",{initDesignStudio:function(){var e=this;e.attachChange(function(){e.fireDesignStudioPropertiesChangedAndEvent(["value"],"onChange")});this.setWrapping("Soft");this.addStyleClass("zenTextArea")},setValue:function(e){t.prototype.setValue.call(this,e);this.fireDesignStudioPropertiesChanged(["value"])},renderer:{}})});
//# sourceMappingURL=TextArea.js.map