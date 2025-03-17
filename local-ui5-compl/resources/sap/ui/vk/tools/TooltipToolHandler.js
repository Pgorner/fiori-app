/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/vk/tools/ToolHandlerBase"],function(t){"use strict";var i=t.extend("sap.ui.vk.tools.TooltipToolHandler",{metadata:{library:"sap.ui.vk"}});i.prototype.hover=function(t){const i=this._tool.getGizmo();const e=this.getViewport();if(i&&this._inside(t)&&e.getScene()){const o=t.x,s=t.y;const r=o-this._rect.x,n=s-this._rect.y;const c=()=>{this._timer=0;let t=e.hitTest(r,n);if(t?.object){t=t.object}i.update(r,n,o,s,t)};const h=this._tool.getTimeout();if(h>0){if(this._timer){clearTimeout(this._timer)}this._timer=setTimeout(c,h)}else{c()}}};i.prototype._deactivate=function(){if(this._timer){clearTimeout(this._timer);this._timer=0}};t.prototype.beginGesture=function(t){const i=this._tool.getGizmo();if(i&&this._inside(t)){i.update(t.x-this._rect.x,t.y-this._rect.y,t.x,t.y,null)}};return i});
//# sourceMappingURL=TooltipToolHandler.js.map