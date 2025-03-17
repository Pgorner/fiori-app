/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/
sap.ui.define("sap/sac/df/changeHandler/MultiDimModelChangeHandler", [
  "sap/ui/mdc/Control",
  "sap/ui/fl/write/api/ControlPersonalizationWriteAPI",
  "sap/ui/core/CustomData",
  "sap/ui/core/Component"
],
function (Control, ControlPersonalizationWriteAPI, CustomData, Component) {
  "use strict";
  /**
         * Constructor for a new <code>MultiDimModelChangeHandler</code>.
         * @public
         * @experimental
         * @class
         * Control to handle changes of {@link sap.sac.df.model.MultiDimModel }. To store the
         * changes in {@link sap.ui.fl.variants.VariantManagement} you need to include this change handler control as a dependent
         * somewhere in the view tree for which the variant management is responsible. Each time new data is fetched and the event <code>dataLoaded</code> is fired a new change will be created.
         * The method <code>dataLoaded</code> needs to be called once to register the {@link sap.sac.df.model.MultiDimModel} to the change handler.
         * @extends sap.ui.mdc.Control
         * @param {string} [sId] ID for the new control, generated automatically if no ID is given
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @experimental since version 1.120
         * @since 1.120
         * @alias sap.sac.df.changeHandler.MultiDimModelChangeHandler
         **/
  var MultiDimModelChangeHandler = Control.extend("sap.sac.df.changeHandler.MultiDimModelChangeHandler", {
    metadata: {
      publicMethods: ["registerMultiDimModel"]
    },
    renderer: "sap.ui.core.Renderer",
    init: function () {
      Control.prototype.init.apply(this, arguments);
      this.skipApplyModelChange = false;
      var oCustomData = new CustomData({
        key: "sap-ui-custom-settings",
        value: {
          "sap.ui.fl": {
            "flexibility": "sap/sac/df/changeHandler/flexibility/MultiDimModelChangeHandler.flexibility"
          }
        }
      });
      this.addCustomData(oCustomData);
    },


    _getMultiDimModel: function () {
      if (this._MultiDimModel) {
        var oModel = this._MultiDimModel;
      } else {
        oModel = Component.getOwnerComponentFor(this) && Component.getOwnerComponentFor(this).getModel("om");
      }
      if (!oModel) {
        throw new Error("No MultiDimModel found.");
      }
      return oModel;
    },

    _initialise: function () {
      this._createModelChangeInProcess = false;
      this._getMultiDimModel().attachEvent("dataProviderUpdated", null, this._createModelChange.bind(this));
    },

    _createModelChange: function () {
      var that = this;
      var oChange = {
        selectorElement: this,
        changeSpecificData: {
          changeType: "MultiDimModelChange",
          content: this._getMultiDimModel().serialize("INA_REPOSITORY_DELTA"),
          transient: false
        }
      };
      this._createModelChangeInProcess = true;
      return Promise.resolve(
        ControlPersonalizationWriteAPI.add({selector: that, changes: [oChange]})
      ).then(function () {
        that._createModelChangeInProcess = false;
      });
    }
  });


  /**
         * Register {@link sap.sac.df.model.MultiDimModel} for handling changes
         * @param {sap.sac.df.model.MultiDimModel} oMultiDimModel
         * @public
         */
  MultiDimModelChangeHandler.prototype.registerMultiDimModel = function (oMultiDimModel) {
    this._MultiDimModel = oMultiDimModel;
    this._initialise();
  };


  /**
         * Apply change
         * @param {object} oChange - change object with instructions to be applied on the control
         * @returns {Promise<undefined>} to wait for execution
         * @private
         */
  MultiDimModelChangeHandler.prototype.applyModelChange = function (oChange) {
    if (!this.skipApplyModelChange && !this._createModelChangeInProcess) {
      return Promise.resolve(this._getMultiDimModel().deserialize(oChange.getContent(), "INA_REPOSITORY_DELTA"));
    }
    this.skipApplyModelChange = false;
    return Promise.resolve();
  };

  /**
         * Revert all model changes and resets the state to the initial state of the metadata
         * @private
         */
  MultiDimModelChangeHandler.prototype.revertModelChange = function () {
    if (!this.skipApplyModelChange && !this._createModelChangeInProcess) {
      return Promise.resolve(this._getMultiDimModel().resetModel());
    }
    return Promise.resolve();
  };

  /**
         * Skip the triggering of the event <code>apply</code> once
         * @public
         */
  MultiDimModelChangeHandler.prototype.skipApplyModelChangeOnce = function () {
    this.skipApplyModelChange = true;
  };

  return MultiDimModelChangeHandler;
});
