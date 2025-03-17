/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(){"use strict";var a={metadata:{fields:[{id:"Country",name:"Country",semanticType:"Dimension",dataType:"String"},{id:"Year",name:"Year",semanticType:"Dimension",dataType:"String"},{id:"Profit",name:"Profit",semanticType:"Measure",dataType:"Number"}]},data:[["China","2009",26885.7],["China","2010",27547.6],["China","2011",21569],["Japan","2009",20833.1],["Japan","2010",38932],["Japan","2011",30523],["France","2009",32681.6],["France","2010",33437],["France","2011",42670.3]]};var e=[{feed:"categoryAxis",source:["Country"]},{feed:"color",source:["Year"]},{feed:"valueAxis",source:["Profit"]}];return{flatData:function(){return new sap.viz.api.data.FlatTableDataset(a)},bindings:function(){return e}}});
//# sourceMappingURL=info_default_data.js.map