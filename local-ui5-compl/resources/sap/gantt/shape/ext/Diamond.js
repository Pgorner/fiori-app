/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log","sap/gantt/shape/Path"],function(t,e){"use strict";var a=e.extend("sap.gantt.shape.ext.Diamond",{metadata:{properties:{isClosed:{type:"boolean",defaultValue:true},verticalDiagonal:{type:"float",defaultValue:12},horizontalDiagonal:{type:"float",defaultValue:12}}}});a.prototype.init=function(){var t=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",t.getText("ARIA_DIAMOND"))};a.prototype.getD=function(e,a){var i;if(this.mShapeConfig.hasShapeProperty("d")){i=this._configFirst("d",e)}else{var r=this.getVerticalDiagonal(e,a)/2;var n=this.getHorizontalDiagonal(e,a)/2;var o=this.getRotationCenter(e,a);if(o&&o.length===2&&jQuery.isNumeric(r)&&jQuery.isNumeric(n)){i="M "+o.join(" ")+" m "+-n+" 0"+" l "+n+" -"+r+" l "+n+" "+r+" l -"+n+" "+r+" z"}}if(this.isValid(i)){return i}else{t.warning("Diamond shape generated invalid d: "+i+" from the given data: "+e);return null}};a.prototype.getVerticalDiagonal=function(t){return this._configFirst("verticalDiagonal",t,true)};a.prototype.getHorizontalDiagonal=function(t){return this._configFirst("horizontalDiagonal",t,true)};return a},true);
//# sourceMappingURL=Diamond.js.map