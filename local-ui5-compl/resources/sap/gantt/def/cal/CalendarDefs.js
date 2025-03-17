/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/def/SvgDefs"],function(e){"use strict";var t=e.extend("sap.gantt.def.cal.CalendarDefs",{metadata:{library:"sap.gantt",aggregations:{defs1:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def1",bindable:"bindable"},defs2:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def2",bindable:"bindable"},defs3:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def3",bindable:"bindable"},defs4:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def4",bindable:"bindable"},defs5:{type:"sap.gantt.def.DefBase",multiple:true,visibility:"public",singularName:"def5",bindable:"bindable"}}}});t.prototype.getRefString=function(e){var t="";if(this.getParent()&&this.getParent().getId()){t=this.getParent().getId()}return"url(#"+t+"_"+e+")"};t.prototype.getDefNode=function(e){var t={id:this.getId(),defNodes:[]};for(var i=0;i<e.length;i++){t.defNodes.push(e[i].getDefNode())}return t};return t},true);
//# sourceMappingURL=CalendarDefs.js.map