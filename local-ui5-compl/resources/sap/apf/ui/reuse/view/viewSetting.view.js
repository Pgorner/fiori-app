/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/m/ViewSettingsDialog","sap/m/ViewSettingsItem","sap/ui/core/mvc/View"],function(e,t,n){"use strict";return n.extend("sap.apf.ui.reuse.view.viewSetting",{getControllerName:function(){return"sap.apf.ui.reuse.controller.viewSetting"},createContent:function(n){var a=this.getViewData().oTableInstance;var i=a.tableControl;var r=[];i.getColumns().forEach(function(e){var n=new t({text:e.getCustomData()[0].getValue().text,key:e.getCustomData()[0].getValue().key});r.push(n)});var o=new e({sortItems:r,confirm:n.handleConfirmForSort.bind(n),cancel:n.handleCancel.bind(n)});return o}})});
//# sourceMappingURL=viewSetting.view.js.map