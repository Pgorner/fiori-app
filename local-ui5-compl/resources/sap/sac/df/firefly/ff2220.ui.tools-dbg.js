/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff2200.ui","sap/sac/df/firefly/ff2100.runtime"
],
function(oFF)
{
"use strict";

oFF.UtUi5AttributeConstants = {

	FAST_NAV_GROUP:"sap-ui-fastnavgroup"
};

oFF.UtCssClasses = {

	FF_FLIP:"ffFlip",
	FF_FONT_SIZE_LARGE:"ffFontSizeLarge",
	FF_FONT_SIZE_SMALL:"ffFontSizeSmall",
	FF_HIDDEN:"ffHidden",
	FF_MIRROR:"ffMirror"
};

oFF.UtStyles = {

	ACTIVITY_INDICATOR_ALT_BASE64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOgSURBVEiJnZVvTNVlFMc/57k/hHTYBVkRpqzJ8EUNa7iFLuLmi3Bt+aKCRRK0srBpKxxZbZW3tl4UswihPwaJU8Hl5qauFm8aW5PlnAOkco4UUTIJ5Z8wg/u7z+mN9/a7VyTg++p3znPO93vOc357jjBLPFlWthzXVyfwqAqXRXXH0eamQ/+XJ7MhDwSCzuKMC6dAcjxuK0YDR/Y3/TxTrhPvKAoGFyQNjWf7jNvfVFMzAuDP6F1lMTlxoUYtzwEzChiv8cLWqsDCqxN9xkq3ugmD5Vu2vwNgrWOnTxeNfA0OXy+4MjRa0turSdMKFBUV+RRpAdKj3Yl+VLalas3YlWXdQEccuxXLfoCBq6PPW2vbRGlelDwWM5eoQHLaikwPebREAw+3tQVdR3wbgMMKQ6CnReSZIwf3tAOIaEEkQYWAlyA6Ayc8dCnsu3MYSIkp02e6AA4faOgHno6/JACrNIuwEUgSaIyp0GuUb92+AXQfsBhQoGZvXfW26UjjMTAwfnfYp6kZaclnbisA8FJlZao7lfAQRi/s3VV9bjbkXpy7PLQc3M1gxkIJWi+v1dYm+qect0QpRPjTqHwYfPPVX+dKDNDT05Moi/xngUwAEY6Z1MmET0X5AFiLUmTRtmD1l3fNR8Dc4c+MkAOoUmAUfTYubkkYfXw+AheXpp0HfovYAkcd4BqQ6g0U4dp8BB4Tcfv6RvJDzlQpxowNpy9pdozo21alBVhwM67VjP/dOh8BgMxM/zCwK1oswLsff7HSiKxDbL+ZGPw+GAze5mmYGb909eQh0gjcA9Tl5WS9H/Ob1u/5Lj3khgtEufT6KyXtcxY4/cdZIDtiWzQQfSo+/+ZAbsh1z4AeVNHjNbubv5oLuaoKyFKvTzD3RgUs5j3A7zmtqGnct3K2AiKiCrujgnDRxfnBsw/Uf0uW69zq86D1+MkHCJtyREZDOPVrclZsO9HZ04pIunUSj+Xfv2w4OoPPGlpeFNXoQyXQnWSv56akZCfekH92CJIHetJMarC09ImxH9tPZUmYLmDhzQI7R/86v7q4uDjsLSJ6RZWbSr5FtBhoUeWTkGVdRUVF6IZM1gpSBTwCUmkT5WsALOv/IweQB5Mz7suK7zJmZb6xaeMhIH6RF8aaUgggYX6P3YeMmIkF/fECJt4RD1HpjPVoB0BhQe5PilaB9qrQoaJPFRaumpixg+nghtmc4GiDImsVToialyNn6/NX7wR2zpT/L/sqUVMZd9+sAAAAAElFTkSuQmCC",
	ACTIVITY_INDICATOR_BASE64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMUSURBVEiJrZZLbFVVFIa/f5/Ti7UWq4bYFNHgQEwkyqAiieiAxGBMjGmJqEQiAx048ZmYaNL2WkwLEZSXGlNmTUysASJOQElQGBGMKWEAxoF1QlQMYNPXvfec/TvoU0ofof2Ha6/z/Wutfc7ZW8ykom9RyH8XnIjmMLXJMd7R8Iz5M0gzruzzEl3L+4D6scigxNG4Ktl6+jGaJb7AvLT+Pv0wm0G4YfTDrEnX8l+nwAFqiFxhs3IFlgJ3ElgG8O0FNx885zfn7sBWaM92W3p7vGqgBkDmy9iavI5kgJ8v+dbGBg0dP+eagSXu7+tH764N0wr+XyC055+NwS37Y8ekEUCiayocoLFBQwAbH9HgPyUdWlpQ1+wdtGevCrqAaLONtrR7bFzP4+QQRcUbAaaq86zvHyn5yL9l/bRng94ASAEoul7knwIYvU9b0j3xVFv6zVzgcWUl1lwZ0cPG6cRUAILyD4DbgDPEsGu+wOvVsl6HC4FNaaLHx2Maex3/BOosb6Sl6vubNRjX1uNeeXmIF9edY2fK1exJpDrgEnl6YqFwgBD5/HLFT59crZGUEBqxEZzyPDZyPvpjhGOJWHF7HV+lIXq5Bdi/LQYc4Mcm7QX2AqSIaoAYQmmxDB7o8fKBgXx/JefrFPsvJIJdvyjzASplmoczNUVzbxoV+oQxrFokPlcrdAexuhDDLlH0gwr5BaDimNRT1JXFMgIIFHURdB6oIomvLBSYHqg8lezOhsKOyp5RA8BwAEB2Kx1etqCKS7rbw65GapiM9jhRe96r9sxqz06yz0tuiv6eR/ex03eMhyb/psXyGoVwCqgFvnNMXqao/nmBP3F1GMgPesRbHDnKjqrnJjqaNCj0Wt4MlIFnFbKzbM+emRO+vbJBA/GMM7ZQGj2Lpi5PP5M/Kq9TDD3AitEM/WJzBOJplP4NZMTsHhQelb0JWEvZUCK64LfoKOyf3QCgw3eFctbqoNdg9EufJgNlw4hMlc9b6Qt06uL1aTPfKgBa/BAx2ybpCeyVNrXKVUAexBp2iCdR1U461DsT4j8tvEUHScegaAAAAABJRU5ErkJggg==",
	DIALOG_BUTTON_MIN_WIDTH:null,
	DIALOG_PADDING:null,
	DIALOG_WIDTH:null,
	ERROR_COLOR:null,
	ERROR_SECONDARY_COLOR:null,
	INFORMATION_COLOR:null,
	LIGHT_GRAY_COLOR:null,
	SUCCESS_COLOR:null,
	WARNING_COLOR:null,
	WARNING_SECONDARY_COLOR:null,
	staticSetup:function()
	{
			oFF.UtStyles.DIALOG_WIDTH = oFF.UiCssLength.create("600px");
		oFF.UtStyles.DIALOG_PADDING = oFF.UiCssBoxEdges.create("1rem");
		oFF.UtStyles.DIALOG_BUTTON_MIN_WIDTH = oFF.UiCssLength.create("5rem");
		oFF.UtStyles.LIGHT_GRAY_COLOR = oFF.UiColor.create("#cbc2c2");
		oFF.UtStyles.SUCCESS_COLOR = oFF.UiColor.create("#38a238");
		oFF.UtStyles.INFORMATION_COLOR = oFF.UiColor.create("#427cac");
		oFF.UtStyles.WARNING_COLOR = oFF.UiColor.create("#f9a429");
		oFF.UtStyles.WARNING_SECONDARY_COLOR = oFF.UiColor.create("#ffe4e4");
		oFF.UtStyles.ERROR_COLOR = oFF.UiColor.create("#e00");
		oFF.UtStyles.ERROR_SECONDARY_COLOR = oFF.UiColor.create("#fef0db");
	}
};

oFF.UiFormUtils = {

	areValuesEqual:function(value, otherValue)
	{
			if (oFF.isNull(value) && oFF.isNull(otherValue))
		{
			return true;
		}
		if (oFF.isNull(value) && oFF.notNull(otherValue))
		{
			return false;
		}
		if (oFF.notNull(value) && oFF.isNull(otherValue))
		{
			return false;
		}
		if (oFF.notNull(value))
		{
			return value.isEqualTo(otherValue);
		}
		return false;
	}
};

oFF.UiFormBaseConstants = {

	ITEM_INITIAL_BLUR_DELAY:400,
	REQUIRED_TEXT:" is required",
	VALUE_REQUIRED_TEXT:"The value is required"
};

oFF.UtStylingHelper = {

	s_activeStylingProvider:null,
	getActiveProvider:function()
	{
			if (oFF.isNull(oFF.UtStylingHelper.s_activeStylingProvider))
		{
			let stylingProvider = new oFF.UtUi5StylingProvider();
			oFF.UtStylingHelper.s_activeStylingProvider = stylingProvider;
		}
		return oFF.UtStylingHelper.s_activeStylingProvider;
	}
};

oFF.UtUi5StylingProvider = function() {};
oFF.UtUi5StylingProvider.prototype = new oFF.XObject();
oFF.UtUi5StylingProvider.prototype._ff_c = "UtUi5StylingProvider";

oFF.UtUi5StylingProvider.CONTENT_PADDING = "sapUiContentPadding";
oFF.UtUi5StylingProvider.CONTENT_PADDING_RESPONSIVE = "sapUiResponsiveContentPadding";
oFF.UtUi5StylingProvider.FORCE_WIDTH_AUTO = "sapUiForceWidthAuto";
oFF.UtUi5StylingProvider.MARGIN_LARGE = "sapUiLargeMargin";
oFF.UtUi5StylingProvider.MARGIN_LARGE_BEGIN = "sapUiLargeMarginBegin";
oFF.UtUi5StylingProvider.MARGIN_LARGE_BEGIN_END = "sapUiLargeMarginBeginEnd";
oFF.UtUi5StylingProvider.MARGIN_LARGE_BOTTOM = "sapUiLargeMarginBottom";
oFF.UtUi5StylingProvider.MARGIN_LARGE_END = "sapUiLargeMarginEnd";
oFF.UtUi5StylingProvider.MARGIN_LARGE_TOP = "sapUiLargeMarginTop";
oFF.UtUi5StylingProvider.MARGIN_LARGE_TOP_BOTTOM = "sapUiLargeMarginTopBottom";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM = "sapUiMediumMargin";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BEGIN = "sapUiMediumMarginBegin";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BEGIN_END = "sapUiMediumMarginBeginEnd";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BOTTOM = "sapUiMediumMarginBottom";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM_END = "sapUiMediumMarginEnd";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM_TOP = "sapUiMediumMarginTop";
oFF.UtUi5StylingProvider.MARGIN_MEDIUM_TOP_BOTTOM = "sapUiMediumMarginTopBottom";
oFF.UtUi5StylingProvider.MARGIN_RESPONSIVE = "sapUiResponsiveMargin";
oFF.UtUi5StylingProvider.MARGIN_SMALL = "sapUiSmallMargin";
oFF.UtUi5StylingProvider.MARGIN_SMALL_BEGIN = "sapUiSmallMarginBegin";
oFF.UtUi5StylingProvider.MARGIN_SMALL_BEGIN_END = "sapUiSmallMarginBeginEnd";
oFF.UtUi5StylingProvider.MARGIN_SMALL_BOTTOM = "sapUiSmallMarginBottom";
oFF.UtUi5StylingProvider.MARGIN_SMALL_END = "sapUiSmallMarginEnd";
oFF.UtUi5StylingProvider.MARGIN_SMALL_TOP = "sapUiSmallMarginTop";
oFF.UtUi5StylingProvider.MARGIN_SMALL_TOP_BOTTOM = "sapUiSmallMarginTopBottom";
oFF.UtUi5StylingProvider.MARGIN_TINY = "sapUiTinyMargin";
oFF.UtUi5StylingProvider.MARGIN_TINY_BEGIN = "sapUiTinyMarginBegin";
oFF.UtUi5StylingProvider.MARGIN_TINY_BEGIN_END = "sapUiTinyMarginBeginEnd";
oFF.UtUi5StylingProvider.MARGIN_TINY_BOTTOM = "sapUiTinyMarginBottom";
oFF.UtUi5StylingProvider.MARGIN_TINY_END = "sapUiTinyMarginEnd";
oFF.UtUi5StylingProvider.MARGIN_TINY_TOP = "sapUiTinyMarginTop";
oFF.UtUi5StylingProvider.MARGIN_TINY_TOP_BOTTOM = "sapUiTinyMarginTopBottom";
oFF.UtUi5StylingProvider.NO_CONTENT_PADDING = "sapUiNoContentPadding";
oFF.UtUi5StylingProvider.NO_MARGIN = "sapUiNoMargin";
oFF.UtUi5StylingProvider.NO_MARGIN_BEGIN = "sapUiNoMarginBegin";
oFF.UtUi5StylingProvider.NO_MARGIN_BOTTOM = "sapUiNoMarginBottom";
oFF.UtUi5StylingProvider.NO_MARGIN_END = "sapUiNoMarginEnd";
oFF.UtUi5StylingProvider.NO_MARGIN_TOP = "sapUiNoMarginTop";
oFF.UtUi5StylingProvider.prototype.addCssClass = function(control, cssClass)
{
	if (oFF.notNull(control) && oFF.XStringUtils.isNotNullAndNotEmpty(cssClass))
	{
		control.addCssClass(cssClass);
	}
	return control;
};
oFF.UtUi5StylingProvider.prototype.applyContentPadding = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.CONTENT_PADDING);
};
oFF.UtUi5StylingProvider.prototype.applyContentPaddingResponsive = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.CONTENT_PADDING_RESPONSIVE);
};
oFF.UtUi5StylingProvider.prototype.applyForceAutoWidth = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.FORCE_WIDTH_AUTO);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLarge = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLargeBegin = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_BEGIN);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLargeBeginEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_BEGIN_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLargeBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLargeEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLargeTop = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_TOP);
};
oFF.UtUi5StylingProvider.prototype.applyMarginLargeTopBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_TOP_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMedium = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMediumBegin = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BEGIN);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMediumBeginEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BEGIN_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMediumBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMediumEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMediumTop = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_TOP);
};
oFF.UtUi5StylingProvider.prototype.applyMarginMediumTopBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_TOP_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginResponsive = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_RESPONSIVE);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmall = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmallBegin = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_BEGIN);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmallBeginEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_BEGIN_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmallBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmallEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmallTop = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_TOP);
};
oFF.UtUi5StylingProvider.prototype.applyMarginSmallTopBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_TOP_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTiny = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTinyBegin = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_BEGIN);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTinyBeginEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_BEGIN_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTinyBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTinyEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_END);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTinyTop = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_TOP);
};
oFF.UtUi5StylingProvider.prototype.applyMarginTinyTopBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_TOP_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyNoContentPadding = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.NO_CONTENT_PADDING);
};
oFF.UtUi5StylingProvider.prototype.applyNoMargin = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN);
};
oFF.UtUi5StylingProvider.prototype.applyNoMarginBegin = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_BEGIN);
};
oFF.UtUi5StylingProvider.prototype.applyNoMarginBottom = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_BOTTOM);
};
oFF.UtUi5StylingProvider.prototype.applyNoMarginEnd = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_END);
};
oFF.UtUi5StylingProvider.prototype.applyNoMarginTop = function(control)
{
	return this.addCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_TOP);
};
oFF.UtUi5StylingProvider.prototype.removeCssClass = function(control, cssClass)
{
	if (oFF.notNull(control) && oFF.XStringUtils.isNotNullAndNotEmpty(cssClass))
	{
		control.removeCssClass(cssClass);
	}
	return control;
};
oFF.UtUi5StylingProvider.prototype.removeStyling = function(control)
{
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_TOP);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_TOP);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_TOP);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_TOP);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_BEGIN);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_BEGIN);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BEGIN);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_BEGIN);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_BEGIN_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_BEGIN_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_BEGIN_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_BEGIN_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_TINY_TOP_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_SMALL_TOP_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_MEDIUM_TOP_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_LARGE_TOP_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.MARGIN_RESPONSIVE);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.FORCE_WIDTH_AUTO);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_TOP);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_BOTTOM);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_BEGIN);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.NO_MARGIN_END);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.NO_CONTENT_PADDING);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.CONTENT_PADDING);
	this.removeCssClass(control, oFF.UtUi5StylingProvider.CONTENT_PADDING_RESPONSIVE);
	return control;
};

oFF.UtStringUtils = {

	getHighlightedText:function(text, textToHighlight)
	{
			if (oFF.XStringUtils.isNullOrEmpty(text) || oFF.XStringUtils.isNullOrEmpty(textToHighlight))
		{
			return text;
		}
		let highlightedText = oFF.XStringBuffer.create();
		let startIndex = oFF.XString.indexOf(oFF.XString.toUpperCase(text), oFF.XString.toUpperCase(textToHighlight));
		if (startIndex !== -1)
		{
			let firstPart = oFF.XString.substring(text, 0, startIndex);
			if (oFF.XString.size(firstPart) > 0)
			{
				highlightedText.append("<span>");
				highlightedText.append(firstPart);
				highlightedText.append("</span>");
			}
			let highlightPart = oFF.XString.substring(text, startIndex, startIndex + oFF.XString.size(textToHighlight));
			highlightedText.append("<bdi>");
			highlightedText.append(highlightPart);
			highlightedText.append("</bdi>");
			let lastPart = oFF.XString.substring(text, startIndex + oFF.XString.size(textToHighlight), oFF.XString.size(text));
			if (oFF.XString.size(lastPart) > 0)
			{
				highlightedText.append("<span>");
				highlightedText.append(lastPart);
				highlightedText.append("</span>");
			}
			return highlightedText.toString();
		}
		else
		{
			return text;
		}
	}
};

oFF.UtUiHelpers = {

	cancelLiveChangeDebounceIfNeeded:function(control)
	{
			if (oFF.isNull(control))
		{
			return;
		}
		try
		{
			let contextControl = control;
			if (contextControl.getListenerOnLiveChange() !== null)
			{
				let debounceListener = contextControl.getListenerOnLiveChange();
				debounceListener.cancel();
			}
		}
		catch (err)
		{
			oFF.XException.getMessage(err);
		}
	}
};

oFF.UtToolbarWidgetMenuItem = function() {};
oFF.UtToolbarWidgetMenuItem.prototype = new oFF.XObject();
oFF.UtToolbarWidgetMenuItem.prototype._ff_c = "UtToolbarWidgetMenuItem";

oFF.UtToolbarWidgetMenuItem.create = function(parentMenu, name, text, icon)
{
	let menuItem = new oFF.UtToolbarWidgetMenuItem();
	menuItem.setupInternal(parentMenu, name, text, icon);
	return menuItem;
};
oFF.UtToolbarWidgetMenuItem.prototype.m_item = null;
oFF.UtToolbarWidgetMenuItem.prototype.m_parentMenu = null;
oFF.UtToolbarWidgetMenuItem.prototype.addAttribute = function(attributeId, attributeValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(attributeValue))
	{
		this.m_item.addAttribute(attributeId, attributeValue);
	}
};
oFF.UtToolbarWidgetMenuItem.prototype.addCssClass = function(cssClass)
{
	this.m_item.addCssClass(cssClass);
};
oFF.UtToolbarWidgetMenuItem.prototype.addMenuItem = function(name, text, icon)
{
	return this.m_item.addNewItem().setName(name).setText(text).setIcon(icon);
};
oFF.UtToolbarWidgetMenuItem.prototype.addToggleButton = function(name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState)
{
	let toggleButton = oFF.UtToolbarWidgetMenuToggleButton.create(this.m_item, name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState);
	return toggleButton.getItem();
};
oFF.UtToolbarWidgetMenuItem.prototype.clearItems = function()
{
	this.m_item.clearItems();
};
oFF.UtToolbarWidgetMenuItem.prototype.isEnabled = function()
{
	return this.m_item.isEnabled();
};
oFF.UtToolbarWidgetMenuItem.prototype.isSectionStart = function()
{
	return this.m_item.isSectionStart();
};
oFF.UtToolbarWidgetMenuItem.prototype.releaseObject = function()
{
	this.m_item = oFF.XObjectExt.release(this.m_item);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UtToolbarWidgetMenuItem.prototype.remove = function()
{
	this.m_parentMenu.removeItem(this.m_item);
};
oFF.UtToolbarWidgetMenuItem.prototype.setEnabled = function(enabled)
{
	return this.m_item.setEnabled(enabled);
};
oFF.UtToolbarWidgetMenuItem.prototype.setHoverConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_item.registerOnHover(oFF.UiLambdaHoverListener.create(consumer));
	}
};
oFF.UtToolbarWidgetMenuItem.prototype.setHoverEndConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_item.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create(consumer));
	}
};
oFF.UtToolbarWidgetMenuItem.prototype.setIcon = function(icon)
{
	this.m_item.setIcon(icon);
};
oFF.UtToolbarWidgetMenuItem.prototype.setPressConsumer = function(consumer)
{
	this.m_item.registerOnPress(oFF.UiLambdaPressListener.create(consumer));
};
oFF.UtToolbarWidgetMenuItem.prototype.setSectionStart = function(sectionStart)
{
	return this.m_item.setSectionStart(sectionStart);
};
oFF.UtToolbarWidgetMenuItem.prototype.setShortcutText = function(shortcutText)
{
	this.m_item.setShortcutText(shortcutText);
};
oFF.UtToolbarWidgetMenuItem.prototype.setText = function(text)
{
	this.m_item.setText(text);
};
oFF.UtToolbarWidgetMenuItem.prototype.setTooltip = function(tooltip)
{
	this.m_item.setTooltip(tooltip);
};
oFF.UtToolbarWidgetMenuItem.prototype.setupInternal = function(parentMenu, name, text, icon)
{
	this.m_parentMenu = parentMenu;
	this.m_item = parentMenu.addNewItem().setName(name).setText(text).setIcon(icon);
};

oFF.UtToolbarWidgetMenuToggleButton = function() {};
oFF.UtToolbarWidgetMenuToggleButton.prototype = new oFF.XObject();
oFF.UtToolbarWidgetMenuToggleButton.prototype._ff_c = "UtToolbarWidgetMenuToggleButton";

oFF.UtToolbarWidgetMenuToggleButton.create = function(menu, name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState)
{
	let menuToggle = new oFF.UtToolbarWidgetMenuToggleButton();
	menuToggle.setupInternal(menu, name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState);
	return menuToggle;
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_activeIcon = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_activeText = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_consumer = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_hoverConsumer = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_hoverEndConsumer = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_inactiveIcon = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_inactiveText = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_item = null;
oFF.UtToolbarWidgetMenuToggleButton.prototype.m_state = false;
oFF.UtToolbarWidgetMenuToggleButton.prototype.getItem = function()
{
	return this.m_item;
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.hover = function(event)
{
	if (oFF.notNull(this.m_hoverConsumer))
	{
		this.m_hoverConsumer(event);
	}
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.hoverEnd = function(event)
{
	if (oFF.notNull(this.m_hoverEndConsumer))
	{
		this.m_hoverEndConsumer(event);
	}
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.isPressed = function()
{
	return this.m_state;
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.releaseObject = function()
{
	this.m_item = oFF.XObjectExt.release(this.m_item);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.setHoverConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_hoverConsumer = consumer;
	}
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.setHoverEndConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_hoverEndConsumer = consumer;
	}
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.setItemActive = function()
{
	this.m_item.setText(this.m_activeText).setIcon(this.m_activeIcon);
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.setItemInactive = function()
{
	this.m_item.setText(this.m_inactiveText).setIcon(this.m_inactiveIcon);
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.setPressConsumer = function(consumer)
{
	this.m_consumer = consumer;
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.setupInternal = function(menu, name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState)
{
	this.m_activeText = activeText;
	this.m_inactiveText = inactiveText;
	this.m_activeIcon = activeIcon;
	this.m_inactiveIcon = inactiveIcon;
	this.m_state = defaultState;
	this.m_item = menu.addNewItem().setName(name).registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this.stateChange(controlEvent);
	})).registerOnHover(oFF.UiLambdaHoverListener.create((hoverEvent) => {
		this.hover(hoverEvent);
	})).registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((hoverEndEvent) => {
		this.hoverEnd(hoverEndEvent);
	}));
	if (this.m_state)
	{
		this.setItemActive();
	}
	else
	{
		this.setItemInactive();
	}
};
oFF.UtToolbarWidgetMenuToggleButton.prototype.stateChange = function(event)
{
	if (this.m_state)
	{
		this.m_state = false;
		this.setItemInactive();
	}
	else
	{
		this.m_state = true;
		this.setItemActive();
	}
	if (oFF.notNull(this.m_consumer))
	{
		this.m_consumer(event);
	}
};

oFF.UtToolbarWidgetSectionGroup = function() {};
oFF.UtToolbarWidgetSectionGroup.prototype = new oFF.XObject();
oFF.UtToolbarWidgetSectionGroup.prototype._ff_c = "UtToolbarWidgetSectionGroup";

oFF.UtToolbarWidgetSectionGroup.create = function(genesis, parentSection)
{
	let group = new oFF.UtToolbarWidgetSectionGroup();
	group.setupInternal(genesis, parentSection);
	return group;
};
oFF.UtToolbarWidgetSectionGroup.prototype.m_genesis = null;
oFF.UtToolbarWidgetSectionGroup.prototype.m_items = null;
oFF.UtToolbarWidgetSectionGroup.prototype.m_parentSection = null;
oFF.UtToolbarWidgetSectionGroup.prototype.addButton = function(name, text, tooltip, icon)
{
	let button = oFF.UtToolbarWidgetButton.create(this.m_genesis, name, text, tooltip, icon);
	this.m_items.add(button);
	this.m_parentSection.rebuild();
	return button;
};
oFF.UtToolbarWidgetSectionGroup.prototype.addMenu = function(name, text, hasDefaultAction)
{
	let menu = oFF.UtToolbarWidgetMenu.create(this.m_genesis, name, text, hasDefaultAction);
	this.m_items.add(menu);
	this.m_parentSection.rebuild();
	return menu;
};
oFF.UtToolbarWidgetSectionGroup.prototype.addToggleButton = function(name, text, tooltip, icon)
{
	let button = oFF.UtToolbarWidgetToggleButton.create(this.m_genesis, name, text, tooltip, icon);
	this.m_items.add(button);
	this.m_parentSection.rebuild();
	return button;
};
oFF.UtToolbarWidgetSectionGroup.prototype.clearItems = function()
{
	if (oFF.XCollectionUtils.hasElements(this.m_items))
	{
		this.m_items.clear();
		this.m_parentSection.rebuild();
	}
};
oFF.UtToolbarWidgetSectionGroup.prototype.getItems = function()
{
	return this.m_items;
};
oFF.UtToolbarWidgetSectionGroup.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_genesis = null;
	this.m_parentSection = null;
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
};
oFF.UtToolbarWidgetSectionGroup.prototype.removeItem = function(item)
{
	if (this.m_items.contains(item))
	{
		let removedItem = this.m_items.removeElement(item);
		this.m_parentSection.rebuild();
		return removedItem;
	}
	return null;
};
oFF.UtToolbarWidgetSectionGroup.prototype.removeItemAtIndex = function(index)
{
	if (index >= 0 && index < this.m_items.size())
	{
		let removedItem = this.m_items.removeAt(index);
		this.m_parentSection.rebuild();
		return removedItem;
	}
	return null;
};
oFF.UtToolbarWidgetSectionGroup.prototype.setupInternal = function(genesis, parentSection)
{
	this.m_genesis = genesis;
	this.m_parentSection = parentSection;
	this.m_items = oFF.XList.create();
};

oFF.UiIntegrationInfoCenter = function() {};
oFF.UiIntegrationInfoCenter.prototype = new oFF.XObject();
oFF.UiIntegrationInfoCenter.prototype._ff_c = "UiIntegrationInfoCenter";

oFF.UiIntegrationInfoCenter.s_externalPlugin = null;
oFF.UiIntegrationInfoCenter.s_singletonInstance = null;
oFF.UiIntegrationInfoCenter.getCenter = function()
{
	if (oFF.isNull(oFF.UiIntegrationInfoCenter.s_singletonInstance))
	{
		let newCenter = new oFF.UiIntegrationInfoCenter();
		newCenter.setupCenter();
		oFF.UiIntegrationInfoCenter.s_singletonInstance = newCenter;
	}
	return oFF.UiIntegrationInfoCenter.s_singletonInstance;
};
oFF.UiIntegrationInfoCenter.setExternalIntegrationInfo = function(externalPlugin)
{
	oFF.UiIntegrationInfoCenter.s_externalPlugin = externalPlugin;
};
oFF.UiIntegrationInfoCenter.prototype.isEmbedded = function()
{
	if (oFF.notNull(oFF.UiIntegrationInfoCenter.s_externalPlugin))
	{
		return oFF.UiIntegrationInfoCenter.s_externalPlugin.isEmbedded();
	}
	return false;
};
oFF.UiIntegrationInfoCenter.prototype.setupCenter = function()
{
	this.setup();
};

oFF.UiConfigurationCenter = function() {};
oFF.UiConfigurationCenter.prototype = new oFF.XObject();
oFF.UiConfigurationCenter.prototype._ff_c = "UiConfigurationCenter";

oFF.UiConfigurationCenter.s_externalPlugin = null;
oFF.UiConfigurationCenter.s_singletonInstance = null;
oFF.UiConfigurationCenter.getCenter = function()
{
	if (oFF.isNull(oFF.UiConfigurationCenter.s_singletonInstance))
	{
		let newCenter = new oFF.UiConfigurationCenter();
		newCenter.setupCenter();
		oFF.UiConfigurationCenter.s_singletonInstance = newCenter;
	}
	return oFF.UiConfigurationCenter.s_singletonInstance;
};
oFF.UiConfigurationCenter.setExternalConfigurationChecker = function(externalPlugin)
{
	oFF.UiConfigurationCenter.s_externalPlugin = externalPlugin;
};
oFF.UiConfigurationCenter.prototype.isActive = function(name)
{
	if (oFF.notNull(oFF.UiConfigurationCenter.s_externalPlugin))
	{
		return oFF.UiConfigurationCenter.s_externalPlugin.isActive(name);
	}
	return true;
};
oFF.UiConfigurationCenter.prototype.setupCenter = function()
{
	this.setup();
};

oFF.UiNumberFormatterCenter = function() {};
oFF.UiNumberFormatterCenter.prototype = new oFF.XObject();
oFF.UiNumberFormatterCenter.prototype._ff_c = "UiNumberFormatterCenter";

oFF.UiNumberFormatterCenter.DATE_DISPLAY_FORMAT = "yyyy-MM-dd";
oFF.UiNumberFormatterCenter.DATE_VALUE_FORMAT = "yyyy-MM-dd";
oFF.UiNumberFormatterCenter.s_externalPlugin = null;
oFF.UiNumberFormatterCenter.s_singletonInstance = null;
oFF.UiNumberFormatterCenter.getCenter = function()
{
	if (oFF.isNull(oFF.UiNumberFormatterCenter.s_singletonInstance))
	{
		let newCenter = new oFF.UiNumberFormatterCenter();
		newCenter.setupCenter();
		oFF.UiNumberFormatterCenter.s_singletonInstance = newCenter;
	}
	return oFF.UiNumberFormatterCenter.s_singletonInstance;
};
oFF.UiNumberFormatterCenter.parseNumber = function(value)
{
	if (oFF.XStringUtils.isNullOrEmpty(value))
	{
		return value;
	}
	if (oFF.XString.containsString(value, "NaN") || oFF.XString.containsString(value, ",") || !oFF.XStringUtils.isNumber(value))
	{
		return null;
	}
	let parsedValue = value;
	let negative = oFF.XString.startsWith(parsedValue, "-");
	if (negative)
	{
		parsedValue = oFF.XString.substring(parsedValue, 1, -1);
	}
	parsedValue = oFF.XStringUtils.stripStart(parsedValue, "0");
	if (oFF.XString.isEqual(parsedValue, "") || oFF.XString.startsWith(parsedValue, "."))
	{
		parsedValue = oFF.XStringUtils.concatenate2("0", parsedValue);
	}
	if (negative && !oFF.XString.startsWith(parsedValue, "-"))
	{
		parsedValue = oFF.XStringUtils.concatenate2("-", parsedValue);
	}
	return parsedValue;
};
oFF.UiNumberFormatterCenter.setExternalNumberFormatter = function(externalPlugin)
{
	oFF.UiNumberFormatterCenter.s_externalPlugin = externalPlugin;
};
oFF.UiNumberFormatterCenter.prototype.format = function(value)
{
	return oFF.notNull(oFF.UiNumberFormatterCenter.s_externalPlugin) ? oFF.UiNumberFormatterCenter.s_externalPlugin.format(value) : value;
};
oFF.UiNumberFormatterCenter.prototype.formatTextForDateTimeKey = function(textValue, keyValue, keyValueType)
{
	return oFF.notNull(oFF.UiNumberFormatterCenter.s_externalPlugin) ? oFF.UiNumberFormatterCenter.s_externalPlugin.formatTextForDateTimeKey(textValue, keyValue, keyValueType) : oFF.notNull(textValue) ? textValue : keyValue;
};
oFF.UiNumberFormatterCenter.prototype.getDateDisplayFormat = function()
{
	let displayFormat = oFF.notNull(oFF.UiNumberFormatterCenter.s_externalPlugin) ? oFF.UiNumberFormatterCenter.s_externalPlugin.getDateDisplayFormat() : oFF.UiNumberFormatterCenter.DATE_DISPLAY_FORMAT;
	return oFF.notNull(displayFormat) ? displayFormat : oFF.UiNumberFormatterCenter.DATE_DISPLAY_FORMAT;
};
oFF.UiNumberFormatterCenter.prototype.parseFormattedDate = function(value)
{
	return oFF.notNull(oFF.UiNumberFormatterCenter.s_externalPlugin) ? oFF.UiNumberFormatterCenter.s_externalPlugin.parseFormattedDate(value) : oFF.XDate.createDateSafe(value);
};
oFF.UiNumberFormatterCenter.prototype.parseFormattedNumber = function(value)
{
	if (oFF.notNull(oFF.UiNumberFormatterCenter.s_externalPlugin))
	{
		return oFF.UiNumberFormatterCenter.s_externalPlugin.parseFormattedNumber(value);
	}
	return oFF.UiNumberFormatterCenter.parseNumber(value);
};
oFF.UiNumberFormatterCenter.prototype.setupCenter = function()
{
	this.setup();
};

oFF.UiFormItemOption = function() {};
oFF.UiFormItemOption.prototype = new oFF.XObject();
oFF.UiFormItemOption.prototype._ff_c = "UiFormItemOption";

oFF.UiFormItemOption.create = function(key, text, icon, tooltip)
{
	let newObject = new oFF.UiFormItemOption();
	newObject._setupInternal(key, text, icon, tooltip);
	return newObject;
};
oFF.UiFormItemOption.createWithText = function(key, text)
{
	let newObject = new oFF.UiFormItemOption();
	newObject._setupInternal(key, text, null, null);
	return newObject;
};
oFF.UiFormItemOption.prototype.m_icon = null;
oFF.UiFormItemOption.prototype.m_key = null;
oFF.UiFormItemOption.prototype.m_text = null;
oFF.UiFormItemOption.prototype.m_tooltip = null;
oFF.UiFormItemOption.prototype._setupInternal = function(key, text, icon, tooltip)
{
	if (oFF.XStringUtils.isNullOrEmpty(key))
	{
		throw oFF.XException.createRuntimeException("[UiFrom] Key must be specified for a form item option!");
	}
	this.m_key = key;
	this.m_text = text;
	this.m_icon = icon;
	this.m_tooltip = tooltip;
};
oFF.UiFormItemOption.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.UiFormItemOption.prototype.getKey = function()
{
	return this.m_key;
};
oFF.UiFormItemOption.prototype.getText = function()
{
	return this.m_text;
};
oFF.UiFormItemOption.prototype.getTooltip = function()
{
	return this.m_tooltip;
};
oFF.UiFormItemOption.prototype.releaseObject = function()
{
	this.m_key = null;
	this.m_text = null;
	this.m_icon = null;
	this.m_tooltip = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.DfUiPopup = function() {};
oFF.DfUiPopup.prototype = new oFF.XObject();
oFF.DfUiPopup.prototype._ff_c = "DfUiPopup";

oFF.DfUiPopup.prototype.m_closeProcedure = null;
oFF.DfUiPopup.prototype.m_customObject = null;
oFF.DfUiPopup.prototype.m_dialog = null;
oFF.DfUiPopup.prototype.m_genesis = null;
oFF.DfUiPopup.prototype._createDialog = function(genesis)
{
	if (oFF.notNull(genesis))
	{
		this.m_dialog = genesis.newControl(oFF.UiType.DIALOG);
		this.m_dialog.setPadding(oFF.UtStyles.DIALOG_PADDING);
		this.m_dialog.registerOnAfterOpen(oFF.UiLambdaAfterOpenListener.create(this.onPopupOpened.bind(this)));
		this.m_dialog.registerOnAfterClose(oFF.UiLambdaAfterCloseListener.create(this.onPopupClosed.bind(this)));
		this.m_dialog.registerOnEscape(oFF.UiLambdaEscapeListener.create(this._handleEscapeKeyPressed.bind(this)));
	}
};
oFF.DfUiPopup.prototype._fireCloseProcedure = function()
{
	if (oFF.notNull(this.m_closeProcedure))
	{
		this.m_closeProcedure();
	}
};
oFF.DfUiPopup.prototype._handleEscapeKeyPressed = function(event)
{
	this.close();
};
oFF.DfUiPopup.prototype.addButton = function(btnType, text, icon, pressConsumer)
{
	if (oFF.notNull(this.m_dialog))
	{
		let tmpDialogBtn = this.m_dialog.addNewDialogButton();
		tmpDialogBtn.setButtonType(oFF.notNull(btnType) ? btnType : oFF.UiButtonType.DEFAULT);
		tmpDialogBtn.setMinWidth(oFF.UtStyles.DIALOG_BUTTON_MIN_WIDTH);
		tmpDialogBtn.setText(text);
		tmpDialogBtn.setIcon(icon);
		if (oFF.notNull(pressConsumer))
		{
			tmpDialogBtn.registerOnPress(oFF.UiLambdaPressListener.create(pressConsumer));
		}
		if (this.m_dialog.getNumberOfDialogButtons() === 1)
		{
			this.setInitialFocus(tmpDialogBtn);
		}
		return tmpDialogBtn;
	}
	return oFF.UiContextDummy.getSingleton().getContent();
};
oFF.DfUiPopup.prototype.addCssClass = function(cssClass)
{
	this.m_dialog.addCssClass(cssClass);
};
oFF.DfUiPopup.prototype.close = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.close();
	}
	this._fireCloseProcedure();
};
oFF.DfUiPopup.prototype.getCustomObject = function()
{
	return this.m_customObject;
};
oFF.DfUiPopup.prototype.getDialog = function()
{
	return this.m_dialog;
};
oFF.DfUiPopup.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.DfUiPopup.prototype.getLocalization = function()
{
	return oFF.XLocalizationCenter.getCenter();
};
oFF.DfUiPopup.prototype.open = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.open();
	}
};
oFF.DfUiPopup.prototype.releaseObject = function()
{
	this.m_dialog = oFF.XObjectExt.release(this.m_dialog);
	this.m_genesis = oFF.XObjectExt.release(this.m_genesis);
	this.m_customObject = null;
	this.m_closeProcedure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfUiPopup.prototype.setBusy = function(busy)
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.setBusy(busy);
	}
};
oFF.DfUiPopup.prototype.setCloseProcedure = function(procedure)
{
	this.m_closeProcedure = procedure;
};
oFF.DfUiPopup.prototype.setCustomObject = function(customObject)
{
	this.m_customObject = customObject;
};
oFF.DfUiPopup.prototype.setInitialFocus = function(controlToFocus)
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.setInitialFocus(controlToFocus);
	}
};
oFF.DfUiPopup.prototype.setupPopup = function(genesis)
{
	if (oFF.isNull(genesis))
	{
		throw oFF.XException.createRuntimeException("Cannot create a popup. Please sepcify a genesis object!");
	}
	this._createDialog(genesis);
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.addCssClass("ffUiPopup");
		this.configurePopup(this.m_dialog);
		let innerGenesis = oFF.UiGenesis.create(this.m_dialog);
		this.m_genesis = innerGenesis;
		this.buildPopupContent(innerGenesis);
	}
};
oFF.DfUiPopup.prototype.shake = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		this.m_dialog.shake();
	}
};

oFF.UiLambdaFunctionExecutedListener = function() {};
oFF.UiLambdaFunctionExecutedListener.prototype = new oFF.XObject();
oFF.UiLambdaFunctionExecutedListener.prototype._ff_c = "UiLambdaFunctionExecutedListener";

oFF.UiLambdaFunctionExecutedListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaFunctionExecutedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaFunctionExecutedListener.prototype.m_consumer = null;
oFF.UiLambdaFunctionExecutedListener.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.m_consumer(extResult);
};
oFF.UiLambdaFunctionExecutedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaModuleLoadedListener = function() {};
oFF.UiLambdaModuleLoadedListener.prototype = new oFF.XObject();
oFF.UiLambdaModuleLoadedListener.prototype._ff_c = "UiLambdaModuleLoadedListener";

oFF.UiLambdaModuleLoadedListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaModuleLoadedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaModuleLoadedListener.prototype.m_consumer = null;
oFF.UiLambdaModuleLoadedListener.prototype.onModuleLoaded = function(messages, moduleName, hasBeenLoaded, customIdentifier)
{
	this.m_consumer(moduleName, oFF.XBooleanValue.create(hasBeenLoaded), messages);
};
oFF.UiLambdaModuleLoadedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaModuleLoadedMultiListener = function() {};
oFF.UiLambdaModuleLoadedMultiListener.prototype = new oFF.XObject();
oFF.UiLambdaModuleLoadedMultiListener.prototype._ff_c = "UiLambdaModuleLoadedMultiListener";

oFF.UiLambdaModuleLoadedMultiListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaModuleLoadedMultiListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaModuleLoadedMultiListener.prototype.m_consumer = null;
oFF.UiLambdaModuleLoadedMultiListener.prototype.onModuleLoadedMulti = function(extResult, rootModuleNames, customIdentifier)
{
	this.m_consumer(extResult, rootModuleNames);
};
oFF.UiLambdaModuleLoadedMultiListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiMessageCenter = function() {};
oFF.UiMessageCenter.prototype = new oFF.XObject();
oFF.UiMessageCenter.prototype._ff_c = "UiMessageCenter";

oFF.UiMessageCenter.s_externalPlugin = null;
oFF.UiMessageCenter.s_singletonInstance = null;
oFF.UiMessageCenter.createMessageCenter = function(uiManager)
{
	let obj = new oFF.UiMessageCenter();
	obj.setupCenter(uiManager);
	return obj;
};
oFF.UiMessageCenter.getCenter = function()
{
	if (oFF.isNull(oFF.UiMessageCenter.s_singletonInstance))
	{
		oFF.UiMessageCenter.s_singletonInstance = oFF.UiMessageCenter.createMessageCenter(null);
	}
	return oFF.UiMessageCenter.s_singletonInstance;
};
oFF.UiMessageCenter.getExternalMessagePoster = function()
{
	return oFF.UiMessageCenter.s_externalPlugin;
};
oFF.UiMessageCenter.setExternalMessagePoster = function(externalPlugin)
{
	oFF.UiMessageCenter.s_externalPlugin = externalPlugin;
};
oFF.UiMessageCenter.prototype.m_uiManager = null;
oFF.UiMessageCenter.prototype.postErrorExt = function(message, component)
{
	this.postMessage(oFF.UiMessageType.ERROR, message, component);
};
oFF.UiMessageCenter.prototype.postInfoExt = function(message, component)
{
	this.postMessage(oFF.UiMessageType.INFORMATION, message, component);
};
oFF.UiMessageCenter.prototype.postMessage = function(type, message, component)
{
	if (oFF.notNull(oFF.UiMessageCenter.s_externalPlugin))
	{
		if (type === oFF.UiMessageType.INFORMATION)
		{
			oFF.UiMessageCenter.s_externalPlugin.postInfoExt(message, component);
		}
		else if (type === oFF.UiMessageType.WARNING)
		{
			oFF.UiMessageCenter.s_externalPlugin.postWarningExt(message, component);
		}
		else if (type === oFF.UiMessageType.ERROR)
		{
			oFF.UiMessageCenter.s_externalPlugin.postErrorExt(message, component);
		}
		else if (type === oFF.UiMessageType.SUCCESS)
		{
			oFF.UiMessageCenter.s_externalPlugin.postSuccessExt(message, component);
		}
		return;
	}
	if (oFF.notNull(this.m_uiManager))
	{
		if (type === oFF.UiMessageType.INFORMATION)
		{
			this.m_uiManager.getFreeGenesis().showInfoToast(message);
		}
		else if (type === oFF.UiMessageType.WARNING)
		{
			this.m_uiManager.getFreeGenesis().showWarningToast(message);
		}
		else if (type === oFF.UiMessageType.ERROR)
		{
			this.m_uiManager.getFreeGenesis().showErrorToast(message);
		}
		else if (type === oFF.UiMessageType.SUCCESS)
		{
			this.m_uiManager.getFreeGenesis().showSuccessToast(message);
		}
	}
};
oFF.UiMessageCenter.prototype.postSuccessExt = function(message, component)
{
	this.postMessage(oFF.UiMessageType.SUCCESS, message, component);
};
oFF.UiMessageCenter.prototype.postWarningExt = function(message, component)
{
	this.postMessage(oFF.UiMessageType.WARNING, message, component);
};
oFF.UiMessageCenter.prototype.releaseObject = function()
{
	this.m_uiManager = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiMessageCenter.prototype.setupCenter = function(uiManager)
{
	this.setup();
	this.m_uiManager = uiManager;
};
oFF.UiMessageCenter.prototype.showErrorToast = function(message)
{
	this.postErrorExt(message, null);
};
oFF.UiMessageCenter.prototype.showInfoToast = function(message)
{
	this.postInfoExt(message, null);
};
oFF.UiMessageCenter.prototype.showSuccessToast = function(message)
{
	this.postSuccessExt(message, null);
};
oFF.UiMessageCenter.prototype.showWarningToast = function(message)
{
	this.postWarningExt(message, null);
};

oFF.UiPerformanceCenter = function() {};
oFF.UiPerformanceCenter.prototype = new oFF.XObject();
oFF.UiPerformanceCenter.prototype._ff_c = "UiPerformanceCenter";

oFF.UiPerformanceCenter.s_externalPlugin = null;
oFF.UiPerformanceCenter.s_singeltonInstance = null;
oFF.UiPerformanceCenter.getCenter = function()
{
	if (oFF.isNull(oFF.UiPerformanceCenter.s_singeltonInstance))
	{
		let newCenter = new oFF.UiPerformanceCenter();
		newCenter.setupCenter();
		oFF.UiPerformanceCenter.s_singeltonInstance = newCenter;
	}
	return oFF.UiPerformanceCenter.s_singeltonInstance;
};
oFF.UiPerformanceCenter.setExternalPerformanceTool = function(externalPlugin)
{
	oFF.UiPerformanceCenter.s_externalPlugin = externalPlugin;
};
oFF.UiPerformanceCenter.prototype.m_isLogMeasurements = false;
oFF.UiPerformanceCenter.prototype.endMeasure = function(name)
{
	if (oFF.notNull(oFF.UiPerformanceCenter.s_externalPlugin))
	{
		oFF.UiPerformanceCenter.s_externalPlugin.endMeasure(name);
	}
	else
	{
		let result = oFF.XPerformance.performance().endSimpledMeasure(name);
		if (this.m_isLogMeasurements)
		{
			let message = oFF.XStringUtils.concatenate5("[PerformanceCenter] Finished measurement for: ", name, ". Result -> ", oFF.XDouble.convertToString(result), "ms");
			oFF.XLogger.println(message);
		}
	}
};
oFF.UiPerformanceCenter.prototype.setLogMeasurements = function(logMeasurements)
{
	this.m_isLogMeasurements = logMeasurements;
};
oFF.UiPerformanceCenter.prototype.setupCenter = function()
{
	this.m_isLogMeasurements = false;
	this.setup();
};
oFF.UiPerformanceCenter.prototype.startMeasure = function(name)
{
	if (oFF.notNull(oFF.UiPerformanceCenter.s_externalPlugin))
	{
		oFF.UiPerformanceCenter.s_externalPlugin.startMeasure(name);
	}
	else
	{
		oFF.XPerformance.performance().startSimpleMeasure(name);
		if (this.m_isLogMeasurements)
		{
			let message = oFF.XStringUtils.concatenate2("[PerformanceCenter] Starting measurement for: ", name);
			oFF.XLogger.println(message);
		}
	}
};

oFF.DfUiFormControl = function() {};
oFF.DfUiFormControl.prototype = new oFF.XObject();
oFF.DfUiFormControl.prototype._ff_c = "DfUiFormControl";

oFF.DfUiFormControl.prototype.m_control = null;
oFF.DfUiFormControl.prototype.m_customObject = null;
oFF.DfUiFormControl.prototype.m_genesis = null;
oFF.DfUiFormControl.prototype.m_name = null;
oFF.DfUiFormControl.prototype.m_parentForm = null;
oFF.DfUiFormControl.prototype.addCssClass = function(cssClass)
{
	this.getFormControl().addCssClass(cssClass);
	return this;
};
oFF.DfUiFormControl.prototype.focus = function()
{
	if (this.getFormControl() !== null)
	{
		this.getFormControl().focus();
	}
};
oFF.DfUiFormControl.prototype.getCustomObject = function()
{
	return this.m_customObject;
};
oFF.DfUiFormControl.prototype.getFormControl = function()
{
	return this.m_control;
};
oFF.DfUiFormControl.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.DfUiFormControl.prototype.getName = function()
{
	return this.m_name;
};
oFF.DfUiFormControl.prototype.getParentForm = function()
{
	return this.m_parentForm;
};
oFF.DfUiFormControl.prototype.getView = function()
{
	return this.m_control;
};
oFF.DfUiFormControl.prototype.hasModelValue = function()
{
	return this.isModelItem();
};
oFF.DfUiFormControl.prototype.isEnabled = function()
{
	return this.getFormControl().isEnabled();
};
oFF.DfUiFormControl.prototype.isModelItem = function()
{
	return false;
};
oFF.DfUiFormControl.prototype.isVisible = function()
{
	return this.getFormControl().isVisible();
};
oFF.DfUiFormControl.prototype.releaseObject = function()
{
	this.m_genesis = null;
	this.m_customObject = null;
	this.m_control = oFF.XObjectExt.release(this.m_control);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfUiFormControl.prototype.removeCssClass = function(cssClass)
{
	this.getFormControl().removeCssClass(cssClass);
	return this;
};
oFF.DfUiFormControl.prototype.setCustomObject = function(customObject)
{
	this.m_customObject = customObject;
};
oFF.DfUiFormControl.prototype.setFlex = function(flex)
{
	this.getFormControl().setFlex(flex);
	return this;
};
oFF.DfUiFormControl.prototype.setVisible = function(visible)
{
	this.getFormControl().setVisible(visible);
	return this;
};
oFF.DfUiFormControl.prototype.setupFormControl = function(parentForm, name)
{
	if (oFF.isNull(parentForm))
	{
		throw oFF.XException.createRuntimeException("Cannot create a form control. Please sepcify a parent form!");
	}
	this.m_parentForm = parentForm;
	this.m_genesis = this.m_parentForm.getGenesis();
	this.m_name = name;
	this.m_control = this.createFormControl(this.m_genesis);
};

oFF.UiLambdaAfterCloseListener = function() {};
oFF.UiLambdaAfterCloseListener.prototype = new oFF.XObject();
oFF.UiLambdaAfterCloseListener.prototype._ff_c = "UiLambdaAfterCloseListener";

oFF.UiLambdaAfterCloseListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaAfterCloseListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaAfterCloseListener.prototype.m_consumer = null;
oFF.UiLambdaAfterCloseListener.prototype.onAfterClose = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaAfterCloseListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaAfterOpenListener = function() {};
oFF.UiLambdaAfterOpenListener.prototype = new oFF.XObject();
oFF.UiLambdaAfterOpenListener.prototype._ff_c = "UiLambdaAfterOpenListener";

oFF.UiLambdaAfterOpenListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaAfterOpenListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaAfterOpenListener.prototype.m_consumer = null;
oFF.UiLambdaAfterOpenListener.prototype.onAfterOpen = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaAfterOpenListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaAfterRenderListener = function() {};
oFF.UiLambdaAfterRenderListener.prototype = new oFF.XObject();
oFF.UiLambdaAfterRenderListener.prototype._ff_c = "UiLambdaAfterRenderListener";

oFF.UiLambdaAfterRenderListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaAfterRenderListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaAfterRenderListener.prototype.m_consumer = null;
oFF.UiLambdaAfterRenderListener.prototype.onAfterRender = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaAfterRenderListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaBackListener = function() {};
oFF.UiLambdaBackListener.prototype = new oFF.XObject();
oFF.UiLambdaBackListener.prototype._ff_c = "UiLambdaBackListener";

oFF.UiLambdaBackListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaBackListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaBackListener.prototype.m_consumer = null;
oFF.UiLambdaBackListener.prototype.onBack = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaBackListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaBeforeCloseListener = function() {};
oFF.UiLambdaBeforeCloseListener.prototype = new oFF.XObject();
oFF.UiLambdaBeforeCloseListener.prototype._ff_c = "UiLambdaBeforeCloseListener";

oFF.UiLambdaBeforeCloseListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaBeforeCloseListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaBeforeCloseListener.prototype.m_consumer = null;
oFF.UiLambdaBeforeCloseListener.prototype.onBeforeClose = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaBeforeCloseListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaBeforeOpenListener = function() {};
oFF.UiLambdaBeforeOpenListener.prototype = new oFF.XObject();
oFF.UiLambdaBeforeOpenListener.prototype._ff_c = "UiLambdaBeforeOpenListener";

oFF.UiLambdaBeforeOpenListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaBeforeOpenListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaBeforeOpenListener.prototype.m_consumer = null;
oFF.UiLambdaBeforeOpenListener.prototype.onBeforeOpen = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaBeforeOpenListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaBeforePageChangedListener = function() {};
oFF.UiLambdaBeforePageChangedListener.prototype = new oFF.XObject();
oFF.UiLambdaBeforePageChangedListener.prototype._ff_c = "UiLambdaBeforePageChangedListener";

oFF.UiLambdaBeforePageChangedListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaBeforePageChangedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaBeforePageChangedListener.prototype.m_consumer = null;
oFF.UiLambdaBeforePageChangedListener.prototype.onBeforePageChanged = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaBeforePageChangedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaChangeListener = function() {};
oFF.UiLambdaChangeListener.prototype = new oFF.XObject();
oFF.UiLambdaChangeListener.prototype._ff_c = "UiLambdaChangeListener";

oFF.UiLambdaChangeListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaChangeListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaChangeListener.prototype.m_consumer = null;
oFF.UiLambdaChangeListener.prototype.onChange = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaChangeListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaChipUpdateListener = function() {};
oFF.UiLambdaChipUpdateListener.prototype = new oFF.XObject();
oFF.UiLambdaChipUpdateListener.prototype._ff_c = "UiLambdaChipUpdateListener";

oFF.UiLambdaChipUpdateListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaChipUpdateListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaChipUpdateListener.prototype.m_consumer = null;
oFF.UiLambdaChipUpdateListener.prototype.onChipUpdate = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaChipUpdateListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaClickListener = function() {};
oFF.UiLambdaClickListener.prototype = new oFF.XObject();
oFF.UiLambdaClickListener.prototype._ff_c = "UiLambdaClickListener";

oFF.UiLambdaClickListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaClickListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaClickListener.prototype.m_consumer = null;
oFF.UiLambdaClickListener.prototype.onClick = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaClickListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaCloseListener = function() {};
oFF.UiLambdaCloseListener.prototype = new oFF.XObject();
oFF.UiLambdaCloseListener.prototype._ff_c = "UiLambdaCloseListener";

oFF.UiLambdaCloseListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaCloseListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaCloseListener.prototype.m_consumer = null;
oFF.UiLambdaCloseListener.prototype.onClose = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaCloseListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaCollapseListener = function() {};
oFF.UiLambdaCollapseListener.prototype = new oFF.XObject();
oFF.UiLambdaCollapseListener.prototype._ff_c = "UiLambdaCollapseListener";

oFF.UiLambdaCollapseListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaCollapseListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaCollapseListener.prototype.m_consumer = null;
oFF.UiLambdaCollapseListener.prototype.onCollapse = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaCollapseListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaColorSelectListener = function() {};
oFF.UiLambdaColorSelectListener.prototype = new oFF.XObject();
oFF.UiLambdaColorSelectListener.prototype._ff_c = "UiLambdaColorSelectListener";

oFF.UiLambdaColorSelectListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaColorSelectListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaColorSelectListener.prototype.m_consumer = null;
oFF.UiLambdaColorSelectListener.prototype.onColorSelect = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaColorSelectListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaContextMenuListener = function() {};
oFF.UiLambdaContextMenuListener.prototype = new oFF.XObject();
oFF.UiLambdaContextMenuListener.prototype._ff_c = "UiLambdaContextMenuListener";

oFF.UiLambdaContextMenuListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaContextMenuListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaContextMenuListener.prototype.m_consumer = null;
oFF.UiLambdaContextMenuListener.prototype.onContextMenu = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaContextMenuListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaCursorChangeListener = function() {};
oFF.UiLambdaCursorChangeListener.prototype = new oFF.XObject();
oFF.UiLambdaCursorChangeListener.prototype._ff_c = "UiLambdaCursorChangeListener";

oFF.UiLambdaCursorChangeListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaCursorChangeListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaCursorChangeListener.prototype.m_consumer = null;
oFF.UiLambdaCursorChangeListener.prototype.onCursorChange = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaCursorChangeListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDeleteListener = function() {};
oFF.UiLambdaDeleteListener.prototype = new oFF.XObject();
oFF.UiLambdaDeleteListener.prototype._ff_c = "UiLambdaDeleteListener";

oFF.UiLambdaDeleteListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDeleteListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDeleteListener.prototype.m_consumer = null;
oFF.UiLambdaDeleteListener.prototype.onDelete = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDeleteListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDoubleClickListener = function() {};
oFF.UiLambdaDoubleClickListener.prototype = new oFF.XObject();
oFF.UiLambdaDoubleClickListener.prototype._ff_c = "UiLambdaDoubleClickListener";

oFF.UiLambdaDoubleClickListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDoubleClickListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDoubleClickListener.prototype.m_consumer = null;
oFF.UiLambdaDoubleClickListener.prototype.onDoubleClick = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDoubleClickListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDragEndListener = function() {};
oFF.UiLambdaDragEndListener.prototype = new oFF.XObject();
oFF.UiLambdaDragEndListener.prototype._ff_c = "UiLambdaDragEndListener";

oFF.UiLambdaDragEndListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDragEndListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDragEndListener.prototype.m_consumer = null;
oFF.UiLambdaDragEndListener.prototype.onDragEnd = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDragEndListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDragEnterListener = function() {};
oFF.UiLambdaDragEnterListener.prototype = new oFF.XObject();
oFF.UiLambdaDragEnterListener.prototype._ff_c = "UiLambdaDragEnterListener";

oFF.UiLambdaDragEnterListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDragEnterListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDragEnterListener.prototype.m_consumer = null;
oFF.UiLambdaDragEnterListener.prototype.onDragEnter = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDragEnterListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDragOverListener = function() {};
oFF.UiLambdaDragOverListener.prototype = new oFF.XObject();
oFF.UiLambdaDragOverListener.prototype._ff_c = "UiLambdaDragOverListener";

oFF.UiLambdaDragOverListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDragOverListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDragOverListener.prototype.m_consumer = null;
oFF.UiLambdaDragOverListener.prototype.onDragOver = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDragOverListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDragStartListener = function() {};
oFF.UiLambdaDragStartListener.prototype = new oFF.XObject();
oFF.UiLambdaDragStartListener.prototype._ff_c = "UiLambdaDragStartListener";

oFF.UiLambdaDragStartListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDragStartListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDragStartListener.prototype.m_consumer = null;
oFF.UiLambdaDragStartListener.prototype.onDragStart = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDragStartListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaDropListener = function() {};
oFF.UiLambdaDropListener.prototype = new oFF.XObject();
oFF.UiLambdaDropListener.prototype._ff_c = "UiLambdaDropListener";

oFF.UiLambdaDropListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaDropListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaDropListener.prototype.m_consumer = null;
oFF.UiLambdaDropListener.prototype.onDrop = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaDropListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaEditingEndListener = function() {};
oFF.UiLambdaEditingEndListener.prototype = new oFF.XObject();
oFF.UiLambdaEditingEndListener.prototype._ff_c = "UiLambdaEditingEndListener";

oFF.UiLambdaEditingEndListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaEditingEndListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaEditingEndListener.prototype.m_consumer = null;
oFF.UiLambdaEditingEndListener.prototype.onEditingEnd = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaEditingEndListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaEnterListener = function() {};
oFF.UiLambdaEnterListener.prototype = new oFF.XObject();
oFF.UiLambdaEnterListener.prototype._ff_c = "UiLambdaEnterListener";

oFF.UiLambdaEnterListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaEnterListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaEnterListener.prototype.m_consumer = null;
oFF.UiLambdaEnterListener.prototype.onEnter = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaEnterListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaErrorListener = function() {};
oFF.UiLambdaErrorListener.prototype = new oFF.XObject();
oFF.UiLambdaErrorListener.prototype._ff_c = "UiLambdaErrorListener";

oFF.UiLambdaErrorListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaErrorListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaErrorListener.prototype.m_consumer = null;
oFF.UiLambdaErrorListener.prototype.onError = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaErrorListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaEscapeListener = function() {};
oFF.UiLambdaEscapeListener.prototype = new oFF.XObject();
oFF.UiLambdaEscapeListener.prototype._ff_c = "UiLambdaEscapeListener";

oFF.UiLambdaEscapeListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaEscapeListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaEscapeListener.prototype.m_consumer = null;
oFF.UiLambdaEscapeListener.prototype.onEscape = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaEscapeListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaExpandListener = function() {};
oFF.UiLambdaExpandListener.prototype = new oFF.XObject();
oFF.UiLambdaExpandListener.prototype._ff_c = "UiLambdaExpandListener";

oFF.UiLambdaExpandListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaExpandListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaExpandListener.prototype.m_consumer = null;
oFF.UiLambdaExpandListener.prototype.onExpand = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaExpandListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaFileDropListener = function() {};
oFF.UiLambdaFileDropListener.prototype = new oFF.XObject();
oFF.UiLambdaFileDropListener.prototype._ff_c = "UiLambdaFileDropListener";

oFF.UiLambdaFileDropListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaFileDropListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaFileDropListener.prototype.m_consumer = null;
oFF.UiLambdaFileDropListener.prototype.onFileDrop = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaFileDropListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaHoverEndListener = function() {};
oFF.UiLambdaHoverEndListener.prototype = new oFF.XObject();
oFF.UiLambdaHoverEndListener.prototype._ff_c = "UiLambdaHoverEndListener";

oFF.UiLambdaHoverEndListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaHoverEndListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaHoverEndListener.prototype.m_consumer = null;
oFF.UiLambdaHoverEndListener.prototype.onHoverEnd = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaHoverEndListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaHoverListener = function() {};
oFF.UiLambdaHoverListener.prototype = new oFF.XObject();
oFF.UiLambdaHoverListener.prototype._ff_c = "UiLambdaHoverListener";

oFF.UiLambdaHoverListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaHoverListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaHoverListener.prototype.m_consumer = null;
oFF.UiLambdaHoverListener.prototype.onHover = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaHoverListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaItemCloseListener = function() {};
oFF.UiLambdaItemCloseListener.prototype = new oFF.XObject();
oFF.UiLambdaItemCloseListener.prototype._ff_c = "UiLambdaItemCloseListener";

oFF.UiLambdaItemCloseListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaItemCloseListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaItemCloseListener.prototype.m_consumer = null;
oFF.UiLambdaItemCloseListener.prototype.onItemClose = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaItemCloseListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaItemSelectListener = function() {};
oFF.UiLambdaItemSelectListener.prototype = new oFF.XObject();
oFF.UiLambdaItemSelectListener.prototype._ff_c = "UiLambdaItemSelectListener";

oFF.UiLambdaItemSelectListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaItemSelectListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaItemSelectListener.prototype.m_consumer = null;
oFF.UiLambdaItemSelectListener.prototype.onItemSelect = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaItemSelectListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaKeyDownListener = function() {};
oFF.UiLambdaKeyDownListener.prototype = new oFF.XObject();
oFF.UiLambdaKeyDownListener.prototype._ff_c = "UiLambdaKeyDownListener";

oFF.UiLambdaKeyDownListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaKeyDownListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaKeyDownListener.prototype.m_consumer = null;
oFF.UiLambdaKeyDownListener.prototype.onKeyDown = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaKeyDownListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaKeyUpListener = function() {};
oFF.UiLambdaKeyUpListener.prototype = new oFF.XObject();
oFF.UiLambdaKeyUpListener.prototype._ff_c = "UiLambdaKeyUpListener";

oFF.UiLambdaKeyUpListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaKeyUpListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaKeyUpListener.prototype.m_consumer = null;
oFF.UiLambdaKeyUpListener.prototype.onKeyUp = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaKeyUpListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaLiveChangeListener = function() {};
oFF.UiLambdaLiveChangeListener.prototype = new oFF.XObject();
oFF.UiLambdaLiveChangeListener.prototype._ff_c = "UiLambdaLiveChangeListener";

oFF.UiLambdaLiveChangeListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaLiveChangeListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaLiveChangeListener.prototype.m_consumer = null;
oFF.UiLambdaLiveChangeListener.prototype.onLiveChange = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaLiveChangeListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaLiveChangeWithDebounceListener = function() {};
oFF.UiLambdaLiveChangeWithDebounceListener.prototype = new oFF.XObject();
oFF.UiLambdaLiveChangeWithDebounceListener.prototype._ff_c = "UiLambdaLiveChangeWithDebounceListener";

oFF.UiLambdaLiveChangeWithDebounceListener.create = function(consumer, debounce)
{
	let obj = new oFF.UiLambdaLiveChangeWithDebounceListener();
	obj.m_consumer = consumer;
	obj.m_debounce = debounce;
	return obj;
};
oFF.UiLambdaLiveChangeWithDebounceListener.prototype.m_consumer = null;
oFF.UiLambdaLiveChangeWithDebounceListener.prototype.m_debounce = 0;
oFF.UiLambdaLiveChangeWithDebounceListener.prototype.m_runningTimeoutId = null;
oFF.UiLambdaLiveChangeWithDebounceListener.prototype.cancel = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_runningTimeoutId))
	{
		oFF.XTimeout.clear(this.m_runningTimeoutId);
	}
};
oFF.UiLambdaLiveChangeWithDebounceListener.prototype.onLiveChange = function(event)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_runningTimeoutId))
	{
		oFF.XTimeout.clear(this.m_runningTimeoutId);
	}
	this.m_runningTimeoutId = oFF.XTimeout.timeout(this.m_debounce, () => {
		if (!event.getControl().isReleased())
		{
			this.m_consumer(event);
		}
		oFF.XTimeout.clear(this.m_runningTimeoutId);
	});
};
oFF.UiLambdaLiveChangeWithDebounceListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	this.m_runningTimeoutId = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaLoadFinishedListener = function() {};
oFF.UiLambdaLoadFinishedListener.prototype = new oFF.XObject();
oFF.UiLambdaLoadFinishedListener.prototype._ff_c = "UiLambdaLoadFinishedListener";

oFF.UiLambdaLoadFinishedListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaLoadFinishedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaLoadFinishedListener.prototype.m_consumer = null;
oFF.UiLambdaLoadFinishedListener.prototype.onLoadFinished = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaLoadFinishedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaMenuPressListener = function() {};
oFF.UiLambdaMenuPressListener.prototype = new oFF.XObject();
oFF.UiLambdaMenuPressListener.prototype._ff_c = "UiLambdaMenuPressListener";

oFF.UiLambdaMenuPressListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaMenuPressListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaMenuPressListener.prototype.m_consumer = null;
oFF.UiLambdaMenuPressListener.prototype.onMenuPress = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaMenuPressListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaPageChangedListener = function() {};
oFF.UiLambdaPageChangedListener.prototype = new oFF.XObject();
oFF.UiLambdaPageChangedListener.prototype._ff_c = "UiLambdaPageChangedListener";

oFF.UiLambdaPageChangedListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaPageChangedListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaPageChangedListener.prototype.m_consumer = null;
oFF.UiLambdaPageChangedListener.prototype.onPageChanged = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaPageChangedListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaPressListener = function() {};
oFF.UiLambdaPressListener.prototype = new oFF.XObject();
oFF.UiLambdaPressListener.prototype._ff_c = "UiLambdaPressListener";

oFF.UiLambdaPressListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaPressListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaPressListener.prototype.m_consumer = null;
oFF.UiLambdaPressListener.prototype.onPress = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaPressListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaResizeListener = function() {};
oFF.UiLambdaResizeListener.prototype = new oFF.XObject();
oFF.UiLambdaResizeListener.prototype._ff_c = "UiLambdaResizeListener";

oFF.UiLambdaResizeListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaResizeListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaResizeListener.prototype.m_consumer = null;
oFF.UiLambdaResizeListener.prototype.onResize = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaResizeListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaSearchListener = function() {};
oFF.UiLambdaSearchListener.prototype = new oFF.XObject();
oFF.UiLambdaSearchListener.prototype._ff_c = "UiLambdaSearchListener";

oFF.UiLambdaSearchListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaSearchListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaSearchListener.prototype.m_consumer = null;
oFF.UiLambdaSearchListener.prototype.onSearch = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaSearchListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaSelectListener = function() {};
oFF.UiLambdaSelectListener.prototype = new oFF.XObject();
oFF.UiLambdaSelectListener.prototype._ff_c = "UiLambdaSelectListener";

oFF.UiLambdaSelectListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaSelectListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaSelectListener.prototype.m_consumer = null;
oFF.UiLambdaSelectListener.prototype.onSelect = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaSelectListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaSelectionChangeListener = function() {};
oFF.UiLambdaSelectionChangeListener.prototype = new oFF.XObject();
oFF.UiLambdaSelectionChangeListener.prototype._ff_c = "UiLambdaSelectionChangeListener";

oFF.UiLambdaSelectionChangeListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaSelectionChangeListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaSelectionChangeListener.prototype.m_consumer = null;
oFF.UiLambdaSelectionChangeListener.prototype.onSelectionChange = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaSelectionChangeListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaSuggestionSelectListener = function() {};
oFF.UiLambdaSuggestionSelectListener.prototype = new oFF.XObject();
oFF.UiLambdaSuggestionSelectListener.prototype._ff_c = "UiLambdaSuggestionSelectListener";

oFF.UiLambdaSuggestionSelectListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaSuggestionSelectListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaSuggestionSelectListener.prototype.m_consumer = null;
oFF.UiLambdaSuggestionSelectListener.prototype.onSuggestionSelect = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaSuggestionSelectListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaToggleListener = function() {};
oFF.UiLambdaToggleListener.prototype = new oFF.XObject();
oFF.UiLambdaToggleListener.prototype._ff_c = "UiLambdaToggleListener";

oFF.UiLambdaToggleListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaToggleListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaToggleListener.prototype.m_consumer = null;
oFF.UiLambdaToggleListener.prototype.onToggle = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaToggleListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UiLambdaValueHelpRequestListener = function() {};
oFF.UiLambdaValueHelpRequestListener.prototype = new oFF.XObject();
oFF.UiLambdaValueHelpRequestListener.prototype._ff_c = "UiLambdaValueHelpRequestListener";

oFF.UiLambdaValueHelpRequestListener.create = function(consumer)
{
	let obj = new oFF.UiLambdaValueHelpRequestListener();
	obj.m_consumer = consumer;
	return obj;
};
oFF.UiLambdaValueHelpRequestListener.prototype.m_consumer = null;
oFF.UiLambdaValueHelpRequestListener.prototype.onValueHelpRequest = function(event)
{
	this.m_consumer(event);
};
oFF.UiLambdaValueHelpRequestListener.prototype.releaseObject = function()
{
	this.m_consumer = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.UtConfirmPopup = function() {};
oFF.UtConfirmPopup.prototype = new oFF.DfUiPopup();
oFF.UtConfirmPopup.prototype._ff_c = "UtConfirmPopup";

oFF.UtConfirmPopup.POPUP_CANCEL_BTN_NAME = "SuConfirmationPopupCancelBtn";
oFF.UtConfirmPopup.POPUP_CONFIRM_BTN_NAME = "SuConfirmationPopupConfirmBtn";
oFF.UtConfirmPopup.create = function(genesis, title, text)
{
	let newPopup = new oFF.UtConfirmPopup();
	newPopup.setupInternal(genesis, title, text);
	return newPopup;
};
oFF.UtConfirmPopup.prototype.m_cancelBtn = null;
oFF.UtConfirmPopup.prototype.m_cancelProcedure = null;
oFF.UtConfirmPopup.prototype.m_confirmBtn = null;
oFF.UtConfirmPopup.prototype.m_confirmProcedure = null;
oFF.UtConfirmPopup.prototype.m_text = null;
oFF.UtConfirmPopup.prototype.m_title = null;
oFF.UtConfirmPopup.prototype._cancelInternal = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure();
	}
	this.close();
};
oFF.UtConfirmPopup.prototype._confirmInternal = function()
{
	if (oFF.notNull(this.m_confirmProcedure))
	{
		this.m_confirmProcedure();
	}
	this.close();
};
oFF.UtConfirmPopup.prototype.buildPopupContent = function(genesis)
{
	let dlgLabel = genesis.newControl(oFF.UiType.LABEL);
	dlgLabel.setWrapping(true);
	dlgLabel.setText(this.m_text);
	genesis.setRoot(dlgLabel);
};
oFF.UtConfirmPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.m_title);
	dialog.setWidth(oFF.UiCssLength.create("auto"));
	dialog.setMaxWidth(oFF.UiCssLength.create("600px"));
	dialog.setState(oFF.UiValueState.WARNING);
	this.m_confirmBtn = this.addButton(oFF.UiButtonType.PRIMARY, "Confirm", "accept", (controlEvent) => {
		this._confirmInternal();
	});
	this.m_confirmBtn.setName(oFF.UtConfirmPopup.POPUP_CONFIRM_BTN_NAME);
	this.m_cancelBtn = this.addButton(oFF.UiButtonType.DEFAULT, "Cancel", "sys-cancel-2", (controlEvent2) => {
		this._cancelInternal();
	});
	this.m_cancelBtn.setName(oFF.UtConfirmPopup.POPUP_CANCEL_BTN_NAME);
};
oFF.UtConfirmPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtConfirmPopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.UtConfirmPopup.prototype.releaseObject = function()
{
	this.m_confirmBtn = oFF.XObjectExt.release(this.m_confirmBtn);
	this.m_cancelBtn = oFF.XObjectExt.release(this.m_cancelBtn);
	this.m_confirmProcedure = null;
	this.m_cancelProcedure = null;
	this.m_title = null;
	this.m_text = null;
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtConfirmPopup.prototype.setCancelButtonIcon = function(icon)
{
	if (oFF.notNull(this.m_cancelBtn))
	{
		this.m_cancelBtn.setIcon(icon);
	}
};
oFF.UtConfirmPopup.prototype.setCancelButtonText = function(text)
{
	if (oFF.notNull(this.m_cancelBtn))
	{
		this.m_cancelBtn.setText(text);
	}
};
oFF.UtConfirmPopup.prototype.setCancelProcedure = function(procedure)
{
	this.m_cancelProcedure = procedure;
};
oFF.UtConfirmPopup.prototype.setConfirmButtonIcon = function(icon)
{
	if (oFF.notNull(this.m_confirmBtn))
	{
		this.m_confirmBtn.setIcon(icon);
	}
};
oFF.UtConfirmPopup.prototype.setConfirmButtonText = function(text)
{
	if (oFF.notNull(this.m_confirmBtn))
	{
		this.m_confirmBtn.setText(text);
	}
};
oFF.UtConfirmPopup.prototype.setConfirmButtonType = function(btnType)
{
	if (oFF.notNull(this.m_confirmBtn))
	{
		this.m_confirmBtn.setButtonType(btnType);
	}
};
oFF.UtConfirmPopup.prototype.setConfirmProcedure = function(procedure)
{
	this.m_confirmProcedure = procedure;
};
oFF.UtConfirmPopup.prototype.setupInternal = function(genesis, title, text)
{
	this.m_title = title;
	this.m_text = text;
	this.setupPopup(genesis);
};

oFF.UtErrorPopup = function() {};
oFF.UtErrorPopup.prototype = new oFF.DfUiPopup();
oFF.UtErrorPopup.prototype._ff_c = "UtErrorPopup";

oFF.UtErrorPopup.create = function(genesis, text)
{
	let newPopup = new oFF.UtErrorPopup();
	newPopup.setupInternal(genesis, text);
	return newPopup;
};
oFF.UtErrorPopup.prototype.m_closeBtn = null;
oFF.UtErrorPopup.prototype.m_text = null;
oFF.UtErrorPopup.prototype.buildPopupContent = function(genesis)
{
	let dlgLabel = genesis.newControl(oFF.UiType.LABEL);
	dlgLabel.setWrapping(true);
	dlgLabel.setText(this.m_text);
	genesis.setRoot(dlgLabel);
};
oFF.UtErrorPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.getLocalization().getText(oFF.XCommonI18n.ERROR));
	dialog.setWidth(oFF.UiCssLength.create("auto"));
	dialog.setState(oFF.UiValueState.ERROR);
	this.m_closeBtn = this.addButton(oFF.UiButtonType.PRIMARY, this.getLocalization().getText(oFF.XCommonI18n.CLOSE), "", (controlEvent) => {
		this.close();
	});
};
oFF.UtErrorPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtErrorPopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.UtErrorPopup.prototype.releaseObject = function()
{
	this.m_closeBtn = oFF.XObjectExt.release(this.m_closeBtn);
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtErrorPopup.prototype.setCloseButtonIcon = function(icon)
{
	if (oFF.notNull(this.m_closeBtn))
	{
		this.m_closeBtn.setIcon(icon);
	}
};
oFF.UtErrorPopup.prototype.setCloseButtonText = function(text)
{
	if (oFF.notNull(this.m_closeBtn))
	{
		this.m_closeBtn.setText(text);
	}
};
oFF.UtErrorPopup.prototype.setCloseButtonType = function(btnType)
{
	if (oFF.notNull(this.m_closeBtn))
	{
		this.m_closeBtn.setButtonType(btnType);
	}
};
oFF.UtErrorPopup.prototype.setupInternal = function(genesis, text)
{
	this.m_text = text;
	this.setupPopup(genesis);
};

oFF.UtGridContainerSettingsPopup = function() {};
oFF.UtGridContainerSettingsPopup.prototype = new oFF.DfUiPopup();
oFF.UtGridContainerSettingsPopup.prototype._ff_c = "UtGridContainerSettingsPopup";

oFF.UtGridContainerSettingsPopup.FORM_COLUMNS_KEY = "columns";
oFF.UtGridContainerSettingsPopup.FORM_COLUMN_SIZE_KEY = "columnSize";
oFF.UtGridContainerSettingsPopup.FORM_GAP_KEY = "gap";
oFF.UtGridContainerSettingsPopup.FORM_MAX_COLUMN_SIZE_KEY = "maxColumnSize";
oFF.UtGridContainerSettingsPopup.FORM_MIN_COLUMN_SIZE_KEY = "minColumnSize";
oFF.UtGridContainerSettingsPopup.FORM_ROW_SIZE_KEY = "rowSize";
oFF.UtGridContainerSettingsPopup.create = function(genesis, gridContainerSettings)
{
	let newPopup = new oFF.UtGridContainerSettingsPopup();
	newPopup._setupInternal(genesis, gridContainerSettings);
	return newPopup;
};
oFF.UtGridContainerSettingsPopup.prototype.m_cancelBtn = null;
oFF.UtGridContainerSettingsPopup.prototype.m_cancelProcedure = null;
oFF.UtGridContainerSettingsPopup.prototype.m_confirmBtn = null;
oFF.UtGridContainerSettingsPopup.prototype.m_confirmConsumer = null;
oFF.UtGridContainerSettingsPopup.prototype.m_existingGridContainerSettings = null;
oFF.UtGridContainerSettingsPopup.prototype.m_settingsForm = null;
oFF.UtGridContainerSettingsPopup.prototype._cancelInternal = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure();
	}
	this.close();
};
oFF.UtGridContainerSettingsPopup.prototype._confirmInternal = function()
{
	if (oFF.notNull(this.m_confirmConsumer))
	{
		this.m_confirmConsumer(this._createGridContainerSettings());
	}
	this.close();
};
oFF.UtGridContainerSettingsPopup.prototype._createGridContainerSettings = function()
{
	let newGridContainerSettings = oFF.UiGridContainerSettings.create();
	if (oFF.notNull(this.m_settingsForm))
	{
		let formModel = this.m_settingsForm.getJsonModel();
		newGridContainerSettings.setColumns(formModel.getIntegerByKey(oFF.UtGridContainerSettingsPopup.FORM_COLUMNS_KEY));
		newGridContainerSettings.setColumnSize(oFF.UiCssLength.create(formModel.getStringByKey(oFF.UtGridContainerSettingsPopup.FORM_COLUMN_SIZE_KEY)));
		newGridContainerSettings.setGap(oFF.UiCssLength.create(formModel.getStringByKey(oFF.UtGridContainerSettingsPopup.FORM_GAP_KEY)));
		newGridContainerSettings.setMaxColumnSize(oFF.UiCssLength.create(formModel.getStringByKey(oFF.UtGridContainerSettingsPopup.FORM_MAX_COLUMN_SIZE_KEY)));
		newGridContainerSettings.setMinColumnSize(oFF.UiCssLength.create(formModel.getStringByKey(oFF.UtGridContainerSettingsPopup.FORM_MIN_COLUMN_SIZE_KEY)));
		newGridContainerSettings.setRowSize(oFF.UiCssLength.create(formModel.getStringByKey(oFF.UtGridContainerSettingsPopup.FORM_ROW_SIZE_KEY)));
	}
	return newGridContainerSettings;
};
oFF.UtGridContainerSettingsPopup.prototype._setupInternal = function(genesis, gridContainerSettings)
{
	this.m_existingGridContainerSettings = gridContainerSettings;
	this.setupPopup(genesis);
};
oFF.UtGridContainerSettingsPopup.prototype.buildPopupContent = function(genesis)
{
	this.m_settingsForm = oFF.UiForm.create(genesis);
	this.m_settingsForm.setItemEnterPressedConsumer((formItem) => {
		this._confirmInternal();
	});
	let columnsValue = null;
	let columnSizeValue = null;
	let gapValue = null;
	let maxColumnSizeValue = null;
	let minColumnSizeValue = null;
	let rowSizeValue = null;
	if (oFF.notNull(this.m_existingGridContainerSettings))
	{
		columnsValue = this.m_existingGridContainerSettings.getColumns() > 0 ? oFF.XInteger.convertToString(this.m_existingGridContainerSettings.getColumns()) : null;
		columnSizeValue = this.m_existingGridContainerSettings.getColumnSize() !== null ? this.m_existingGridContainerSettings.getColumnSize().getCssValue() : null;
		gapValue = this.m_existingGridContainerSettings.getGap() !== null ? this.m_existingGridContainerSettings.getGap().getCssValue() : null;
		maxColumnSizeValue = this.m_existingGridContainerSettings.getMaxColumnSize() !== null ? this.m_existingGridContainerSettings.getMaxColumnSize().getCssValue() : null;
		minColumnSizeValue = this.m_existingGridContainerSettings.getMinColumnSize() !== null ? this.m_existingGridContainerSettings.getMinColumnSize().getCssValue() : null;
		rowSizeValue = this.m_existingGridContainerSettings.getRowSize() !== null ? this.m_existingGridContainerSettings.getRowSize().getCssValue() : null;
	}
	let columnsInput = this.m_settingsForm.addInput(oFF.UtGridContainerSettingsPopup.FORM_COLUMNS_KEY, columnsValue, "Columns");
	columnsInput.setModelValueType(oFF.XValueType.INTEGER);
	columnsInput.setInputType(oFF.UiInputType.NUMBER);
	let columnSizeInput = this.m_settingsForm.addInput(oFF.UtGridContainerSettingsPopup.FORM_COLUMN_SIZE_KEY, columnSizeValue, "Column Size");
	columnSizeInput.setModelValueType(oFF.XValueType.STRING);
	columnSizeInput.setInputType(oFF.UiInputType.TEXT);
	let gapInput = this.m_settingsForm.addInput(oFF.UtGridContainerSettingsPopup.FORM_GAP_KEY, gapValue, "Gap");
	gapInput.setModelValueType(oFF.XValueType.STRING);
	gapInput.setInputType(oFF.UiInputType.TEXT);
	let maxColumnSizeInput = this.m_settingsForm.addInput(oFF.UtGridContainerSettingsPopup.FORM_MAX_COLUMN_SIZE_KEY, maxColumnSizeValue, "Max Column Size");
	maxColumnSizeInput.setModelValueType(oFF.XValueType.STRING);
	maxColumnSizeInput.setInputType(oFF.UiInputType.TEXT);
	let minColumnSizeInput = this.m_settingsForm.addInput(oFF.UtGridContainerSettingsPopup.FORM_MIN_COLUMN_SIZE_KEY, minColumnSizeValue, "Min Column Size");
	minColumnSizeInput.setModelValueType(oFF.XValueType.STRING);
	minColumnSizeInput.setInputType(oFF.UiInputType.TEXT);
	let rowSizeInput = this.m_settingsForm.addInput(oFF.UtGridContainerSettingsPopup.FORM_ROW_SIZE_KEY, rowSizeValue, "Row Size");
	rowSizeInput.setModelValueType(oFF.XValueType.STRING);
	rowSizeInput.setInputType(oFF.UiInputType.TEXT);
	genesis.setRoot(this.m_settingsForm.getView());
};
oFF.UtGridContainerSettingsPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle("Grid container settings");
	dialog.setWidth(oFF.UiCssLength.create("auto"));
	dialog.setMaxWidth(oFF.UiCssLength.create("600px"));
	this.m_confirmBtn = this.addButton(oFF.UiButtonType.PRIMARY, "Apply", "accept", (controlEvent) => {
		this._confirmInternal();
	});
	this.m_cancelBtn = this.addButton(oFF.UiButtonType.DEFAULT, "Cancel", "sys-cancel-2", (controlEvent2) => {
		this._cancelInternal();
	});
};
oFF.UtGridContainerSettingsPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtGridContainerSettingsPopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.UtGridContainerSettingsPopup.prototype.releaseObject = function()
{
	this.m_confirmBtn = oFF.XObjectExt.release(this.m_confirmBtn);
	this.m_cancelBtn = oFF.XObjectExt.release(this.m_cancelBtn);
	this.m_confirmConsumer = null;
	this.m_cancelProcedure = null;
	this.m_existingGridContainerSettings = null;
	this.m_settingsForm = oFF.XObjectExt.release(this.m_settingsForm);
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtGridContainerSettingsPopup.prototype.setCancelProcedure = function(procedure)
{
	this.m_cancelProcedure = procedure;
};
oFF.UtGridContainerSettingsPopup.prototype.setConfirmConsumer = function(consumer)
{
	this.m_confirmConsumer = consumer;
};

oFF.UtInputPopup = function() {};
oFF.UtInputPopup.prototype = new oFF.DfUiPopup();
oFF.UtInputPopup.prototype._ff_c = "UtInputPopup";

oFF.UtInputPopup.create = function(genesis, title, text)
{
	let dialog = new oFF.UtInputPopup();
	dialog.setupInternal(genesis, title, text);
	return dialog;
};
oFF.UtInputPopup.prototype.m_allowEmptyValue = false;
oFF.UtInputPopup.prototype.m_input = null;
oFF.UtInputPopup.prototype.m_inputConsumer = null;
oFF.UtInputPopup.prototype.m_okBtn = null;
oFF.UtInputPopup.prototype.m_text = null;
oFF.UtInputPopup.prototype.m_title = null;
oFF.UtInputPopup.prototype._adjustInputEnabledState = function()
{
	if (oFF.notNull(this.m_okBtn) && oFF.notNull(this.m_input))
	{
		this.m_okBtn.setEnabled(this.m_allowEmptyValue || oFF.XStringUtils.isNotNullAndNotEmpty(this.m_input.getValue()));
	}
};
oFF.UtInputPopup.prototype._fireConsumer = function()
{
	if (oFF.notNull(this.m_inputConsumer) && oFF.notNull(this.m_input))
	{
		this.m_inputConsumer(this.m_input.getValue());
	}
	this.close();
};
oFF.UtInputPopup.prototype.buildPopupContent = function(genesis)
{
	let mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_text))
	{
		let dlgLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
		dlgLabel.setText(this.m_text);
	}
	this.m_input = mainLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_input.registerOnLiveChange(oFF.UiLambdaLiveChangeListener.create((controlEvent) => {
		this._adjustInputEnabledState();
	}));
	this.m_input.registerOnEnter(oFF.UiLambdaEnterListener.create((controlEvent) => {
		this._fireConsumer();
	}));
	genesis.setRoot(mainLayout);
};
oFF.UtInputPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.m_title);
	dialog.setWidth(oFF.UiCssLength.create("600px"));
	this.m_okBtn = this.addButton(oFF.UiButtonType.PRIMARY, "Ok", "sys-enter-2", (controlEvent) => {
		this._fireConsumer();
	});
	this.addButton(oFF.UiButtonType.DEFAULT, "Cancel", "sys-cancel-2", (controlEvent2) => {
		this.close();
	});
};
oFF.UtInputPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtInputPopup.prototype.onPopupOpened = function(controlEvent)
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.focus();
	}
};
oFF.UtInputPopup.prototype.releaseObject = function()
{
	this.m_inputConsumer = null;
	this.m_input = oFF.XObjectExt.release(this.m_input);
	this.m_okBtn = oFF.XObjectExt.release(this.m_okBtn);
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtInputPopup.prototype.selectText = function(startIndex, endIndex)
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.selectText(startIndex, endIndex);
	}
};
oFF.UtInputPopup.prototype.setAllowEmptyValue = function(allowEmptyValue)
{
	this.m_allowEmptyValue = allowEmptyValue;
	this._adjustInputEnabledState();
};
oFF.UtInputPopup.prototype.setInputConsumer = function(consumer)
{
	this.m_inputConsumer = consumer;
};
oFF.UtInputPopup.prototype.setInputPlaceholder = function(placeholder)
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.setPlaceholder(placeholder);
	}
};
oFF.UtInputPopup.prototype.setInputValue = function(value)
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.setValue(value);
		this._adjustInputEnabledState();
	}
};
oFF.UtInputPopup.prototype.setOkButtonIcon = function(icon)
{
	if (oFF.notNull(this.m_okBtn))
	{
		this.m_okBtn.setIcon(icon);
	}
};
oFF.UtInputPopup.prototype.setOkButtonText = function(text)
{
	if (oFF.notNull(this.m_okBtn))
	{
		this.m_okBtn.setText(text);
	}
};
oFF.UtInputPopup.prototype.setOkButtonType = function(btnType)
{
	if (oFF.notNull(this.m_okBtn))
	{
		this.m_okBtn.setButtonType(btnType);
	}
};
oFF.UtInputPopup.prototype.setupInternal = function(genesis, title, text)
{
	this.m_title = title;
	this.m_text = text;
	this.m_allowEmptyValue = true;
	this.setupPopup(genesis);
};

oFF.UtMessagePopup = function() {};
oFF.UtMessagePopup.prototype = new oFF.DfUiPopup();
oFF.UtMessagePopup.prototype._ff_c = "UtMessagePopup";

oFF.UtMessagePopup.create = function(genesis, title, subtitle, message)
{
	let newPopup = new oFF.UtMessagePopup();
	newPopup.setupInternal(genesis, title, subtitle, message);
	return newPopup;
};
oFF.UtMessagePopup.prototype.m_message = null;
oFF.UtMessagePopup.prototype.m_subtitle = null;
oFF.UtMessagePopup.prototype.m_title = null;
oFF.UtMessagePopup.prototype.buildPopupContent = function(genesis)
{
	let mainLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	mainLayout.useMaxSpace();
	mainLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_subtitle))
	{
		let dlgSubTitle = mainLayout.addNewItemOfType(oFF.UiType.TITLE);
		dlgSubTitle.setText(this.m_subtitle);
		dlgSubTitle.setTitleStyle(oFF.UiTitleLevel.H_6);
		dlgSubTitle.setTitleLevel(oFF.UiTitleLevel.H_6);
	}
	let messageLabel = mainLayout.addNewItemOfType(oFF.UiType.LABEL);
	messageLabel.setText(this.m_message);
	messageLabel.setWrapping(true);
	messageLabel.setMargin(oFF.UiCssBoxEdges.create("0 0 0.5rem 0"));
	genesis.setRoot(mainLayout);
};
oFF.UtMessagePopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.m_title);
	dialog.setWidth(oFF.UiCssLength.create("600px"));
	this.addButton(oFF.UiButtonType.DEFAULT, "Close", null, (controlEvent) => {
		this.close();
	});
};
oFF.UtMessagePopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtMessagePopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.UtMessagePopup.prototype.releaseObject = function()
{
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtMessagePopup.prototype.setupInternal = function(genesis, title, subtitle, message)
{
	this.m_title = title;
	this.m_subtitle = subtitle;
	this.m_message = message;
	this.setupPopup(genesis);
};

oFF.UtTextAreaPopup = function() {};
oFF.UtTextAreaPopup.prototype = new oFF.DfUiPopup();
oFF.UtTextAreaPopup.prototype._ff_c = "UtTextAreaPopup";

oFF.UtTextAreaPopup.create = function(genesis, title, codeType, text)
{
	let newPopup = new oFF.UtTextAreaPopup();
	newPopup._setupInternal(genesis, title, codeType, text);
	return newPopup;
};
oFF.UtTextAreaPopup.prototype.m_cancelBtn = null;
oFF.UtTextAreaPopup.prototype.m_cancelProcedure = null;
oFF.UtTextAreaPopup.prototype.m_codeEditor = null;
oFF.UtTextAreaPopup.prototype.m_codeType = null;
oFF.UtTextAreaPopup.prototype.m_confirmBtn = null;
oFF.UtTextAreaPopup.prototype.m_confirmConsumer = null;
oFF.UtTextAreaPopup.prototype.m_text = null;
oFF.UtTextAreaPopup.prototype.m_title = null;
oFF.UtTextAreaPopup.prototype._cancelInternal = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure();
	}
	this.close();
};
oFF.UtTextAreaPopup.prototype._confirmInternal = function()
{
	if (oFF.notNull(this.m_confirmConsumer))
	{
		this.m_confirmConsumer(this.m_codeEditor.getValue());
	}
	this.close();
};
oFF.UtTextAreaPopup.prototype._setupInternal = function(genesis, title, codeType, text)
{
	this.m_title = title;
	this.m_codeType = codeType;
	this.m_text = text;
	if (oFF.XStringUtils.isNullOrEmpty(this.m_title))
	{
		this.m_title = "Text Area";
	}
	if (oFF.XStringUtils.isNullOrEmpty(this.m_codeType))
	{
		this.m_codeType = "text";
	}
	this.setupPopup(genesis);
};
oFF.UtTextAreaPopup.prototype.buildPopupContent = function(genesis)
{
	this.m_codeEditor = genesis.newControl(oFF.UiType.CODE_EDITOR);
	this.m_codeEditor.setName("textEntryDialogCodeEditor");
	this.m_codeEditor.setWidth(oFF.UiCssLength.create("100%"));
	this.m_codeEditor.setHeight(oFF.UiCssLength.create("100%"));
	this.m_codeEditor.setCodeType(this.m_codeType);
	this.m_codeEditor.setValue(this.m_text);
	genesis.setRoot(this.m_codeEditor);
};
oFF.UtTextAreaPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.m_title);
	dialog.setWidth(oFF.UiCssLength.create("60vw"));
	dialog.setHeight(oFF.UiCssLength.create("60vh"));
	dialog.setResizable(true);
	this.m_confirmBtn = this.addButton(oFF.UiButtonType.PRIMARY, "Apply", "accept", (controlEvent) => {
		this._confirmInternal();
	});
	this.m_cancelBtn = this.addButton(oFF.UiButtonType.DEFAULT, "Cancel", "sys-cancel-2", (controlEvent2) => {
		this._cancelInternal();
	});
};
oFF.UtTextAreaPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtTextAreaPopup.prototype.onPopupOpened = function(controlEvent)
{
	this.m_codeEditor.focus();
};
oFF.UtTextAreaPopup.prototype.releaseObject = function()
{
	this.m_codeEditor = oFF.XObjectExt.release(this.m_codeEditor);
	this.m_confirmBtn = oFF.XObjectExt.release(this.m_confirmBtn);
	this.m_cancelBtn = oFF.XObjectExt.release(this.m_cancelBtn);
	this.m_confirmConsumer = null;
	this.m_cancelProcedure = null;
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtTextAreaPopup.prototype.setCancelProcedure = function(procedure)
{
	this.m_cancelProcedure = procedure;
};
oFF.UtTextAreaPopup.prototype.setConfirmConsumer = function(consumer)
{
	this.m_confirmConsumer = consumer;
};

oFF.UtWarningPopup = function() {};
oFF.UtWarningPopup.prototype = new oFF.DfUiPopup();
oFF.UtWarningPopup.prototype._ff_c = "UtWarningPopup";

oFF.UtWarningPopup.create = function(genesis, title, content)
{
	let newPopup = new oFF.UtWarningPopup();
	newPopup.setupInternal(genesis, title, content);
	return newPopup;
};
oFF.UtWarningPopup.prototype.m_closeBtn = null;
oFF.UtWarningPopup.prototype.m_content = null;
oFF.UtWarningPopup.prototype.m_title = null;
oFF.UtWarningPopup.prototype.buildPopupContent = function(genesis)
{
	genesis.setRoot(this.m_content);
};
oFF.UtWarningPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.m_title);
	dialog.setWidth(oFF.UiCssLength.create("auto"));
	dialog.setMaxWidth(oFF.UiCssLength.create("30em"));
	dialog.setHeight(oFF.UiCssLength.create("auto"));
	dialog.setState(oFF.UiValueState.WARNING);
	this.m_closeBtn = this.addButton(oFF.UiButtonType.PRIMARY, this.getLocalization().getText(oFF.XCommonI18n.CLOSE), "", (controlEvent) => {
		this.close();
	});
};
oFF.UtWarningPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtWarningPopup.prototype.onPopupOpened = function(controlEvent) {};
oFF.UtWarningPopup.prototype.releaseObject = function()
{
	this.m_content = oFF.XObjectExt.release(this.m_content);
	this.m_closeBtn = oFF.XObjectExt.release(this.m_closeBtn);
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtWarningPopup.prototype.setCloseButtonIcon = function(icon)
{
	if (oFF.notNull(this.m_closeBtn))
	{
		this.m_closeBtn.setIcon(icon);
	}
};
oFF.UtWarningPopup.prototype.setCloseButtonText = function(text)
{
	if (oFF.notNull(this.m_closeBtn))
	{
		this.m_closeBtn.setText(text);
	}
};
oFF.UtWarningPopup.prototype.setCloseButtonType = function(btnType)
{
	if (oFF.notNull(this.m_closeBtn))
	{
		this.m_closeBtn.setButtonType(btnType);
	}
};
oFF.UtWarningPopup.prototype.setHeight = function(height)
{
	this.getDialog().setHeight(oFF.UiCssLength.create(height));
};
oFF.UtWarningPopup.prototype.setWidth = function(width)
{
	this.getDialog().setWidth(oFF.UiCssLength.create(width));
};
oFF.UtWarningPopup.prototype.setupInternal = function(genesis, title, content)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(title))
	{
		this.m_title = title;
	}
	else
	{
		this.m_title = this.getLocalization().getText(oFF.XCommonI18n.WARNING);
	}
	this.m_content = content;
	this.setupPopup(genesis);
};

oFF.DfUtToolbarWidgetItem = function() {};
oFF.DfUtToolbarWidgetItem.prototype = new oFF.XObject();
oFF.DfUtToolbarWidgetItem.prototype._ff_c = "DfUtToolbarWidgetItem";

oFF.DfUtToolbarWidgetItem.prototype.addAttribute = function(attributeKey, attributeValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(attributeValue))
	{
		this.getView().addAttribute(attributeKey, attributeValue);
	}
};
oFF.DfUtToolbarWidgetItem.prototype.getName = function()
{
	return this.getView().getName();
};
oFF.DfUtToolbarWidgetItem.prototype.isEnabled = function()
{
	return this.getView().isEnabled();
};
oFF.DfUtToolbarWidgetItem.prototype.setEnabled = function(enabled)
{
	return this.getView().setEnabled(enabled);
};
oFF.DfUtToolbarWidgetItem.prototype.setName = function(name)
{
	return this.getView().setName(name);
};
oFF.DfUtToolbarWidgetItem.prototype.setOverflowPriority = function(overflowPriority)
{
	let overflowToolbarLayoutData = oFF.UiLayoutData.createOverflowToolbar();
	overflowToolbarLayoutData.setPriority(overflowPriority);
	this.getView().setLayoutData(overflowToolbarLayoutData);
};

oFF.UiFormButton = function() {};
oFF.UiFormButton.prototype = new oFF.DfUiFormControl();
oFF.UiFormButton.prototype._ff_c = "UiFormButton";

oFF.UiFormButton.create = function(parentForm, name, text, tooltip, icon, pressProcedure)
{
	let newFormItem = new oFF.UiFormButton();
	newFormItem._setupFormButton(parentForm, name, text, tooltip, icon, pressProcedure);
	return newFormItem;
};
oFF.UiFormButton.prototype.m_icon = null;
oFF.UiFormButton.prototype.m_pressProcedure = null;
oFF.UiFormButton.prototype.m_text = null;
oFF.UiFormButton.prototype.m_tooltip = null;
oFF.UiFormButton.prototype._firePressProcedureIfNeeded = function()
{
	if (oFF.notNull(this.m_pressProcedure))
	{
		this.m_pressProcedure();
	}
};
oFF.UiFormButton.prototype._setupFormButton = function(parentForm, name, text, tooltip, icon, pressProcedure)
{
	this.m_text = text;
	this.m_tooltip = tooltip;
	this.m_icon = icon;
	this.m_pressProcedure = pressProcedure;
	this.setupFormControl(parentForm, name);
};
oFF.UiFormButton.prototype.createFormControl = function(genesis)
{
	let newBtn = genesis.newControl(oFF.UiType.BUTTON);
	newBtn.setName(this.getName());
	newBtn.setText(this.m_text);
	newBtn.setTooltip(this.m_tooltip);
	newBtn.setIcon(this.m_icon);
	newBtn.setFlex("none");
	newBtn.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._firePressProcedureIfNeeded();
	}));
	return newBtn;
};
oFF.UiFormButton.prototype.releaseObject = function()
{
	this.m_pressProcedure = null;
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.UiFormButton.prototype.setButtonType = function(buttonType)
{
	this.getFormControl().setButtonType(buttonType);
	return this;
};
oFF.UiFormButton.prototype.setEnabled = function(enabled)
{
	this.getFormControl().setEnabled(enabled);
	return this;
};
oFF.UiFormButton.prototype.setText = function(text)
{
	this.getFormControl().setText(text);
	return this;
};

oFF.UiFormCustomControl = function() {};
oFF.UiFormCustomControl.prototype = new oFF.DfUiFormControl();
oFF.UiFormCustomControl.prototype._ff_c = "UiFormCustomControl";

oFF.UiFormCustomControl.create = function(parentForm, name, control)
{
	let newFormItem = new oFF.UiFormCustomControl();
	newFormItem._setupFormCustomControl(parentForm, name, control);
	return newFormItem;
};
oFF.UiFormCustomControl.prototype.m_customControl = null;
oFF.UiFormCustomControl.prototype._setupFormCustomControl = function(parentForm, name, control)
{
	this.m_customControl = control;
	this.setupFormControl(parentForm, name);
};
oFF.UiFormCustomControl.prototype.createFormControl = function(genesis)
{
	return this.m_customControl;
};
oFF.UiFormCustomControl.prototype.focus = function()
{
	if (this.getFormControl() !== null)
	{
		this.getFormControl().focus();
	}
};
oFF.UiFormCustomControl.prototype.releaseObject = function()
{
	this.m_customControl = null;
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.UiFormCustomControl.prototype.setEnabled = function(enabled)
{
	this.getFormControl().setEnabled(enabled);
	return this;
};

oFF.UiFormLabel = function() {};
oFF.UiFormLabel.prototype = new oFF.DfUiFormControl();
oFF.UiFormLabel.prototype._ff_c = "UiFormLabel";

oFF.UiFormLabel.create = function(parentForm, name, text, tooltip)
{
	let newFormItem = new oFF.UiFormLabel();
	newFormItem._setupFormLabel(parentForm, name, text, tooltip);
	return newFormItem;
};
oFF.UiFormLabel.prototype.m_text = null;
oFF.UiFormLabel.prototype.m_tooltip = null;
oFF.UiFormLabel.prototype._setupFormLabel = function(parentForm, name, text, tooltip)
{
	this.m_text = text;
	this.m_tooltip = tooltip;
	this.setupFormControl(parentForm, name);
};
oFF.UiFormLabel.prototype.applyErrorState = function(reason)
{
	this.getFormControl().setFontColor(oFF.UtStyles.ERROR_COLOR);
	this.getFormControl().setTooltip(reason);
	return this;
};
oFF.UiFormLabel.prototype.createFormControl = function(genesis)
{
	let newLbl = genesis.newControl(oFF.UiType.LABEL);
	newLbl.setName(this.getName());
	newLbl.setText(this.m_text);
	newLbl.setTooltip(this.m_tooltip);
	newLbl.setFlex("0 0 auto");
	newLbl.setFontWeight(oFF.UiFontWeight.BOLD);
	return newLbl;
};
oFF.UiFormLabel.prototype.releaseObject = function()
{
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.UiFormLabel.prototype.removeErrorState = function()
{
	this.getFormControl().setFontColor(null);
	this.getFormControl().setTooltip(null);
	return this;
};
oFF.UiFormLabel.prototype.setEnabled = function(enabled)
{
	return this;
};
oFF.UiFormLabel.prototype.setFontSize = function(fontSize)
{
	this.getFormControl().setFontSize(fontSize);
	return this;
};
oFF.UiFormLabel.prototype.setFontWeight = function(fontWeight)
{
	this.getFormControl().setFontWeight(fontWeight);
	return this;
};
oFF.UiFormLabel.prototype.setLabelFor = function(control)
{
	this.getFormControl().setLabelFor(control);
	return this;
};
oFF.UiFormLabel.prototype.setMargin = function(margin)
{
	this.getFormControl().setMargin(margin);
	return this;
};
oFF.UiFormLabel.prototype.setOpacity = function(opacity)
{
	this.getFormControl().setOpacity(opacity);
	return this;
};
oFF.UiFormLabel.prototype.setPadding = function(padding)
{
	this.getFormControl().setPadding(padding);
	return this;
};
oFF.UiFormLabel.prototype.setRequired = function(isRequired)
{
	this.getFormControl().setRequired(isRequired);
	return this;
};
oFF.UiFormLabel.prototype.setText = function(text)
{
	this.getFormControl().setText(text);
	return this;
};
oFF.UiFormLabel.prototype.setTextAlign = function(textAlign)
{
	this.getFormControl().setTextAlign(textAlign);
	return this;
};
oFF.UiFormLabel.prototype.setTextDecoration = function(textDecoration)
{
	this.getFormControl().setTextDecoration(textDecoration);
	return this;
};
oFF.UiFormLabel.prototype.setTooltip = function(tooltip)
{
	this.getFormControl().setTooltip(tooltip);
	return this;
};
oFF.UiFormLabel.prototype.setWrapping = function(wrapping)
{
	this.getFormControl().setWrapping(wrapping);
	return this;
};

oFF.UiFormTitle = function() {};
oFF.UiFormTitle.prototype = new oFF.DfUiFormControl();
oFF.UiFormTitle.prototype._ff_c = "UiFormTitle";

oFF.UiFormTitle.create = function(parentForm, name, text, tooltip)
{
	let newFormItem = new oFF.UiFormTitle();
	newFormItem._setupFormTitle(parentForm, name, text, tooltip);
	return newFormItem;
};
oFF.UiFormTitle.prototype.m_text = null;
oFF.UiFormTitle.prototype.m_tooltip = null;
oFF.UiFormTitle.prototype._setupFormTitle = function(parentForm, name, text, tooltip)
{
	this.m_text = text;
	this.m_tooltip = tooltip;
	this.setupFormControl(parentForm, name);
};
oFF.UiFormTitle.prototype.createFormControl = function(genesis)
{
	let newTitle = genesis.newControl(oFF.UiType.LABEL);
	newTitle.setName(this.getName());
	newTitle.setText(this.m_text);
	newTitle.setTooltip(this.m_tooltip);
	newTitle.setFlex("0 0 auto");
	return newTitle;
};
oFF.UiFormTitle.prototype.releaseObject = function()
{
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.UiFormTitle.prototype.setEnabled = function(enabled)
{
	return this;
};
oFF.UiFormTitle.prototype.setText = function(text)
{
	this.getFormControl().setText(text);
	return this;
};
oFF.UiFormTitle.prototype.setTextAlign = function(textAlign)
{
	this.getFormControl().setTextAlign(textAlign);
	return this;
};
oFF.UiFormTitle.prototype.setTitleLevel = function(titleLevel)
{
	this.getFormControl().setTitleLevel(titleLevel);
	return this;
};
oFF.UiFormTitle.prototype.setTitleStyle = function(titleStyle)
{
	this.getFormControl().setTitleStyle(titleStyle);
	return this;
};
oFF.UiFormTitle.prototype.setTooltip = function(tooltip)
{
	this.getFormControl().setTooltip(tooltip);
	return this;
};

oFF.DfUiFormItem = function() {};
oFF.DfUiFormItem.prototype = new oFF.DfUiFormControl();
oFF.DfUiFormItem.prototype._ff_c = "DfUiFormItem";

oFF.DfUiFormItem.prototype.m_blurTimeoutId = null;
oFF.DfUiFormItem.prototype.m_customRequiredText = null;
oFF.DfUiFormItem.prototype.m_customValidator = null;
oFF.DfUiFormItem.prototype.m_description = null;
oFF.DfUiFormItem.prototype.m_descriptionLbl = null;
oFF.DfUiFormItem.prototype.m_enterPressedProcedure = null;
oFF.DfUiFormItem.prototype.m_formItemControl = null;
oFF.DfUiFormItem.prototype.m_formLabel = null;
oFF.DfUiFormItem.prototype.m_internalBlurProcedure = null;
oFF.DfUiFormItem.prototype.m_internalEnterPressedProcedure = null;
oFF.DfUiFormItem.prototype.m_internalValueChangedProcedure = null;
oFF.DfUiFormItem.prototype.m_isPristine = false;
oFF.DfUiFormItem.prototype.m_isRequired = false;
oFF.DfUiFormItem.prototype.m_isUntouched = false;
oFF.DfUiFormItem.prototype.m_isValid = false;
oFF.DfUiFormItem.prototype.m_modeValueType = null;
oFF.DfUiFormItem.prototype.m_text = null;
oFF.DfUiFormItem.prototype.m_tooltip = null;
oFF.DfUiFormItem.prototype.m_value = null;
oFF.DfUiFormItem.prototype.m_valueChangedConsumer = null;
oFF.DfUiFormItem.prototype._canShowValidationErrors = function()
{
	if (this.getParentForm().getValidationVisibility() === oFF.UiFormValidationVisibility.SUBMIT && !this.getParentForm().isSubmitted())
	{
		return false;
	}
	return true;
};
oFF.DfUiFormItem.prototype._createDescriptionLabel = function(genesis)
{
	let descriptionLabel = genesis.newControl(oFF.UiType.LABEL);
	descriptionLabel.setText(this.getDescription());
	descriptionLabel.setVisible(oFF.XStringUtils.isNotNullAndNotEmpty(this.getDescription()));
	descriptionLabel.setFontSize(oFF.UiCssLength.create("0.75rem"));
	descriptionLabel.setWrapping(true);
	return descriptionLabel;
};
oFF.DfUiFormItem.prototype._createFormLabel = function()
{
	let formItemLabel = oFF.UiFormLabel.create(this.getParentForm(), null, this.getFormattedText(), this.getText());
	formItemLabel.setRequired(this.isRequired());
	formItemLabel.setVisible(oFF.XStringUtils.isNotNullAndNotEmpty(this.getText()));
	formItemLabel.setFontWeight(this.defaultFormLabelFontWeigt());
	formItemLabel.setMargin(oFF.UiCssBoxEdges.create("0 0 0.2rem 0"));
	return formItemLabel;
};
oFF.DfUiFormItem.prototype._getModelValueInternal = function()
{
	let finalValue = this.m_value;
	if (this.getModelValueType() !== null && this.getModelValueType() !== this.getValueType())
	{
		try
		{
			finalValue = oFF.XValueUtil.convertValue(finalValue, this.getModelValueType());
		}
		catch (error)
		{
			finalValue = this.m_value;
		}
	}
	return finalValue;
};
oFF.DfUiFormItem.prototype._itemValueUpdated = function()
{
	this.m_isPristine = false;
	if (this.isTouched())
	{
		this.validate();
	}
	else
	{
		this.refreshModelValue();
	}
};
oFF.DfUiFormItem.prototype._notifyBlur = function()
{
	if (oFF.notNull(this.m_internalBlurProcedure))
	{
		this.m_internalBlurProcedure();
	}
};
oFF.DfUiFormItem.prototype._notifyEnterPressed = function()
{
	if (oFF.notNull(this.m_enterPressedProcedure))
	{
		this.m_enterPressedProcedure();
	}
	if (oFF.notNull(this.m_internalEnterPressedProcedure))
	{
		this.m_internalEnterPressedProcedure();
	}
};
oFF.DfUiFormItem.prototype._notifyValueChanged = function(notifyConsumer)
{
	if (notifyConsumer && oFF.notNull(this.m_valueChangedConsumer))
	{
		this.m_valueChangedConsumer(this.getKey(), this.getValue());
	}
	if (oFF.notNull(this.m_internalValueChangedProcedure))
	{
		this.m_internalValueChangedProcedure();
	}
};
oFF.DfUiFormItem.prototype._renderFormItem = function()
{
	if (this.shouldRenderFormLabel())
	{
		this.m_formLabel = this._createFormLabel();
	}
	this.m_formItemControl = this.createFormItemControl(this.getGenesis());
	this.m_descriptionLbl = this._createDescriptionLabel(this.getGenesis());
	this.layoutFormItem();
	if (oFF.XStringUtils.isNullOrEmpty(this.getKey()))
	{
		this.setEditable(false);
	}
	if (oFF.notNull(this.m_formLabel))
	{
		this.m_formLabel.setLabelFor(this.m_formItemControl);
	}
};
oFF.DfUiFormItem.prototype._setValueSafe = function(value)
{
	if (oFF.notNull(value) && value.getValueType() !== this.getValueType())
	{
		let errMsg = oFF.XStringUtils.concatenate4("Error! Cannot set form item value! Invalid value type, expected: ", this.getValueType().getName(), " but got: ", value.getValueType().getName());
		throw oFF.XException.createRuntimeException(errMsg);
	}
	this.m_value = value;
};
oFF.DfUiFormItem.prototype.addLabelledBy = function(element)
{
	if (oFF.notNull(this.m_formItemControl) && this.m_formItemControl.hasAssociation(oFF.UiAssociation.LABELLED_BY) && oFF.notNull(element))
	{
		let formItem = this.m_formItemControl;
		formItem.addLabelledBy(element);
	}
	return this;
};
oFF.DfUiFormItem.prototype.addSectionLabelToLabelledBy = function(sectionLabel)
{
	if (oFF.notNull(sectionLabel))
	{
		this.addLabelledBy(sectionLabel.getView());
		let label = this.getFormLabel();
		if (oFF.notNull(label))
		{
			this.addLabelledBy(label.getView());
		}
	}
};
oFF.DfUiFormItem.prototype.createFormControl = function(genesis)
{
	let formItemWrapper = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	formItemWrapper.setName(this.getKey());
	formItemWrapper.setFlex("0 0 auto");
	formItemWrapper.setOverflow(oFF.UiOverflow.HIDDEN);
	return formItemWrapper;
};
oFF.DfUiFormItem.prototype.defaultFormLabelFontWeigt = function()
{
	return oFF.UiFontWeight.NORMAL;
};
oFF.DfUiFormItem.prototype.executeCustomValidator = function()
{
	if (oFF.notNull(this.m_customValidator))
	{
		this.m_customValidator(this);
	}
};
oFF.DfUiFormItem.prototype.focus = function()
{
	if (this.getFormItemControl() !== null)
	{
		this.getFormItemControl().focus();
	}
};
oFF.DfUiFormItem.prototype.getCustomRequiredText = function()
{
	return this.m_customRequiredText;
};
oFF.DfUiFormItem.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.DfUiFormItem.prototype.getDescriptionLabel = function()
{
	return this.m_descriptionLbl;
};
oFF.DfUiFormItem.prototype.getFormItemControl = function()
{
	return this.m_formItemControl;
};
oFF.DfUiFormItem.prototype.getFormLabel = function()
{
	return this.m_formLabel;
};
oFF.DfUiFormItem.prototype.getFormattedText = function()
{
	let formattedText = this.getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(formattedText))
	{
		formattedText = !oFF.XString.endsWith(formattedText, ":") && !oFF.XString.endsWith(formattedText, "?") ? oFF.XStringUtils.concatenate2(formattedText, ":") : formattedText;
	}
	return formattedText;
};
oFF.DfUiFormItem.prototype.getKey = function()
{
	return this.getName();
};
oFF.DfUiFormItem.prototype.getModelValueAsBoolean = function()
{
	if (oFF.notNull(this.m_value))
	{
		return oFF.XValueUtil.getBoolean(this.m_value, false, true);
	}
	return false;
};
oFF.DfUiFormItem.prototype.getModelValueAsList = function()
{
	if (oFF.notNull(this.m_value))
	{
		return this.m_value;
	}
	return null;
};
oFF.DfUiFormItem.prototype.getModelValueAsString = function()
{
	if (oFF.notNull(this.m_value))
	{
		return oFF.XValueUtil.getString(this.m_value);
	}
	return null;
};
oFF.DfUiFormItem.prototype.getModelValueType = function()
{
	return this.m_modeValueType;
};
oFF.DfUiFormItem.prototype.getText = function()
{
	return this.m_text;
};
oFF.DfUiFormItem.prototype.getTooltip = function()
{
	return this.m_tooltip;
};
oFF.DfUiFormItem.prototype.getValue = function()
{
	return this._getModelValueInternal();
};
oFF.DfUiFormItem.prototype.getValueRequiredText = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getCustomRequiredText()))
	{
		return this.getCustomRequiredText();
	}
	else if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getText()))
	{
		return oFF.XStringUtils.concatenate2(this.getText(), oFF.UiFormBaseConstants.REQUIRED_TEXT);
	}
	return oFF.UiFormBaseConstants.VALUE_REQUIRED_TEXT;
};
oFF.DfUiFormItem.prototype.handleItemBlured = function()
{
	if (this.isUntouched())
	{
		this.m_blurTimeoutId = oFF.XTimeout.timeout(oFF.UiFormBaseConstants.ITEM_INITIAL_BLUR_DELAY, () => {
			this.validate();
		});
	}
	this.m_isUntouched = false;
	this._notifyBlur();
};
oFF.DfUiFormItem.prototype.handleItemEnterPressed = function()
{
	this._notifyEnterPressed();
};
oFF.DfUiFormItem.prototype.handleItemValueChanged = function()
{
	this._itemValueUpdated();
	this._notifyValueChanged(true);
};
oFF.DfUiFormItem.prototype.handleItemValueManualSet = function()
{
	this._itemValueUpdated();
	this._notifyValueChanged(false);
};
oFF.DfUiFormItem.prototype.isDirty = function()
{
	return !this.m_isPristine;
};
oFF.DfUiFormItem.prototype.isEmpty = function()
{
	return this.getValueType() === oFF.XValueType.STRING && oFF.XStringUtils.isNullOrEmpty(this.getModelValueAsString());
};
oFF.DfUiFormItem.prototype.isEnabled = function()
{
	return this.getFormItemControl().isEnabled();
};
oFF.DfUiFormItem.prototype.isModelItem = function()
{
	return true;
};
oFF.DfUiFormItem.prototype.isPristine = function()
{
	return this.m_isPristine;
};
oFF.DfUiFormItem.prototype.isRequired = function()
{
	return this.m_isRequired;
};
oFF.DfUiFormItem.prototype.isRequiredValid = function()
{
	if (this.isRequired() && this.isEmpty())
	{
		return false;
	}
	return true;
};
oFF.DfUiFormItem.prototype.isTouched = function()
{
	return !this.m_isUntouched;
};
oFF.DfUiFormItem.prototype.isUntouched = function()
{
	return this.m_isUntouched;
};
oFF.DfUiFormItem.prototype.isValid = function()
{
	return this.m_isValid;
};
oFF.DfUiFormItem.prototype.isVisible = function()
{
	return this.getFormItemControl().isVisible();
};
oFF.DfUiFormItem.prototype.layoutFormItem = function()
{
	let wrapperLayout = this.getFormControl();
	wrapperLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	if (this.getFormLabel() !== null)
	{
		wrapperLayout.addItem(this.getFormLabel().getView());
	}
	wrapperLayout.addItem(this.getFormItemControl());
	wrapperLayout.addItem(this.getDescriptionLabel());
};
oFF.DfUiFormItem.prototype.refreshItemModel = function()
{
	this.refreshModelValue();
};
oFF.DfUiFormItem.prototype.releaseObject = function()
{
	this.m_valueChangedConsumer = null;
	this.m_enterPressedProcedure = null;
	this.m_value = oFF.XObjectExt.release(this.m_value);
	this.m_formItemControl = oFF.XObjectExt.release(this.m_formItemControl);
	this.m_descriptionLbl = oFF.XObjectExt.release(this.m_descriptionLbl);
	this.m_formLabel = oFF.XObjectExt.release(this.m_formLabel);
	this.m_customValidator = null;
	this.m_internalBlurProcedure = null;
	this.m_internalValueChangedProcedure = null;
	this.m_internalEnterPressedProcedure = null;
	oFF.XTimeout.clear(this.m_blurTimeoutId);
	oFF.DfUiFormControl.prototype.releaseObject.call( this );
};
oFF.DfUiFormItem.prototype.rerenderFormItem = function()
{
	let sectionWrapper = this.getFormControl();
	if (oFF.notNull(sectionWrapper))
	{
		sectionWrapper.clearItems();
	}
	this.m_formLabel = null;
	this.m_formItemControl = null;
	this._renderFormItem();
};
oFF.DfUiFormItem.prototype.setCustomRequiredText = function(requiredText)
{
	this.m_customRequiredText = requiredText;
};
oFF.DfUiFormItem.prototype.setCustomValidator = function(consumer)
{
	this.m_customValidator = consumer;
};
oFF.DfUiFormItem.prototype.setDescription = function(description)
{
	this.m_description = description;
	if (this.getDescriptionLabel() !== null)
	{
		this.getDescriptionLabel().setText(description);
		this.getDescriptionLabel().setVisible(oFF.XStringUtils.isNotNullAndNotEmpty(this.getDescription()));
	}
	return this;
};
oFF.DfUiFormItem.prototype.setEnterPressedProcedure = function(procedure)
{
	this.m_enterPressedProcedure = procedure;
	return this;
};
oFF.DfUiFormItem.prototype.setInternalBlurConsumer = function(procedure)
{
	this.m_internalBlurProcedure = procedure;
};
oFF.DfUiFormItem.prototype.setInternalEnterPressedProcedure = function(procedure)
{
	this.m_internalEnterPressedProcedure = procedure;
};
oFF.DfUiFormItem.prototype.setInternalValueChangedProcedure = function(procedure)
{
	this.m_internalValueChangedProcedure = procedure;
};
oFF.DfUiFormItem.prototype.setInvalid = function(reason)
{
	this.m_isValid = false;
	if (this._canShowValidationErrors())
	{
		this.setInvalidState(reason);
	}
};
oFF.DfUiFormItem.prototype.setLabelFontWeight = function(fontWeight)
{
	if (this.getFormLabel() !== null)
	{
		this.getFormLabel().setFontWeight(fontWeight);
	}
	return this;
};
oFF.DfUiFormItem.prototype.setModelValueType = function(modelValueType)
{
	this.m_modeValueType = modelValueType;
	return this;
};
oFF.DfUiFormItem.prototype.setRequired = function(isRequired)
{
	this.m_isRequired = true;
	if (this.getFormLabel() !== null)
	{
		this.getFormLabel().setRequired(isRequired);
	}
	return this;
};
oFF.DfUiFormItem.prototype.setText = function(text)
{
	this.m_text = text;
	if (this.getFormLabel() !== null)
	{
		this.getFormLabel().setText(this.getFormattedText());
	}
	return this;
};
oFF.DfUiFormItem.prototype.setTooltip = function(tooltip)
{
	this.m_tooltip = tooltip;
	if (this.getFormControl() !== null)
	{
		this.getFormControl().setTooltip(tooltip);
	}
	return this;
};
oFF.DfUiFormItem.prototype.setValid = function()
{
	this.m_isValid = true;
	this.setValidState();
};
oFF.DfUiFormItem.prototype.setValue = function(value)
{
	let areEqual = oFF.UiFormUtils.areValuesEqual(this.getValue(), value);
	if (!areEqual)
	{
		this._setValueSafe(value);
		this.updateControlValue();
		this.handleItemValueManualSet();
	}
	return this;
};
oFF.DfUiFormItem.prototype.setValueChangedConsumer = function(consumer)
{
	this.m_valueChangedConsumer = consumer;
	return this;
};
oFF.DfUiFormItem.prototype.setupFormItem = function(parentForm, key, value, text)
{
	this._setValueSafe(value);
	this.m_text = text;
	this.m_modeValueType = null;
	this.m_isRequired = false;
	this.m_isValid = true;
	this.m_isPristine = true;
	this.m_isUntouched = true;
	this.setupFormControl(parentForm, key);
	this._renderFormItem();
};
oFF.DfUiFormItem.prototype.shouldRenderFormLabel = function()
{
	return true;
};
oFF.DfUiFormItem.prototype.updateModelValueByBoolean = function(newValue)
{
	if (oFF.notNull(this.m_value))
	{
		let tmpBoolVal = this.m_value;
		tmpBoolVal.setBoolean(newValue);
	}
	else
	{
		this.m_value = oFF.XBooleanValue.create(newValue);
	}
};
oFF.DfUiFormItem.prototype.updateModelValueByList = function(newValue)
{
	this.m_value = newValue;
};
oFF.DfUiFormItem.prototype.updateModelValueByString = function(newValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(newValue))
	{
		if (oFF.notNull(this.m_value))
		{
			let tmpStrVal = this.m_value;
			tmpStrVal.setString(newValue);
		}
		else
		{
			this.m_value = oFF.XStringValue.create(newValue);
		}
	}
	else
	{
		this.m_value = null;
	}
};
oFF.DfUiFormItem.prototype.validate = function()
{
	this.m_isUntouched = false;
	this.refreshModelValue();
	if (!this.isRequiredValid())
	{
		this.setInvalid(this.getValueRequiredText());
		return;
	}
	else
	{
		this.setValid();
	}
	this.executeCustomValidator();
};

oFF.DfUiWidget = function() {};
oFF.DfUiWidget.prototype = new oFF.DfUiView();
oFF.DfUiWidget.prototype._ff_c = "DfUiWidget";

oFF.DfUiWidget.prototype.addCssClass = function(cssClass)
{
	if (this.getView() !== null)
	{
		this.getView().addCssClass(cssClass);
	}
	return this;
};
oFF.DfUiWidget.prototype.destroyView = function()
{
	this.destroyWidget();
};
oFF.DfUiWidget.prototype.getViewControl = function(genesis)
{
	return this.getWidgetControl(genesis);
};
oFF.DfUiWidget.prototype.initWidget = function(genesis)
{
	this.initView(genesis);
};
oFF.DfUiWidget.prototype.isVisible = function()
{
	if (this.getView() !== null)
	{
		return this.getView().isVisible();
	}
	return false;
};
oFF.DfUiWidget.prototype.layoutView = function(viewControl)
{
	this.layoutWidget(viewControl);
};
oFF.DfUiWidget.prototype.removeCssClass = function(cssClass)
{
	if (this.getView() !== null)
	{
		this.getView().removeCssClass(cssClass);
	}
	return this;
};
oFF.DfUiWidget.prototype.setMargin = function(margin)
{
	if (this.getView() !== null)
	{
		this.getView().setMargin(margin);
	}
	return this;
};
oFF.DfUiWidget.prototype.setName = function(name)
{
	if (this.getView() !== null)
	{
		this.getView().setName(name);
	}
	return this;
};
oFF.DfUiWidget.prototype.setVisible = function(visible)
{
	if (this.getView() !== null)
	{
		this.getView().setVisible(visible);
	}
	return this;
};
oFF.DfUiWidget.prototype.setupView = function()
{
	this.setupWidget();
};

oFF.UtFormPopup = function() {};
oFF.UtFormPopup.prototype = new oFF.DfUiPopup();
oFF.UtFormPopup.prototype._ff_c = "UtFormPopup";

oFF.UtFormPopup.POPUP_CANCEL_BTN_NAME = "SuFormPopupCancelBtn";
oFF.UtFormPopup.POPUP_SUBMIT_BTN_NAME = "SuFormPopupSubmitBtn";
oFF.UtFormPopup.create = function(genesis, title, submitConsumer)
{
	let dialog = new oFF.UtFormPopup();
	dialog.setupFormPopup(genesis, title, submitConsumer);
	return dialog;
};
oFF.UtFormPopup.prototype.m_afterOpenConsumer = null;
oFF.UtFormPopup.prototype.m_beforeSubmitPredicate = null;
oFF.UtFormPopup.prototype.m_cancelBtn = null;
oFF.UtFormPopup.prototype.m_cancelBtnIcon = null;
oFF.UtFormPopup.prototype.m_cancelBtnText = null;
oFF.UtFormPopup.prototype.m_cancelProcedure = null;
oFF.UtFormPopup.prototype.m_form = null;
oFF.UtFormPopup.prototype.m_mainLayout = null;
oFF.UtFormPopup.prototype.m_submitBtn = null;
oFF.UtFormPopup.prototype.m_submitConsumer = null;
oFF.UtFormPopup.prototype.m_title = null;
oFF.UtFormPopup.prototype._cancelInternal = function()
{
	if (oFF.notNull(this.m_cancelProcedure))
	{
		this.m_cancelProcedure();
	}
	this.close();
};
oFF.UtFormPopup.prototype._submitFormInternal = function()
{
	if (oFF.isNull(this.m_beforeSubmitPredicate) || this.m_beforeSubmitPredicate(this.m_form))
	{
		if (this.m_form.submit())
		{
			if (oFF.notNull(this.m_submitConsumer))
			{
				this.m_submitConsumer(this.m_form.getJsonModel());
			}
			this.close();
		}
		else
		{
			this.getDialog().shake();
		}
	}
};
oFF.UtFormPopup.prototype.addCheckbox = function(key, value, text)
{
	return this.m_form.addCheckbox(key, value, text);
};
oFF.UtFormPopup.prototype.addColorPicker = function(key, value, text)
{
	return this.m_form.addColorPicker(key, value, text);
};
oFF.UtFormPopup.prototype.addComboBox = function(key, value, text, dropdownItems, addEmptyItem)
{
	return this.m_form.addComboBox(key, value, text, dropdownItems, addEmptyItem);
};
oFF.UtFormPopup.prototype.addDropdown = function(key, value, text, dropdownItems, addEmptyItem)
{
	return this.m_form.addDropdown(key, value, text, dropdownItems, addEmptyItem);
};
oFF.UtFormPopup.prototype.addFormButton = function(name, text, tooltip, icon, pressProcedure)
{
	return this.m_form.addFormButton(name, text, tooltip, icon, pressProcedure);
};
oFF.UtFormPopup.prototype.addFormCustomControl = function(name, customControl)
{
	return this.m_form.addFormCustomControl(name, customControl);
};
oFF.UtFormPopup.prototype.addFormLabel = function(name, text, tooltip)
{
	return this.m_form.addFormLabel(name, text, tooltip);
};
oFF.UtFormPopup.prototype.addFormList = function(key, value, text, itemsType)
{
	return this.m_form.addFormList(key, value, text, itemsType);
};
oFF.UtFormPopup.prototype.addFormSection = function(key, text, isHorizontal)
{
	return this.m_form.addFormSection(key, text, isHorizontal);
};
oFF.UtFormPopup.prototype.addFormTitle = function(name, text, tooltip)
{
	return this.m_form.addFormTitle(name, text, tooltip);
};
oFF.UtFormPopup.prototype.addInput = function(key, value, text)
{
	return this.m_form.addInput(key, value, text);
};
oFF.UtFormPopup.prototype.addRadioGroup = function(key, value, text, radioGroupItems)
{
	return this.m_form.addRadioGroup(key, value, text, radioGroupItems);
};
oFF.UtFormPopup.prototype.addSegmentedButton = function(key, value, text, segmentedButtonItems)
{
	return this.m_form.addSegmentedButton(key, value, text, segmentedButtonItems);
};
oFF.UtFormPopup.prototype.addSwitch = function(key, value, text)
{
	return this.m_form.addSwitch(key, value, text);
};
oFF.UtFormPopup.prototype.buildPopupContent = function(genesis)
{
	this.m_form = oFF.UiForm.create(genesis);
	this.m_form.setItemEnterPressedConsumer((tmpItem) => {
		this._submitFormInternal();
	});
	genesis.setRoot(this.m_form.getView());
};
oFF.UtFormPopup.prototype.clearFormItems = function()
{
	this.m_form.clearFormItems();
};
oFF.UtFormPopup.prototype.configurePopup = function(dialog)
{
	dialog.setTitle(this.m_title);
	dialog.setWidth(oFF.UiCssLength.create("600px"));
	this.m_submitBtn = this.addButton(oFF.UiButtonType.PRIMARY, "Submit", "sys-enter-2", (controlEvent) => {
		this._submitFormInternal();
	});
	this.m_submitBtn.setName(oFF.UtFormPopup.POPUP_SUBMIT_BTN_NAME);
	this.m_cancelBtn = this.addButton(oFF.UiButtonType.DEFAULT, "Cancel", "sys-cancel-2", (controlEvent) => {
		this._cancelInternal();
	});
	this.m_cancelBtn.setName(oFF.UtFormPopup.POPUP_CANCEL_BTN_NAME);
};
oFF.UtFormPopup.prototype.getAllFormControls = function()
{
	return this.m_form.getAllFormControls();
};
oFF.UtFormPopup.prototype.getAllFormItems = function()
{
	return this.m_form.getAllFormItems();
};
oFF.UtFormPopup.prototype.getCancelProcedure = function()
{
	return this.m_cancelProcedure;
};
oFF.UtFormPopup.prototype.getFormControlByName = function(name)
{
	return this.m_form.getFormControlByName(name);
};
oFF.UtFormPopup.prototype.getFormItemByKey = function(key)
{
	return this.m_form.getFormItemByKey(key);
};
oFF.UtFormPopup.prototype.getJsonModel = function()
{
	return this.m_form.getJsonModel();
};
oFF.UtFormPopup.prototype.getSubmitConsumer = function()
{
	return this.m_submitConsumer;
};
oFF.UtFormPopup.prototype.getValidationVisibility = function()
{
	return this.m_form.getValidationVisibility();
};
oFF.UtFormPopup.prototype.hasFormItems = function()
{
	return this.m_form.hasFormItems();
};
oFF.UtFormPopup.prototype.isDirty = function()
{
	return this.m_form.isDirty();
};
oFF.UtFormPopup.prototype.isPristine = function()
{
	return this.m_form.isPristine();
};
oFF.UtFormPopup.prototype.isTouched = function()
{
	return this.m_form.isTouched();
};
oFF.UtFormPopup.prototype.isUntouched = function()
{
	return this.m_form.isUntouched();
};
oFF.UtFormPopup.prototype.isValid = function()
{
	return this.m_form.isValid();
};
oFF.UtFormPopup.prototype.onPopupClosed = function(controlEvent) {};
oFF.UtFormPopup.prototype.onPopupOpened = function(controlEvent)
{
	if (oFF.notNull(this.m_afterOpenConsumer))
	{
		this.m_afterOpenConsumer(this.m_form);
	}
	else if (this.m_form.getAllFormItems().hasElements())
	{
		this.m_form.getAllFormItems().get(0).focus();
	}
};
oFF.UtFormPopup.prototype.releaseObject = function()
{
	this.m_submitConsumer = null;
	this.m_cancelProcedure = null;
	this.m_beforeSubmitPredicate = null;
	this.m_afterOpenConsumer = null;
	this.m_form = oFF.XObjectExt.release(this.m_form);
	this.m_submitBtn = oFF.XObjectExt.release(this.m_submitBtn);
	this.m_cancelBtn = oFF.XObjectExt.release(this.m_cancelBtn);
	this.m_mainLayout = oFF.XObjectExt.release(this.m_mainLayout);
	oFF.DfUiPopup.prototype.releaseObject.call( this );
};
oFF.UtFormPopup.prototype.removeFormControlByName = function(name)
{
	return this.m_form.removeFormControlByName(name);
};
oFF.UtFormPopup.prototype.removeFormItemByKey = function(key)
{
	return this.m_form.removeFormItemByKey(key);
};
oFF.UtFormPopup.prototype.setAfterOpenConsumer = function(afterOpenConsumer)
{
	this.m_afterOpenConsumer = afterOpenConsumer;
};
oFF.UtFormPopup.prototype.setBeforeSubmitPredicate = function(beforeSubmitPredicate)
{
	this.m_beforeSubmitPredicate = beforeSubmitPredicate;
};
oFF.UtFormPopup.prototype.setCancelButtonIcon = function(icon)
{
	this.m_cancelBtnIcon = icon;
	if (oFF.notNull(this.m_cancelBtn))
	{
		this.m_cancelBtn.setIcon(icon);
	}
};
oFF.UtFormPopup.prototype.setCancelButtonText = function(text)
{
	this.m_cancelBtnText = text;
	if (oFF.notNull(this.m_cancelBtn))
	{
		this.m_cancelBtn.setText(text);
	}
};
oFF.UtFormPopup.prototype.setCancelProcedure = function(cancelProcedure)
{
	this.m_cancelProcedure = cancelProcedure;
};
oFF.UtFormPopup.prototype.setGap = function(gap)
{
	return this.m_form.setGap(gap);
};
oFF.UtFormPopup.prototype.setPopupState = function(state)
{
	if (this.getDialog() !== null)
	{
		this.getDialog().setState(state);
	}
};
oFF.UtFormPopup.prototype.setReadOnly = function()
{
	this.getDialog().clearDialogButtons();
	this.m_submitBtn = oFF.XObjectExt.release(this.m_submitBtn);
	let cancelBtnText = oFF.XStringUtils.isNotNullAndNotEmpty(this.m_cancelBtnText) ? this.m_cancelBtnText : "Close";
	let cancelBtnIcon = oFF.XStringUtils.isNotNullAndNotEmpty(this.m_cancelBtnIcon) ? this.m_cancelBtnIcon : "accept";
	this.m_cancelBtn = this.addButton(oFF.UiButtonType.PRIMARY, cancelBtnText, cancelBtnIcon, (controlEvent) => {
		this.close();
	});
	this.m_cancelBtn.setName(oFF.UtFormPopup.POPUP_CANCEL_BTN_NAME);
};
oFF.UtFormPopup.prototype.setSubmitButtonIcon = function(icon)
{
	if (oFF.notNull(this.m_submitBtn))
	{
		this.m_submitBtn.setIcon(icon);
	}
};
oFF.UtFormPopup.prototype.setSubmitButtonText = function(text)
{
	if (oFF.notNull(this.m_submitBtn))
	{
		this.m_submitBtn.setText(text);
	}
};
oFF.UtFormPopup.prototype.setSubmitConsumer = function(submitConsumer)
{
	this.m_submitConsumer = submitConsumer;
};
oFF.UtFormPopup.prototype.setValidationVisibility = function(validationVisibility)
{
	this.m_form.setValidationVisibility(validationVisibility);
};
oFF.UtFormPopup.prototype.setWidth = function(length)
{
	if (this.getDialog() !== null)
	{
		this.getDialog().setWidth(length);
	}
};
oFF.UtFormPopup.prototype.setupFormPopup = function(genesis, title, submitConsumer)
{
	this.m_title = title;
	this.m_submitConsumer = submitConsumer;
	this.setupPopup(genesis);
};
oFF.UtFormPopup.prototype.submit = function()
{
	this._submitFormInternal();
};
oFF.UtFormPopup.prototype.validate = function()
{
	this.m_form.validate();
};

oFF.UtAiChatView = function() {};
oFF.UtAiChatView.prototype = new oFF.DfUiView();
oFF.UtAiChatView.prototype._ff_c = "UtAiChatView";

oFF.UtAiChatView.DEFAULT_ASSISTANT_NAME = "assistant";
oFF.UtAiChatView.DEFAULT_USER_NAME = "user";
oFF.UtAiChatView.SCROLL_TIME_MS = 100;
oFF.UtAiChatView.create = function()
{
	let newView = new oFF.UtAiChatView();
	newView._setupInternal();
	return newView;
};
oFF.UtAiChatView.prototype.m_assistantName = null;
oFF.UtAiChatView.prototype.m_criticalErrorMessage = null;
oFF.UtAiChatView.prototype.m_currentAssistantMessage = null;
oFF.UtAiChatView.prototype.m_executePromptBtn = null;
oFF.UtAiChatView.prototype.m_isPromptExecutionEnabled = false;
oFF.UtAiChatView.prototype.m_messagesContainer = null;
oFF.UtAiChatView.prototype.m_messagesScrollContainer = null;
oFF.UtAiChatView.prototype.m_promptConsumer = null;
oFF.UtAiChatView.prototype.m_promptContainer = null;
oFF.UtAiChatView.prototype.m_promptTextArea = null;
oFF.UtAiChatView.prototype.m_userName = null;
oFF.UtAiChatView.prototype._disablePromptExecution = function()
{
	this.m_executePromptBtn.setEnabled(false);
	this.m_isPromptExecutionEnabled = false;
};
oFF.UtAiChatView.prototype._enablePromptExecution = function()
{
	this.m_executePromptBtn.setEnabled(true);
	this.m_isPromptExecutionEnabled = true;
};
oFF.UtAiChatView.prototype._executePrompt = function(controlEvent)
{
	let promptText = this.m_promptTextArea.getValue();
	if (this.m_isPromptExecutionEnabled && oFF.XStringUtils.isNotNullAndNotEmpty(promptText))
	{
		this.m_promptTextArea.setValue("");
		this.addUserMessage(promptText);
		this._showEmptyAssistantResponseMessage();
		this._disablePromptExecution();
		this._notifyPromptConsumerIfNeeded(promptText);
	}
};
oFF.UtAiChatView.prototype._getAssistantName = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_assistantName))
	{
		return this.m_assistantName;
	}
	return oFF.UtAiChatView.DEFAULT_ASSISTANT_NAME;
};
oFF.UtAiChatView.prototype._getUserName = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_userName))
	{
		return this.m_userName;
	}
	return oFF.UtAiChatView.DEFAULT_USER_NAME;
};
oFF.UtAiChatView.prototype._notifyPromptConsumerIfNeeded = function(prompt)
{
	if (oFF.notNull(this.m_promptConsumer) && oFF.XStringUtils.isNotNullAndNotEmpty(prompt))
	{
		this.m_promptConsumer(prompt);
	}
};
oFF.UtAiChatView.prototype._scrollToEnd = function()
{
	this.m_messagesScrollContainer.scrollTo(0, 10000, oFF.UtAiChatView.SCROLL_TIME_MS);
};
oFF.UtAiChatView.prototype._setupInternal = function() {};
oFF.UtAiChatView.prototype._showCriticalErrorMessageIfPossible = function(errorMsg)
{
	if (this.getView() !== null)
	{
		this.getView().clearItems();
		let messageStrip = this.getView().addNewItemOfType(oFF.UiType.MESSAGE_STRIP);
		messageStrip.setMessageType(oFF.UiMessageType.ERROR);
		messageStrip.setText(errorMsg);
	}
};
oFF.UtAiChatView.prototype._showEmptyAssistantResponseMessage = function()
{
	this.m_currentAssistantMessage = oFF.UtAiChatMessageView._createAssistantMessage(this._getAssistantName());
	this._showMessage(this.m_currentAssistantMessage);
};
oFF.UtAiChatView.prototype._showMessage = function(messageView)
{
	if (oFF.notNull(messageView) && oFF.notNull(this.m_messagesContainer))
	{
		this.m_messagesContainer.addItem(messageView.renderView(this.getGenesis()));
		this._scrollToEnd();
	}
};
oFF.UtAiChatView.prototype.addAssistantErrorMessage = function(assistanErrortMsg)
{
	let assistantMsgView = oFF.UtAiChatMessageView._createAssistantMessage(this._getAssistantName());
	assistantMsgView.setErrorMessage(assistanErrortMsg);
	this._showMessage(assistantMsgView);
};
oFF.UtAiChatView.prototype.addAssistantMessage = function(assistantMsg)
{
	let assistantMsgView = oFF.UtAiChatMessageView._createAssistantMessage(this._getAssistantName());
	assistantMsgView.setMessage(assistantMsg);
	this._showMessage(assistantMsgView);
};
oFF.UtAiChatView.prototype.addUserMessage = function(userMsg)
{
	let userMsgView = oFF.UtAiChatMessageView._createUserMessage(this._getUserName());
	userMsgView.setMessage(userMsg);
	this._showMessage(userMsgView);
};
oFF.UtAiChatView.prototype.destroyView = function()
{
	this.m_promptConsumer = null;
	this.m_currentAssistantMessage = null;
	this.m_executePromptBtn = oFF.XObjectExt.release(this.m_executePromptBtn);
	this.m_promptTextArea = oFF.XObjectExt.release(this.m_promptTextArea);
	this.m_promptContainer = oFF.XObjectExt.release(this.m_promptContainer);
	this.m_messagesContainer = oFF.XObjectExt.release(this.m_messagesContainer);
	this.m_messagesScrollContainer = oFF.XObjectExt.release(this.m_messagesScrollContainer);
};
oFF.UtAiChatView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.UtAiChatView.prototype.layoutView = function(viewControl)
{
	viewControl.useMaxSpace();
	viewControl.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
	viewControl.setDirection(oFF.UiFlexDirection.COLUMN);
	viewControl.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	if (oFF.XStringUtils.isNullOrEmpty(this.m_criticalErrorMessage))
	{
		this.m_messagesScrollContainer = viewControl.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
		this.m_messagesScrollContainer.setMaxWidth(oFF.UiCssLength.create("54rem"));
		this.m_messagesScrollContainer.setHeight(oFF.UiCssLength.create("auto"));
		this.m_messagesScrollContainer.setFlex("100%");
		this.m_messagesScrollContainer.setWidth(oFF.UiCssLength.create("100%"));
		this.m_messagesContainer = this.m_messagesScrollContainer.setNewContent(oFF.UiType.FLEX_LAYOUT);
		this.m_messagesContainer.setHeight(oFF.UiCssLength.create("auto"));
		this.m_messagesContainer.useMaxWidth();
		this.m_messagesContainer.setDirection(oFF.UiFlexDirection.COLUMN);
		this.m_promptContainer = viewControl.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
		this.m_promptContainer.setMaxWidth(oFF.UiCssLength.create("54rem"));
		this.m_promptContainer.setHeight(oFF.UiCssLength.create("auto"));
		this.m_promptContainer.setWidth(oFF.UiCssLength.create("100%"));
		this.m_promptContainer.setDirection(oFF.UiFlexDirection.ROW);
		this.m_promptContainer.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		this.m_promptContainer.setMargin(oFF.UiCssBoxEdges.create("0.5rem 0 0 0"));
		this.m_promptTextArea = this.m_promptContainer.addNewItemOfType(oFF.UiType.TEXT_AREA);
		this.m_promptTextArea.useMaxWidth();
		this.m_promptTextArea.setPlaceholder("Ask a question");
		this.m_promptTextArea.setRowCount(1);
		this.m_promptTextArea.setGrowing(true);
		this.m_promptTextArea.setMaxLines(6);
		this.m_promptTextArea.registerOnEnter(oFF.UiLambdaEnterListener.create(this._executePrompt.bind(this)));
		this.m_executePromptBtn = this.m_promptContainer.addNewItemOfType(oFF.UiType.BUTTON);
		this.m_executePromptBtn.setIcon("paper-plane");
		this.m_executePromptBtn.setButtonType(oFF.UiButtonType.PRIMARY);
		this.m_executePromptBtn.registerOnPress(oFF.UiLambdaPressListener.create(this._executePrompt.bind(this)));
	}
	else
	{
		this._showCriticalErrorMessageIfPossible(this.m_criticalErrorMessage);
	}
};
oFF.UtAiChatView.prototype.setAssistantErrorResponse = function(assistantErrorResponse)
{
	if (oFF.notNull(this.m_currentAssistantMessage))
	{
		this.m_currentAssistantMessage.setErrorMessage(assistantErrorResponse);
		this.m_currentAssistantMessage = null;
		this._scrollToEnd();
		this._enablePromptExecution();
	}
};
oFF.UtAiChatView.prototype.setAssistantName = function(assistatnName)
{
	this.m_assistantName = assistatnName;
};
oFF.UtAiChatView.prototype.setAssistantResponse = function(assistantResponse)
{
	if (oFF.notNull(this.m_currentAssistantMessage))
	{
		this.m_currentAssistantMessage.setMessage(assistantResponse);
		this.m_currentAssistantMessage = null;
		this._scrollToEnd();
		this._enablePromptExecution();
	}
};
oFF.UtAiChatView.prototype.setAssistantResponseAnimated = function(assistantResponse)
{
	this.m_currentAssistantMessage.setMessageAnimated(assistantResponse, () => {
		this._scrollToEnd();
	}).onFinally(() => {
		this._enablePromptExecution();
	});
	this.m_currentAssistantMessage = null;
	this._scrollToEnd();
};
oFF.UtAiChatView.prototype.setPromptConsumer = function(consumer)
{
	this.m_promptConsumer = consumer;
};
oFF.UtAiChatView.prototype.setUserName = function(userName)
{
	this.m_userName = userName;
};
oFF.UtAiChatView.prototype.setupView = function()
{
	this.m_isPromptExecutionEnabled = true;
};
oFF.UtAiChatView.prototype.showCriticalErrorMessage = function(errorMsg)
{
	this.m_criticalErrorMessage = errorMsg;
	this._showCriticalErrorMessageIfPossible(errorMsg);
};

oFF.UtAiChatMessageView = function() {};
oFF.UtAiChatMessageView.prototype = new oFF.DfUiView();
oFF.UtAiChatMessageView.prototype._ff_c = "UtAiChatMessageView";

oFF.UtAiChatMessageView.MESSAGE_ANIM_TIME_MS = 10;
oFF.UtAiChatMessageView._createAssistantMessage = function(participantName)
{
	let newView = new oFF.UtAiChatMessageView();
	newView._setupInternal(participantName, true);
	return newView;
};
oFF.UtAiChatMessageView._createUserMessage = function(participantName)
{
	let newView = new oFF.UtAiChatMessageView();
	newView._setupInternal(participantName, false);
	return newView;
};
oFF.UtAiChatMessageView.prototype.m_errorMessageStrip = null;
oFF.UtAiChatMessageView.prototype.m_isAssistant = false;
oFF.UtAiChatMessageView.prototype.m_isError = false;
oFF.UtAiChatMessageView.prototype.m_message = null;
oFF.UtAiChatMessageView.prototype.m_messageAnimCancelProcedure = null;
oFF.UtAiChatMessageView.prototype.m_messageText = null;
oFF.UtAiChatMessageView.prototype.m_participantName = null;
oFF.UtAiChatMessageView.prototype._animateResponseMessage = function(message, scrollProcedure)
{
	this.m_messageText.setText("");
	let animIntervalId = oFF.XStringValue.create("");
	let animationPromise = oFF.XPromise.create((resolve, reject) => {
		this.m_messageAnimCancelProcedure = () => {
			oFF.XTimeout.clear(animIntervalId.getString());
			this.m_messageText.setText(message);
			if (oFF.notNull(scrollProcedure))
			{
				scrollProcedure();
			}
			this.m_messageAnimCancelProcedure = null;
			resolve(oFF.XBooleanValue.create(true));
		};
		let messageSize = oFF.XString.size(message);
		let intervalIdStr = oFF.XTimeout.interval(oFF.UtAiChatMessageView.MESSAGE_ANIM_TIME_MS, () => {
			let curIndex = this.m_messageText.getText() === null ? 0 : oFF.XString.size(this.m_messageText.getText());
			this.m_messageText.setText(oFF.XString.substring(message, 0, curIndex + 1));
			if (oFF.notNull(scrollProcedure))
			{
				scrollProcedure();
			}
			if (curIndex + 1 === messageSize)
			{
				this.m_messageAnimCancelProcedure = null;
				oFF.XTimeout.clear(animIntervalId.getString());
				resolve(oFF.XBooleanValue.create(true));
			}
		});
		animIntervalId.setString(intervalIdStr);
	});
	return animationPromise;
};
oFF.UtAiChatMessageView.prototype._renderMessageControlIfNeeded = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_message))
	{
		if (!this.m_isError)
		{
			this._showTextControl();
		}
		else
		{
			this._showMessageStripControl();
		}
		if (this.getView() !== null)
		{
			this.getView().setBusy(false);
		}
	}
};
oFF.UtAiChatMessageView.prototype._setupInternal = function(participantName, isAssistant)
{
	this.m_participantName = participantName;
	this.m_isAssistant = isAssistant;
};
oFF.UtAiChatMessageView.prototype._showMessageStripControl = function()
{
	if (this.getView() !== null && oFF.isNull(this.m_messageText))
	{
		this.m_errorMessageStrip = this.getView().addNewItemOfType(oFF.UiType.MESSAGE_STRIP);
		this.m_errorMessageStrip.setMessageType(oFF.UiMessageType.ERROR);
		this.m_errorMessageStrip.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
		this.m_errorMessageStrip.setText(this.m_message);
	}
};
oFF.UtAiChatMessageView.prototype._showTextControl = function()
{
	if (this.getView() !== null && oFF.isNull(this.m_errorMessageStrip))
	{
		this.m_messageText = this.getView().addNewItemOfType(oFF.UiType.TEXT);
		this.m_messageText.setWrapping(true);
		this.m_messageText.setFontWeight(oFF.UiFontWeight.BOLDER);
		this.m_messageText.setText(this.m_message);
	}
};
oFF.UtAiChatMessageView.prototype.destroyView = function()
{
	if (oFF.notNull(this.m_messageAnimCancelProcedure))
	{
		this.m_messageAnimCancelProcedure();
	}
	this.m_messageAnimCancelProcedure = null;
	this.m_messageText = oFF.XObjectExt.release(this.m_messageText);
	this.m_errorMessageStrip = oFF.XObjectExt.release(this.m_errorMessageStrip);
};
oFF.UtAiChatMessageView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.UtAiChatMessageView.prototype.layoutView = function(viewControl)
{
	viewControl.setDirection(oFF.UiFlexDirection.COLUMN);
	viewControl.setAlignItems(oFF.UiFlexAlignItems.START);
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	viewControl.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
	viewControl.setBorderWidth(oFF.UiCssBoxEdges.create("0 0 1px 0"));
	viewControl.setBorderStyle(oFF.UiBorderStyle.SOLID);
	viewControl.setBorderColor(oFF.UiColor.BLACK.newColorWithAlpha(0.4));
	viewControl.addCssClass("ffAiChatMessageContainer");
	viewControl.addCssClass(this.m_isAssistant ? "ffAiChatAssistantMessage" : "ffAiChatUserMessage");
	viewControl.setBusyDelay(0);
	viewControl.setBusy(this.m_isAssistant);
	let titleWrapper = viewControl.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	titleWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	titleWrapper.setMargin(oFF.UiCssBoxEdges.create("0 0 0.5rem 0"));
	let participantAvatar = titleWrapper.addNewItemOfType(oFF.UiType.AVATAR);
	participantAvatar.setAvatarShape(oFF.UiAvatarShape.CIRCLE);
	participantAvatar.setAvatarSize(oFF.UiAvatarSize.CUSTOM);
	participantAvatar.setDisplaySize(oFF.UiCssLength.create("1.5rem"));
	participantAvatar.setFontSize(oFF.UiCssLength.create("0.875rem"));
	participantAvatar.setMargin(oFF.UiCssBoxEdges.create("0 0.5rem 0 0"));
	if (this.m_isAssistant)
	{
		participantAvatar.setIcon("machine");
		participantAvatar.setAvatarColor(oFF.UiAvatarColor.ACCENT_9);
	}
	else
	{
		participantAvatar.setIcon("person-placeholder");
		participantAvatar.setAvatarColor(oFF.UiAvatarColor.ACCENT_6);
	}
	let participantNameTitle = titleWrapper.addNewItemOfType(oFF.UiType.TITLE);
	participantNameTitle.setWrapping(false);
	participantNameTitle.setTitleLevel(oFF.UiTitleLevel.H_6);
	participantNameTitle.setTitleStyle(oFF.UiTitleLevel.H_6);
	participantNameTitle.setText(this.m_participantName);
	this._renderMessageControlIfNeeded();
};
oFF.UtAiChatMessageView.prototype.setErrorMessage = function(errorMsgStr)
{
	this.m_isError = true;
	this.m_message = oFF.XString.trim(errorMsgStr);
	this._renderMessageControlIfNeeded();
};
oFF.UtAiChatMessageView.prototype.setMessage = function(msgStr)
{
	this.m_isError = false;
	this.m_message = oFF.XString.trim(msgStr);
	this._renderMessageControlIfNeeded();
};
oFF.UtAiChatMessageView.prototype.setMessageAnimated = function(msgStr, scrollProcedure)
{
	this.setMessage(msgStr);
	return this._animateResponseMessage(msgStr, scrollProcedure);
};
oFF.UtAiChatMessageView.prototype.setupView = function() {};

oFF.UtBulletPointListView = function() {};
oFF.UtBulletPointListView.prototype = new oFF.DfUiView();
oFF.UtBulletPointListView.prototype._ff_c = "UtBulletPointListView";

oFF.UtBulletPointListView.create = function(genesis, listItems)
{
	let obj = new oFF.UtBulletPointListView();
	obj.setupInternal(genesis, listItems);
	return obj;
};
oFF.UtBulletPointListView.prototype.m_htmlContent = "";
oFF.UtBulletPointListView.prototype.createBulletPointElement = function(bulletPointText)
{
	return oFF.XStringUtils.concatenate3("<li>", bulletPointText, "</li>");
};
oFF.UtBulletPointListView.prototype.createListFromListItemElements = function(listItemElements)
{
	return oFF.XStringUtils.concatenate3("<ul>", listItemElements, "</ul>");
};
oFF.UtBulletPointListView.prototype.destroyView = function() {};
oFF.UtBulletPointListView.prototype.generateList = function(bulletPoints)
{
	if (oFF.notNull(bulletPoints))
	{
		for (let i = 0; i < bulletPoints.size(); i++)
		{
			this.m_htmlContent = oFF.XStringUtils.concatenate2(this.m_htmlContent, this.createBulletPointElement(bulletPoints.get(i)));
		}
	}
	this.m_htmlContent = this.createListFromListItemElements(this.m_htmlContent);
};
oFF.UtBulletPointListView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FORMATTED_TEXT);
};
oFF.UtBulletPointListView.prototype.layoutView = function(viewControl)
{
	viewControl.setText(this.m_htmlContent);
	viewControl.useMaxSpace();
};
oFF.UtBulletPointListView.prototype.setBulletPoints = function(listItems)
{
	this.generateList(listItems);
};
oFF.UtBulletPointListView.prototype.setupInternal = function(genesis, listItems)
{
	this.generateList(listItems);
	oFF.DfUiView.prototype.initView.call( this , genesis);
};
oFF.UtBulletPointListView.prototype.setupView = function() {};

oFF.UtPanelListView = function() {};
oFF.UtPanelListView.prototype = new oFF.DfUiView();
oFF.UtPanelListView.prototype._ff_c = "UtPanelListView";

oFF.UtPanelListView.create = function(genesis)
{
	let obj = new oFF.UtPanelListView();
	obj.initView(genesis);
	return obj;
};
oFF.UtPanelListView.prototype.m_headerToolbar = null;
oFF.UtPanelListView.prototype.m_list = null;
oFF.UtPanelListView.prototype.m_root = null;
oFF.UtPanelListView.prototype.activateList = function()
{
	if (oFF.isNull(this.m_list))
	{
		this.m_root.setExpandable(true);
		this.m_list = this.m_root.setNewContent(oFF.UiType.LIST);
	}
	return this.m_list;
};
oFF.UtPanelListView.prototype.addNewPanelListItem = function()
{
	let listItem = this.getGenesis().newControl(oFF.UiType.CUSTOM_LIST_ITEM);
	let panelList = oFF.UtPanelListView.create(this.getGenesis());
	listItem.setContent(panelList.getView());
	this.activateList().addItem(listItem);
	return panelList;
};
oFF.UtPanelListView.prototype.destroyView = function()
{
	this.m_list = null;
	this.m_headerToolbar = null;
	this.m_root = null;
};
oFF.UtPanelListView.prototype.getHeaderToolbar = function()
{
	return this.m_headerToolbar;
};
oFF.UtPanelListView.prototype.getList = function()
{
	return this.m_list;
};
oFF.UtPanelListView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.PANEL);
};
oFF.UtPanelListView.prototype.layoutView = function(viewControl)
{
	this.m_root = viewControl;
	this.m_root.setBackgroundDesign(oFF.UiBackgroundDesign.TRANSPARENT);
	this.m_headerToolbar = this.m_root.setNewHeaderToolbar();
	this.m_headerToolbar.useMaxWidth();
};
oFF.UtPanelListView.prototype.setupView = function() {};

oFF.UtSearchableListView = function() {};
oFF.UtSearchableListView.prototype = new oFF.DfUiView();
oFF.UtSearchableListView.prototype._ff_c = "UtSearchableListView";

oFF.UtSearchableListView.create = function(genesis, initialListItems)
{
	let newSearchableList = new oFF.UtSearchableListView();
	newSearchableList.setupInternal(genesis, initialListItems);
	return newSearchableList;
};
oFF.UtSearchableListView.prototype.m_allListItems = null;
oFF.UtSearchableListView.prototype.m_filterSection = null;
oFF.UtSearchableListView.prototype.m_list = null;
oFF.UtSearchableListView.prototype.m_listChangedConsumer = null;
oFF.UtSearchableListView.prototype.m_listItemSelectedConsumer = null;
oFF.UtSearchableListView.prototype.m_searchInput = null;
oFF.UtSearchableListView.prototype._fillList = function(listItems)
{
	if (oFF.notNull(this.m_list))
	{
		this.m_list.clearItems();
		this.m_searchInput.setValue("");
		this.m_allListItems.clear();
		if (oFF.notNull(listItems) && listItems.hasElements())
		{
			oFF.XCollectionUtils.forEach(listItems, (listItem) => {
				this.m_list.addItem(listItem);
				this.m_allListItems.add(listItem);
			});
		}
	}
};
oFF.UtSearchableListView.prototype._filterList = function(searchText, clearButtonPressed)
{
	this.m_list.clearItems();
	if (!clearButtonPressed)
	{
		for (let a = 0; a < this.m_allListItems.size(); a++)
		{
			let tmpListItem = this.m_allListItems.get(a);
			if (oFF.XString.containsString(oFF.XString.toLowerCase(tmpListItem.getText()), oFF.XString.toLowerCase(searchText)))
			{
				this.m_list.addItem(tmpListItem);
			}
		}
	}
	else
	{
		oFF.XCollectionUtils.forEach(this.m_allListItems, (listItem) => {
			this.m_list.addItem(listItem);
		});
	}
	if (oFF.notNull(this.m_listChangedConsumer))
	{
		this.m_listChangedConsumer(this.m_allListItems);
	}
};
oFF.UtSearchableListView.prototype._handleSearch = function(controlEvent)
{
	if (oFF.notNull(controlEvent))
	{
		let didPressClearButton = controlEvent.getParameters().getBooleanByKeyExt(oFF.UiEventParams.PARAM_CLEAR_BUTTON_PRESSED, false);
		let searchText = controlEvent.getParameters().getStringByKeyExt(oFF.UiEventParams.PARAM_SEARCH_TEXT, "");
		this._filterList(searchText, didPressClearButton);
	}
};
oFF.UtSearchableListView.prototype._handleSelect = function(event)
{
	if (oFF.notNull(event))
	{
		let selectedListItem = event.getSelectedItem();
		this.selectItem(selectedListItem);
		if (oFF.notNull(selectedListItem) && oFF.notNull(this.m_listItemSelectedConsumer))
		{
			this.m_listItemSelectedConsumer(selectedListItem);
		}
	}
};
oFF.UtSearchableListView.prototype.addFilterDropdown = function(dropdownItems, selectedItem, selectConsumer)
{
	if (oFF.notNull(this.m_filterSection))
	{
		let tmpDropdown = this.m_filterSection.addNewItemOfType(oFF.UiType.DROPDOWN);
		tmpDropdown.setMargin(oFF.UiCssBoxEdges.create("0 0 0.25rem 0"));
		tmpDropdown.setFlex("0 0 auto");
		oFF.XCollectionUtils.forEach(dropdownItems, (ddItem) => {
			tmpDropdown.addItem(ddItem);
		});
		tmpDropdown.setSelectedItem(selectedItem);
		tmpDropdown.registerOnSelect(oFF.UiLambdaSelectListener.create((selectionEvent) => {
			if (oFF.notNull(selectConsumer))
			{
				selectConsumer(selectionEvent.getSelectedItem());
			}
			if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_searchInput.getValue()))
			{
				this._filterList(this.m_searchInput.getValue(), false);
			}
		}));
		this.m_filterSection.setVisible(true);
		return tmpDropdown;
	}
	return null;
};
oFF.UtSearchableListView.prototype.destroyView = function()
{
	this.m_filterSection = oFF.XObjectExt.release(this.m_filterSection);
	this.m_list = oFF.XObjectExt.release(this.m_list);
	this.m_searchInput = oFF.XObjectExt.release(this.m_searchInput);
	this.m_allListItems = oFF.XObjectExt.release(this.m_allListItems);
	this.m_listChangedConsumer = null;
	this.m_listItemSelectedConsumer = null;
};
oFF.UtSearchableListView.prototype.getListItems = function()
{
	let tmpList = oFF.XList.create();
	oFF.XCollectionUtils.forEach(this.m_list.getItems(), (tmpItem) => {
		tmpList.add(tmpItem);
	});
	return tmpList;
};
oFF.UtSearchableListView.prototype.getSearchText = function()
{
	if (oFF.notNull(this.m_searchInput))
	{
		return this.m_searchInput.getValue();
	}
	return null;
};
oFF.UtSearchableListView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.UtSearchableListView.prototype.layoutView = function(viewControl)
{
	viewControl.setDirection(oFF.UiFlexDirection.COLUMN);
	viewControl.setHeight(oFF.UiCssLength.create("100%"));
	viewControl.setMaxWidth(oFF.UiCssLength.create("300px"));
	viewControl.setMinWidth(oFF.UiCssLength.create("150px"));
	viewControl.setFlex("0 1 300px ");
	this.m_searchInput = viewControl.addNewItemOfType(oFF.UiType.SEARCH_FIELD);
	this.m_searchInput.setPlaceholder("Search...");
	this.m_searchInput.setPadding(oFF.UiCssBoxEdges.create("0.25rem"));
	this.m_searchInput.setMargin(oFF.UiCssBoxEdges.create("0 0 0.25rem 0"));
	this.m_searchInput.setFlex("0 0 auto");
	this.m_searchInput.registerOnSearch(oFF.UiLambdaSearchListener.create((controlEvent) => {
		this._handleSearch(controlEvent);
	}));
	this.m_searchInput.registerOnLiveChange(oFF.UiLambdaLiveChangeWithDebounceListener.create((controlEven2) => {
		this._filterList(this.m_searchInput.getValue(), false);
	}, 1000));
	this.m_filterSection = viewControl.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_filterSection.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_filterSection.setMargin(oFF.UiCssBoxEdges.create("0 0.25rem 0.25rem 0.25rem"));
	this.m_filterSection.setFlex("0 0 auto");
	this.m_filterSection.setVisible(false);
	let listScrollContainer = viewControl.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
	listScrollContainer.useMaxWidth();
	this.m_list = listScrollContainer.setNewContent(oFF.UiType.LIST);
	this.m_list.useMaxSpace();
	this.m_list.registerOnSelect(oFF.UiLambdaSelectListener.create((selectEvent) => {
		this._handleSelect(selectEvent);
	}));
	this.m_list.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT_MASTER);
};
oFF.UtSearchableListView.prototype.scrollToItem = function(listItem)
{
	if (oFF.notNull(this.m_list) && this.m_list.hasItems())
	{
		let indexToSelect = this.m_list.getIndexOfItem(listItem);
		if (indexToSelect !== -1)
		{
			this.m_list.scrollToIndex(indexToSelect);
		}
	}
};
oFF.UtSearchableListView.prototype.scrollToItemByName = function(itemName)
{
	if (oFF.notNull(this.m_list) && this.m_list.hasItems())
	{
		let listItem = this.m_list.getItemByName(itemName);
		this.scrollToItem(listItem);
	}
};
oFF.UtSearchableListView.prototype.search = function(searchText)
{
	this._filterList(searchText, false);
	if (oFF.notNull(this.m_searchInput))
	{
		this.m_searchInput.setValue(searchText);
	}
};
oFF.UtSearchableListView.prototype.selectItem = function(listItem)
{
	if (oFF.notNull(this.m_list) && this.m_list.hasItems())
	{
		this.m_list.clearSelectedItems();
		let indexToSelect = this.m_list.getIndexOfItem(listItem);
		if (indexToSelect !== -1)
		{
			this.m_list.setSelectedItem(listItem);
		}
	}
};
oFF.UtSearchableListView.prototype.selectItemByName = function(itemName)
{
	if (oFF.notNull(this.m_list) && this.m_list.hasItems())
	{
		let listItem = this.m_list.getItemByName(itemName);
		this.selectItem(listItem);
	}
};
oFF.UtSearchableListView.prototype.setListChangdConsumer = function(consumer)
{
	this.m_listChangedConsumer = consumer;
};
oFF.UtSearchableListView.prototype.setListItemSelectedConsumer = function(consumer)
{
	this.m_listItemSelectedConsumer = consumer;
};
oFF.UtSearchableListView.prototype.setListItems = function(listItems)
{
	this._fillList(listItems);
};
oFF.UtSearchableListView.prototype.setListSelectionMode = function(mode)
{
	this.m_list.setSelectionMode(mode);
};
oFF.UtSearchableListView.prototype.setSearchFieldPlaceholder = function(placeholder)
{
	if (oFF.notNull(this.m_searchInput))
	{
		this.m_searchInput.setPlaceholder(placeholder);
	}
};
oFF.UtSearchableListView.prototype.setupInternal = function(genesis, initialListItems)
{
	oFF.DfUiView.prototype.initView.call( this , genesis);
	this._fillList(initialListItems);
};
oFF.UtSearchableListView.prototype.setupView = function()
{
	this.m_allListItems = oFF.XList.create();
};

oFF.UtSettingsView = function() {};
oFF.UtSettingsView.prototype = new oFF.DfUiView();
oFF.UtSettingsView.prototype._ff_c = "UtSettingsView";

oFF.UtSettingsView.INVALID_DATA_MSG = "Some of the properties contain invalid data! Cannot save!";
oFF.UtSettingsView.OTHER_ICON_PATH = "${ff_mimes}/images/settingsdialog/genericconfiguration.png";
oFF.UtSettingsView.PLUGIN_ICON_PATH = "${ff_mimes}/images/settingsdialog/plugin.png";
oFF.UtSettingsView.UNKNOWN_ICON_PATH = "${ff_mimes}/images/settingsdialog/unknown.png";
oFF.UtSettingsView.create = function(process)
{
	let newView = new oFF.UtSettingsView();
	newView._setupInternal(process);
	return newView;
};
oFF.UtSettingsView.prototype.m_activeConfigurationLayer = null;
oFF.UtSettingsView.prototype.m_activeProfile = null;
oFF.UtSettingsView.prototype.m_configuration = null;
oFF.UtSettingsView.prototype.m_configurationContainer = null;
oFF.UtSettingsView.prototype.m_configurationName = null;
oFF.UtSettingsView.prototype.m_configurationNames = null;
oFF.UtSettingsView.prototype.m_configurationType = null;
oFF.UtSettingsView.prototype.m_currentConfiguration = null;
oFF.UtSettingsView.prototype.m_currentConfigurationMetadata = null;
oFF.UtSettingsView.prototype.m_isUserMode = false;
oFF.UtSettingsView.prototype.m_layerDropdown = null;
oFF.UtSettingsView.prototype.m_process = null;
oFF.UtSettingsView.prototype.m_profileDropdown = null;
oFF.UtSettingsView.prototype.m_searchableListView = null;
oFF.UtSettingsView.prototype.m_settingsContainer = null;
oFF.UtSettingsView.prototype.m_settingsForm = null;
oFF.UtSettingsView.prototype.m_settingsTitle = null;
oFF.UtSettingsView.prototype._addNewProfileEntry = function(profileName)
{
	if (oFF.notNull(this.m_profileDropdown) && this.m_profileDropdown.getItemByName(profileName) === null)
	{
		let newProfile = this.m_profileDropdown.addNewItem();
		newProfile.setText(profileName);
		newProfile.setName(profileName);
		this.m_profileDropdown.setSelectedItem(newProfile);
		this._enableDisableProfileDropdown();
	}
};
oFF.UtSettingsView.prototype._changeActiveConfigurationLayer = function(newLayer)
{
	if (oFF.notNull(newLayer) && this.m_activeConfigurationLayer !== newLayer)
	{
		this.m_activeConfigurationLayer = newLayer;
		this._reloadCurrentConfiguration();
	}
};
oFF.UtSettingsView.prototype._createAndShowMessageStrip = function()
{
	let msgStrip = null;
	if (oFF.notNull(this.m_configurationContainer))
	{
		this.m_configurationContainer.clearItems();
		this.m_configurationContainer.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		this.m_configurationContainer.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
		msgStrip = this.m_configurationContainer.addNewItemOfType(oFF.UiType.MESSAGE_STRIP);
	}
	return msgStrip;
};
oFF.UtSettingsView.prototype._enableDisableProfileDropdown = function()
{
	if (oFF.notNull(this.m_profileDropdown))
	{
		this.m_profileDropdown.setEnabled(this.m_profileDropdown.getItems().size() > 0);
	}
};
oFF.UtSettingsView.prototype._fillConfigurationList = function(configurationNames)
{
	if (oFF.notNull(this.m_searchableListView))
	{
		let itemList = oFF.XList.create();
		oFF.XCollectionUtils.forEach(configurationNames, (configurationName) => {
			let tmpConfigMetadata = oFF.CoConfigurationRegistry.getConfigurationMetadata(configurationName);
			if (oFF.notNull(tmpConfigMetadata) && this._hasNonHiddenProperties(tmpConfigMetadata))
			{
				let newListItem = this.getGenesis().newControl(oFF.UiType.LIST_ITEM);
				newListItem.setName(tmpConfigMetadata.getName());
				newListItem.setCustomObject(tmpConfigMetadata);
				newListItem.setText(tmpConfigMetadata.getTitle());
				newListItem.setTooltip(tmpConfigMetadata.getName());
				newListItem.setDescription(tmpConfigMetadata.getDescription());
				newListItem.setIcon(this._getResolvedIconPath(tmpConfigMetadata));
				itemList.add(newListItem);
			}
		});
		if (oFF.notNull(itemList))
		{
			this.m_searchableListView.setListItems(itemList);
		}
	}
};
oFF.UtSettingsView.prototype._fillConfigurationListByType = function(configurationType)
{
	let allConfigurationNames = oFF.CoConfigurationRegistry.getAllRegisteredConfigNames();
	let configurationsToShow = oFF.XList.create();
	oFF.XCollectionUtils.forEach(allConfigurationNames, (configurationName) => {
		let tmpConfigMetadata = oFF.CoConfigurationRegistry.getConfigurationMetadata(configurationName);
		if (oFF.notNull(tmpConfigMetadata) && (oFF.isNull(configurationType) || configurationType === tmpConfigMetadata.getConfigurationType()))
		{
			configurationsToShow.add(configurationName);
		}
	});
	this._fillConfigurationList(configurationsToShow);
};
oFF.UtSettingsView.prototype._fillLayerDropdown = function()
{
	if (oFF.notNull(this.m_layerDropdown))
	{
		let userItem = this.m_layerDropdown.addNewItem();
		userItem.setText(oFF.CoConfigurationLayer.USER.getName());
		userItem.setCustomObject(oFF.CoConfigurationLayer.USER);
		let adminItem = this.m_layerDropdown.addNewItem();
		adminItem.setText(oFF.CoConfigurationLayer.ADMIN.getName());
		adminItem.setCustomObject(oFF.CoConfigurationLayer.ADMIN);
		let platformItem = this.m_layerDropdown.addNewItem();
		platformItem.setText(oFF.CoConfigurationLayer.PLATFORM.getName());
		platformItem.setCustomObject(oFF.CoConfigurationLayer.PLATFORM);
		this.m_layerDropdown.setSelectedItem(userItem);
	}
};
oFF.UtSettingsView.prototype._fillProfileDropdown = function(listOfProfiles)
{
	if (oFF.notNull(this.m_profileDropdown))
	{
		this.m_profileDropdown.clearItems();
		oFF.XCollectionUtils.forEach(listOfProfiles, (profileName) => {
			let tmpProfileItem = this.m_profileDropdown.addNewItem();
			tmpProfileItem.setText(profileName);
			tmpProfileItem.setName(profileName);
		});
		this.m_profileDropdown.setSelectedName(oFF.CoConfigurationConstants.DEFAULT_PROFILE_NAME);
		this._enableDisableProfileDropdown();
	}
};
oFF.UtSettingsView.prototype._getChoicesMap = function(choicesList)
{
	if (oFF.notNull(choicesList) && choicesList.hasElements())
	{
		let tmpStrMap = oFF.XHashMapByString.create();
		oFF.XCollectionUtils.forEach(choicesList, (choice) => {
			let choiceStr = choice.asString().getString();
			tmpStrMap.put(choiceStr, choiceStr);
		});
		return tmpStrMap;
	}
	return null;
};
oFF.UtSettingsView.prototype._getConfigurationTitle = function(configuration)
{
	let friendlyName = null;
	if (oFF.notNull(configuration))
	{
		friendlyName = configuration.getTitle();
		if (oFF.XStringUtils.isNullOrEmpty(friendlyName))
		{
			friendlyName = configuration.getName();
		}
	}
	return friendlyName;
};
oFF.UtSettingsView.prototype._getCustomValidatorIfNeeded = function(propMetadata, formItem)
{
	if (oFF.notNull(propMetadata) && oFF.notNull(formItem))
	{
		let errorList = propMetadata.validate(oFF.PrUtils.createByValue(formItem.getValue()));
		if (oFF.notNull(errorList) && errorList.hasElements())
		{
			formItem.setInvalid(errorList.get(0).getText());
		}
		else
		{
			formItem.setValid();
		}
	}
};
oFF.UtSettingsView.prototype._getDirtyJsonModel = function()
{
	let currentFormStruct = this.m_settingsForm.getJsonModel();
	let dirtyStruct = oFF.PrFactory.createStructure();
	oFF.XCollectionUtils.forEach(this.m_currentConfiguration.getAllPropertyNames(), (propName) => {
		let tmpFormItem = this.m_settingsForm.getFormItemByKey(propName);
		if (this.m_currentConfiguration.isPropertyDirty(propName) && oFF.notNull(tmpFormItem) && tmpFormItem.getValue() !== null || oFF.notNull(tmpFormItem) && tmpFormItem.isDirty() && tmpFormItem.getValue() !== null)
		{
			dirtyStruct.put(propName, currentFormStruct.getByKey(propName));
		}
	});
	return dirtyStruct;
};
oFF.UtSettingsView.prototype._getResolvedIconPath = function(configMetadata)
{
	if (oFF.notNull(configMetadata))
	{
		if (configMetadata.getConfigurationType() === oFF.CoConfigurationType.PLUGIN)
		{
			return this.getProcess().resolvePath(oFF.UtSettingsView.PLUGIN_ICON_PATH);
		}
		else if (configMetadata.getConfigurationType() === oFF.CoConfigurationType.OTHER)
		{
			return this.getProcess().resolvePath(oFF.UtSettingsView.OTHER_ICON_PATH);
		}
		else if (configMetadata.getConfigurationType() === oFF.CoConfigurationType.PROGRAM)
		{
			let tmpPrgManifest = oFF.ProgramRegistry.getProgramManifest(configMetadata.getName());
			if (oFF.notNull(tmpPrgManifest))
			{
				let resolvedIconPath = tmpPrgManifest.getResolvedIconPath(this.getProcess());
				if (oFF.XStringUtils.isNotNullAndNotEmpty(resolvedIconPath))
				{
					return resolvedIconPath;
				}
			}
		}
	}
	return this.getProcess().resolvePath(oFF.UtSettingsView.UNKNOWN_ICON_PATH);
};
oFF.UtSettingsView.prototype._getSaveBtnMenu = function()
{
	let tmpMenu = this.getGenesis().newControl(oFF.UiType.MENU);
	let saveAsProfileUserItem = tmpMenu.addNewItem();
	saveAsProfileUserItem.setText("Save as Profile");
	saveAsProfileUserItem.setIcon("save");
	saveAsProfileUserItem.registerOnPress(oFF.UiLambdaPressListener.create(this._handleSaveAsProfile.bind(this)));
	return tmpMenu;
};
oFF.UtSettingsView.prototype._getValueTypeFromItemsType = function(itemsType)
{
	let valueType = oFF.XValueType.STRING;
	if (oFF.notNull(itemsType))
	{
		if (itemsType.isNumeric())
		{
			valueType = oFF.XValueType.INTEGER;
		}
		else if (itemsType === oFF.CoDataType.BOOLEAN)
		{
			valueType = oFF.XValueType.BOOLEAN;
		}
		else
		{
			valueType = oFF.XValueType.STRING;
		}
	}
	return valueType;
};
oFF.UtSettingsView.prototype._handleError = function(error)
{
	if (oFF.notNull(error))
	{
		let errorMsg = oFF.XStringUtils.concatenate2("Error during settings rendering! ", error.getText());
		this.getGenesis().showErrorToast(errorMsg);
	}
};
oFF.UtSettingsView.prototype._handleSaveAsProfile = function(controlEvent)
{
	let inputpopup = oFF.UtInputPopup.create(this.getGenesis(), oFF.XStringUtils.concatenate3("Save ", this.m_activeConfigurationLayer.getName(), " configuration as profile"), "Please specify the profile name");
	inputpopup.setOkButtonText("Save");
	inputpopup.setOkButtonIcon("save");
	inputpopup.setAllowEmptyValue(false);
	inputpopup.setInputConsumer((enteredText) => {
		this._setSettingsContainerBusy(true);
		this._saveCurrentSettingsAsProfile(enteredText).onCatch((err) => {
			this.getGenesis().showErrorToast(err.getText());
		}).onFinally(() => {
			this._setSettingsContainerBusy(false);
		});
	});
	inputpopup.open();
};
oFF.UtSettingsView.prototype._handleSaveDefault = function(controlEvent)
{
	this._setSettingsContainerBusy(true);
	this._saveCurrentSettings().onCatch((err) => {
		this.getGenesis().showErrorToast(err.getText());
	}).onFinally(() => {
		this._setSettingsContainerBusy(false);
	});
};
oFF.UtSettingsView.prototype._hasNonHiddenProperties = function(configMetadata)
{
	if (oFF.isNull(configMetadata))
	{
		return false;
	}
	return oFF.XCollectionUtils.contains(configMetadata.getAllProperties(), (tmpProp) => {
		return !tmpProp.isHidden();
	});
};
oFF.UtSettingsView.prototype._isShowConfigurationList = function()
{
	return oFF.XStringUtils.isNullOrEmpty(this.m_configurationName) && oFF.isNull(this.m_configuration);
};
oFF.UtSettingsView.prototype._isShowConfigurationTypeFilterDropdown = function()
{
	return oFF.isNull(this.m_configurationType) && !oFF.XCollectionUtils.hasElements(this.getConfigurationNames());
};
oFF.UtSettingsView.prototype._isUserMode = function()
{
	return this.m_isUserMode;
};
oFF.UtSettingsView.prototype._prepareUi = function()
{
	if (this._isShowConfigurationList())
	{
		if (oFF.XCollectionUtils.hasElements(this.getConfigurationNames()))
		{
			this._fillConfigurationList(this.getConfigurationNames());
		}
		else
		{
			this._fillConfigurationListByType(this.m_configurationType);
		}
		if (this._isShowConfigurationTypeFilterDropdown())
		{
			this._setupTypeDropdown();
		}
		if (oFF.notNull(this.m_searchableListView) && this.m_searchableListView.getListItems().hasElements())
		{
			let tmpListItem = this.m_searchableListView.getListItems().get(0);
			this.m_searchableListView.selectItem(tmpListItem);
			let tmpConfigDef = tmpListItem.getCustomObject();
			this._switchConfiguration(tmpConfigDef);
		}
		else
		{
			this._showNoConfigurationSelectedMessage();
		}
	}
	else
	{
		let tmpConfigDef = oFF.CoConfigurationRegistry.getConfigurationMetadata(this.m_configurationName);
		if (oFF.notNull(tmpConfigDef))
		{
			this._switchConfiguration(tmpConfigDef);
		}
		else
		{
			this._showConfigurationNotFoundMessage();
		}
	}
};
oFF.UtSettingsView.prototype._reloadCurrentConfiguration = function()
{
	this._switchConfiguration(this.m_currentConfigurationMetadata);
};
oFF.UtSettingsView.prototype._renderConfigurationForm = function(configuration)
{
	if (oFF.notNull(configuration))
	{
		oFF.XCollectionUtils.forEach(configuration.getAllProperties().getValuesAsReadOnlyList(), (tmpProp) => {
			this._renderConfigurationProperty(tmpProp, this.m_settingsForm, configuration.getConfigurationStructure());
		});
	}
};
oFF.UtSettingsView.prototype._renderConfigurationProperty = function(prop, form, configuration)
{
	let tmpFormItem = null;
	let propKey = prop.getName();
	let propDataType = prop.getType();
	let hasChoices = prop.hasChoices();
	let propDisplayName = prop.getDisplayName();
	let propDescription = prop.getDescription();
	let isAdminOnly = prop.isAdminOnly();
	let isHidden = prop.isHidden();
	if (!isHidden && (!this._isUserMode() || !isAdminOnly))
	{
		if (propDataType === oFF.CoDataType.STRING)
		{
			if (hasChoices)
			{
				tmpFormItem = form.addDropdown(propKey, configuration.getStringByKey(propKey), propDisplayName, this._getChoicesMap(prop.getChoices()), true);
			}
			else
			{
				tmpFormItem = form.addInput(propKey, configuration.getStringByKey(propKey), propDisplayName);
			}
		}
		else if (propDataType === oFF.CoDataType.BOOLEAN)
		{
			tmpFormItem = form.addCheckbox(propKey, configuration.getBooleanByKey(propKey), propDisplayName);
		}
		else if (propDataType === oFF.CoDataType.INTEGER)
		{
			let initialVal = oFF.PrUtils.convertElementToStringValue(configuration.getByKey(propKey), "");
			let tmpIntegerInput = form.addInput(propKey, initialVal, propDisplayName);
			tmpIntegerInput.setInputType(oFF.UiInputType.NUMBER);
			tmpIntegerInput.setModelValueType(oFF.XValueType.INTEGER);
			tmpFormItem = tmpIntegerInput;
		}
		else if (propDataType === oFF.CoDataType.NUMBER)
		{
			let initialVal = oFF.PrUtils.convertElementToStringValue(configuration.getByKey(propKey), "");
			let tmpDoubleInput = form.addInput(propKey, initialVal, propDisplayName);
			tmpDoubleInput.setInputType(oFF.UiInputType.NUMBER);
			tmpDoubleInput.setModelValueType(oFF.XValueType.DOUBLE);
			tmpFormItem = tmpDoubleInput;
		}
		else if (propDataType === oFF.CoDataType.ARRAY)
		{
			let initialValFromConfig = oFF.PrUtils.convertToList(configuration.getByKey(propKey));
			let initialVal = oFF.notNull(initialValFromConfig) ? initialValFromConfig.clone() : null;
			let tmpArrayProperty = prop;
			let valueType = this._getValueTypeFromItemsType(tmpArrayProperty.getItemsType());
			tmpFormItem = form.addFormList(propKey, initialVal, propDisplayName, valueType);
		}
		else if (propDataType === oFF.CoDataType.OBJECT)
		{
			let initialValFromConfig = configuration.getStructureByKey(propKey);
			let initialVal = oFF.notNull(initialValFromConfig) ? initialValFromConfig.clone() : oFF.PrFactory.createStructure();
			let tmpObjectProperty = prop;
			let tmpFormSection = form.addFormSection(propKey, propDisplayName, false);
			tmpFormSection.showAsPanel(true, false);
			oFF.XCollectionUtils.forEach(tmpObjectProperty.getAllProperties().getValuesAsReadOnlyList(), (tmpProp) => {
				this._renderConfigurationProperty(tmpProp, tmpFormSection, initialVal);
			});
			tmpFormItem = tmpFormSection;
		}
		if (oFF.notNull(tmpFormItem))
		{
			tmpFormItem.setCustomValidator((formItem) => {
				this._getCustomValidatorIfNeeded(prop, formItem);
			});
			tmpFormItem.setLabelFontWeight(oFF.UiFontWeight.BOLD);
			tmpFormItem.setDescription(propDescription);
		}
	}
};
oFF.UtSettingsView.prototype._renderConfigurationSettings = function(configuration)
{
	this.m_currentConfiguration = configuration;
	this.m_settingsForm.clearFormItems();
	this._setSettingsTitleAndTooltip(this._getConfigurationTitle(configuration), oFF.notNull(configuration) ? configuration.getName() : null);
	this._renderConfigurationForm(configuration);
};
oFF.UtSettingsView.prototype._restoreCurrentConfigToDefault = function()
{
	let defaultConfiguration = oFF.CoConfiguration.create(this.m_currentConfigurationMetadata, null);
	this._renderConfigurationSettings(defaultConfiguration);
};
oFF.UtSettingsView.prototype._saveCurrentSettings = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_activeProfile) || oFF.XString.isEqual(this.m_activeProfile, oFF.CoConfigurationConstants.DEFAULT_PROFILE_NAME))
	{
		return this._saveCurrentSettingsAsDefault();
	}
	else
	{
		return this._saveCurrentSettingsAsProfile(this.m_activeProfile);
	}
};
oFF.UtSettingsView.prototype._saveCurrentSettingsAsDefault = function()
{
	if (oFF.isNull(this.m_settingsForm) || !this.m_settingsForm.submit())
	{
		return oFF.XPromise.reject(oFF.XError.create(oFF.UtSettingsView.INVALID_DATA_MSG));
	}
	return oFF.CoConfigurationUtils.saveConfigurationForLayer(this.getProcess(), this.m_currentConfigurationMetadata, this.m_activeConfigurationLayer, this._getDirtyJsonModel()).onThen((result) => {
		this.getGenesis().showSuccessToast(oFF.XStringUtils.concatenate2(this.m_currentConfigurationMetadata.getName(), " configuration saved!"));
	});
};
oFF.UtSettingsView.prototype._saveCurrentSettingsAsProfile = function(profileName)
{
	if (oFF.isNull(this.m_settingsForm) || !this.m_settingsForm.submit())
	{
		return oFF.XPromise.reject(oFF.XError.create(oFF.UtSettingsView.INVALID_DATA_MSG));
	}
	return oFF.CoConfigurationUtils.saveConfigurationForLayerAsProfile(this.getProcess(), this.m_currentConfigurationMetadata, this.m_activeConfigurationLayer, this._getDirtyJsonModel(), profileName).onThen((result) => {
		this.getGenesis().showSuccessToast(oFF.XStringUtils.concatenate4(this.m_currentConfigurationMetadata.getName(), " configuration saved as profile ", profileName, "!"));
		this._addNewProfileEntry(profileName);
	});
};
oFF.UtSettingsView.prototype._setSettingsContainerBusy = function(busy)
{
	if (oFF.notNull(this.m_settingsContainer))
	{
		this.m_configurationContainer.setBusy(busy);
	}
};
oFF.UtSettingsView.prototype._setSettingsTitleAndTooltip = function(title, tooltip)
{
	if (oFF.notNull(this.m_settingsTitle))
	{
		this.m_settingsTitle.setText(title);
		this.m_settingsTitle.setTooltip(tooltip);
	}
};
oFF.UtSettingsView.prototype._setupInternal = function(process)
{
	this.m_process = process;
};
oFF.UtSettingsView.prototype._setupTypeDropdown = function()
{
	if (oFF.notNull(this.m_searchableListView))
	{
		let dropdownItemList = oFF.XList.create();
		let allDdItem = this.getGenesis().newControl(oFF.UiType.DROPDOWN_ITEM);
		allDdItem.setTag(null);
		allDdItem.setText("All");
		dropdownItemList.add(allDdItem);
		oFF.XCollectionUtils.forEach(oFF.CoConfigurationType.getAllTypeNames(), (typeName) => {
			let tmpDdItem = this.getGenesis().newControl(oFF.UiType.DROPDOWN_ITEM);
			tmpDdItem.setTag(typeName);
			tmpDdItem.setText(typeName);
			dropdownItemList.add(tmpDdItem);
		});
		this.m_searchableListView.addFilterDropdown(dropdownItemList, allDdItem, (selectedDdItem) => {
			let currentSerchText = this.m_searchableListView.getSearchText();
			this._fillConfigurationListByType(oFF.CoConfigurationType.lookup(selectedDdItem.getTag()));
			this.m_searchableListView.search(currentSerchText);
		});
	}
};
oFF.UtSettingsView.prototype._showConfigurationNotFoundMessage = function()
{
	let msgStrip = this._createAndShowMessageStrip();
	if (oFF.notNull(msgStrip))
	{
		msgStrip.setText(oFF.XStringUtils.concatenate2("Could not find configuration for name: ", this.m_configurationName));
		msgStrip.setMessageType(oFF.UiMessageType.ERROR);
	}
};
oFF.UtSettingsView.prototype._showNoConfigurationSelectedMessage = function()
{
	let msgStrip = this._createAndShowMessageStrip();
	if (oFF.notNull(msgStrip))
	{
		msgStrip.setText("No settings selected!");
		msgStrip.setMessageType(oFF.UiMessageType.WARNING);
	}
};
oFF.UtSettingsView.prototype._switchConfiguration = function(configMetadata)
{
	this._setSettingsContainerBusy(true);
	this.m_currentConfigurationMetadata = configMetadata;
	if (this._isUserMode())
	{
		oFF.CoConfigurationUtils.getResolvedConfiguration(this.getProcess(), configMetadata).onThen((newConfiguration) => {
			this._renderConfigurationSettings(newConfiguration);
		}).onCatch((error) => {
			this._handleError(error);
		}).onFinally(() => {
			this._setSettingsContainerBusy(false);
		});
	}
	else
	{
		oFF.CoConfigurationUtils.getProfileListForMetadataAndLayer(this.getProcess(), configMetadata, this.m_activeConfigurationLayer).onThen((result) => {
			this._fillProfileDropdown(result);
		}).onCatch((err) => {
			this._fillProfileDropdown(null);
		}).onFinally(() => {
			oFF.CoConfigurationUtils.getConfigurationForLayer(this.getProcess(), configMetadata, this.m_activeConfigurationLayer).onThen((newConfiguration) => {
				this._renderConfigurationSettings(newConfiguration);
			}).onCatch((error) => {
				this._handleError(error);
			}).onFinally(() => {
				this._setSettingsContainerBusy(false);
			});
		});
	}
};
oFF.UtSettingsView.prototype._switchProfile = function(profileName)
{
	this.m_activeProfile = profileName;
	this._setSettingsContainerBusy(true);
	oFF.CoConfigurationUtils.getConfigurationForProfile(this.getProcess(), this.m_currentConfigurationMetadata, this.m_activeConfigurationLayer, profileName).onThen((newConfiguration) => {
		this._renderConfigurationSettings(newConfiguration);
	}).onCatch((error) => {
		this._handleError(error);
	}).onFinally(() => {
		this._setSettingsContainerBusy(false);
	});
};
oFF.UtSettingsView.prototype.destroyView = function()
{
	this.m_currentConfiguration = oFF.XObjectExt.release(this.m_currentConfiguration);
	this.m_currentConfigurationMetadata = null;
	this.m_activeConfigurationLayer = null;
	this.m_activeProfile = null;
	this.m_settingsForm = oFF.XObjectExt.release(this.m_settingsForm);
	this.m_settingsTitle = oFF.XObjectExt.release(this.m_settingsTitle);
	this.m_settingsContainer = oFF.XObjectExt.release(this.m_settingsContainer);
	this.m_configurationContainer = oFF.XObjectExt.release(this.m_configurationContainer);
	this.m_searchableListView = oFF.XObjectExt.release(this.m_searchableListView);
	this.m_configurationType = null;
	this.m_configurationNames = null;
	this.m_configuration = null;
	this.m_process = null;
};
oFF.UtSettingsView.prototype.getConfiguration = function()
{
	return this.m_configuration;
};
oFF.UtSettingsView.prototype.getConfigurationName = function()
{
	return this.m_configurationName;
};
oFF.UtSettingsView.prototype.getConfigurationNames = function()
{
	return this.m_configurationNames;
};
oFF.UtSettingsView.prototype.getConfigurationType = function()
{
	return this.m_configurationType;
};
oFF.UtSettingsView.prototype.getProcess = function()
{
	return this.m_process;
};
oFF.UtSettingsView.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.UtSettingsView.prototype.isUserMode = function()
{
	return this.m_isUserMode;
};
oFF.UtSettingsView.prototype.layoutView = function(viewControl)
{
	viewControl.useMaxSpace();
	viewControl.setPadding(oFF.UiCssBoxEdges.create("1rem"));
	viewControl.setDirection(oFF.UiFlexDirection.ROW);
	viewControl.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.CENTER);
	viewControl.setWrap(oFF.UiFlexWrap.NO_WRAP);
	if (this._isShowConfigurationList())
	{
		this.m_searchableListView = oFF.UtSearchableListView.create(this.getGenesis(), null);
		this.m_searchableListView.setSearchFieldPlaceholder("Search settings...");
		this.m_searchableListView.setListItemSelectedConsumer((selectedListItem) => {
			let tmpConfigDef = selectedListItem.getCustomObject();
			this.m_activeProfile = oFF.CoConfigurationConstants.DEFAULT_PROFILE_NAME;
			this._switchConfiguration(tmpConfigDef);
		});
		this.m_searchableListView.setListChangdConsumer((newList) => {
			if (oFF.notNull(this.m_currentConfigurationMetadata))
			{
				let foundListItem = oFF.XCollectionUtils.findFirst(newList, (listItem) => {
					return listItem.getCustomObject() === this.m_currentConfigurationMetadata;
				});
				if (oFF.notNull(foundListItem))
				{
					this.m_searchableListView.selectItem(foundListItem);
				}
			}
		});
		this.m_searchableListView.getView().setMaxWidth(oFF.UiCssLength.create("350px"));
		this.m_searchableListView.getView().setMinWidth(oFF.UiCssLength.create("150px"));
		this.m_searchableListView.getView().setFlex("auto");
		viewControl.addItem(this.m_searchableListView.getView());
	}
	this.m_configurationContainer = viewControl.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	this.m_configurationContainer.useMaxHeight();
	this.m_configurationContainer.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_configurationContainer.setJustifyContent(oFF.UiFlexJustifyContent.START);
	this.m_configurationContainer.setAlignItems(oFF.UiFlexAlignItems.START);
	this.m_configurationContainer.setMinWidth(oFF.UiCssLength.create("150px"));
	this.m_configurationContainer.setFlex("1 1 auto");
	let titleToolbar = this.m_configurationContainer.addNewItemOfType(oFF.UiType.OVERFLOW_TOOLBAR);
	titleToolbar.useMaxWidth();
	titleToolbar.setFlex("0 0 auto");
	this.m_settingsTitle = titleToolbar.addNewItemOfType(oFF.UiType.TITLE);
	titleToolbar.addNewItemOfType(oFF.UiType.SPACER);
	let actionsToolbar = titleToolbar;
	if (!this._isUserMode())
	{
		actionsToolbar = this.m_configurationContainer.addNewItemOfType(oFF.UiType.OVERFLOW_TOOLBAR);
		actionsToolbar.useMaxWidth();
		actionsToolbar.setFlex("0 0 auto");
		actionsToolbar.setMargin(oFF.UiCssBoxEdges.create("0.5rem 0"));
		this.m_layerDropdown = actionsToolbar.addNewItemOfType(oFF.UiType.DROPDOWN);
		this.m_layerDropdown.registerOnSelect(oFF.UiLambdaSelectListener.create((selectionEvent) => {
			let selectedItem = selectionEvent.getSelectedItem();
			this._changeActiveConfigurationLayer(selectedItem.getCustomObject());
		}));
		this._fillLayerDropdown();
		this.m_profileDropdown = actionsToolbar.addNewItemOfType(oFF.UiType.DROPDOWN);
		this.m_profileDropdown.setWidth(oFF.UiCssLength.create("10rem"));
		this.m_profileDropdown.registerOnSelect(oFF.UiLambdaSelectListener.create((selectionEvent) => {
			let selectedItem = selectionEvent.getSelectedItem();
			this._switchProfile(selectedItem.getName());
		}));
		actionsToolbar.addNewItemOfType(oFF.UiType.SPACER);
	}
	else
	{
		actionsToolbar.setMargin(oFF.UiCssBoxEdges.create("0 0 0.5rem 0"));
	}
	let restoreDefaultConfigBtn = actionsToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	restoreDefaultConfigBtn.setTooltip("Restore Default");
	restoreDefaultConfigBtn.setIcon("reset");
	restoreDefaultConfigBtn.setButtonType(oFF.UiButtonType.DEFAULT);
	restoreDefaultConfigBtn.registerOnPress(oFF.UiLambdaPressListener.create((event) => {
		this._restoreCurrentConfigToDefault();
	}));
	let reloadCurConfigBtn = actionsToolbar.addNewItemOfType(oFF.UiType.BUTTON);
	reloadCurConfigBtn.setTooltip("Reload");
	reloadCurConfigBtn.setIcon("refresh");
	reloadCurConfigBtn.setButtonType(oFF.UiButtonType.DEFAULT);
	reloadCurConfigBtn.registerOnPress(oFF.UiLambdaPressListener.create((event2) => {
		this._reloadCurrentConfiguration();
	}));
	if (!this._isUserMode())
	{
		let menuSaveBtn = actionsToolbar.addNewItemOfType(oFF.UiType.MENU_BUTTON);
		menuSaveBtn.setText("Save");
		menuSaveBtn.setTooltip("Save the current configuration");
		menuSaveBtn.setIcon("save");
		menuSaveBtn.setButtonType(oFF.UiButtonType.PRIMARY);
		menuSaveBtn.setMenuButtonMode(oFF.UiMenuButtonMode.SPLIT);
		menuSaveBtn.setUseDefaultActionOnly(true);
		menuSaveBtn.setMenu(this._getSaveBtnMenu());
		menuSaveBtn.registerOnPress(oFF.UiLambdaPressListener.create(this._handleSaveDefault.bind(this)));
	}
	else
	{
		let userSaveBtn = actionsToolbar.addNewItemOfType(oFF.UiType.BUTTON);
		userSaveBtn.setText("Save");
		userSaveBtn.setTooltip("Save the current configuration");
		userSaveBtn.setIcon("save");
		userSaveBtn.setButtonType(oFF.UiButtonType.PRIMARY);
		userSaveBtn.registerOnPress(oFF.UiLambdaPressListener.create(this._handleSaveDefault.bind(this)));
	}
	let scrollContainer = this.m_configurationContainer.addNewItemOfType(oFF.UiType.SCROLL_CONTAINER);
	scrollContainer.useMaxWidth();
	this.m_settingsContainer = scrollContainer.setNewContent(oFF.UiType.FLEX_LAYOUT);
	this.m_settingsContainer.useMaxWidth();
	this.m_settingsContainer.setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_settingsContainer.setPadding(oFF.UiCssBoxEdges.create("0 1rem"));
	this.m_settingsForm = oFF.UiForm.create(this.getGenesis());
	this.m_settingsContainer.addItem(this.m_settingsForm.getView());
	this._prepareUi();
};
oFF.UtSettingsView.prototype.saveCurrentSettings = function()
{
	if (oFF.notNull(this.m_currentConfigurationMetadata))
	{
		this._setSettingsContainerBusy(true);
		return this._saveCurrentSettings().onFinally(() => {
			this._setSettingsContainerBusy(false);
		});
	}
	return oFF.XPromise.reject(oFF.XError.create("No settings selected!"));
};
oFF.UtSettingsView.prototype.setConfiguration = function(configuration)
{
	this.m_configuration = configuration;
};
oFF.UtSettingsView.prototype.setConfigurationName = function(configurationName)
{
	this.m_configurationName = configurationName;
};
oFF.UtSettingsView.prototype.setConfigurationNames = function(configurationNames)
{
	this.m_configurationNames = configurationNames;
};
oFF.UtSettingsView.prototype.setConfigurationType = function(configurationType)
{
	this.m_configurationType = configurationType;
};
oFF.UtSettingsView.prototype.setUserMode = function(isUserMode)
{
	this.m_isUserMode = isUserMode;
};
oFF.UtSettingsView.prototype.setupView = function()
{
	this.m_activeConfigurationLayer = oFF.CoConfigurationLayer.USER;
	this.m_activeProfile = oFF.CoConfigurationConstants.DEFAULT_PROFILE_NAME;
};

oFF.UtToolbarWidgetButton = function() {};
oFF.UtToolbarWidgetButton.prototype = new oFF.DfUtToolbarWidgetItem();
oFF.UtToolbarWidgetButton.prototype._ff_c = "UtToolbarWidgetButton";

oFF.UtToolbarWidgetButton.create = function(genesis, name, text, tooltip, icon)
{
	let toolbarButton = new oFF.UtToolbarWidgetButton();
	toolbarButton.setupInternal(genesis, name, text, tooltip, icon);
	return toolbarButton;
};
oFF.UtToolbarWidgetButton.prototype.m_button = null;
oFF.UtToolbarWidgetButton.prototype.addAttribute = function(attributeKey, attributeValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(attributeValue))
	{
		this.m_button.addAttribute(attributeKey, attributeValue);
	}
};
oFF.UtToolbarWidgetButton.prototype.getView = function()
{
	return this.m_button;
};
oFF.UtToolbarWidgetButton.prototype.releaseObject = function()
{
	this.m_button = oFF.XObjectExt.release(this.m_button);
	oFF.DfUtToolbarWidgetItem.prototype.releaseObject.call( this );
};
oFF.UtToolbarWidgetButton.prototype.setBadgeNumber = function(badgeNumber)
{
	this.m_button.setBadgeNumber(badgeNumber);
};
oFF.UtToolbarWidgetButton.prototype.setHoverConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_button.registerOnHover(oFF.UiLambdaHoverListener.create(consumer));
	}
};
oFF.UtToolbarWidgetButton.prototype.setHoverEndConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_button.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create(consumer));
	}
};
oFF.UtToolbarWidgetButton.prototype.setIcon = function(icon)
{
	this.m_button.setIcon(icon);
};
oFF.UtToolbarWidgetButton.prototype.setPressConsumer = function(consumer)
{
	this.m_button.registerOnPress(oFF.UiLambdaPressListener.create(consumer));
};
oFF.UtToolbarWidgetButton.prototype.setText = function(text)
{
	this.m_button.setText(text);
};
oFF.UtToolbarWidgetButton.prototype.setTooltip = function(tooltip)
{
	this.m_button.setTooltip(tooltip);
};
oFF.UtToolbarWidgetButton.prototype.setupInternal = function(genesis, name, text, tooltip, icon)
{
	this.m_button = genesis.newControl(oFF.UiType.OVERFLOW_BUTTON).setButtonType(oFF.UiButtonType.TRANSPARENT).setName(name).setText(text).setTooltip(tooltip).setIcon(icon);
};

oFF.UtToolbarWidgetFixedSection = function() {};
oFF.UtToolbarWidgetFixedSection.prototype = new oFF.DfUiView();
oFF.UtToolbarWidgetFixedSection.prototype._ff_c = "UtToolbarWidgetFixedSection";

oFF.UtToolbarWidgetFixedSection.create = function(genesis)
{
	let section = new oFF.UtToolbarWidgetFixedSection();
	section.setupInternal(genesis);
	return section;
};
oFF.UtToolbarWidgetFixedSection.prototype.m_layout = null;
oFF.UtToolbarWidgetFixedSection.prototype.addControl = function(control)
{
	this.m_layout.addItem(control);
	return control;
};
oFF.UtToolbarWidgetFixedSection.prototype.addNewButton = function(name, text, tooltip, icon)
{
	let button = this.newButton(name, text, tooltip, icon);
	this.addControl(button);
	return button;
};
oFF.UtToolbarWidgetFixedSection.prototype.addNewToggleButton = function(name, text, tooltip, icon)
{
	let toggleButton = this.newToggleButton(name, text, tooltip, icon);
	this.addControl(toggleButton);
	return toggleButton;
};
oFF.UtToolbarWidgetFixedSection.prototype.clearItems = function()
{
	this.m_layout.clearItems();
};
oFF.UtToolbarWidgetFixedSection.prototype.destroyView = function()
{
	this.m_layout = null;
};
oFF.UtToolbarWidgetFixedSection.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};
oFF.UtToolbarWidgetFixedSection.prototype.layoutView = function(viewControl)
{
	this.m_layout = viewControl;
	viewControl.setJustifyContent(oFF.UiFlexJustifyContent.END);
	viewControl.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	viewControl.addCssClass("sapMTBStandard");
	viewControl.setBackgroundDesign(oFF.UiBackgroundDesign.TRANSPARENT);
	viewControl.setPadding(oFF.UiCssBoxEdges.create("0 1rem 0 0"));
	viewControl.setHeight(oFF.UiCssLength.create("2.5rem"));
	viewControl.setOverflow(oFF.UiOverflow.VISIBLE);
	this.clearItems();
};
oFF.UtToolbarWidgetFixedSection.prototype.newButton = function(name, text, tooltip, icon)
{
	let button = this.getGenesis().newControl(oFF.UiType.BUTTON).setButtonType(oFF.UiButtonType.TRANSPARENT).setName(name).setText(text).setTooltip(tooltip).setIcon(icon);
	return button;
};
oFF.UtToolbarWidgetFixedSection.prototype.newToggleButton = function(name, text, tooltip, icon)
{
	let toggleButton = this.getGenesis().newControl(oFF.UiType.TOGGLE_BUTTON).setName(name).setText(text).setTooltip(tooltip).setIcon(icon);
	oFF.UtStylingHelper.getActiveProvider().applyMarginSmallBegin(toggleButton);
	return toggleButton;
};
oFF.UtToolbarWidgetFixedSection.prototype.removeItem = function(item)
{
	return this.m_layout.removeItem(item);
};
oFF.UtToolbarWidgetFixedSection.prototype.setupInternal = function(genesis)
{
	this.initView(genesis);
};
oFF.UtToolbarWidgetFixedSection.prototype.setupView = function() {};

oFF.UtToolbarWidgetMenu = function() {};
oFF.UtToolbarWidgetMenu.prototype = new oFF.DfUtToolbarWidgetItem();
oFF.UtToolbarWidgetMenu.prototype._ff_c = "UtToolbarWidgetMenu";

oFF.UtToolbarWidgetMenu.create = function(genesis, name, text, hasDefaultAction)
{
	let toolbarMenu = new oFF.UtToolbarWidgetMenu();
	toolbarMenu.setupInternal(genesis, name, text, hasDefaultAction);
	return toolbarMenu;
};
oFF.UtToolbarWidgetMenu.prototype.m_button = null;
oFF.UtToolbarWidgetMenu.prototype.m_genesis = null;
oFF.UtToolbarWidgetMenu.prototype.m_menu = null;
oFF.UtToolbarWidgetMenu.prototype.addAttribute = function(attributeKey, attributeValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(attributeValue))
	{
		this.m_button.addAttribute(attributeKey, attributeValue);
	}
};
oFF.UtToolbarWidgetMenu.prototype.addMenuItem = function(name, text, icon)
{
	return oFF.UtToolbarWidgetMenuItem.create(this.m_menu, name, text, icon);
};
oFF.UtToolbarWidgetMenu.prototype.addToggleButton = function(name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState)
{
	return oFF.UtToolbarWidgetMenuToggleButton.create(this.m_menu, name, activeText, inactiveText, activeIcon, inactiveIcon, defaultState);
};
oFF.UtToolbarWidgetMenu.prototype.clearItems = function()
{
	this.m_menu.clearItems();
};
oFF.UtToolbarWidgetMenu.prototype.getView = function()
{
	return this.m_button;
};
oFF.UtToolbarWidgetMenu.prototype.releaseObject = function()
{
	this.m_button = oFF.XObjectExt.release(this.m_button);
	this.m_menu = oFF.XObjectExt.release(this.m_menu);
	oFF.DfUtToolbarWidgetItem.prototype.releaseObject.call( this );
};
oFF.UtToolbarWidgetMenu.prototype.removeItem = function(menuItem)
{
	if (oFF.notNull(menuItem))
	{
		menuItem.remove();
	}
};
oFF.UtToolbarWidgetMenu.prototype.setBadgeNumber = function(badgeNumber)
{
	this.m_button.setBadgeNumber(badgeNumber);
};
oFF.UtToolbarWidgetMenu.prototype.setHoverConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_button.registerOnHover(oFF.UiLambdaHoverListener.create(consumer));
	}
};
oFF.UtToolbarWidgetMenu.prototype.setHoverEndConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_button.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create(consumer));
	}
};
oFF.UtToolbarWidgetMenu.prototype.setIcon = function(icon)
{
	this.m_button.setIcon(icon);
};
oFF.UtToolbarWidgetMenu.prototype.setPressConsumer = function(consumer)
{
	this.m_button.registerOnPress(oFF.UiLambdaPressListener.create(consumer));
};
oFF.UtToolbarWidgetMenu.prototype.setText = function(text)
{
	this.m_button.setText(text);
};
oFF.UtToolbarWidgetMenu.prototype.setTooltip = function(tooltip)
{
	this.m_button.setTooltip(tooltip);
};
oFF.UtToolbarWidgetMenu.prototype.setupInternal = function(genesis, name, text, hasDefaultAction)
{
	this.m_genesis = genesis;
	this.m_button = this.m_genesis.newControl(oFF.UiType.MENU_BUTTON).setButtonType(oFF.UiButtonType.TRANSPARENT).setMenuButtonMode(hasDefaultAction ? oFF.UiMenuButtonMode.SPLIT : oFF.UiMenuButtonMode.REGULAR).setName(name).setText(text).setTooltip(text).setUseDefaultActionOnly(hasDefaultAction);
	this.m_menu = this.m_genesis.newControl(oFF.UiType.MENU).setName(name);
	this.m_button.setMenu(this.m_menu);
};

oFF.UtToolbarWidgetSection = function() {};
oFF.UtToolbarWidgetSection.prototype = new oFF.DfUiView();
oFF.UtToolbarWidgetSection.prototype._ff_c = "UtToolbarWidgetSection";

oFF.UtToolbarWidgetSection.create = function(genesis)
{
	let section = new oFF.UtToolbarWidgetSection();
	section.setupInternal(genesis);
	return section;
};
oFF.UtToolbarWidgetSection.prototype.m_groups = null;
oFF.UtToolbarWidgetSection.prototype.m_toolbar = null;
oFF.UtToolbarWidgetSection.prototype.addGroup = function(group)
{
	this.m_groups.add(group);
	this.rebuild();
	return group;
};
oFF.UtToolbarWidgetSection.prototype.addNewGroup = function()
{
	let group = this.newGroup();
	this.addGroup(group);
	return group;
};
oFF.UtToolbarWidgetSection.prototype.clearItems = function()
{
	this.m_toolbar.clearItems();
	this.m_groups.clear();
};
oFF.UtToolbarWidgetSection.prototype.createNewSeparator = function()
{
	let overflowToolbarLayoutData = oFF.UiLayoutData.createOverflowToolbar();
	return this.getGenesis().newControl(oFF.UiType.SEPARATOR).setLayoutData(overflowToolbarLayoutData);
};
oFF.UtToolbarWidgetSection.prototype.destroyView = function()
{
	this.m_groups = oFF.XObjectExt.release(this.m_groups);
	this.m_toolbar = null;
};
oFF.UtToolbarWidgetSection.prototype.getGroupCount = function()
{
	return this.m_groups.size();
};
oFF.UtToolbarWidgetSection.prototype.getGroups = function()
{
	return this.m_groups;
};
oFF.UtToolbarWidgetSection.prototype.getViewControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.OVERFLOW_TOOLBAR);
};
oFF.UtToolbarWidgetSection.prototype.layoutView = function(viewControl)
{
	this.m_toolbar = viewControl;
	this.m_toolbar.setWidth(oFF.UiCssLength.create("100%"));
	this.m_toolbar.setHeight(oFF.UiCssLength.create("2.5rem"));
	this.clearItems();
};
oFF.UtToolbarWidgetSection.prototype.newGroup = function()
{
	let group = oFF.UtToolbarWidgetSectionGroup.create(this.getGenesis(), this);
	return group;
};
oFF.UtToolbarWidgetSection.prototype.rebuild = function()
{
	this.m_toolbar.clearItems();
	for (let i = 0; i < this.m_groups.size(); i++)
	{
		let group = this.m_groups.get(i);
		let groupItems = group.getItems();
		for (let j = 0; j < groupItems.size(); j++)
		{
			this.m_toolbar.addItem(groupItems.get(j).getView());
		}
		this.m_toolbar.addItem(this.createNewSeparator());
	}
};
oFF.UtToolbarWidgetSection.prototype.removeGroup = function(group)
{
	let removedGroup = this.m_groups.removeElement(group);
	this.rebuild();
	return removedGroup;
};
oFF.UtToolbarWidgetSection.prototype.setupInternal = function(genesis)
{
	this.initView(genesis);
};
oFF.UtToolbarWidgetSection.prototype.setupView = function()
{
	this.m_groups = oFF.XList.create();
};

oFF.UtToolbarWidgetToggleButton = function() {};
oFF.UtToolbarWidgetToggleButton.prototype = new oFF.DfUtToolbarWidgetItem();
oFF.UtToolbarWidgetToggleButton.prototype._ff_c = "UtToolbarWidgetToggleButton";

oFF.UtToolbarWidgetToggleButton.create = function(genesis, name, text, tooltip, icon)
{
	let toolbarButton = new oFF.UtToolbarWidgetToggleButton();
	toolbarButton.setupInternal(genesis, name, text, tooltip, icon);
	return toolbarButton;
};
oFF.UtToolbarWidgetToggleButton.prototype.m_button = null;
oFF.UtToolbarWidgetToggleButton.prototype.addAttribute = function(attributeKey, attributeValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(attributeValue))
	{
		this.m_button.addAttribute(attributeKey, attributeValue);
	}
};
oFF.UtToolbarWidgetToggleButton.prototype.getView = function()
{
	return this.m_button;
};
oFF.UtToolbarWidgetToggleButton.prototype.isPressed = function()
{
	return this.m_button.isPressed();
};
oFF.UtToolbarWidgetToggleButton.prototype.setBadgeNumber = function(badgeNumber)
{
	this.m_button.setBadgeNumber(badgeNumber);
};
oFF.UtToolbarWidgetToggleButton.prototype.setHoverConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_button.registerOnHover(oFF.UiLambdaHoverListener.create(consumer));
	}
};
oFF.UtToolbarWidgetToggleButton.prototype.setHoverEndConsumer = function(consumer)
{
	if (oFF.notNull(consumer))
	{
		this.m_button.registerOnHover(oFF.UiLambdaHoverListener.create(consumer));
	}
};
oFF.UtToolbarWidgetToggleButton.prototype.setIcon = function(icon)
{
	this.m_button.setIcon(icon);
};
oFF.UtToolbarWidgetToggleButton.prototype.setPressConsumer = function(consumer)
{
	this.m_button.registerOnPress(oFF.UiLambdaPressListener.create(consumer));
};
oFF.UtToolbarWidgetToggleButton.prototype.setPressed = function(pressed)
{
	this.m_button.setPressed(pressed);
};
oFF.UtToolbarWidgetToggleButton.prototype.setText = function(text)
{
	this.m_button.setText(text);
};
oFF.UtToolbarWidgetToggleButton.prototype.setTooltip = function(tooltip)
{
	this.m_button.setTooltip(tooltip);
};
oFF.UtToolbarWidgetToggleButton.prototype.setupInternal = function(genesis, name, text, tooltip, icon)
{
	this.m_button = genesis.newControl(oFF.UiType.OVERFLOW_TOGGLE_BUTTON).setButtonType(oFF.UiButtonType.TRANSPARENT).setTooltip(tooltip).setIcon(icon).setText(text).setName(name);
};

oFF.UiFormValidationVisibility = function() {};
oFF.UiFormValidationVisibility.prototype = new oFF.XConstant();
oFF.UiFormValidationVisibility.prototype._ff_c = "UiFormValidationVisibility";

oFF.UiFormValidationVisibility.BLUR = null;
oFF.UiFormValidationVisibility.DIRTY = null;
oFF.UiFormValidationVisibility.LIVE = null;
oFF.UiFormValidationVisibility.SUBMIT = null;
oFF.UiFormValidationVisibility.s_lookup = null;
oFF.UiFormValidationVisibility._createWithName = function(name)
{
	let newConstant = oFF.XConstant.setupName(new oFF.UiFormValidationVisibility(), name);
	oFF.UiFormValidationVisibility.s_lookup.put(oFF.XString.toLowerCase(name), newConstant);
	return newConstant;
};
oFF.UiFormValidationVisibility.lookup = function(name)
{
	return oFF.UiFormValidationVisibility.s_lookup.getByKey(oFF.XString.toLowerCase(name));
};
oFF.UiFormValidationVisibility.staticSetup = function()
{
	oFF.UiFormValidationVisibility.s_lookup = oFF.XHashMapByString.create();
	oFF.UiFormValidationVisibility.BLUR = oFF.UiFormValidationVisibility._createWithName("Blur");
	oFF.UiFormValidationVisibility.LIVE = oFF.UiFormValidationVisibility._createWithName("Live");
	oFF.UiFormValidationVisibility.DIRTY = oFF.UiFormValidationVisibility._createWithName("Dirty");
	oFF.UiFormValidationVisibility.SUBMIT = oFF.UiFormValidationVisibility._createWithName("Submit");
};

oFF.DfUiFormItemSingleLine = function() {};
oFF.DfUiFormItemSingleLine.prototype = new oFF.DfUiFormItem();
oFF.DfUiFormItemSingleLine.prototype._ff_c = "DfUiFormItemSingleLine";

oFF.DfUiFormItemSingleLine.prototype.getFormattedText = function()
{
	return this.getText();
};
oFF.DfUiFormItemSingleLine.prototype.layoutFormItem = function()
{
	let wrapperLayout = this.getFormControl();
	wrapperLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	let formItemWrapper = wrapperLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	formItemWrapper.setDirection(oFF.UiFlexDirection.ROW);
	formItemWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	formItemWrapper.addItem(this.getFormItemControl());
	if (this.getFormLabel() !== null)
	{
		this.getFormLabel().setFlex("1 1 auto");
		this.getFormLabel().setWrapping(true);
		formItemWrapper.addItem(this.getFormLabel().getView());
	}
	wrapperLayout.addItem(this.getDescriptionLabel());
};

oFF.UiFormItemColorPicker = function() {};
oFF.UiFormItemColorPicker.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemColorPicker.prototype._ff_c = "UiFormItemColorPicker";

oFF.UiFormItemColorPicker.create = function(parentForm, key, value, text)
{
	let newFormItem = new oFF.UiFormItemColorPicker();
	newFormItem._setupInternal(parentForm, key, value, text);
	return newFormItem;
};
oFF.UiFormItemColorPicker.prototype.m_colorPalettePopover = null;
oFF.UiFormItemColorPicker.prototype.m_currentColor = null;
oFF.UiFormItemColorPicker.prototype._applyIconColor = function()
{
	let iconColor = oFF.UiColor.create(this.getModelValueAsString());
	this.getFormItemControl().setIconColor(iconColor);
};
oFF.UiFormItemColorPicker.prototype._handleValueChanged = function(event)
{
	this.m_currentColor = event.getParameters().getStringByKey(oFF.UiEventParams.PARAM_VALUE);
	this.handleItemValueChanged();
	this._applyIconColor();
};
oFF.UiFormItemColorPicker.prototype._setupInternal = function(parentForm, key, value, text)
{
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemColorPicker.prototype.createFormItemControl = function(genesis)
{
	this.m_colorPalettePopover = genesis.newControl(oFF.UiType.COLOR_PALETTE_POPOVER);
	this.m_colorPalettePopover.setColorString(this.getModelValueAsString());
	this.m_colorPalettePopover.setShowDefaultColorButton(false);
	this.m_colorPalettePopover.registerOnColorSelect(oFF.UiLambdaColorSelectListener.create(this._handleValueChanged.bind(this)));
	let colorPickerBtn = genesis.newControl(oFF.UiType.BUTTON);
	colorPickerBtn.setIcon("color-fill");
	colorPickerBtn.setFlex("none");
	colorPickerBtn.setAlignSelf(oFF.UiFlexAlignSelf.FLEX_START);
	colorPickerBtn.registerOnPress(oFF.UiLambdaPressListener.create((event) => {
		this.m_colorPalettePopover.openAt(colorPickerBtn);
	}));
	return colorPickerBtn;
};
oFF.UiFormItemColorPicker.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemColorPicker.prototype.refreshModelValue = function()
{
	this.updateModelValueByString(this.m_currentColor);
};
oFF.UiFormItemColorPicker.prototype.releaseObject = function()
{
	this.m_colorPalettePopover = oFF.XObjectExt.release(this.m_colorPalettePopover);
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemColorPicker.prototype.setColors = function(colors)
{
	if (oFF.notNull(this.m_colorPalettePopover))
	{
		this.m_colorPalettePopover.setColors(colors);
	}
	return this;
};
oFF.UiFormItemColorPicker.prototype.setDefaultColorString = function(defaultColorString)
{
	if (oFF.notNull(this.m_colorPalettePopover))
	{
		this.m_colorPalettePopover.setDefaultColorString(defaultColorString);
	}
	return this;
};
oFF.UiFormItemColorPicker.prototype.setEditable = function(editable)
{
	this.getFormItemControl().setEnabled(editable);
	return this;
};
oFF.UiFormItemColorPicker.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemColorPicker.prototype.setInvalidState = function(reason)
{
	this.getFormLabel().applyErrorState(reason);
};
oFF.UiFormItemColorPicker.prototype.setShowDefaultColorButton = function(showDefaultColorButton)
{
	if (oFF.notNull(this.m_colorPalettePopover))
	{
		this.m_colorPalettePopover.setShowDefaultColorButton(showDefaultColorButton);
	}
	return this;
};
oFF.UiFormItemColorPicker.prototype.setValidState = function()
{
	this.getFormLabel().removeErrorState();
};
oFF.UiFormItemColorPicker.prototype.updateControlValue = function()
{
	this.m_currentColor = this.getModelValueAsString();
	this.m_colorPalettePopover.setColorString(this.getModelValueAsString());
	this._applyIconColor();
};

oFF.UiFormItemComboBox = function() {};
oFF.UiFormItemComboBox.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemComboBox.prototype._ff_c = "UiFormItemComboBox";

oFF.UiFormItemComboBox.COMBO_BOX_EMPTY_ITEM_NAME = "UiFormItemComboBoxEmptyItem";
oFF.UiFormItemComboBox.create = function(parentForm, key, value, text, dropdownItems, addEmptyItem)
{
	let newFormItem = new oFF.UiFormItemComboBox();
	newFormItem._setupInternal(parentForm, key, value, text, dropdownItems, addEmptyItem);
	return newFormItem;
};
oFF.UiFormItemComboBox.prototype.m_addEmptyItem = false;
oFF.UiFormItemComboBox.prototype.m_comboBoxItems = null;
oFF.UiFormItemComboBox.prototype.m_emptyItemText = null;
oFF.UiFormItemComboBox.prototype._handleSelectionChange = function()
{
	this.handleItemValueChanged();
	this.handleItemBlured();
};
oFF.UiFormItemComboBox.prototype._setupInternal = function(parentForm, key, value, text, dropdownItems, addEmptyItem)
{
	this.m_comboBoxItems = dropdownItems;
	this.m_addEmptyItem = addEmptyItem;
	this.m_emptyItemText = "";
	this.setupFormItem(parentForm, key, value, text);
	this.fillDropdownItems();
};
oFF.UiFormItemComboBox.prototype.createFormItemControl = function(genesis)
{
	let formItemDropdown = genesis.newControl(oFF.UiType.COMBO_BOX);
	formItemDropdown.setRequired(this.isRequired());
	formItemDropdown.registerOnSelectionChange(oFF.UiLambdaSelectionChangeListener.create((selectionEvent) => {
		this._handleSelectionChange();
	}));
	return formItemDropdown;
};
oFF.UiFormItemComboBox.prototype.fillDropdownItems = function()
{
	if (this.getFormItemControl() !== null)
	{
		this.getFormItemControl().clearItems();
		if (oFF.notNull(this.m_comboBoxItems) && this.m_comboBoxItems.size() > 0)
		{
			if (this.m_addEmptyItem)
			{
				let emptyDdItem = this.getFormItemControl().addNewItem();
				emptyDdItem.setName(oFF.UiFormItemComboBox.COMBO_BOX_EMPTY_ITEM_NAME);
				emptyDdItem.setText(this.m_emptyItemText);
			}
			oFF.XCollectionUtils.forEach(this.m_comboBoxItems.getKeysAsReadOnlyList(), (key) => {
				let tmpText = this.m_comboBoxItems.getByKey(key);
				let tmpDdItem = this.getFormItemControl().addNewItem();
				tmpDdItem.setName(key);
				tmpDdItem.setText(tmpText);
			});
			if (this.getValue() !== null && this.m_comboBoxItems.containsKey(this.getModelValueAsString()))
			{
				this.getFormItemControl().setSelectedName(this.getModelValueAsString());
			}
			else
			{
				this.getFormItemControl().setSelectedItemByIndex(0);
			}
		}
	}
};
oFF.UiFormItemComboBox.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemComboBox.prototype.refreshModelValue = function()
{
	let value = this.getFormItemControl().getSelectedName();
	value = oFF.XString.isEqual(value, oFF.UiFormItemComboBox.COMBO_BOX_EMPTY_ITEM_NAME) ? null : value;
	this.updateModelValueByString(value);
};
oFF.UiFormItemComboBox.prototype.releaseObject = function()
{
	this.m_comboBoxItems = null;
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemComboBox.prototype.setComboBoxItems = function(comboBoxItems)
{
	this.m_comboBoxItems = comboBoxItems;
	this.fillDropdownItems();
	return this;
};
oFF.UiFormItemComboBox.prototype.setEditable = function(editable)
{
	return null;
};
oFF.UiFormItemComboBox.prototype.setEmptyItemText = function(emptyItemText)
{
	this.m_emptyItemText = emptyItemText;
	if (this.getFormItemControl() !== null && this.m_addEmptyItem)
	{
		let emptyItem = this.getFormItemControl().getItemByName(oFF.UiFormItemComboBox.COMBO_BOX_EMPTY_ITEM_NAME);
		if (oFF.notNull(emptyItem))
		{
			emptyItem.setText(this.m_emptyItemText);
		}
	}
	return this;
};
oFF.UiFormItemComboBox.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemComboBox.prototype.setInvalidState = function(reason)
{
	this.getFormItemControl().setValueState(oFF.UiValueState.ERROR);
	this.getFormItemControl().setValueStateText(reason);
};
oFF.UiFormItemComboBox.prototype.setValidState = function()
{
	this.getFormItemControl().setValueState(oFF.UiValueState.NONE);
	this.getFormItemControl().setValueStateText(null);
};
oFF.UiFormItemComboBox.prototype.updateControlValue = function()
{
	this.getFormItemControl().setSelectedName(this.getModelValueAsString());
};

oFF.UiFormItemDropdown = function() {};
oFF.UiFormItemDropdown.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemDropdown.prototype._ff_c = "UiFormItemDropdown";

oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME = "UiFormItemDropdownEmptyItem";
oFF.UiFormItemDropdown.create = function(parentForm, key, value, text, dropdownItems, addEmptyItem)
{
	let newFormItem = new oFF.UiFormItemDropdown();
	newFormItem._setupInternal(parentForm, key, value, text, dropdownItems, addEmptyItem);
	return newFormItem;
};
oFF.UiFormItemDropdown.prototype.m_addEmptyItem = false;
oFF.UiFormItemDropdown.prototype.m_dropdownItems = null;
oFF.UiFormItemDropdown.prototype.m_emptyItemText = null;
oFF.UiFormItemDropdown.prototype._fillDropdownItems = function()
{
	if (this.getFormItemControl() !== null)
	{
		this.getFormItemControl().clearItems();
		if (oFF.notNull(this.m_dropdownItems) && this.m_dropdownItems.size() > 0)
		{
			if (this.m_addEmptyItem)
			{
				let emptyDdItem = this.getFormItemControl().addNewItem();
				emptyDdItem.setName(oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME);
				emptyDdItem.setText(this.m_emptyItemText);
			}
			oFF.XCollectionUtils.forEach(this.m_dropdownItems.getKeysAsReadOnlyList(), (key) => {
				let tmpText = this.m_dropdownItems.getByKey(key);
				let tmpDdItem = this.getFormItemControl().addNewItem();
				tmpDdItem.setName(key);
				tmpDdItem.setText(tmpText);
			});
			if (this.getValue() !== null && this.m_dropdownItems.containsKey(this.getModelValueAsString()))
			{
				this.getFormItemControl().setSelectedName(this.getModelValueAsString());
			}
			else
			{
				this.getFormItemControl().setSelectedItemByIndex(0);
			}
		}
	}
};
oFF.UiFormItemDropdown.prototype._handleSelect = function()
{
	this.handleItemValueChanged();
	this.handleItemBlured();
};
oFF.UiFormItemDropdown.prototype._setupInternal = function(parentForm, key, value, text, dropdownItems, addEmptyItem)
{
	this.m_dropdownItems = dropdownItems;
	this.m_addEmptyItem = addEmptyItem;
	this.m_emptyItemText = "";
	this.setupFormItem(parentForm, key, value, text);
	this._fillDropdownItems();
};
oFF.UiFormItemDropdown.prototype.createFormItemControl = function(genesis)
{
	let formItemDropdown = genesis.newControl(oFF.UiType.DROPDOWN);
	formItemDropdown.setRequired(this.isRequired());
	formItemDropdown.registerOnSelect(oFF.UiLambdaSelectListener.create((selectionEvent) => {
		this._handleSelect();
	}));
	return formItemDropdown;
};
oFF.UiFormItemDropdown.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemDropdown.prototype.refreshModelValue = function()
{
	let value = this.getFormItemControl().getSelectedName();
	value = oFF.XString.isEqual(value, oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME) ? null : value;
	this.updateModelValueByString(value);
};
oFF.UiFormItemDropdown.prototype.releaseObject = function()
{
	this.m_dropdownItems = null;
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemDropdown.prototype.setDropdownItems = function(dropdownItems)
{
	this.m_dropdownItems = dropdownItems;
	this._fillDropdownItems();
	return this;
};
oFF.UiFormItemDropdown.prototype.setEditable = function(editable)
{
	this.getFormItemControl().setEditable(editable);
	return this;
};
oFF.UiFormItemDropdown.prototype.setEmptyItemText = function(emptyItemText)
{
	this.m_emptyItemText = emptyItemText;
	if (this.getFormItemControl() !== null && this.m_addEmptyItem)
	{
		let emptyItem = this.getFormItemControl().getItemByName(oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME);
		if (oFF.notNull(emptyItem))
		{
			emptyItem.setText(this.m_emptyItemText);
		}
	}
	return this;
};
oFF.UiFormItemDropdown.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemDropdown.prototype.setInvalidState = function(reason)
{
	this.getFormItemControl().setValueState(oFF.UiValueState.ERROR);
	this.getFormItemControl().setValueStateText(reason);
};
oFF.UiFormItemDropdown.prototype.setValidState = function()
{
	this.getFormItemControl().setValueState(oFF.UiValueState.NONE);
	this.getFormItemControl().setValueStateText(null);
};
oFF.UiFormItemDropdown.prototype.updateControlValue = function()
{
	let itemName = this.getModelValueAsString();
	itemName = oFF.XStringUtils.isNullOrEmpty(itemName) ? oFF.UiFormItemDropdown.DROPDOWN_EMPTY_ITEM_NAME : itemName;
	this.getFormItemControl().setSelectedName(itemName);
};

oFF.UiFormItemInput = function() {};
oFF.UiFormItemInput.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemInput.prototype._ff_c = "UiFormItemInput";

oFF.UiFormItemInput.create = function(parentForm, key, value, text)
{
	let newFormItem = new oFF.UiFormItemInput();
	newFormItem._setupInternal(parentForm, key, value, text);
	return newFormItem;
};
oFF.UiFormItemInput.prototype.m_inputType = null;
oFF.UiFormItemInput.prototype.m_placeholder = null;
oFF.UiFormItemInput.prototype.m_valueHelpProcedure = null;
oFF.UiFormItemInput.prototype._setupInternal = function(parentForm, key, value, text)
{
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemInput.prototype.createFormItemControl = function(genesis)
{
	let formItemInput = genesis.newControl(oFF.UiType.INPUT);
	formItemInput.setValue(this.getModelValueAsString());
	formItemInput.setInputType(this.m_inputType);
	formItemInput.setRequired(this.isRequired());
	formItemInput.registerOnLiveChange(oFF.UiLambdaLiveChangeListener.create((controlEvent) => {
		this.handleItemValueChanged();
	}));
	formItemInput.registerOnEditingEnd(oFF.UiLambdaEditingEndListener.create((controlEvent) => {
		this.handleItemBlured();
	}));
	formItemInput.registerOnEnter(oFF.UiLambdaEnterListener.create((controlEvent) => {
		this.handleItemEnterPressed();
	}));
	return formItemInput;
};
oFF.UiFormItemInput.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemInput.prototype.refreshModelValue = function()
{
	this.updateModelValueByString(this.getFormItemControl().getValue());
};
oFF.UiFormItemInput.prototype.releaseObject = function()
{
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemInput.prototype.setAutoComplete = function(autocomplete)
{
	this.getFormItemControl().setAutocomplete(autocomplete);
	return this;
};
oFF.UiFormItemInput.prototype.setEditable = function(editable)
{
	this.getFormItemControl().setEditable(editable);
	return this;
};
oFF.UiFormItemInput.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemInput.prototype.setInputType = function(inputType)
{
	this.m_inputType = oFF.notNull(inputType) ? inputType : oFF.UiInputType.TEXT;
	this.getFormItemControl().setInputType(this.m_inputType);
	return this;
};
oFF.UiFormItemInput.prototype.setInvalidState = function(reason)
{
	this.getFormItemControl().setValueState(oFF.UiValueState.ERROR);
	this.getFormItemControl().setValueStateText(reason);
};
oFF.UiFormItemInput.prototype.setPlaceholder = function(placeholder)
{
	this.m_placeholder = placeholder;
	this.getFormItemControl().setPlaceholder(this.m_placeholder);
	return this;
};
oFF.UiFormItemInput.prototype.setValidState = function()
{
	this.getFormItemControl().setValueState(oFF.UiValueState.NONE);
	this.getFormItemControl().setValueStateText(null);
};
oFF.UiFormItemInput.prototype.setValueHelpProcedure = function(valueHelpProcedure)
{
	this.m_valueHelpProcedure = valueHelpProcedure;
	if (oFF.notNull(this.m_valueHelpProcedure))
	{
		this.getFormItemControl().setShowValueHelp(true);
		this.getFormItemControl().registerOnValueHelpRequest(oFF.UiLambdaValueHelpRequestListener.create((control) => {
			this.m_valueHelpProcedure();
		}));
	}
	else
	{
		this.getFormItemControl().setShowValueHelp(false);
		this.getFormItemControl().registerOnValueHelpRequest(null);
	}
	return this;
};
oFF.UiFormItemInput.prototype.updateControlValue = function()
{
	this.getFormItemControl().setValue(this.getModelValueAsString());
};

oFF.UiFormItemList = function() {};
oFF.UiFormItemList.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemList.prototype._ff_c = "UiFormItemList";

oFF.UiFormItemList.FORM_ITEM_KEY_PREFIX = "FormItem_";
oFF.UiFormItemList.create = function(parentForm, key, value, text, itemsType)
{
	let newFormItem = new oFF.UiFormItemList();
	newFormItem._setupInternal(parentForm, key, value, text, itemsType);
	return newFormItem;
};
oFF.UiFormItemList.prototype.m_extraFormControls = null;
oFF.UiFormItemList.prototype.m_initialValues = null;
oFF.UiFormItemList.prototype.m_internalForm = null;
oFF.UiFormItemList.prototype.m_itemsLayout = null;
oFF.UiFormItemList.prototype.m_itemsType = null;
oFF.UiFormItemList.prototype.m_rootLayout = null;
oFF.UiFormItemList.prototype._checkListValidationState = function()
{
	if (this.m_internalForm.isValid())
	{
		this.setValid();
	}
	else
	{
		this.setInvalid("");
	}
};
oFF.UiFormItemList.prototype._createListItem = function(value)
{
	let itemLayout = this.m_itemsLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT).setDirection(oFF.UiFlexDirection.ROW);
	let dataInputFormItem = null;
	let formItemKey = this._getFormItemKey(this.m_itemsLayout.getNumberOfItems());
	if (this.m_itemsType.isString() || this.m_itemsType.isNumber())
	{
		let stringValue = oFF.notNull(value) ? value.getStringRepresentation() : "";
		let formItemInput = this.m_internalForm.addInput(formItemKey, stringValue, null);
		formItemInput.setInputType(this._getInputType());
		dataInputFormItem = formItemInput;
	}
	else if (this.m_itemsType.isBoolean())
	{
		let booleanValue = oFF.XValueUtil.getBoolean(value, false, true);
		dataInputFormItem = this.m_internalForm.addSwitch(formItemKey, booleanValue, null);
	}
	if (oFF.notNull(dataInputFormItem))
	{
		this.m_internalForm.addFormItem(dataInputFormItem);
		dataInputFormItem.setFlex("auto");
		let inputView = dataInputFormItem.getView().setPadding(oFF.UiCssBoxEdges.create("0 0.25rem 0 0"));
		itemLayout.addItem(inputView);
		let deleteBtn = oFF.UiFormButton.create(this.m_internalForm, null, null, "Delete", "sys-cancel", () => {
			this.m_internalForm.removeFormItemByKey(formItemKey);
			this.m_itemsLayout.removeItem(itemLayout);
			this.handleItemValueChanged();
		});
		this.m_extraFormControls.add(deleteBtn);
		itemLayout.addItem(deleteBtn.getView());
	}
};
oFF.UiFormItemList.prototype._extractInitialValues = function(initialValues, itemsType)
{
	let items = oFF.XList.create();
	if (oFF.notNull(initialValues))
	{
		let values = initialValues.getValuesAsReadOnlyList();
		oFF.XCollectionUtils.forEach(values, (value) => {
			if (oFF.isNull(value))
			{
				items.add(null);
			}
			else if (value.getValueType() === itemsType)
			{
				if (itemsType.isString())
				{
					items.add(oFF.XStringValue.create(value.asString().getString()));
				}
				else if (itemsType.isNumber() || itemsType.isBoolean())
				{
					items.add(value);
				}
				else
				{
					throw oFF.XException.createRuntimeException("Unsupported item type detected. Only strings and numbers are currently supported. ");
				}
			}
			else
			{
				throw oFF.XException.createRuntimeException("Value type mismatch in UiFormItemList elements");
			}
		});
	}
	return items;
};
oFF.UiFormItemList.prototype._getDefaultValue = function()
{
	let defaultValue = null;
	if (this.m_itemsType.isString())
	{
		defaultValue = oFF.XStringValue.create("");
	}
	else if (this.m_itemsType.isBoolean())
	{
		defaultValue = oFF.XBooleanValue.create(false);
	}
	return defaultValue;
};
oFF.UiFormItemList.prototype._getFormItemKey = function(index)
{
	return oFF.XStringUtils.concatenateWithInt(oFF.UiFormItemList.FORM_ITEM_KEY_PREFIX, index);
};
oFF.UiFormItemList.prototype._getInputType = function()
{
	return this.m_itemsType.isNumber() ? oFF.UiInputType.NUMBER : oFF.UiInputType.TEXT;
};
oFF.UiFormItemList.prototype._layoutInitialItems = function()
{
	oFF.XCollectionUtils.forEach(this.m_initialValues, this._createListItem.bind(this));
};
oFF.UiFormItemList.prototype._setupInternal = function(parentForm, key, value, text, itemsType)
{
	this.m_itemsType = itemsType;
	this.m_initialValues = this._extractInitialValues(value, itemsType);
	this.m_extraFormControls = oFF.XList.create();
	this.m_internalForm = oFF.UiForm.create(parentForm.getGenesis());
	this.m_internalForm.setItemEnterPressedConsumer((tmpItem) => {
		this.handleItemEnterPressed();
	});
	this.m_internalForm.setModelChangedConsumer((formModel) => {
		this.handleItemValueChanged();
	});
	parentForm.addChildForm(this.m_internalForm);
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemList.prototype.createFormItemControl = function(genesis)
{
	this.m_rootLayout = genesis.newControl(oFF.UiType.FLEX_LAYOUT).setDirection(oFF.UiFlexDirection.COLUMN);
	this.m_itemsLayout = this.m_rootLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT).setDirection(oFF.UiFlexDirection.COLUMN);
	this._layoutInitialItems();
	let footerLayout = this.m_rootLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT).setDirection(oFF.UiFlexDirection.ROW_REVERSE);
	let addBtn = oFF.UiFormButton.create(this.m_internalForm, null, "Add Entry", "Add", "add", () => {
		let defaultValue = this._getDefaultValue();
		this._createListItem(defaultValue);
		this.handleItemValueChanged();
	});
	addBtn.setButtonType(oFF.UiButtonType.PRIMARY);
	this.m_extraFormControls.add(addBtn);
	footerLayout.addItem(addBtn.getView());
	return this.m_rootLayout;
};
oFF.UiFormItemList.prototype.getValueType = function()
{
	return oFF.XValueType.LIST;
};
oFF.UiFormItemList.prototype.isValid = function()
{
	this._checkListValidationState();
	return oFF.DfUiFormItem.prototype.isValid.call( this );
};
oFF.UiFormItemList.prototype.refreshModelValue = function()
{
	let modelValues = this.m_internalForm.getJsonModel().getValuesAsReadOnlyList();
	let list = oFF.PrFactory.createList();
	list.addAll(modelValues);
	this.updateModelValueByList(list);
};
oFF.UiFormItemList.prototype.releaseObject = function()
{
	this.m_extraFormControls = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_extraFormControls);
	this.getParentForm().removeChildForm(this.m_internalForm);
	this.m_internalForm = oFF.XObjectExt.release(this.m_internalForm);
	this.m_itemsLayout = oFF.XObjectExt.release(this.m_itemsLayout);
	this.m_rootLayout = oFF.XObjectExt.release(this.m_rootLayout);
	this.m_initialValues = oFF.XObjectExt.release(this.m_initialValues);
	this.m_itemsType = null;
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemList.prototype.setEditable = function(editable)
{
	this.setEnabled(editable);
	return this;
};
oFF.UiFormItemList.prototype.setEnabled = function(enabled)
{
	oFF.XCollectionUtils.forEach(this.m_itemsLayout.getItems(), (item) => {
		let itemLayout = item;
		oFF.XCollectionUtils.forEach(itemLayout.getItems(), (childItem) => {
			if (childItem.getUiType() === oFF.UiType.INPUT)
			{
				let control = childItem;
				control.setEnabled(enabled);
			}
			else if (childItem.getUiType() === oFF.UiType.SWITCH)
			{
				let control = childItem;
				control.setEnabled(enabled);
			}
			else if (childItem.getUiType() === oFF.UiType.BUTTON)
			{
				let control = childItem;
				control.setEnabled(enabled);
			}
		});
	});
	return this;
};
oFF.UiFormItemList.prototype.setInvalidState = function(reason)
{
	this.getFormLabel().applyErrorState(reason);
};
oFF.UiFormItemList.prototype.setValidState = function()
{
	this.getFormLabel().removeErrorState();
};
oFF.UiFormItemList.prototype.updateControlValue = function() {};
oFF.UiFormItemList.prototype.validate = function()
{
	this.m_internalForm.validate();
	this._checkListValidationState();
};

oFF.UiFormItemRadioGroup = function() {};
oFF.UiFormItemRadioGroup.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemRadioGroup.prototype._ff_c = "UiFormItemRadioGroup";

oFF.UiFormItemRadioGroup.create = function(parentForm, key, value, text, radioGroupItems)
{
	let newFormItem = new oFF.UiFormItemRadioGroup();
	newFormItem._setupInternal(parentForm, key, value, text, radioGroupItems);
	return newFormItem;
};
oFF.UiFormItemRadioGroup.prototype.m_radioGroupItems = null;
oFF.UiFormItemRadioGroup.prototype._fillRadioGroup = function(formItemRadioGroup)
{
	if (oFF.notNull(this.m_radioGroupItems) && this.m_radioGroupItems.size() > 0)
	{
		oFF.XCollectionUtils.forEach(this.m_radioGroupItems.getKeysAsReadOnlyList(), (key) => {
			let tmpText = this.m_radioGroupItems.getByKey(key);
			let tmpRb = formItemRadioGroup.addNewRadioButton();
			tmpRb.setName(key);
			tmpRb.setText(tmpText);
		});
		if (this.getValue() !== null && this.m_radioGroupItems.containsKey(this.getModelValueAsString()))
		{
			formItemRadioGroup.setSelectedName(this.getModelValueAsString());
		}
		else
		{
			formItemRadioGroup.setSelectedItemByIndex(0);
		}
	}
};
oFF.UiFormItemRadioGroup.prototype._handleSelect = function()
{
	this.handleItemValueChanged();
	this.handleItemBlured();
};
oFF.UiFormItemRadioGroup.prototype._setupInternal = function(parentForm, key, value, text, radioGroupItems)
{
	this.m_radioGroupItems = radioGroupItems;
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemRadioGroup.prototype.createFormItemControl = function(genesis)
{
	let radioGroup = genesis.newControl(oFF.UiType.RADIO_BUTTON_GROUP);
	radioGroup.registerOnSelect(oFF.UiLambdaSelectListener.create((controlEvent) => {
		this._handleSelect();
	}));
	this._fillRadioGroup(radioGroup);
	return radioGroup;
};
oFF.UiFormItemRadioGroup.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemRadioGroup.prototype.refreshModelValue = function()
{
	let value = this.getFormItemControl().getSelectedName();
	this.updateModelValueByString(value);
};
oFF.UiFormItemRadioGroup.prototype.releaseObject = function()
{
	this.m_radioGroupItems = null;
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemRadioGroup.prototype.setEditable = function(editable)
{
	return this;
};
oFF.UiFormItemRadioGroup.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemRadioGroup.prototype.setInvalidState = function(reason)
{
	this.getFormItemControl().setValueState(oFF.UiValueState.ERROR);
};
oFF.UiFormItemRadioGroup.prototype.setValidState = function()
{
	this.getFormItemControl().setValueState(oFF.UiValueState.NONE);
};
oFF.UiFormItemRadioGroup.prototype.updateControlValue = function()
{
	this.getFormItemControl().setSelectedName(this.getModelValueAsString());
};

oFF.UiFormItemSegmentedButton = function() {};
oFF.UiFormItemSegmentedButton.prototype = new oFF.DfUiFormItem();
oFF.UiFormItemSegmentedButton.prototype._ff_c = "UiFormItemSegmentedButton";

oFF.UiFormItemSegmentedButton.create = function(parentForm, key, value, text, segmentedButtonItems)
{
	let newFormItem = new oFF.UiFormItemSegmentedButton();
	newFormItem._setupInternal(parentForm, key, value, text, segmentedButtonItems);
	return newFormItem;
};
oFF.UiFormItemSegmentedButton.prototype.m_segmentedButtonItems = null;
oFF.UiFormItemSegmentedButton.prototype._fillSegmentedButtonItems = function(formItemSegmentedButton)
{
	if (oFF.XCollectionUtils.hasElements(this.m_segmentedButtonItems))
	{
		oFF.XCollectionUtils.forEach(this.m_segmentedButtonItems, (option) => {
			let tmpSbItem = formItemSegmentedButton.addNewItem();
			tmpSbItem.setName(option.getKey());
			tmpSbItem.setText(option.getText());
			tmpSbItem.setIcon(option.getIcon());
			tmpSbItem.setTooltip(option.getTooltip());
		});
		if (this.getValue() !== null && oFF.XCollectionUtils.contains(this.m_segmentedButtonItems, (option) => {
			return oFF.XString.isEqual(option.getKey(), this.getModelValueAsString());
		}))
		{
			formItemSegmentedButton.setSelectedName(this.getModelValueAsString());
		}
		else
		{
			formItemSegmentedButton.setSelectedItemByIndex(0);
		}
	}
};
oFF.UiFormItemSegmentedButton.prototype._handleSelectionChange = function()
{
	this.handleItemValueChanged();
	this.handleItemBlured();
};
oFF.UiFormItemSegmentedButton.prototype._setupInternal = function(parentForm, key, value, text, segmentedButtonItems)
{
	this.m_segmentedButtonItems = segmentedButtonItems;
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemSegmentedButton.prototype.createFormItemControl = function(genesis)
{
	let formItemSegmentedButton = genesis.newControl(oFF.UiType.SEGMENTED_BUTTON);
	formItemSegmentedButton.setWidth(oFF.UiCssLength.create("100%"));
	formItemSegmentedButton.registerOnSelectionChange(oFF.UiLambdaSelectionChangeListener.create((selectionEvent) => {
		this._handleSelectionChange();
	}));
	this._fillSegmentedButtonItems(formItemSegmentedButton);
	return formItemSegmentedButton;
};
oFF.UiFormItemSegmentedButton.prototype.getValueType = function()
{
	return oFF.XValueType.STRING;
};
oFF.UiFormItemSegmentedButton.prototype.refreshModelValue = function()
{
	let value = this.getFormItemControl().getSelectedName();
	this.updateModelValueByString(value);
};
oFF.UiFormItemSegmentedButton.prototype.releaseObject = function()
{
	this.m_segmentedButtonItems = null;
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormItemSegmentedButton.prototype.setEditable = function(editable)
{
	this.setEnabled(editable);
	return this;
};
oFF.UiFormItemSegmentedButton.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemSegmentedButton.prototype.setInvalidState = function(reason)
{
	this.getFormLabel().applyErrorState(reason);
};
oFF.UiFormItemSegmentedButton.prototype.setValidState = function()
{
	this.getFormLabel().removeErrorState();
};
oFF.UiFormItemSegmentedButton.prototype.updateControlValue = function()
{
	this.getFormItemControl().setSelectedName(this.getModelValueAsString());
};

oFF.UiFormSection = function() {};
oFF.UiFormSection.prototype = new oFF.DfUiFormItem();
oFF.UiFormSection.prototype._ff_c = "UiFormSection";

oFF.UiFormSection.FORM_SECTION_ERROR_LABEL_TAG = "ffFormSectionErrorLabel";
oFF.UiFormSection.FORM_SECTION_ERROR_WRAPPER_TAG = "ffFormSectionErrorWrapper";
oFF.UiFormSection.create = function(parentForm, key, text, isHorizontal)
{
	let newFormItem = new oFF.UiFormSection();
	newFormItem._setupInternal(parentForm, key, text, isHorizontal);
	return newFormItem;
};
oFF.UiFormSection.prototype.m_alwaysShowSectionMarker = false;
oFF.UiFormSection.prototype.m_errorLbl = null;
oFF.UiFormSection.prototype.m_errorWrapper = null;
oFF.UiFormSection.prototype.m_expandPanel = false;
oFF.UiFormSection.prototype.m_internalForm = null;
oFF.UiFormSection.prototype.m_sectionBlurTimeoutId = null;
oFF.UiFormSection.prototype.m_showSectionAsPanel = false;
oFF.UiFormSection.prototype.m_showSectionMarkerDuringValidation = false;
oFF.UiFormSection.prototype._addScreenReaderSupport = function(formItem)
{
	let sectionLabel = this.getFormLabel();
	if (oFF.notNull(sectionLabel))
	{
		let formItemBase = formItem;
		formItemBase.addSectionLabelToLabelledBy(sectionLabel);
	}
};
oFF.UiFormSection.prototype._checkSectionValidationState = function()
{
	if (this.m_internalForm.isValid())
	{
		this.setValid();
	}
	else
	{
		this.setInvalid("");
	}
	this.executeCustomValidator();
};
oFF.UiFormSection.prototype._createErrorWrapper = function(genesis)
{
	this.m_errorWrapper = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	this.m_errorWrapper.setTag(oFF.UiFormSection.FORM_SECTION_ERROR_WRAPPER_TAG);
	this.m_errorWrapper.setDirection(oFF.UiFlexDirection.ROW);
	this.m_errorWrapper.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_errorWrapper.useMaxWidth();
	this.m_errorWrapper.setVisible(false);
	if (!this.m_showSectionAsPanel)
	{
		this.m_errorWrapper.setPadding(oFF.UiCssBoxEdges.create("0.2rem 0.3rem 0 0"));
	}
	let alertIcon = this.m_errorWrapper.addNewItemOfType(oFF.UiType.ICON);
	alertIcon.setIcon("alert");
	alertIcon.setEnabled(false);
	alertIcon.setColor(oFF.UtStyles.ERROR_COLOR);
	alertIcon.setIconSize(oFF.UiCssLength.create("0.75rem"));
	alertIcon.setMargin(oFF.UiCssBoxEdges.create("0 0.325rem 0 0"));
	this.m_errorLbl = this.m_errorWrapper.addNewItemOfType(oFF.UiType.LABEL);
	this.m_errorLbl.setTag(oFF.UiFormSection.FORM_SECTION_ERROR_LABEL_TAG);
	this.m_errorLbl.setFontColor(oFF.UtStyles.ERROR_COLOR);
	this.m_errorLbl.setFontSize(oFF.UiCssLength.create("0.75rem"));
	this.m_errorLbl.setWrapping(false);
};
oFF.UiFormSection.prototype._handleSectionItemBlured = function()
{
	oFF.XTimeout.clear(this.m_sectionBlurTimeoutId);
	this.m_sectionBlurTimeoutId = oFF.XTimeout.timeout(oFF.UiFormBaseConstants.ITEM_INITIAL_BLUR_DELAY, () => {
		this._checkSectionValidationState();
	});
};
oFF.UiFormSection.prototype._setupInternal = function(parentForm, key, text, isHorizontal)
{
	this.m_alwaysShowSectionMarker = false;
	this.m_showSectionMarkerDuringValidation = true;
	this.m_showSectionAsPanel = false;
	this.m_expandPanel = false;
	let newForm = oFF.UiForm.create(parentForm.getGenesis());
	this.m_internalForm = newForm;
	this.m_internalForm.setHorizontal(isHorizontal);
	this.m_internalForm.setInternalItemBlurConsumer((bluredItem) => {
		this._handleSectionItemBlured();
	});
	this.m_internalForm.setItemEnterPressedConsumer((tmpItem) => {
		this.handleItemEnterPressed();
	});
	this.m_internalForm.setModelChangedConsumer((formModel) => {
		this.handleItemValueChanged();
	});
	parentForm.addChildForm(this.m_internalForm);
	this._createErrorWrapper(parentForm.getGenesis());
	this.setupFormItem(parentForm, key, null, text);
};
oFF.UiFormSection.prototype._showSectionMarkerInternal = function(showMarker, borderColor)
{
	if (showMarker)
	{
		this.getFormControl().setBorderStyle(oFF.UiBorderStyle.SOLID);
		this.getFormControl().setBorderWidth(oFF.UiCssBoxEdges.create("0px 0px 0px 2px"));
		this.getFormControl().setBorderColor(borderColor);
		this.getFormControl().setPadding(oFF.UiCssBoxEdges.create("0px 0px 0px 5px"));
	}
	else
	{
		this.getFormControl().setBorderStyle(null);
		this.getFormControl().setBorderWidth(null);
		this.getFormControl().setBorderColor(null);
		this.getFormControl().setPadding(null);
	}
};
oFF.UiFormSection.prototype.addCheckbox = function(key, value, text)
{
	let checkbox = this.m_internalForm.addCheckbox(key, value, text);
	this._addScreenReaderSupport(checkbox);
	return checkbox;
};
oFF.UiFormSection.prototype.addColorPicker = function(key, value, text)
{
	let colorPicker = this.m_internalForm.addColorPicker(key, value, text);
	this._addScreenReaderSupport(colorPicker);
	return colorPicker;
};
oFF.UiFormSection.prototype.addComboBox = function(key, value, text, dropdownItems, addEmptyItem)
{
	let comboBox = this.m_internalForm.addComboBox(key, value, text, dropdownItems, addEmptyItem);
	this._addScreenReaderSupport(comboBox);
	return comboBox;
};
oFF.UiFormSection.prototype.addDropdown = function(key, value, text, dropdownItems, addEmptyItem)
{
	let dropdown = this.m_internalForm.addDropdown(key, value, text, dropdownItems, addEmptyItem);
	this._addScreenReaderSupport(dropdown);
	return dropdown;
};
oFF.UiFormSection.prototype.addFormButton = function(name, text, tooltip, icon, pressProcedure)
{
	return this.m_internalForm.addFormButton(name, text, tooltip, icon, pressProcedure);
};
oFF.UiFormSection.prototype.addFormCustomControl = function(name, customControl)
{
	return this.m_internalForm.addFormCustomControl(name, customControl);
};
oFF.UiFormSection.prototype.addFormLabel = function(name, text, tooltip)
{
	return this.m_internalForm.addFormLabel(name, text, tooltip);
};
oFF.UiFormSection.prototype.addFormList = function(key, value, text, itemsType)
{
	let formList = this.m_internalForm.addFormList(key, value, text, itemsType);
	this._addScreenReaderSupport(formList);
	return formList;
};
oFF.UiFormSection.prototype.addFormSection = function(key, text, isHorizontal)
{
	let formSection = this.m_internalForm.addFormSection(key, text, isHorizontal);
	this._addScreenReaderSupport(formSection);
	return formSection;
};
oFF.UiFormSection.prototype.addFormTitle = function(name, text, tooltip)
{
	return this.m_internalForm.addFormTitle(name, text, tooltip);
};
oFF.UiFormSection.prototype.addInput = function(key, value, text)
{
	let input = this.m_internalForm.addInput(key, value, text);
	this._addScreenReaderSupport(input);
	return input;
};
oFF.UiFormSection.prototype.addRadioGroup = function(key, value, text, radioGroupItems)
{
	let radioGroup = this.m_internalForm.addRadioGroup(key, value, text, radioGroupItems);
	this._addScreenReaderSupport(radioGroup);
	return radioGroup;
};
oFF.UiFormSection.prototype.addSegmentedButton = function(key, value, text, segmentedButtonItems)
{
	let segmentedButton = this.m_internalForm.addSegmentedButton(key, value, text, segmentedButtonItems);
	this._addScreenReaderSupport(segmentedButton);
	return segmentedButton;
};
oFF.UiFormSection.prototype.addSwitch = function(key, value, text)
{
	let formSwitch = this.m_internalForm.addSwitch(key, value, text);
	this._addScreenReaderSupport(formSwitch);
	return formSwitch;
};
oFF.UiFormSection.prototype.alwaysShowSectionMarker = function(alwaysShow)
{
	this.m_alwaysShowSectionMarker = alwaysShow;
	this._showSectionMarkerInternal(alwaysShow, oFF.UtStyles.LIGHT_GRAY_COLOR);
};
oFF.UiFormSection.prototype.clearFormItems = function()
{
	this.m_internalForm.clearFormItems();
};
oFF.UiFormSection.prototype.createFormItemControl = function(genesis)
{
	if (this.m_showSectionAsPanel)
	{
		let panel = genesis.newControl(oFF.UiType.PANEL);
		panel.setExpandable(true);
		panel.setExpanded(this.m_expandPanel);
		panel.setText(this.getText());
		panel.setContent(this.m_internalForm.getView());
		return panel;
	}
	return this.m_internalForm.getView();
};
oFF.UiFormSection.prototype.defaultFormLabelFontWeigt = function()
{
	return oFF.UiFontWeight.BOLD;
};
oFF.UiFormSection.prototype.focus = function()
{
	if (oFF.notNull(this.m_internalForm))
	{
		oFF.XStream.of(this.m_internalForm.getAllFormControls()).filter((control) => {
			return control.isVisible() && control.isEnabled();
		}).findAny().ifPresent((item) => {
			item.focus();
		});
	}
};
oFF.UiFormSection.prototype.getAllFormControls = function()
{
	return this.m_internalForm.getAllFormControls();
};
oFF.UiFormSection.prototype.getAllFormItems = function()
{
	return this.m_internalForm.getAllFormItems();
};
oFF.UiFormSection.prototype.getFormControlByName = function(name)
{
	return this.m_internalForm.getFormControlByName(name);
};
oFF.UiFormSection.prototype.getFormItemByKey = function(key)
{
	return this.m_internalForm.getFormItemByKey(key);
};
oFF.UiFormSection.prototype.getValue = function()
{
	return this.m_internalForm.getJsonModel();
};
oFF.UiFormSection.prototype.getValueType = function()
{
	return oFF.XValueType.STRUCTURE;
};
oFF.UiFormSection.prototype.hasFormItems = function()
{
	return this.m_internalForm.hasFormItems();
};
oFF.UiFormSection.prototype.isEmpty = function()
{
	let isEmpty = true;
	let formItemIterator = this.getAllFormItems().getIterator();
	while (formItemIterator.hasNext())
	{
		let tmpFormItem = formItemIterator.next();
		if (!tmpFormItem.isEmpty())
		{
			isEmpty = false;
			break;
		}
	}
	return isEmpty;
};
oFF.UiFormSection.prototype.isRequired = function()
{
	return false;
};
oFF.UiFormSection.prototype.isRequiredValid = function()
{
	return true;
};
oFF.UiFormSection.prototype.isValid = function()
{
	this._checkSectionValidationState();
	return oFF.DfUiFormItem.prototype.isValid.call( this );
};
oFF.UiFormSection.prototype.layoutFormItem = function()
{
	oFF.DfUiFormItem.prototype.layoutFormItem.call( this );
	let sectionWrapper = this.getFormControl();
	sectionWrapper.addItem(this.m_errorWrapper);
};
oFF.UiFormSection.prototype.refreshModelValue = function()
{
	this.m_internalForm.collectModelValues();
};
oFF.UiFormSection.prototype.releaseObject = function()
{
	this.m_errorLbl = oFF.XObjectExt.release(this.m_errorLbl);
	this.m_errorWrapper = oFF.XObjectExt.release(this.m_errorWrapper);
	this.getParentForm().removeChildForm(this.m_internalForm);
	this.m_internalForm = oFF.XObjectExt.release(this.m_internalForm);
	oFF.XTimeout.clear(this.m_sectionBlurTimeoutId);
	oFF.DfUiFormItem.prototype.releaseObject.call( this );
};
oFF.UiFormSection.prototype.removeFormControlByName = function(name)
{
	return this.m_internalForm.removeFormControlByName(name);
};
oFF.UiFormSection.prototype.removeFormItemByKey = function(key)
{
	return this.m_internalForm.removeFormItemByKey(key);
};
oFF.UiFormSection.prototype.setEditable = function(editable)
{
	return this;
};
oFF.UiFormSection.prototype.setEnabled = function(enabled)
{
	return this;
};
oFF.UiFormSection.prototype.setGap = function(gap)
{
	return this.m_internalForm.setGap(gap);
};
oFF.UiFormSection.prototype.setInvalidState = function(reason)
{
	if (this.m_showSectionMarkerDuringValidation)
	{
		this._showSectionMarkerInternal(true, oFF.UtStyles.ERROR_COLOR);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(reason))
		{
			this.m_errorWrapper.setVisible(true);
			this.m_errorWrapper.setTooltip(reason);
			this.m_errorLbl.setText(reason);
		}
	}
};
oFF.UiFormSection.prototype.setValidState = function()
{
	if (this.m_showSectionMarkerDuringValidation)
	{
		this._showSectionMarkerInternal(this.m_alwaysShowSectionMarker, oFF.UtStyles.LIGHT_GRAY_COLOR);
		this.m_errorWrapper.setVisible(false);
		this.m_errorWrapper.setTooltip(null);
		this.m_errorLbl.setText(null);
	}
};
oFF.UiFormSection.prototype.setValue = function(value)
{
	return this;
};
oFF.UiFormSection.prototype.shouldRenderFormLabel = function()
{
	return !this.m_showSectionAsPanel;
};
oFF.UiFormSection.prototype.showAsPanel = function(showAsPanel, expanded)
{
	this.m_showSectionAsPanel = showAsPanel;
	this.m_expandPanel = expanded;
	this.rerenderFormItem();
};
oFF.UiFormSection.prototype.showSectionMarkerDuringValidation = function(showDuringValidation)
{
	this.m_showSectionMarkerDuringValidation = showDuringValidation;
};
oFF.UiFormSection.prototype.updateControlValue = function() {};
oFF.UiFormSection.prototype.validate = function()
{
	this.m_internalForm.validate();
	this._checkSectionValidationState();
};

oFF.UiForm = function() {};
oFF.UiForm.prototype = new oFF.XObject();
oFF.UiForm.prototype._ff_c = "UiForm";

oFF.UiForm.create = function(genesis)
{
	let form = new oFF.UiForm();
	form._setupForm(genesis);
	return form;
};
oFF.UiForm.prototype.m_childFormList = null;
oFF.UiForm.prototype.m_dataModel = null;
oFF.UiForm.prototype.m_formControlMap = null;
oFF.UiForm.prototype.m_formItemMap = null;
oFF.UiForm.prototype.m_formLayout = null;
oFF.UiForm.prototype.m_genesis = null;
oFF.UiForm.prototype.m_internalItemBlurConsumer = null;
oFF.UiForm.prototype.m_isSubmitted = false;
oFF.UiForm.prototype.m_itemEnterPressedConsumer = null;
oFF.UiForm.prototype.m_modelChangedConsumer = null;
oFF.UiForm.prototype.m_validationVisibility = null;
oFF.UiForm.prototype._applySettingsToChildForm = function(childForm)
{
	if (oFF.notNull(childForm))
	{
		childForm.setValidationVisibility(this.getValidationVisibility());
	}
};
oFF.UiForm.prototype._applySettingsToChildForms = function()
{
	oFF.XCollectionUtils.forEach(this.m_childFormList, (tmpForm) => {
		this._applySettingsToChildForm(tmpForm);
	});
};
oFF.UiForm.prototype._createFormWrapper = function(genesis)
{
	let layout = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	layout.useMaxWidth();
	layout.addCssClass("ffUiForm");
	layout.setHeight(oFF.UiCssLength.AUTO);
	layout.setDirection(oFF.UiFlexDirection.COLUMN);
	layout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	layout.setAlignItems(oFF.UiFlexAlignItems.STRETCH);
	layout.setGap(oFF.UiCssGap.create("10px"));
	return layout;
};
oFF.UiForm.prototype._notifyInternalItemBlur = function(formItem)
{
	if (oFF.notNull(this.m_internalItemBlurConsumer))
	{
		this.m_internalItemBlurConsumer(formItem);
	}
};
oFF.UiForm.prototype._notifyItemEnterPressed = function(formItem)
{
	if (oFF.notNull(this.m_itemEnterPressedConsumer))
	{
		this.m_itemEnterPressedConsumer(formItem);
	}
};
oFF.UiForm.prototype._notifyModelChanged = function()
{
	if (oFF.notNull(this.m_modelChangedConsumer))
	{
		this.m_modelChangedConsumer(this.m_dataModel);
	}
};
oFF.UiForm.prototype._refreshModel = function()
{
	oFF.XCollectionUtils.forEach(this.m_formItemMap, (formItem) => {
		this._updateModelValue(formItem, false);
	});
};
oFF.UiForm.prototype._setupForm = function(genesis)
{
	this.m_genesis = genesis;
	this.m_isSubmitted = false;
	this.m_validationVisibility = oFF.UiFormValidationVisibility.BLUR;
	this.m_dataModel = oFF.PrStructure.create();
	this.m_formItemMap = oFF.XLinkedHashMapByString.create();
	this.m_formControlMap = oFF.XLinkedHashMapByString.create();
	this.m_childFormList = oFF.XList.create();
	this.m_formLayout = this._createFormWrapper(genesis);
};
oFF.UiForm.prototype._submitChildForms = function()
{
	oFF.XCollectionUtils.forEach(this.m_childFormList, (tmpForm) => {
		tmpForm.submit();
	});
};
oFF.UiForm.prototype._updateModelValue = function(formItem, notifyChanged)
{
	if (oFF.notNull(formItem))
	{
		let key = formItem.getKey();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(key))
		{
			let value = formItem.getValue();
			if (oFF.notNull(value))
			{
				let valueType = value.getValueType();
				if (valueType === oFF.XValueType.STRING)
				{
					let strVal = value;
					this.m_dataModel.putString(key, strVal.getString());
				}
				else if (valueType === oFF.XValueType.BOOLEAN)
				{
					let boolVal = value;
					this.m_dataModel.putBoolean(key, boolVal.getBoolean());
				}
				else if (valueType === oFF.XValueType.INTEGER)
				{
					let intVal = value;
					this.m_dataModel.putInteger(key, intVal.getInteger());
				}
				else if (valueType === oFF.XValueType.DOUBLE)
				{
					let doubleVal = value;
					this.m_dataModel.putDouble(key, doubleVal.getDouble());
				}
				else if (valueType === oFF.XValueType.LIST)
				{
					let listValue = value;
					this.m_dataModel.put(key, listValue);
				}
				else if (valueType === oFF.XValueType.STRUCTURE)
				{
					let structValue = value;
					this.m_dataModel.put(key, structValue);
				}
			}
			else
			{
				this.m_dataModel.putNull(key);
			}
			if (notifyChanged)
			{
				this._notifyModelChanged();
			}
		}
	}
};
oFF.UiForm.prototype.addCheckbox = function(key, value, text)
{
	let checkboxFormItem = oFF.UiFormItemCheckbox.create(this, key, oFF.XBooleanValue.create(value), text);
	this.addFormItem(checkboxFormItem);
	return checkboxFormItem;
};
oFF.UiForm.prototype.addChildForm = function(childForm)
{
	oFF.XCollectionUtils.addIfNotPresent(this.m_childFormList, childForm);
	if (oFF.notNull(childForm) && !childForm.isSubmitted() && this.isSubmitted())
	{
		childForm.submit();
	}
	this._applySettingsToChildForm(childForm);
	return this;
};
oFF.UiForm.prototype.addColorPicker = function(key, value, text)
{
	let colorPickerFormItem = oFF.UiFormItemColorPicker.create(this, key, oFF.XStringValue.create(value), text);
	this.addFormItem(colorPickerFormItem);
	return colorPickerFormItem;
};
oFF.UiForm.prototype.addComboBox = function(key, value, text, dropdownItems, addEmptyItem)
{
	let comboBoxFormItem = oFF.UiFormItemComboBox.create(this, key, oFF.XStringValue.create(value), text, dropdownItems, addEmptyItem);
	this.addFormItem(comboBoxFormItem);
	return comboBoxFormItem;
};
oFF.UiForm.prototype.addDropdown = function(key, value, text, dropdownItems, addEmptyItem)
{
	let dropdownFormItem = oFF.UiFormItemDropdown.create(this, key, oFF.XStringValue.create(value), text, dropdownItems, addEmptyItem);
	this.addFormItem(dropdownFormItem);
	return dropdownFormItem;
};
oFF.UiForm.prototype.addFormButton = function(name, text, tooltip, icon, pressProcedure)
{
	let formButton = oFF.UiFormButton.create(this, name, text, tooltip, icon, pressProcedure);
	this.addFormControl(formButton);
	return formButton;
};
oFF.UiForm.prototype.addFormControl = function(formControl)
{
	if (oFF.notNull(formControl))
	{
		this.m_formLayout.addItem(formControl.getView());
		if (oFF.XStringUtils.isNotNullAndNotEmpty(formControl.getName()))
		{
			this.m_formControlMap.put(formControl.getName(), formControl);
		}
	}
	return this;
};
oFF.UiForm.prototype.addFormCustomControl = function(name, customControl)
{
	let formCustomControl = oFF.UiFormCustomControl.create(this, name, customControl);
	this.addFormControl(formCustomControl);
	return formCustomControl;
};
oFF.UiForm.prototype.addFormItem = function(formItem)
{
	if (oFF.notNull(formItem))
	{
		this.addFormControl(formItem);
		let key = formItem.getKey();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(key) && !this.m_formItemMap.containsKey(key))
		{
			this.m_formItemMap.put(key, formItem);
			this._updateModelValue(formItem, true);
			formItem.setInternalBlurConsumer(() => {
				this._notifyInternalItemBlur(formItem);
			});
			formItem.setInternalValueChangedProcedure(() => {
				this._updateModelValue(formItem, true);
			});
			formItem.setInternalEnterPressedProcedure(() => {
				this._notifyItemEnterPressed(formItem);
			});
		}
	}
	return this;
};
oFF.UiForm.prototype.addFormLabel = function(name, text, tooltip)
{
	let formLabel = oFF.UiFormLabel.create(this, name, text, tooltip);
	this.addFormControl(formLabel);
	return formLabel;
};
oFF.UiForm.prototype.addFormList = function(key, value, text, itemsType)
{
	let formList = oFF.UiFormItemList.create(this, key, value, text, itemsType);
	this.addFormItem(formList);
	return formList;
};
oFF.UiForm.prototype.addFormSection = function(key, text, isHorizontal)
{
	let formSection = oFF.UiFormSection.create(this, key, text, isHorizontal);
	this.addFormItem(formSection);
	return formSection;
};
oFF.UiForm.prototype.addFormTitle = function(name, text, tooltip)
{
	let formTitle = oFF.UiFormTitle.create(this, name, text, tooltip);
	this.addFormControl(formTitle);
	return formTitle;
};
oFF.UiForm.prototype.addInput = function(key, value, text)
{
	let inputFormItem = oFF.UiFormItemInput.create(this, key, oFF.XStringValue.create(value), text);
	this.addFormItem(inputFormItem);
	return inputFormItem;
};
oFF.UiForm.prototype.addRadioGroup = function(key, value, text, radioGroupItems)
{
	let radioGroupFormItem = oFF.UiFormItemRadioGroup.create(this, key, oFF.XStringValue.create(value), text, radioGroupItems);
	this.addFormItem(radioGroupFormItem);
	return radioGroupFormItem;
};
oFF.UiForm.prototype.addSegmentedButton = function(key, value, text, segmentedButtonItems)
{
	let segmentedButtonFormItem = oFF.UiFormItemSegmentedButton.create(this, key, oFF.XStringValue.create(value), text, segmentedButtonItems);
	this.addFormItem(segmentedButtonFormItem);
	return segmentedButtonFormItem;
};
oFF.UiForm.prototype.addSwitch = function(key, value, text)
{
	let switchFormItem = oFF.UiFormItemSwitch.create(this, key, oFF.XBooleanValue.create(value), text);
	this.addFormItem(switchFormItem);
	return switchFormItem;
};
oFF.UiForm.prototype.clearFormItems = function()
{
	let keysIterator = this.m_formItemMap.getKeysAsIterator();
	while (keysIterator.hasNext())
	{
		let tmpKey = keysIterator.next();
		this.removeFormItemByKey(tmpKey);
	}
};
oFF.UiForm.prototype.collectModelValues = function()
{
	oFF.XCollectionUtils.forEach(this.m_formItemMap, (formItem) => {
		let tmpFormItem = formItem;
		tmpFormItem.refreshItemModel();
	});
	return this;
};
oFF.UiForm.prototype.getAllFormControls = function()
{
	return this.m_formControlMap.getValuesAsReadOnlyList();
};
oFF.UiForm.prototype.getAllFormItems = function()
{
	return this.m_formItemMap.getValuesAsReadOnlyList();
};
oFF.UiForm.prototype.getErrors = function()
{
	return oFF.XList.create();
};
oFF.UiForm.prototype.getFormControlByName = function(name)
{
	return this.m_formControlMap.getByKey(name);
};
oFF.UiForm.prototype.getFormItemByKey = function(key)
{
	return this.m_formItemMap.getByKey(key);
};
oFF.UiForm.prototype.getGenesis = function()
{
	return this.m_genesis;
};
oFF.UiForm.prototype.getJsonModel = function()
{
	this._refreshModel();
	return this.m_dataModel;
};
oFF.UiForm.prototype.getValidationVisibility = function()
{
	return this.m_validationVisibility;
};
oFF.UiForm.prototype.getView = function()
{
	return this.m_formLayout;
};
oFF.UiForm.prototype.hasFormItems = function()
{
	return this.m_formItemMap.hasElements();
};
oFF.UiForm.prototype.isDirty = function()
{
	return oFF.XCollectionUtils.contains(this.m_formItemMap, (formItem) => {
		return formItem.isDirty();
	});
};
oFF.UiForm.prototype.isPristine = function()
{
	return oFF.XCollectionUtils.ensureAll(this.m_formItemMap, (formItem) => {
		return formItem.isPristine();
	});
};
oFF.UiForm.prototype.isSubmitted = function()
{
	return this.m_isSubmitted;
};
oFF.UiForm.prototype.isTouched = function()
{
	return oFF.XCollectionUtils.ensureAll(this.m_formItemMap, (formItem) => {
		return formItem.isTouched();
	});
};
oFF.UiForm.prototype.isUntouched = function()
{
	return oFF.XCollectionUtils.contains(this.m_formItemMap, (formItem) => {
		return formItem.isUntouched();
	});
};
oFF.UiForm.prototype.isValid = function()
{
	return oFF.XCollectionUtils.ensureAll(this.m_formItemMap, (formItem) => {
		return formItem.isValid();
	});
};
oFF.UiForm.prototype.releaseObject = function()
{
	this.m_genesis = null;
	this.m_itemEnterPressedConsumer = null;
	this.m_modelChangedConsumer = null;
	this.m_internalItemBlurConsumer = null;
	this.m_dataModel = oFF.XObjectExt.release(this.m_dataModel);
	this.m_formItemMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_formItemMap);
	this.m_formControlMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_formControlMap);
	this.m_childFormList = oFF.XCollectionUtils.clearAndReleaseCollection(this.m_childFormList);
	this.m_formLayout = oFF.XObjectExt.release(this.m_formLayout);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.UiForm.prototype.removeChildForm = function(childForm)
{
	if (oFF.notNull(this.m_childFormList) && oFF.notNull(childForm))
	{
		this.m_childFormList.removeElement(childForm);
	}
	return this;
};
oFF.UiForm.prototype.removeFormControlByName = function(name)
{
	let formControl = this.m_formControlMap.getByKey(name);
	if (oFF.notNull(formControl))
	{
		if (formControl.hasModelValue())
		{
			this.removeFormItemByKey(name);
		}
		else
		{
			this.m_formControlMap.remove(name);
			this.m_formLayout.removeItem(formControl.getView());
		}
	}
	return formControl;
};
oFF.UiForm.prototype.removeFormItemByKey = function(key)
{
	this.m_dataModel.remove(key);
	let formItem = this.m_formItemMap.remove(key);
	this.m_formControlMap.remove(key);
	if (oFF.notNull(formItem))
	{
		formItem.setInternalBlurConsumer(null);
		formItem.setInternalValueChangedProcedure(null);
		formItem.setInternalEnterPressedProcedure(null);
		this.m_formLayout.removeItem(formItem.getView());
	}
	return formItem;
};
oFF.UiForm.prototype.setGap = function(gap)
{
	this.m_formLayout.setGap(gap);
	return this;
};
oFF.UiForm.prototype.setHorizontal = function(isHorizontal)
{
	if (isHorizontal)
	{
		this.m_formLayout.setDirection(oFF.UiFlexDirection.ROW);
		this.m_formLayout.setWrap(oFF.UiFlexWrap.WRAP);
		this.m_formLayout.setAlignItems(oFF.UiFlexAlignItems.END);
		this.m_formLayout.setSize(oFF.UiSize.createByCss("100%", "auto"));
	}
	else
	{
		this.m_formLayout.setDirection(oFF.UiFlexDirection.COLUMN);
		this.m_formLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
		this.m_formLayout.setAlignItems(oFF.UiFlexAlignItems.STRETCH);
		this.m_formLayout.useMaxSpace();
	}
	return this;
};
oFF.UiForm.prototype.setInternalItemBlurConsumer = function(consumer)
{
	this.m_internalItemBlurConsumer = consumer;
	return this;
};
oFF.UiForm.prototype.setItemEnterPressedConsumer = function(consumer)
{
	this.m_itemEnterPressedConsumer = consumer;
};
oFF.UiForm.prototype.setModelChangedConsumer = function(modelChangedConsumer)
{
	this.m_modelChangedConsumer = modelChangedConsumer;
};
oFF.UiForm.prototype.setValidationVisibility = function(validationVisibility)
{
	if (oFF.notNull(validationVisibility))
	{
		this.m_validationVisibility = validationVisibility;
		this._applySettingsToChildForms();
	}
};
oFF.UiForm.prototype.submit = function()
{
	this.m_isSubmitted = true;
	this.validate();
	this._submitChildForms();
	return this.isValid();
};
oFF.UiForm.prototype.validate = function()
{
	oFF.XCollectionUtils.forEach(this.m_formItemMap, (formItem) => {
		formItem.validate();
	});
};

oFF.DfUiFlexWidget = function() {};
oFF.DfUiFlexWidget.prototype = new oFF.DfUiWidget();
oFF.DfUiFlexWidget.prototype._ff_c = "DfUiFlexWidget";

oFF.DfUiFlexWidget.prototype.getWidgetControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.FLEX_LAYOUT);
};

oFF.UtPanelWidget = function() {};
oFF.UtPanelWidget.prototype = new oFF.DfUiWidget();
oFF.UtPanelWidget.prototype._ff_c = "UtPanelWidget";

oFF.UtPanelWidget.PANEL_HEADER_HEIGHT = "2.75rem";
oFF.UtPanelWidget.PANEL_HEADER_ICON_SIZE = "1.125rem";
oFF.UtPanelWidget.create = function(genesis, icon, title, toolbarButtons)
{
	let view = new oFF.UtPanelWidget();
	view.m_headerIcon = icon;
	view.m_headerTitle = title;
	view.m_toolbarButtons = toolbarButtons;
	view.initWidget(genesis);
	return view;
};
oFF.UtPanelWidget.prototype.m_headerIcon = null;
oFF.UtPanelWidget.prototype.m_headerTitle = null;
oFF.UtPanelWidget.prototype.m_toolbarButtons = null;
oFF.UtPanelWidget.prototype.destroyWidget = function()
{
	this.m_headerIcon = null;
	this.m_headerTitle = null;
	this.m_toolbarButtons = oFF.XObjectExt.release(this.m_toolbarButtons);
};
oFF.UtPanelWidget.prototype.getWidgetControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.PANEL);
};
oFF.UtPanelWidget.prototype.layoutWidget = function(widgetControl)
{
	widgetControl.useMaxSpace();
	widgetControl.setExpandable(false);
	widgetControl.addCssClass("ffPanelWidget");
	let headerToolbar = widgetControl.setNewHeaderToolbar();
	headerToolbar.addCssClass("ffPanelWidgetToolbar");
	headerToolbar.setHeight(oFF.UiCssLength.create(oFF.UtPanelWidget.PANEL_HEADER_HEIGHT));
	let headerIcon = headerToolbar.addNewItemOfType(oFF.UiType.ICON);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_headerIcon))
	{
		headerIcon.setIcon(this.m_headerIcon);
		headerIcon.setIconSize(oFF.UiCssLength.create(oFF.UtPanelWidget.PANEL_HEADER_ICON_SIZE));
		headerIcon.setMargin(oFF.UiCssBoxEdges.create("0 0.5rem 0 0"));
	}
	let headerTitle = headerToolbar.addNewItemOfType(oFF.UiType.TITLE);
	headerTitle.setText(this.m_headerTitle);
	headerTitle.setTooltip(this.m_headerTitle);
	headerTitle.addCssClass("ffPanelWidgetTitle");
	headerTitle.setTitleLevel(oFF.UiTitleLevel.H_5);
	headerTitle.setTitleStyle(oFF.UiTitleLevel.H_5);
	headerToolbar.addNewItemOfType(oFF.UiType.SPACER);
	oFF.XCollectionUtils.forEach(this.m_toolbarButtons, (button) => {
		headerToolbar.addItem(button);
	});
};
oFF.UtPanelWidget.prototype.setupWidget = function() {};

oFF.UtAvatarWidget = function() {};
oFF.UtAvatarWidget.prototype = new oFF.DfUiWidget();
oFF.UtAvatarWidget.prototype._ff_c = "UtAvatarWidget";

oFF.UtAvatarWidget.create = function(genesis, icon, color, size, popoverContent)
{
	let newWidget = new oFF.UtAvatarWidget();
	newWidget.setupInternal(genesis, icon, color, size, popoverContent);
	return newWidget;
};
oFF.UtAvatarWidget.prototype.m_avatar = null;
oFF.UtAvatarWidget.prototype.m_hoverOnPopover = false;
oFF.UtAvatarWidget.prototype.m_popover = null;
oFF.UtAvatarWidget.prototype.m_popoverContent = null;
oFF.UtAvatarWidget.prototype.destroyWidget = function()
{
	this.m_popover = oFF.XObjectExt.release(this.m_popover);
	this.m_popoverContent = null;
};
oFF.UtAvatarWidget.prototype.getWidgetControl = function(genesis)
{
	return this.m_avatar;
};
oFF.UtAvatarWidget.prototype.layoutWidget = function(widgetControl)
{
	this.m_popover = this.getGenesis().newControl(oFF.UiType.POPOVER);
	this.m_popover.setPlacement(oFF.UiPlacementType.AUTO);
	this.m_popover.registerOnHover(oFF.UiLambdaHoverListener.create((popoverHoverEvent) => {
		this.m_hoverOnPopover = true;
	}));
	this.m_popover.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((popoverHoverEndEvent) => {
		this.m_popover.close();
	}));
	widgetControl.registerOnHover(oFF.UiLambdaHoverListener.create((controlEventHover) => {
		this.m_hoverOnPopover = false;
		this.m_popover.setContent(this.m_popoverContent());
		this.m_popover.openAt(widgetControl);
	}));
	widgetControl.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((controlEventHoverEnd) => {
		oFF.XTimeout.timeout(100, () => {
			if (!this.m_hoverOnPopover)
			{
				this.m_popover.close();
			}
		});
	}));
};
oFF.UtAvatarWidget.prototype.setPopoverPlacement = function(placementType)
{
	if (oFF.notNull(this.m_popover))
	{
		this.m_popover.setPlacement(placementType);
	}
};
oFF.UtAvatarWidget.prototype.setupInternal = function(genesis, icon, color, size, popoverContent)
{
	this.m_avatar = genesis.newControl(oFF.UiType.AVATAR);
	this.m_avatar.setIcon(icon);
	this.m_avatar.setAvatarColor(color);
	this.m_avatar.setAvatarSize(size);
	this.m_popoverContent = popoverContent;
	this.initView(genesis);
};
oFF.UtAvatarWidget.prototype.setupWidget = function() {};

oFF.UtInfoButtonWidget = function() {};
oFF.UtInfoButtonWidget.prototype = new oFF.DfUiWidget();
oFF.UtInfoButtonWidget.prototype._ff_c = "UtInfoButtonWidget";

oFF.UtInfoButtonWidget.POPOVER_CSS_CLASS_SUFFIX = "-popover";
oFF.UtInfoButtonWidget.create = function(genesis, icon, tooltip)
{
	let newWidget = new oFF.UtInfoButtonWidget();
	newWidget.setupInternal(genesis, icon, tooltip);
	return newWidget;
};
oFF.UtInfoButtonWidget.prototype.m_icon = null;
oFF.UtInfoButtonWidget.prototype.m_infoDetailsLabel = null;
oFF.UtInfoButtonWidget.prototype.m_onPressListener = null;
oFF.UtInfoButtonWidget.prototype.m_openOnPress = false;
oFF.UtInfoButtonWidget.prototype.m_popover = null;
oFF.UtInfoButtonWidget.prototype.m_popoverText = null;
oFF.UtInfoButtonWidget.prototype.m_popoverTitle = null;
oFF.UtInfoButtonWidget.prototype.m_tooltip = null;
oFF.UtInfoButtonWidget.prototype.addCssClass = function(cssClass)
{
	oFF.DfUiWidget.prototype.addCssClass.call( this , cssClass);
	this.m_popover.addCssClass(oFF.XStringUtils.concatenate2(cssClass, oFF.UtInfoButtonWidget.POPOVER_CSS_CLASS_SUFFIX));
	return this;
};
oFF.UtInfoButtonWidget.prototype.destroyWidget = function()
{
	this.m_popoverTitle = null;
	this.m_popoverText = null;
	this.m_popover = oFF.XObjectExt.release(this.m_popover);
	this.m_tooltip = null;
	this.m_icon = null;
	this.m_infoDetailsLabel = oFF.XObjectExt.release(this.m_infoDetailsLabel);
	this.m_openOnPress = false;
	this.m_onPressListener = null;
};
oFF.UtInfoButtonWidget.prototype.getWidgetControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.BUTTON).setMargin(oFF.UiCssBoxEdges.create("0"));
};
oFF.UtInfoButtonWidget.prototype.layoutWidget = function(widgetControl)
{
	widgetControl.setIcon(this.m_icon);
	widgetControl.setTooltip(this.m_tooltip);
	widgetControl.registerOnHover(oFF.UiLambdaHoverListener.create((controlEventHover) => {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_popoverText))
		{
			this.m_popover.openAt(widgetControl);
		}
	}));
	widgetControl.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((controlEventHoverEnd) => {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_popoverText))
		{
			if (!this.m_openOnPress)
			{
				this.m_popover.close();
			}
		}
	}));
	widgetControl.registerOnPress(oFF.UiLambdaPressListener.create((controlEventPress) => {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_popoverText))
		{
			if (!this.m_openOnPress || !this.m_popover.isOpen())
			{
				this.m_openOnPress = true;
				this.m_popover.openAt(widgetControl);
			}
			else
			{
				this.m_openOnPress = false;
				this.m_popover.close();
			}
		}
		else
		{
			this.m_onPressListener.onPress(controlEventPress);
		}
	}));
	this.m_popover = this.getGenesis().newControl(oFF.UiType.POPOVER);
	this.m_popover.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
	this.m_popover.setPlacement(oFF.UiPlacementType.AUTO);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_popoverTitle))
	{
		this.m_popover.setTitle(this.m_popoverTitle);
	}
	this.m_popover.registerOnAfterClose(oFF.UiLambdaAfterCloseListener.create((controlAfterClosePress) => {
		this.m_openOnPress = false;
	}));
	this.m_infoDetailsLabel = this.m_popover.setNewContent(oFF.UiType.LABEL);
	this.m_infoDetailsLabel.setWrapping(true);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_popoverText))
	{
		this.m_infoDetailsLabel.setText(this.m_popoverText);
	}
};
oFF.UtInfoButtonWidget.prototype.registerOnPress = function(onPressListener)
{
	this.m_onPressListener = onPressListener;
};
oFF.UtInfoButtonWidget.prototype.removeCssClass = function(cssClass)
{
	oFF.DfUiWidget.prototype.removeCssClass.call( this , cssClass);
	this.m_popover.removeCssClass(oFF.XStringUtils.concatenate2(cssClass, oFF.UtInfoButtonWidget.POPOVER_CSS_CLASS_SUFFIX));
	return this;
};
oFF.UtInfoButtonWidget.prototype.setEnabled = function(enabled)
{
	this.getView().setEnabled(enabled);
};
oFF.UtInfoButtonWidget.prototype.setName = function(name)
{
	oFF.DfUiWidget.prototype.setName.call( this , name);
	this.m_popover.setName(oFF.XStringUtils.concatenate2(name, oFF.UtInfoButtonWidget.POPOVER_CSS_CLASS_SUFFIX));
	return this;
};
oFF.UtInfoButtonWidget.prototype.setPopoverPlacement = function(placementType)
{
	if (oFF.notNull(this.m_popover))
	{
		this.m_popover.setPlacement(placementType);
	}
};
oFF.UtInfoButtonWidget.prototype.setPopoverText = function(text)
{
	this.m_popoverText = text;
	this.m_infoDetailsLabel.setText(this.m_popoverText);
};
oFF.UtInfoButtonWidget.prototype.setPopoverTitle = function(title)
{
	this.m_popoverTitle = title;
};
oFF.UtInfoButtonWidget.prototype.setupInternal = function(genesis, icon, tooltip)
{
	this.m_icon = icon;
	this.m_tooltip = tooltip;
	this.initView(genesis);
};
oFF.UtInfoButtonWidget.prototype.setupWidget = function() {};

oFF.UtInfoIconWidget = function() {};
oFF.UtInfoIconWidget.prototype = new oFF.DfUiWidget();
oFF.UtInfoIconWidget.prototype._ff_c = "UtInfoIconWidget";

oFF.UtInfoIconWidget.POPOVER_CSS_CLASS_SUFFIX = "-popover";
oFF.UtInfoIconWidget.create = function(genesis, title, text)
{
	let newWidget = new oFF.UtInfoIconWidget();
	newWidget.setupInternal(genesis, title, text);
	return newWidget;
};
oFF.UtInfoIconWidget.prototype.m_icon = null;
oFF.UtInfoIconWidget.prototype.m_infoDetailsLabel = null;
oFF.UtInfoIconWidget.prototype.m_openOnPress = false;
oFF.UtInfoIconWidget.prototype.m_popover = null;
oFF.UtInfoIconWidget.prototype.m_text = null;
oFF.UtInfoIconWidget.prototype.m_title = null;
oFF.UtInfoIconWidget.prototype.addCssClass = function(cssClass)
{
	oFF.DfUiWidget.prototype.addCssClass.call( this , cssClass);
	this.m_popover.addCssClass(oFF.XStringUtils.concatenate2(cssClass, oFF.UtInfoIconWidget.POPOVER_CSS_CLASS_SUFFIX));
	return this;
};
oFF.UtInfoIconWidget.prototype.destroyWidget = function()
{
	this.m_infoDetailsLabel = oFF.XObjectExt.release(this.m_infoDetailsLabel);
	this.m_popover = oFF.XObjectExt.release(this.m_popover);
};
oFF.UtInfoIconWidget.prototype.getWidgetControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.ICON);
};
oFF.UtInfoIconWidget.prototype.layoutWidget = function(widgetControl)
{
	widgetControl.setIcon(this.m_icon);
	widgetControl.registerOnHover(oFF.UiLambdaHoverListener.create((controlEventHover) => {
		this.m_popover.openAt(widgetControl);
	}));
	widgetControl.registerOnHoverEnd(oFF.UiLambdaHoverEndListener.create((controlEventHoverEnd) => {
		if (!this.m_openOnPress)
		{
			this.m_popover.close();
		}
	}));
	widgetControl.registerOnPress(oFF.UiLambdaPressListener.create((controlEventPress) => {
		if (!this.m_openOnPress || !this.m_popover.isOpen())
		{
			this.m_openOnPress = true;
			this.m_popover.openAt(widgetControl);
		}
		else
		{
			this.m_openOnPress = false;
			this.m_popover.close();
		}
	}));
	this.m_popover = this.getGenesis().newControl(oFF.UiType.POPOVER);
	this.m_popover.setPadding(oFF.UiCssBoxEdges.create("0.5rem"));
	this.m_popover.setPlacement(oFF.UiPlacementType.AUTO);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_title))
	{
		this.m_popover.setTitle(this.m_title);
	}
	this.m_popover.registerOnAfterClose(oFF.UiLambdaAfterCloseListener.create((controlAfterClosePress) => {
		this.m_openOnPress = false;
	}));
	this.m_infoDetailsLabel = this.m_popover.setNewContent(oFF.UiType.LABEL);
	this.m_infoDetailsLabel.setWrapping(true);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_text))
	{
		this.m_infoDetailsLabel.setText(this.m_text);
	}
};
oFF.UtInfoIconWidget.prototype.removeCssClass = function(cssClass)
{
	oFF.DfUiWidget.prototype.removeCssClass.call( this , cssClass);
	this.m_popover.removeCssClass(oFF.XStringUtils.concatenate2(cssClass, oFF.UtInfoIconWidget.POPOVER_CSS_CLASS_SUFFIX));
	return this;
};
oFF.UtInfoIconWidget.prototype.setInfoIcon = function(icon)
{
	this.m_icon = icon;
	if (this.getView() !== null)
	{
		this.getView().setIcon(icon);
	}
};
oFF.UtInfoIconWidget.prototype.setName = function(name)
{
	oFF.DfUiWidget.prototype.setName.call( this , name);
	this.m_popover.setName(oFF.XStringUtils.concatenate2(name, oFF.UtInfoIconWidget.POPOVER_CSS_CLASS_SUFFIX));
	return this;
};
oFF.UtInfoIconWidget.prototype.setPopoverPlacement = function(placementType)
{
	if (oFF.notNull(this.m_popover))
	{
		this.m_popover.setPlacement(placementType);
	}
};
oFF.UtInfoIconWidget.prototype.setPopoverText = function(text)
{
	this.m_text = text;
	if (oFF.notNull(this.m_infoDetailsLabel))
	{
		this.m_infoDetailsLabel.setText(text);
	}
};
oFF.UtInfoIconWidget.prototype.setPopoverTitle = function(title)
{
	this.m_title = title;
	if (oFF.notNull(this.m_popover))
	{
		this.m_popover.setTitle(title);
	}
};
oFF.UtInfoIconWidget.prototype.setupInternal = function(genesis, title, text)
{
	this.m_title = title;
	this.m_text = text;
	this.m_icon = "message-information";
	this.initView(genesis);
};
oFF.UtInfoIconWidget.prototype.setupWidget = function() {};

oFF.UtMessageIconWidget = function() {};
oFF.UtMessageIconWidget.prototype = new oFF.DfUiWidget();
oFF.UtMessageIconWidget.prototype._ff_c = "UtMessageIconWidget";

oFF.UtMessageIconWidget.create = function(genesis, messageType)
{
	let newWidget = new oFF.UtMessageIconWidget();
	newWidget.setupInternal(genesis, messageType);
	return newWidget;
};
oFF.UtMessageIconWidget.prototype.m_clearBtn = null;
oFF.UtMessageIconWidget.prototype.m_clearPressProcedure = null;
oFF.UtMessageIconWidget.prototype.m_messageType = null;
oFF.UtMessageIconWidget.prototype.m_messageView = null;
oFF.UtMessageIconWidget.prototype.m_messages = null;
oFF.UtMessageIconWidget.prototype.m_popover = null;
oFF.UtMessageIconWidget.prototype.m_showClearButton = false;
oFF.UtMessageIconWidget.prototype._executeClearAllProcedure = function()
{
	if (oFF.notNull(this.m_clearPressProcedure))
	{
		this.m_clearPressProcedure();
	}
};
oFF.UtMessageIconWidget.prototype._getColor = function()
{
	if (this.m_messageType === oFF.UiMessageType.ERROR)
	{
		return oFF.UiColor.ERROR;
	}
	if (this.m_messageType === oFF.UiMessageType.WARNING)
	{
		return oFF.UiColor.WARNING;
	}
	if (this.m_messageType === oFF.UiMessageType.SUCCESS)
	{
		return oFF.UiColor.SUCCESS;
	}
	if (this.m_messageType === oFF.UiMessageType.INFORMATION)
	{
		return oFF.UiColor.INFO;
	}
	return oFF.UiColor.INFO;
};
oFF.UtMessageIconWidget.prototype._getIcon = function()
{
	if (this.m_messageType === oFF.UiMessageType.ERROR)
	{
		return "message-error";
	}
	if (this.m_messageType === oFF.UiMessageType.WARNING)
	{
		return "message-warning";
	}
	if (this.m_messageType === oFF.UiMessageType.SUCCESS)
	{
		return "message-success";
	}
	if (this.m_messageType === oFF.UiMessageType.INFORMATION)
	{
		return "message-information";
	}
	return "message-information";
};
oFF.UtMessageIconWidget.prototype._getPopoverTitle = function()
{
	if (this.m_messageType === oFF.UiMessageType.ERROR)
	{
		return "Errors";
	}
	if (this.m_messageType === oFF.UiMessageType.WARNING)
	{
		return "Warnings";
	}
	if (this.m_messageType === oFF.UiMessageType.SUCCESS)
	{
		return "Success";
	}
	if (this.m_messageType === oFF.UiMessageType.INFORMATION)
	{
		return "Information";
	}
	return "Information";
};
oFF.UtMessageIconWidget.prototype._getTooltip = function()
{
	if (this.m_messageType === oFF.UiMessageType.ERROR)
	{
		return oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.getNumberOfMessages()), " errors...");
	}
	if (this.m_messageType === oFF.UiMessageType.WARNING)
	{
		return oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.getNumberOfMessages()), " warning...");
	}
	if (this.m_messageType === oFF.UiMessageType.SUCCESS)
	{
		return oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.getNumberOfMessages()), " success messages...");
	}
	if (this.m_messageType === oFF.UiMessageType.INFORMATION)
	{
		return oFF.XStringUtils.concatenate2(oFF.XInteger.convertToString(this.getNumberOfMessages()), " information messages...");
	}
	return "Information...";
};
oFF.UtMessageIconWidget.prototype._showPopover = function()
{
	if (oFF.isNull(this.m_popover) || !this.m_popover.isOpen())
	{
		if (oFF.isNull(this.m_popover))
		{
			this.m_popover = this.getGenesis().newControl(oFF.UiType.POPOVER);
			this.m_popover.setWidth(oFF.UiCssLength.create("440px"));
			this.m_popover.setHeight(oFF.UiCssLength.create("320px"));
			this.m_popover.setPlacement(oFF.UiPlacementType.TOP);
			this.m_popover.setResizable(true);
			this.m_popover.setTitle(this._getPopoverTitle());
			let headerLayout = this.m_popover.setNewHeader(oFF.UiType.FLEX_LAYOUT);
			headerLayout.setDirection(oFF.UiFlexDirection.ROW);
			headerLayout.setJustifyContent(oFF.UiFlexJustifyContent.SPACE_BETWEEN);
			headerLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
			headerLayout.setPadding(oFF.UiCssBoxEdges.create("0 1rem"));
			headerLayout.setHeight(oFF.UiCssLength.create("2.5rem"));
			let headerTitle = headerLayout.addNewItemOfType(oFF.UiType.TITLE);
			headerTitle.setText(this._getPopoverTitle());
			this.m_clearBtn = headerLayout.addNewItemOfType(oFF.UiType.BUTTON);
			this.m_clearBtn.setText("Clear");
			this.m_clearBtn.setTooltip("Clear All Messages");
			this.m_clearBtn.setIcon("clear-all");
			this.m_clearBtn.setButtonType(oFF.UiButtonType.TRANSPARENT);
			this.m_clearBtn.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
				this._executeClearAllProcedure();
				this.m_popover.close();
			}));
		}
		this.m_clearBtn.setVisible(this.getNumberOfMessages() > 0 ? this.m_showClearButton : false);
		if (oFF.isNull(this.m_messageView))
		{
			this.m_messageView = this.m_popover.setNewContent(oFF.UiType.MESSAGE_VIEW);
			this.m_messageView.setGroupItems(true);
		}
		this.m_messageView.clearItems();
		oFF.XCollectionUtils.forEach(this.m_messages, (tmpMsgItem) => {
			this.m_messageView.addItem(tmpMsgItem);
		});
		this.m_popover.openAt(this.getView());
	}
};
oFF.UtMessageIconWidget.prototype.addMessage = function(title, subtitle, description, groupName)
{
	let newMsgItem = this.getGenesis().newControl(oFF.UiType.MESSAGE_ITEM);
	newMsgItem.setTitle(title);
	newMsgItem.setSubtitle(subtitle);
	newMsgItem.setDescription(description);
	newMsgItem.setMessageType(this.m_messageType);
	newMsgItem.setGroupName(groupName);
	this.m_messages.add(newMsgItem);
	this.getView().setTooltip(this._getTooltip());
	if (oFF.notNull(this.m_messageView))
	{
		this.m_messageView.addItem(newMsgItem);
	}
	return this;
};
oFF.UtMessageIconWidget.prototype.clearAllMessages = function()
{
	if (oFF.notNull(this.m_messageView))
	{
		this.m_messageView.clearItems();
	}
	oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_messages);
	this.m_messages.clear();
	return this;
};
oFF.UtMessageIconWidget.prototype.destroyWidget = function()
{
	this.m_messageView = oFF.XObjectExt.release(this.m_messageView);
	this.m_popover = oFF.XObjectExt.release(this.m_popover);
	this.m_messages = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_messages);
	this.m_clearPressProcedure = null;
};
oFF.UtMessageIconWidget.prototype.getNumberOfMessages = function()
{
	return this.m_messages.size();
};
oFF.UtMessageIconWidget.prototype.getWidgetControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.ICON);
};
oFF.UtMessageIconWidget.prototype.hasMessages = function()
{
	return this.getNumberOfMessages() > 0;
};
oFF.UtMessageIconWidget.prototype.layoutWidget = function(widgetControl)
{
	widgetControl.setIcon(this._getIcon());
	widgetControl.setColor(this._getColor());
	widgetControl.setIconSize(oFF.UiCssLength.create("1rem"));
	widgetControl.setTooltip(this._getTooltip());
	widgetControl.setFlex("0 0 auto");
	widgetControl.registerOnPress(oFF.UiLambdaPressListener.create((controlEvent) => {
		this._showPopover();
	}));
};
oFF.UtMessageIconWidget.prototype.open = function()
{
	if (this.isVisible())
	{
		oFF.XTimeout.timeout(10, () => {
			this._showPopover();
		});
	}
	return this;
};
oFF.UtMessageIconWidget.prototype.setClearPressProcedure = function(pressProcedure)
{
	this.m_clearPressProcedure = pressProcedure;
	return this;
};
oFF.UtMessageIconWidget.prototype.setShowClearButton = function(showClear)
{
	this.m_showClearButton = showClear;
	if (oFF.notNull(this.m_clearBtn))
	{
		this.m_clearBtn.setVisible(showClear);
	}
	return this;
};
oFF.UtMessageIconWidget.prototype.setupInternal = function(genesis, messageType)
{
	this.m_messageType = messageType;
	this.initView(genesis);
};
oFF.UtMessageIconWidget.prototype.setupWidget = function()
{
	if (oFF.isNull(this.m_messageType))
	{
		this.m_messageType = oFF.UiMessageType.INFORMATION;
	}
	this.m_messages = oFF.XList.create();
	this.m_showClearButton = true;
};

oFF.UtTextFilterWidget = function() {};
oFF.UtTextFilterWidget.prototype = new oFF.DfUiWidget();
oFF.UtTextFilterWidget.prototype._ff_c = "UtTextFilterWidget";

oFF.UtTextFilterWidget.create = function(genesis, listToFilter)
{
	let newWidget = new oFF.UtTextFilterWidget();
	newWidget.setupInternal(genesis, listToFilter);
	return newWidget;
};
oFF.UtTextFilterWidget.prototype.m_filterChangedConsumer = null;
oFF.UtTextFilterWidget.prototype.m_filteredList = null;
oFF.UtTextFilterWidget.prototype.m_listToFilter = null;
oFF.UtTextFilterWidget.prototype.m_textFunction = null;
oFF.UtTextFilterWidget.prototype.destroyWidget = function()
{
	this.m_filteredList = oFF.XObjectExt.release(this.m_filteredList);
	this.m_listToFilter = null;
	this.m_textFunction = null;
	this.m_filterChangedConsumer = null;
};
oFF.UtTextFilterWidget.prototype.filterItems = function(searchText, clearButtonPressed)
{
	if (oFF.notNull(this.m_listToFilter) && this.m_listToFilter.hasElements())
	{
		this.m_filteredList.clear();
		if (clearButtonPressed === false)
		{
			for (let a = 0; a < this.m_listToFilter.size(); a++)
			{
				let tmpListItem = this.m_listToFilter.get(a);
				if (this.testItem(searchText, tmpListItem))
				{
					this.m_filteredList.add(tmpListItem);
				}
			}
		}
		else
		{
			oFF.XCollectionUtils.forEach(this.m_listToFilter, (listItem) => {
				this.m_filteredList.add(listItem);
			});
		}
		if (oFF.notNull(this.m_filterChangedConsumer))
		{
			this.m_filterChangedConsumer(this.m_filteredList);
		}
	}
};
oFF.UtTextFilterWidget.prototype.getFilteredList = function()
{
	return this.m_filteredList;
};
oFF.UtTextFilterWidget.prototype.getWidgetControl = function(genesis)
{
	return genesis.newControl(oFF.UiType.SEARCH_FIELD);
};
oFF.UtTextFilterWidget.prototype.handleSearch = function(controlEvent)
{
	if (oFF.notNull(controlEvent))
	{
		let didPressClearButton = controlEvent.getParameters().getBooleanByKeyExt(oFF.UiEventParams.PARAM_CLEAR_BUTTON_PRESSED, false);
		let searchText = controlEvent.getParameters().getStringByKeyExt(oFF.UiEventParams.PARAM_SEARCH_TEXT, "");
		this.filterItems(searchText, didPressClearButton);
	}
};
oFF.UtTextFilterWidget.prototype.layoutWidget = function(widgetControl)
{
	widgetControl.setPlaceholder("Search...");
	widgetControl.registerOnSearch(oFF.UiLambdaSearchListener.create((controlEvent) => {
		this.handleSearch(controlEvent);
	}));
	widgetControl.registerOnLiveChange(oFF.UiLambdaLiveChangeWithDebounceListener.create((controlEven2) => {
		this.filterItems(widgetControl.getValue(), false);
	}, 1000));
	this.reinitFilteredList();
};
oFF.UtTextFilterWidget.prototype.reinitFilteredList = function()
{
	this.m_filteredList.clear();
	oFF.XCollectionUtils.forEach(this.m_listToFilter, (listItem) => {
		this.m_filteredList.add(listItem);
	});
};
oFF.UtTextFilterWidget.prototype.setFilterChangedConsumer = function(consumer)
{
	this.m_filterChangedConsumer = consumer;
};
oFF.UtTextFilterWidget.prototype.setFilterList = function(listToFilter)
{
	this.m_listToFilter = listToFilter;
	this.reinitFilteredList();
};
oFF.UtTextFilterWidget.prototype.setPlaceholder = function(placeholder)
{
	this.getView().setPlaceholder(placeholder);
};
oFF.UtTextFilterWidget.prototype.setTextFunction = function(_function)
{
	this.m_textFunction = _function;
};
oFF.UtTextFilterWidget.prototype.setupInternal = function(genesis, listToFilter)
{
	this.m_listToFilter = listToFilter;
	this.initWidget(genesis);
};
oFF.UtTextFilterWidget.prototype.setupWidget = function()
{
	this.m_filteredList = oFF.XList.create();
};
oFF.UtTextFilterWidget.prototype.testItem = function(searchText, item)
{
	if (oFF.notNull(this.m_textFunction))
	{
		let itemText = this.m_textFunction(item);
		return oFF.XString.containsString(oFF.XString.toLowerCase(itemText), oFF.XString.toLowerCase(searchText));
	}
	return true;
};

oFF.UiFormItemCheckbox = function() {};
oFF.UiFormItemCheckbox.prototype = new oFF.DfUiFormItemSingleLine();
oFF.UiFormItemCheckbox.prototype._ff_c = "UiFormItemCheckbox";

oFF.UiFormItemCheckbox.create = function(parentForm, key, value, text)
{
	let newFormItem = new oFF.UiFormItemCheckbox();
	newFormItem._setupInternal(parentForm, key, value, text);
	return newFormItem;
};
oFF.UiFormItemCheckbox.prototype._handleChange = function()
{
	this.handleItemValueChanged();
	this.handleItemBlured();
};
oFF.UiFormItemCheckbox.prototype._setupInternal = function(parentForm, key, value, text)
{
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemCheckbox.prototype.createFormItemControl = function(genesis)
{
	let formItemCheckbox = genesis.newControl(oFF.UiType.CHECKBOX);
	formItemCheckbox.setChecked(this.getModelValueAsBoolean());
	formItemCheckbox.registerOnChange(oFF.UiLambdaChangeListener.create((controlEvent) => {
		this._handleChange();
	}));
	return formItemCheckbox;
};
oFF.UiFormItemCheckbox.prototype.getValueType = function()
{
	return oFF.XValueType.BOOLEAN;
};
oFF.UiFormItemCheckbox.prototype.isEmpty = function()
{
	return false;
};
oFF.UiFormItemCheckbox.prototype.isRequiredValid = function()
{
	return true;
};
oFF.UiFormItemCheckbox.prototype.refreshModelValue = function()
{
	this.updateModelValueByBoolean(this.getFormItemControl().isChecked());
};
oFF.UiFormItemCheckbox.prototype.releaseObject = function()
{
	oFF.DfUiFormItemSingleLine.prototype.releaseObject.call( this );
};
oFF.UiFormItemCheckbox.prototype.setEditable = function(editable)
{
	this.getFormItemControl().setEnabled(editable);
	return this;
};
oFF.UiFormItemCheckbox.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemCheckbox.prototype.setInvalidState = function(reason)
{
	this.getFormLabel().applyErrorState(reason);
};
oFF.UiFormItemCheckbox.prototype.setValidState = function()
{
	this.getFormLabel().removeErrorState();
};
oFF.UiFormItemCheckbox.prototype.updateControlValue = function()
{
	this.getFormItemControl().setChecked(this.getModelValueAsBoolean());
};

oFF.UiFormItemSwitch = function() {};
oFF.UiFormItemSwitch.prototype = new oFF.DfUiFormItemSingleLine();
oFF.UiFormItemSwitch.prototype._ff_c = "UiFormItemSwitch";

oFF.UiFormItemSwitch.create = function(parentForm, key, value, text)
{
	let newFormItem = new oFF.UiFormItemSwitch();
	newFormItem._setupInternal(parentForm, key, value, text);
	return newFormItem;
};
oFF.UiFormItemSwitch.prototype._handleChange = function()
{
	this.handleItemValueChanged();
	this.handleItemBlured();
};
oFF.UiFormItemSwitch.prototype._setupInternal = function(parentForm, key, value, text)
{
	this.setupFormItem(parentForm, key, value, text);
};
oFF.UiFormItemSwitch.prototype.createFormItemControl = function(genesis)
{
	let formItemSwitch = genesis.newControl(oFF.UiType.SWITCH);
	formItemSwitch.setOn(this.getModelValueAsBoolean());
	formItemSwitch.setMargin(oFF.UiCssBoxEdges.create("0px 0.5rem 0px 0px"));
	formItemSwitch.registerOnChange(oFF.UiLambdaChangeListener.create((controlEvent) => {
		this._handleChange();
	}));
	return formItemSwitch;
};
oFF.UiFormItemSwitch.prototype.getValueType = function()
{
	return oFF.XValueType.BOOLEAN;
};
oFF.UiFormItemSwitch.prototype.isEmpty = function()
{
	return false;
};
oFF.UiFormItemSwitch.prototype.isRequiredValid = function()
{
	return true;
};
oFF.UiFormItemSwitch.prototype.refreshModelValue = function()
{
	this.updateModelValueByBoolean(this.getFormItemControl().isOn());
};
oFF.UiFormItemSwitch.prototype.releaseObject = function()
{
	oFF.DfUiFormItemSingleLine.prototype.releaseObject.call( this );
};
oFF.UiFormItemSwitch.prototype.setEditable = function(editable)
{
	this.getFormItemControl().setEnabled(editable);
	return this;
};
oFF.UiFormItemSwitch.prototype.setEnabled = function(enabled)
{
	this.getFormItemControl().setEnabled(enabled);
	return this;
};
oFF.UiFormItemSwitch.prototype.setInvalidState = function(reason)
{
	this.getFormLabel().applyErrorState(reason);
};
oFF.UiFormItemSwitch.prototype.setOffText = function(text)
{
	this.getFormItemControl().setOffText(text);
	return this;
};
oFF.UiFormItemSwitch.prototype.setOnText = function(text)
{
	this.getFormItemControl().setOnText(text);
	return this;
};
oFF.UiFormItemSwitch.prototype.setValidState = function()
{
	this.getFormLabel().removeErrorState();
};
oFF.UiFormItemSwitch.prototype.updateControlValue = function()
{
	this.getFormItemControl().setOn(this.getModelValueAsBoolean());
};

oFF.UtToolbarWidget = function() {};
oFF.UtToolbarWidget.prototype = new oFF.DfUiFlexWidget();
oFF.UtToolbarWidget.prototype._ff_c = "UtToolbarWidget";

oFF.UtToolbarWidget.create = function(genesis)
{
	let toolbar = new oFF.UtToolbarWidget();
	toolbar.setupInternal(genesis);
	return toolbar;
};
oFF.UtToolbarWidget.prototype.m_fixedSection = null;
oFF.UtToolbarWidget.prototype.m_toolbarSection = null;
oFF.UtToolbarWidget.prototype.clearItems = function()
{
	this.m_toolbarSection.clearItems();
	this.m_fixedSection.clearItems();
};
oFF.UtToolbarWidget.prototype.createFixedSection = function()
{
	return oFF.UtToolbarWidgetFixedSection.create(this.getGenesis());
};
oFF.UtToolbarWidget.prototype.createToolbarSection = function()
{
	return oFF.UtToolbarWidgetSection.create(this.getGenesis());
};
oFF.UtToolbarWidget.prototype.destroyWidget = function()
{
	this.m_toolbarSection = oFF.XObjectExt.release(this.m_toolbarSection);
	this.m_fixedSection = oFF.XObjectExt.release(this.m_fixedSection);
};
oFF.UtToolbarWidget.prototype.getFixedToolbarSection = function()
{
	return this.m_fixedSection;
};
oFF.UtToolbarWidget.prototype.getToolbarSection = function()
{
	return this.m_toolbarSection;
};
oFF.UtToolbarWidget.prototype.layoutWidget = function(widgetControl)
{
	widgetControl.clearItems();
	widgetControl.setWidth(oFF.UiCssLength.create("100%"));
	widgetControl.addItem(this.m_toolbarSection.getView());
	widgetControl.addItem(this.m_fixedSection.getView());
};
oFF.UtToolbarWidget.prototype.setupInternal = function(genesis)
{
	this.initWidget(genesis);
};
oFF.UtToolbarWidget.prototype.setupWidget = function()
{
	this.m_toolbarSection = this.createToolbarSection();
	this.m_fixedSection = this.createFixedSection();
};

oFF.UiToolsModule = function() {};
oFF.UiToolsModule.prototype = new oFF.DfModule();
oFF.UiToolsModule.prototype._ff_c = "UiToolsModule";

oFF.UiToolsModule.s_module = null;
oFF.UiToolsModule.getInstance = function()
{
	if (oFF.isNull(oFF.UiToolsModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.RuntimeModule.getInstance());
		oFF.UiToolsModule.s_module = oFF.DfModule.startExt(new oFF.UiToolsModule());
		oFF.UtStyles.staticSetup();
		oFF.UiFormValidationVisibility.staticSetup();
		oFF.DfModule.stopExt(oFF.UiToolsModule.s_module);
	}
	return oFF.UiToolsModule.s_module;
};
oFF.UiToolsModule.prototype.getName = function()
{
	return "ff2220.ui.tools";
};

oFF.UiToolsModule.getInstance();

return oFF;
} );