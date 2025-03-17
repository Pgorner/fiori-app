/*
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/library","sap/ui/core/CustomStyleClassSupport","sap/ui/core/Element"],function(jQuery,e,a,n){"use strict";var t=n.extend("sap.zen.commons.MatrixLayoutCell",{metadata:{library:"sap.zen.commons",aggregatingType:"MatrixLayoutRow",properties:{backgroundDesign:{type:"sap.zen.commons.BackgroundDesign",defaultValue:"Transparent"},colSpan:{type:"int",defaultValue:1},hAlign:{type:"sap.zen.commons.HAlign",defaultValue:"Begin"},padding:{type:"sap.zen.commons.Padding",defaultValue:"End"},rowSpan:{type:"int",defaultValue:1},separation:{type:"sap.zen.commons.Separation",defaultValue:"None"},vAlign:{type:"sap.zen.commons.VAlign",defaultValue:"Middle"}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}}});a.apply(t.prototype);return t},true);
//# sourceMappingURL=MatrixLayoutCell.js.map