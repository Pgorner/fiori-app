/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control"],function(e){"use strict";return e.extend("sap.ui.documentation.LightTable",{metadata:{library:"sap.ui.documentation",properties:{columnTitles:{type:"string[]"},columnCount:{type:"int"}},defaultAggregation:"rows",aggregations:{rows:{type:"sap.ui.documentation.Row",multiple:true}}},renderer:{apiVersion:2,render:function(e,t){var n=t.getRows(),o,i=t.getColumnTitles(),s,l,a,r;e.openStart("div",t);e.class("sapUiDocLightTable");e.class("columns-"+t.getColumnCount());e.openEnd();e.openStart("div").class("head").openEnd();for(r=0,a=i.length;r<a;r++){e.openStart("div").class("cell").openEnd();e.text(i[r]).close("div")}e.close("div");for(r=0,a=n.length;r<a;r++){e.openStart("div").class("row").openEnd();o=n[r].getContent();for(l=0,s=o.length;l<s;l++){e.openStart("div").class("cell").openEnd();if(l>0){e.openStart("div").class("inTitle").openEnd().text(i[l]+":").close("div")}e.renderControl(o[l]);e.close("div")}e.close("div")}e.close("div")}}})});
//# sourceMappingURL=LightTable.js.map