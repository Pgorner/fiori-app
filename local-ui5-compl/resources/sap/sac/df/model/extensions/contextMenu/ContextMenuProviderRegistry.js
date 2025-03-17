/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/model/extensions/contextMenu/ContextMenuProviderRegistry",["sap/ui/base/Object","sap/sac/df/model/extensions/contextMenu/ContextMenuProvider"],function(e,t){"use strict";var n=e.extend("sap.sac.df.model.extensions.contextMenu.ContextMenuProviderRegistry",{constructor:function(e){this._Model=e;this._ContextMenuProviderRegistry={default:new t(e)}}});n.prototype.getDefaultProvider=function(){return this._ContextMenuProviderRegistry.default};n.prototype.addProvider=function(e,t){return this._ContextMenuProviderRegistry[e]=t};n.prototype.getProvider=function(e){return this._ContextMenuProviderRegistry[e]};return n});
//# sourceMappingURL=ContextMenuProviderRegistry.js.map