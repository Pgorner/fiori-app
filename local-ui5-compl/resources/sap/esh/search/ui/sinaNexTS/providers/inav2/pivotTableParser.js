/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../core/core"],function(e){"use strict";class t{resultSet;constructor(e){this.resultSet=e.resultSet}parseNamedValue(e){let t;let s;let n;for(const r in e){switch(r){case"Name":s=e[r];break;case"Value":t=e[r];break;default:if(!n){n={}}n[r]=e[r]}}if(n){n.Value=t;return{name:s,value:n}}return{name:s,value:t}}formatItem(e){let t;if(e.NamedValues){t=e.NamedValues}if(!t){return e}const s={};for(let e=0;e<t.length;++e){const n=t[e];const r=this.parseNamedValue(n);s[r.name]=this.formatItem(r.value)}return s}formatItems(t){const s={};for(let n=0;n<t.length;++n){const r=t[n];const l=this.formatItem(r);e.extend(s,l)}return s}parse(){if(!this.resultSet.Grids||!this.resultSet.Grids[0]||!this.resultSet.Grids[0].Axes){return{cells:[],axes:[]}}this.enhance(this.resultSet);const e=this.resultSet.Grids[0];if(e.Cells.length>0){return this.parseWithCells(e)}return this.parseWithoutCells(e)}parseWithCells(t){const s={axes:[],cells:[]};for(let n=0;n<t.Cells.length;n++){const r=t.Cells[n];const l=[];for(let e=0;e<r.Index.length;e++){const s=r.Index[e];const n=t.Axes[e];const o=this.resolve(n,s);l.push(...o)}const o=e.extend({},r);delete o.Index;l.push(o);s.cells.push(this.formatItems(l))}return s}parseWithoutCells(e){const t={axes:[],cells:[]};for(let s=0;s<e.Axes.length;++s){const n=e.Axes[s];const r=[];t.axes.push(r);for(let e=0;e<n.Tuples.length;++e){const t=this.resolve(n,e);r.push(this.formatItems(t))}}return t}resolve(e,t){const s=[];if(e.Tuples.length===0){return s}const n=e.Tuples[t];for(let t=0;t<n.length;++t){const r=n[t];const l=e.Dimensions[t].ItemList.Items[r];s.push(l)}return s}enhance(e){const t={};for(let s=0;s<e.ItemLists.length;++s){const n=e.ItemLists[s];t[n.Name]=n}for(let s=0;s<e.Grids.length;++s){const n=e.Grids[s];for(let e=0;e<n.Axes.length;++e){const s=n.Axes[e];for(let e=0;e<s.Dimensions.length;++e){const n=s.Dimensions[e];n.ItemList=t[n.ItemListName]}}}}}function s(e){const s=new t({resultSet:e});return s.parse()}var n={__esModule:true};n.ResultSetParser=t;n.parse=s;return n})})();
//# sourceMappingURL=pivotTableParser.js.map