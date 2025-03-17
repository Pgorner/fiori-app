/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape","sap/gantt/misc/Utility"],function(t,e){"use strict";var i=t.extend("sap.gantt.shape.Polygon",{metadata:{properties:{tag:{type:"string",defaultValue:"polygon"},points:{type:"string"}}}});i.prototype.init=function(){t.prototype.init.apply(this,arguments);var e=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",e.getText("ARIA_POLYGON"))};i.prototype.getPoints=function(t,i){if(this.mShapeConfig.hasShapeProperty("points")){return this._configFirst("points",t)}var a=this.mChartInstance.getSapUiSizeClass();var s=this.getRotationCenter(t,i),p=e.scaleBySapUiSize(a,8),r=e.scaleBySapUiSize(a,4),n=e.scaleBySapUiSize(a,4*Math.sqrt(3)),o=[];if(s&&s.length===2&&jQuery.isNumeric(p)&&jQuery.isNumeric(r)&&jQuery.isNumeric(n)){o.push([s[0]-n,s[1]-r].join(","));o.push([s[0],s[1]-p].join(","));o.push([s[0]+n,s[1]-r].join(","));o.push([s[0]+n,s[1]+r].join(","));o.push([s[0],s[1]+p].join(","));o.push([s[0]-n,s[1]+r].join(","))}return o.join(" ")};i.prototype.getStyle=function(e,i){var a=t.prototype.getStyle.apply(this,arguments);var s={fill:this.determineValueColor(this.getFill(e,i)),"fill-opacity":this.getFillOpacity(e,i)};var p=Object.assign(a,s);return p};return i},true);
//# sourceMappingURL=Polygon.js.map