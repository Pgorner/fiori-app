/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Dialog", "sap/ui/core/Lib"], function (Dialog, Lib) {
  "use strict";

  /**
   *
   * Abstract base class for My Home Settings Dialog.
   *
   * @extends Dialog
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
   * @alias sap.cux.home.BaseSettingsDialog
   */
  const BaseSettingsDialog = Dialog.extend("sap.cux.home.BaseSettingsDialog", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * The selectedkey of the settings dialog
         */
        selectedKey: {
          type: "string",
          group: "Misc",
          defaultValue: "",
          visibility: "hidden"
        },
        /**
         * Additional context of the settings dialog
         */
        context: {
          type: "object",
          group: "Misc",
          defaultValue: {},
          visibility: "hidden"
        }
      },
      defaultAggregation: "panels",
      aggregations: {
        /**
         * Contains the panels aggregation and should be of type BaseSettingsPanel.
         */
        panels: {
          type: "sap.cux.home.BaseSettingsPanel",
          singularName: "panel",
          multiple: true
        }
      }
    },
    constructor: function _constructor(id, settings) {
      Dialog.prototype.constructor.call(this, id, settings);
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      Dialog.prototype.init.call(this);
      this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n");

      //setup page
      this._panelCache = [];
      this.addStyleClass("sapContrastPlus");
    },
    /**
     * Returns all the panels in the dialog.
     * Overridden to return cached panels.
     *
     * @public
     * @override
     * @returns {BaseSettingsPanel[]} panel array
     */
    getPanels: function _getPanels() {
      return this._panelCache.slice();
    },
    /**
     * Adds a new panel at the end of the available panels.
     * Overridden to update cached panels.
     *
     * @public
     * @override
     * @returns {BaseSettingsDialog} the dialog for chaining
     */
    addPanel: function _addPanel(panel) {
      this._panelCache.push(panel);
      this.addAggregation("panels", panel);
      return this;
    },
    /**
     * Adds a new panel to the 'panels' aggregation at the index.
     * Overridden to update cached panels.
     *
     * @public
     * @override
     * @param {BaseSettingsPanel} panel The panel to insert.
     * @param {number} index The index at which to insert the panel.
     * @returns {BaseSettingsDialog} Returns 'this' to allow method chaining.
     */
    insertPanel: function _insertPanel(panel, index) {
      this._panelCache.splice(index, 0, panel);
      this.insertAggregation("panels", panel, index);
      return this;
    },
    /**
     * Removes all panels from the dialog, clears the internal panel cache.
     * Overridden to update cached panels.
     *
     * @public
     * @override
     * @returns {BaseSettingsPanel[]} An empty array representing the removed panels.
     */
    removeAllPanels: function _removeAllPanels() {
      this._panelCache = [];
      this.removeAllAggregation("panels");
      return this.getPanels();
    }
  });
  return BaseSettingsDialog;
});
//# sourceMappingURL=BaseSettingsDialog-dbg-dbg.js.map
