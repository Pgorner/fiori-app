/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/comp/smartfilterbar/SmartFilterBar","sap/ui/core/mvc/View"],function(e,t){"use strict";return t.extend("sap.apf.ui.reuse.view.smartFilterBar",{getControllerName:function(){return"sap.apf.ui.reuse.controller.smartFilterBar"},createContent:function(t){var r=this,a,i,n,o;a=r.getViewData().oSmartFilterBarConfiguration.entitySet;i=r.getViewData().oSmartFilterBarConfiguration.id;n=r.getViewData().oCoreApi.getSmartFilterBarPersistenceKey(i);o=new e(t.createId("idAPFSmartFilterBar"),{entitySet:a,controlConfiguration:r.getViewData().controlConfiguration,initialized:t.afterInitialization.bind(t),search:t.handlePressOfGoButton.bind(t),persistencyKey:n,considerAnalyticalParameters:true,customData:{key:"dateFormatSettings",value:{UTC:true}},useDateRangeType:true,liveMode:true,filterChange:t.validateFilters.bind(t)});r.setParent(r.getViewData().parent);return o}})});
//# sourceMappingURL=smartFilterBar.view.js.map