/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/DesignerPanel", ["sap/sac/df/controls/MultiDimControlBase", "sap/sac/df/firefly/library"], function (MultiDimControlBase, FF) {
  /**
     * Constructor for a new <code>MultiDimDesignerPanel</code> control.
     *
     * @class DesignerPanel A panel control to design layouts / visualizations
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.132.0
     *
     * @constructor
     * @public
     * @experimental since version 1.129
     * @alias sap.sac.df.DesignerPanel
     */
  var DesignerPanel = MultiDimControlBase.extend("sap.sac.df.DesignerPanel", /** @lends sap.sac.df.controls.MultiDimControlBase.prototype */ {
    metadata: {
      library: "sap.sac.df",
      properties: {
        /**
                 * Defines the relative path to visualization of the corresponding data provider in the multidimensional model.
                 **/
        metaPath: {
          type: "string"
        },
        /**
                 * Show visualization type
                 * @restricted
                 */
        showVisualizationType: {
          type: "boolean", defaultValue: false
        },
        /**
                 * Show available objects panel
                 */
        showAvailableObjects: {
          type: "boolean", defaultValue: true
        }
      }
    },

    //##############-------- CONTROL LIFECYCLE METHODS -----------###############

    init: function () {
      if (MultiDimControlBase.prototype.init) {
        MultiDimControlBase.prototype.init.apply(this, arguments);
      }
    },

    renderer: MultiDimControlBase.getMetadata().getRenderer().render,

    //##############-------- HELPER METHODS -----------###############
    getPluginConfigName: function () {
      return "DesignerPanel";
    },

    //##############-------- PROPERTY METHODS -----------###############

    //##############-------- OVERRIDES -----------###############
    _applyPropertiesToPlugin: function () {
      MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
      if (this.oHorizonProgram) {
        let sVizName = this._getVisualizationName();
        if (sVizName) {
          const oNotificationData = FF.XNotificationData.create();
          oNotificationData.putString(FF.AuOlapAxesBuilderViewPlugin.CONFIG_VISUALIZATION_NAME, sVizName);
          this.oHorizonProgram.postLocalNotification(FF.AuOlapAxesBuilderViewPlugin.NOTIFICATION_VISUALIZATION_NAME_SET, oNotificationData);
        }

        const oNotificationData2 = FF.XNotificationData.create();
        oNotificationData2.putBoolean(FF.AuOlapAxesBuilderViewPlugin.CONFIG_SHOW_DISPLAY_TYPE, this.getShowVisualizationType());
        this.oHorizonProgram.postLocalNotification(FF.AuOlapAxesBuilderViewPlugin.NOTIFICATION_DISPLAY_TYPE_VISIBILITY_CHANGE, oNotificationData2);

        const oNotificationData3 = FF.XNotificationData.create();
        oNotificationData3.putBoolean(FF.AuOlapDesignerDocumentPlugin.NOTIFICATION_DATA_VISIBLE, this.getShowAvailableObjects());
        this.oHorizonProgram.postLocalNotification(FF.AuOlapDesignerDocumentPlugin.NOTIFICATION_TOGGLE_INVENTORY_VISIBILITY, oNotificationData3);
      }
    }
  });

  return DesignerPanel;
});
