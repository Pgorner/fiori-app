/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape","sap/gantt/misc/Utility"],function(t,e){"use strict";var i=t.extend("sap.gantt.shape.Polyline",{metadata:{properties:{tag:{type:"string",defaultValue:"polyline"},fill:{type:"string",defaultValue:"none"},points:{type:"string"}}}});i.prototype.init=function(){t.prototype.init.apply(this,arguments);var e=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",e.getText("ARIA_CIRCLE"))};i.prototype.getPoints=function(t,i){if(this.mShapeConfig.hasShapeProperty("points")){return this._configFirst("points",t)}var a=this.getRotationCenter(t,i),n=[];var p=this.mChartInstance.getSapUiSizeClass();if(a&&a.length===2){n.push([a[0]-15,a[1]].join(","));n.push([a[0]-10,a[1]].join(","));n.push([a[0]-5,a[1]-e.scaleBySapUiSize(p,7.5)].join(","));n.push([a[0]+5,a[1]+e.scaleBySapUiSize(p,7.5)].join(","));n.push([a[0]+10,a[1]].join(","));n.push([a[0]+15,a[1]].join(","))}return n.join(" ")};i.prototype.getStyle=function(e,i){var a=t.prototype.getStyle.apply(this,arguments);var n={fill:this.determineValueColor(this.getFill(e,i)),"fill-opacity":this.getFillOpacity(e,i)};var p=Object.assign(a,n);return p};return i},true);
//# sourceMappingURL=Polyline.js.map