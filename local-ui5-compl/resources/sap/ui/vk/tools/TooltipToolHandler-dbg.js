/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.TooltipToolHandler
sap.ui.define([
	"sap/ui/vk/tools/ToolHandlerBase"
], function(
	ToolHandlerBase
) {
	"use strict";

	var TooltipToolHandler = ToolHandlerBase.extend("sap.ui.vk.tools.TooltipToolHandler", {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	TooltipToolHandler.prototype.hover = function(event) {
		const gizmo = this._tool.getGizmo();
		const viewport = this.getViewport();
		if (gizmo && this._inside(event) && viewport.getScene()) {
			const absoluteX = event.x, absoluteY = event.y;
			const x = absoluteX - this._rect.x, y = absoluteY - this._rect.y;
			const updateGizmo = () => {
				this._timer = 0;
				let hitObject = viewport.hitTest(x, y);
				if (hitObject?.object) {
					// This is workaround for sap.ui.vk.threejs.Viewport which returns structure with hit object as 'object' property
					// TODO: Return object should be consistent among all viewports!
					hitObject = hitObject.object;
				}
				gizmo.update(x, y, absoluteX, absoluteY, hitObject);
			};

			const timeout = this._tool.getTimeout();
			if (timeout > 0) {
				if (this._timer) {
					clearTimeout(this._timer);
				}
				this._timer = setTimeout(updateGizmo, timeout);
			} else {
				updateGizmo();
			}
		}
	};

	TooltipToolHandler.prototype._deactivate = function() {
		if (this._timer) {
			clearTimeout(this._timer);
			this._timer = 0;
		}
	};

	ToolHandlerBase.prototype.beginGesture = function(event) {
		const gizmo = this._tool.getGizmo();
		if (gizmo && this._inside(event)) {
			gizmo.update(event.x - this._rect.x, event.y - this._rect.y, event.x, event.y, null);
		}
	};

	return TooltipToolHandler;
});
