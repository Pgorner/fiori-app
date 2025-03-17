/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control"],function(e){"use strict";return e.extend("sap.ui.documentation.DivContainer",{metadata:{library:"sap.ui.documentation",defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}},renderer:{apiVersion:2,render:function(e,n){e.openStart("div",n);e.openEnd();const t=n.getContent();t.forEach(n=>{e.renderControl(n)});e.close("div")}}})});
//# sourceMappingURL=DivContainer.js.map