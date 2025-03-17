/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define("sap/sac/df/model/extensions/contextMenu/ContextMenuProviderRegistry",
  [
    "sap/ui/base/Object",
    "sap/sac/df/model/extensions/contextMenu/ContextMenuProvider"
  ],
  function (ObjectBase, ContextMenuProvider) {
    "use strict";

    /**
     * Context menu registry
     *
     * @author SAP SE
     * @version 1.132.0
     * @private
     * @experimental since version 1.132
     * @since 1.132
     * @alias sap.sac.df.model.extensions.contextMenu.ContextMenuProviderRegistry
     */
    var ContextMenuProviderRegistry = ObjectBase.extend("sap.sac.df.model.extensions.contextMenu.ContextMenuProviderRegistry", {

      constructor: function (oModel) {
        this._Model = oModel;
        this._ContextMenuProviderRegistry = {
          default: new ContextMenuProvider(oModel)
        };
      }
    });

    /**
     * Get default context menu provider
     * @return sap.sac.df.model.extensions.contextMenu.ContextMenuProvider
     * @public
     */
    ContextMenuProviderRegistry.prototype.getDefaultProvider = function () {
      return this._ContextMenuProviderRegistry.default;
    };

    /**
     * Add context menu provider
     * @param sName name
     * @param {sap.sac.df.model.extensions.contextMenu.ContextMenuProvider} oContextMenuProvider context menu provider object
     * @return {sap.sac.df.model.extensions.contextMenu.ContextMenuProvider} created context menu provider object
     * @public
     */
    ContextMenuProviderRegistry.prototype.addProvider = function (sName, oContextMenuProvider) {
      return this._ContextMenuProviderRegistry[sName] = oContextMenuProvider;
    };

    /**
     * Get context menu provider
     * @param sName name
     * @return {sap.sac.df.model.extensions.contextMenu.ContextMenuProvider} context menu provider object
     * @public
     */
    ContextMenuProviderRegistry.prototype.getProvider = function (sName) {
      return this._ContextMenuProviderRegistry[sName];
    };

    return ContextMenuProviderRegistry;
  }
);
