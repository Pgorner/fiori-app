/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/core/Element", "sap/ui/core/Lib"], function (Element, Lib) {
  "use strict";

  /**
   *
   * Abstract base class for panels inside My Home Settings Dialog.
   *
   * @extends sap.ui.core.Element
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @abstract
   * @private
   *
   * @alias sap.cux.home.BaseSettingsPanel
   */
  const BaseSettingsPanel = Element.extend("sap.cux.home.BaseSettingsPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Key of the settings panel.
         */
        key: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Title of the settings panel.
         */
        title: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Icon of the settings panel.
         */
        icon: {
          type: "sap.ui.core.URI",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Specifies if header should be shown for the settings panel page.
         */
        showHeader: {
          type: "boolean",
          group: "Misc",
          defaultValue: true,
          visibility: "hidden"
        }
      },
      defaultAggregation: "content",
      aggregations: {
        /**
         * Content aggregation of the settings panel.
         */
        content: {
          type: "sap.ui.core.Control",
          singularName: "content",
          multiple: true,
          visibility: "hidden"
        },
        /**
         * Holds the actions to be shown within the settings panel.
         */
        actionButtons: {
          type: "sap.m.Button",
          multiple: true,
          singularName: "actionButton",
          visibility: "hidden"
        }
      },
      associations: {
        /**
         * Associations of the settings panel.
         * Id of the panel associated with the settings panel to be provided.
         * In case of multiple panels with same Id, the first panel will be associated.
         * If no panel is found with the provided id, the settings panel will not be associated with any panel.
         */
        panel: {
          type: "string"
        }
      },
      events: {
        /**
         * Fired whenever the panel has been navigated to.
         */
        panelNavigated: {
          parameters: {
            context: {
              type: "object"
            }
          }
        }
      }
    },
    constructor: function _constructor(id, settings) {
      Element.prototype.constructor.call(this, id, settings);
      this._keyuserChanges = [];
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n");
    },
    /**
     * Retrieves the BasePanel or BaseLayout associated with the BaseSettingsPanel.
     *
     * @returns {BasePanel | BaseLayout} The panel or layout associated with the BaseSettingsPanel
     * @private
     */
    _getPanel: function _getPanel() {
      return Element.getElementById(this.getAssociation("panel", null));
    },
    /**
     * Persists the dialog state by setting a property on the parent layout
     * indicating that the settings dialog should be persisted.
     *
     * @private
     */
    _persistDialog: function _persistDialog() {
      const panel = this._getPanel();
      const container = panel?.getParent();
      const layout = container?.getParent();
      layout?.setProperty("settingsDialogPersisted", true, true);
    },
    /**
     * Returns the KeyUser Changes made by user.
     *
     * @public
     */
    getKeyUserChanges: function _getKeyUserChanges() {
      return this._keyuserChanges;
    },
    /**
     * Add Changes made by user in case of KeyUser Settings Panel.
     *
     * @public
     */
    addKeyUserChanges: function _addKeyUserChanges(change) {
      this._keyuserChanges.push(change);
    },
    /**
     * Clear all KeyUser Changes made by user.
     *
     * @public
     */
    clearKeyUserChanges: function _clearKeyUserChanges() {
      this._keyuserChanges = [];
    }
  });
  return BaseSettingsPanel;
});
//# sourceMappingURL=BaseSettingsPanel-dbg-dbg.js.map
