/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/vk/ViewportHandler"],function(jQuery,t){"use strict";var e=sap.ui.vk.ViewportHandler.extend("sap.ui.vtm.ViewportHandler",{constructor:function(t){sap.ui.vk.ViewportHandler.prototype.constructor.call(this,t._getVkViewport());this._vtmViewport=t},hover:function(t){if(t.n==1&&this._inside(t)&&this._rect){var e=t.x-this._rect.x,i=t.y-this._rect.y;var r=this._viewport.hitTest(e,i);this._vtmViewport._raiseHover(e,i,r)}},beginGesture:function(e){this._vtmViewport._raiseBeginGesture();t.prototype.beginGesture.call(this,e)},endGesture:function(e){this._vtmViewport._raiseEndGesture();t.prototype.endGesture.call(this,e)}});return e});
//# sourceMappingURL=ViewportHandler.js.map