/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/uxap/ObjectPageSubSection","sap/uxap/ObjectPageSubSectionRenderer"],function(e,t,n){"use strict";var r=t.extend("sap.ui.documentation.ObjectPageSubSection",{metadata:{library:"sap.ui.documentation"},renderer:n});var i=e.extend("sap.ui.documentation.Container",{metadata:{library:"sap.ui.documentation",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}},renderer:{apiVersion:2,render:function(e,t){var n=t.getContent(),r,i;e.openStart("div",t).openEnd();for(i=0,r=n.length;i<r;i++){e.renderControl(n[i])}e.close("div")}}});r.prototype._getGrid=function(){if(!this.getAggregation("_grid")){this.setAggregation("_grid",new i({id:this.getId()+"-innerGrid"}),true)}return this.getAggregation("_grid")};return r});
//# sourceMappingURL=ObjectPageSubSection.js.map