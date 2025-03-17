/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/gantt/thirdparty/d3fc-discontinuous-scale"],function(t){"use strict";var e=t.extend("sap.gantt.skipTime.SkipPattern",{metadata:{library:"sap.gantt",abstract:true}});e.prototype.getDiscontinuityProvider=function(){return null};e.prototype.updateDiscontinuousProvider=function(t,e){var i=this.getParent();if(i){delete i._nGanttVisibleWidth;i.setProperty("_discontinuousProvider",t,e)}};e.prototype.setLocale=function(t){this._oLocale=t};e.prototype.getLocale=function(){return this._oLocale};e.prototype._getTimezone=function(){return this._sTimezone};e.prototype._setTimezone=function(t){if(t===null){t=undefined}if(this._sTimezone!==t){this._sTimezone=t;this.updateDiscontinuousProvider(this.getDiscontinuityProvider())}};e.prototype.clone=function(){const e=t.prototype.clone.apply(this,arguments);const i=this.getLocale();if(i){e.setLocale(i)}e._sTimezone=this._sTimezone;return e};return e});
//# sourceMappingURL=SkipPattern.js.map