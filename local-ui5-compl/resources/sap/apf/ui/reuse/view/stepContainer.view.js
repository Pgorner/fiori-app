/*!
 * SAP APF Analysis Path Framework 
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/suite/ui/commons/ChartContainer","sap/suite/ui/commons/ChartContainerToolbarPlaceholder","sap/m/OverflowToolbar","sap/ui/Device","sap/ui/core/mvc/View","sap/ui/layout/VerticalLayout"],function(e,t,a,r,o,i){"use strict";return o.extend("sap.apf.ui.reuse.view.stepContainer",{getControllerName:function(){return"sap.apf.ui.reuse.controller.stepContainer"},createContent:function(o){if(r.system.desktop){o.getView().addStyleClass("sapUiSizeCompact")}var n=new e({id:o.createId("idChartContainer"),showFullScreen:true}).addStyleClass("chartContainer ChartArea");var s=new a({id:o.createId("idChartContainerToolbar")});s.addContent(new t);n.setToolbar(s);this.stepLayout=new i({id:o.createId("idStepLayout"),content:[n],width:"100%"});this.stepLayout.setBusy(true);return this.stepLayout}})});
//# sourceMappingURL=stepContainer.view.js.map