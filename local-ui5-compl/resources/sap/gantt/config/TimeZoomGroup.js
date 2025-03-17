/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ToolbarGroup"],function(t){"use strict";var o=sap.gantt.config.ZoomControlType;var e=t.extend("sap.gantt.config.TimeZoomGroup",{metadata:{library:"sap.gantt",properties:{showZoomSlider:{type:"boolean",defaultValue:true},showZoomButtons:{type:"boolean",defaultValue:true},zoomControlType:{type:"sap.gantt.config.ZoomControlType",defaultValue:sap.gantt.config.ZoomControlType.SliderWithButtons},stepCountOfSlider:{type:"int",defaultValue:10},infoOfSelectItems:{type:"object[]"}}}});e.prototype.getZoomControlType=function(){var t=o.SliderWithButtons;var e=this.getProperty("zoomControlType");if(e==t){return this._getZoomControlTypeByDeprecatedProperties()}return e};e.prototype._getZoomControlTypeByDeprecatedProperties=function(){var t=this.getShowZoomSlider();var e=this.getShowZoomButtons();if(t&&e){return o.SliderWithButtons}if(t&&!e){return o.SliderOnly}if(!t&&e){return o.ButtonsOnly}if(!t&&!e){return o.None}return o.SliderWithButtons};return e},true);
//# sourceMappingURL=TimeZoomGroup.js.map