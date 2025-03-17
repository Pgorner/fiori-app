/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/ui/core/mvc/XMLView","sap/ui/table/Table","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/zen/dsh/utils/BaseHandler"],function(jQuery,e,s,i,o,r,t){"use strict";s.extend("com.sap.ip.bi.DataSourceBrowser",{initDesignStudio:function(){},renderer:{},constructor:function(e,i){this.controlProperties=i.dsControlProperties;jQuery.sap.registerModulePath("dsb","zen.res/zen.rt.components.ui5/datasourcebrowser/js");if(t.dispatcher.isMainMode()){s.call(this,e,{viewName:"dsb.dsb_m",type:sap.ui.core.mvc.ViewType.JSON})}else{s.call(this,e,{viewName:"dsb.dsb",type:sap.ui.core.mvc.ViewType.JSON})}return this}})});
//# sourceMappingURL=datasourcebrowser.js.map