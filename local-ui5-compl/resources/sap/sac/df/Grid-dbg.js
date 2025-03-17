/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/Grid", ["sap/sac/df/controls/MultiDimControlBase", "sap/sac/df/firefly/library"], function (MultiDimControlBase, FF) {
  /**
     * Constructor for a new <code>Grid</code> control.
     *
     * @class Grid A grid control for displaying multi-dimensional data
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.132.0
     *
     * @constructor
     * @public
     * @experimental since version 1.129
     * @alias sap.sac.df.Grid
     */
  var Grid = MultiDimControlBase.extend("sap.sac.df.Grid", /** @lends sap.sac.df.MultiDimControlBase.prototype */ {
    metadata: {
      library: "sap.sac.df",
      properties: {
        /**
                 * Defines the relative path to the data provider in the multidimensional model.
                 **/
        metaPath: {
          type: "string"
        },
        /**
                 *  Show / hide status bar
                 */
        showStatusBar: {
          type: "boolean", defaultValue: false
        }, /**
                 *  Show / hide title
                 */
        showTitle: {
          type: "boolean", defaultValue: false
        }, /**
                 *  Title
                 */
        title: {
          type: "string"
        }
      }, events: {
        /**
                 * Fires on cell click event
                 */
        onCellClick: {
          parameters: {
            /** Cell context */
            cellContext: {type: "object"}
          }
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

    //##############-------- PUBLIC METHODS -----------###############
    /**
         * Set selected data cell
         * @param rowIndex row index
         * @param columnIndex column index
         */
    setSelectedDataCell: function (rowIndex, columnIndex) {
      const oActiveTableContainer = this._getDataProvider().getGridVisualization()._getFFVisualization()?.getActiveTableContainer();
      if (oActiveTableContainer) {
        try {
          const rowNumber = oActiveTableContainer.getRowIndexForTupleIndex(rowIndex);
          const columnNumber = oActiveTableContainer.getColumnIndexForTupleIndex(columnIndex);
          if (rowNumber >= 0 && columnNumber >= 0) {
            const oNotificationData = FF.XNotificationData.create();
            oNotificationData.putInteger(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_DATA_SET_SELECTED_CELL_ROW_INDEX, rowNumber);
            oNotificationData.putInteger(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_DATA_SET_SELECTED_CELL_COLUMN_INDEX, columnNumber);
            this.oHorizonProgram.postLocalNotification(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_SET_SELECTED_CELL, oNotificationData);
          }
        } catch (oError) {
          console.log(oError.message);
        }
      }
    },

    /**
         * Clear selection of cells
         */
    clearCellSelection: function () {
      this.oHorizonProgram.postLocalNotification(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_CLEAR_SELECTION, null);
    },

    //##############-------- HELPER METHODS -----------###############
    getPluginConfigName: function () {
      return "Grid";
    },

    //##############-------- Firefly helpers -----------###############
    _runProgram: function () {
      let oRunProgramPromise = MultiDimControlBase.prototype._runProgram.apply(this);
      return oRunProgramPromise.then(() => {
        let oPair = new FF.XPair();
        oPair.setFirstObject(FF.PrString.createWithValue("UI5ContextMenuProvider"));
        oPair.setSecondObject(this._getDefaultContextMenuProvider());
        this.oHorizonProgram.executeAction(FF.HpMenuEngineCommandPlugin.PLUGIN_NAME, FF.HpMenuEngineCommandPlugin.REGISTER_DYNAMIC_MENU_ACTIONS_PROVIDER, oPair);
      });
    },

    _getDefaultContextMenuProvider: function () {
      return this._getMultiDimModel().getContextMenuProviderRegistry().getDefaultProvider();
    },

    _onCellClick: function (context) {
      this.fireOnCellClick({cellContext: this._getDefaultContextMenuProvider().convertCellClickContext(context, this._getDataProvider().Name)});
    },

    //##############-------- OVERRIDES -----------###############
    _applyPropertiesToPlugin: function () {
      MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
      if (this.oHorizonProgram) {
        // Show status bar
        this.oHorizonProgram.setStatusBarVisible(this.getShowStatusBar());

        // Show title
        const oNotificationData = FF.XNotificationData.create();
        oNotificationData.putBoolean(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_DATA_KEY_SHOW_QUERY_DETAILS, this.getShowTitle());
        this.oHorizonProgram.postLocalNotification(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_SHOW_QUERY_DETAILS, oNotificationData);

        // Set title
        const oNotificationData2 = FF.XNotificationData.create();
        oNotificationData2.putString(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_DATA_KEY_TITLE, this.getTitle());
        this.oHorizonProgram.postLocalNotification(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_SET_TITLE, oNotificationData2);


        //Set onCellClick consumer
        const oNotificationData3 = FF.XNotificationData.create();
        oNotificationData3.putXObject(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_DATA_ON_CELL_CLICK_CONSUMER, FF.XConsumerHolder.create(this._onCellClick.bind(this)));
        this.oHorizonProgram.postLocalNotification(FF.AuAnalyticalTableViewPlugin.NOTIFICATION_SET_ON_CELL_CLICK_CONSUMER, oNotificationData3);

      }
    }
  });
  return Grid;
});