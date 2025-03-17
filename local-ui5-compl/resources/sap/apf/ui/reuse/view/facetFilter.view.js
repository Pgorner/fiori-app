/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
sap.ui.define(["sap/m/FacetFilter","sap/ui/Device","sap/ui/core/mvc/View"],function(e,t,r){"use strict";return r.extend("sap.apf.ui.reuse.view.facetFilter",{getControllerName:function(){return"sap.apf.ui.reuse.controller.facetFilter"},createContent:function(r){var i=new e(r.createId("idAPFFacetFilter"),{type:"Simple",showReset:true,mode:"MultiSelect",showPopoverOKButton:true,reset:r.onResetPress.bind(r)}).addStyleClass("facetFilterInitialAlign");if(t.system.desktop){i.addStyleClass("facetfilter")}return i}})});
//# sourceMappingURL=facetFilter.view.js.map