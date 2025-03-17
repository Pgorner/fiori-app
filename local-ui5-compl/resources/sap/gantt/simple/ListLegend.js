/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/gantt/library","sap/ui/core/delegate/ItemNavigation"],function(t,e,i){"use strict";var a=t.extend("sap.gantt.simple.ListLegend",{metadata:{library:"sap.gantt",properties:{title:{type:"string",group:"Data",defaultValue:null}},defaultAggregation:"items",aggregations:{items:{type:"sap.gantt.simple.ListLegendItem",multiple:true,singularName:"item"}}}});a.prototype.forceInvalidation=a.prototype.invalidate;a.prototype.invalidate=function(t){if(t==this){}else if(!t){this.forceInvalidation()}else if(t instanceof sap.gantt.simple.ListLegendItem){}};a.prototype.onAfterRendering=function(){if(!this._oItemNavigation){this._oItemNavigation=new i(null,null);this.addEventDelegate(this._oItemNavigation)}this._oItemNavigation.setRootDomRef(this.getDomRef());var t=this.getItems();var e=[];for(var a=0;a<t.length;a++){if(t[a].getVisible()){e.push(t[a].getDomRef())}}this._oItemNavigation.setItemDomRefs(e);this._oItemNavigation.setFocusedIndex(0)};a.prototype.exit=function(){this._destroyItemNavigation()};a.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null}};return a},true);
//# sourceMappingURL=ListLegend.js.map