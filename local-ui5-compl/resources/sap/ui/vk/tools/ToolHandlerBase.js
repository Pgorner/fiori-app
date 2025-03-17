/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/EventProvider"],function(t){"use strict";var o=t.extend("sap.ui.vk.tools.ToolHandlerBase",{metadata:{library:"sap.ui.vk"},constructor:function(t){this._priority=0;this._tool=t;this._rect=null}});o.prototype.destroy=function(){this._tool=null;this._rect=null};o.prototype.hover=function(t){};o.prototype.beginGesture=function(t){};o.prototype.move=function(t){};o.prototype.endGesture=function(t){};o.prototype.click=function(t){};o.prototype.doubleClick=function(t){};o.prototype.contextMenu=function(t){};o.prototype.getViewport=function(){return this._tool._viewport};o.prototype._getOffset=function(t){const o=t.getBoundingClientRect();const e={x:o.left+window.scrollX,y:o.top+window.scrollY};return e};o.prototype._inside=function(t){const o=this._tool._viewport.getIdForLabel();const e=document.getElementById(o);if(e==null){return false}const n=this._getOffset(e);this._rect={x:n.x,y:n.y,w:e.offsetWidth,h:e.offsetHeight};return t.x>=this._rect.x&&t.x<=this._rect.x+this._rect.w&&t.y>=this._rect.y&&t.y<=this._rect.y+this._rect.h};return o});
//# sourceMappingURL=ToolHandlerBase.js.map