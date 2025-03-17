/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["../DefBase"],function(t){"use strict";var e=t.extend("sap.gantt.def.gradient.LinearGradient",{metadata:{library:"sap.gantt",properties:{x1:{type:"string",defaultValue:"0"},y1:{type:"string",defaultValue:"0"},x2:{type:"string",defaultValue:"100"},y2:{type:"string",defaultValue:"15"}},aggregations:{stops:{type:"sap.gantt.def.gradient.Stop",multiple:true,singularName:"stop"}}}});e.prototype.getDefString=function(t){var e=this.getId();var a=this.getX1().indexOf("%")>=0?this.getX1().slice(0,-1)/100:this.getX1();var i=this.getX2().indexOf("%")>=0?this.getX2().slice(0,-1)/100:this.getX2();var r=this.getY1().indexOf("%")>=0?this.getY1().slice(0,-1)/100:this.getY1();var s=this.getY2().indexOf("%")>=0?this.getY2().slice(0,-1)/100:this.getY2();var n="<linearGradient id='"+(t?e.slice(0,e.lastIndexOf("-__clone")):e)+"' x1='"+a+"' y1='"+r+"' x2='"+i+"' y2='"+s+"'>";var g=this.getStops();var l=0;while(l<g.length&&Number.parseFloat(g[l].getOffSet())===0){l++}for(var d=Math.max(0,l-1);d<g.length;d++){n=n.concat(g[d].getDefString())}n=n.concat("</linearGradient>");return n};return e},true);
//# sourceMappingURL=LinearGradient.js.map