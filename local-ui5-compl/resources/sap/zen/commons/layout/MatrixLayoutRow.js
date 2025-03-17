/*
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/library","sap/ui/core/CustomStyleClassSupport","sap/ui/core/Element"],function(jQuery,e,a,t){"use strict";var o=t.extend("sap.zen.commons.layout.MatrixLayoutRow",{metadata:{library:"sap.zen.commons",aggregatingType:"MatrixLayout",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null}},defaultAggregation:"cells",aggregations:{cells:{type:"sap.zen.commons.layout.MatrixLayoutCell",multiple:true,singularName:"cell"}}}});a.apply(o.prototype);return o},true);
//# sourceMappingURL=MatrixLayoutRow.js.map