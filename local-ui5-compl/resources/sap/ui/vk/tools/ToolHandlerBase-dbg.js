/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.ToolHandlerBase
sap.ui.define([
	"sap/ui/base/EventProvider"
], function(
	EventProvider
) {
	"use strict";

	var ToolHandlerBase = EventProvider.extend("sap.ui.vk.tools.ToolHandlerBase", {
		metadata: {
			library: "sap.ui.vk"
		},
		constructor: function(tool) {
			this._priority = 0; // the priority of the handler
			this._tool = tool;
			this._rect = null;
		}
	});

	ToolHandlerBase.prototype.destroy = function() {
		this._tool = null;
		this._rect = null;
	};

	ToolHandlerBase.prototype.hover = function(event) { };

	ToolHandlerBase.prototype.beginGesture = function(event) { };

	ToolHandlerBase.prototype.move = function(event) { };

	ToolHandlerBase.prototype.endGesture = function(event) { };

	ToolHandlerBase.prototype.click = function(event) { };

	ToolHandlerBase.prototype.doubleClick = function(event) { };

	ToolHandlerBase.prototype.contextMenu = function(event) { };

	ToolHandlerBase.prototype.getViewport = function() {
		return this._tool._viewport;
	};

	// GENERALIZE THIS FUNCTION
	ToolHandlerBase.prototype._getOffset = function(obj) {
		const rectangle = obj.getBoundingClientRect();
		const p = {
			x: rectangle.left + window.scrollX,
			y: rectangle.top + window.scrollY
		};
		return p;
	};

	// GENERALIZE THIS FUNCTION
	ToolHandlerBase.prototype._inside = function(event) {
		const id = this._tool._viewport.getIdForLabel();
		const domobj = document.getElementById(id);
		if (domobj == null) {
			return false;
		}

		const o = this._getOffset(domobj);
		this._rect = {
			x: o.x,
			y: o.y,
			w: domobj.offsetWidth,
			h: domobj.offsetHeight
		};

		return event.x >= this._rect.x && event.x <= this._rect.x + this._rect.w &&
			event.y >= this._rect.y && event.y <= this._rect.y + this._rect.h;
	};

	return ToolHandlerBase;
});
