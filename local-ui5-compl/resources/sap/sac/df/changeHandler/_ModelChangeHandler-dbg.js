/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/
sap.ui.define("sap/sac/df/changeHandler/_ModelChangeHandler", [
  "sap/ui/mdc/Control",
  "sap/ui/fl/write/api/ControlPersonalizationWriteAPI",
  "sap/ui/core/CustomData"
],
function(Control, ControlPersonalizationWriteAPI, CustomData) {
  "use strict";
  /**
     * Constructor for a new <code>ModelChangeHandler</code>.
     * @public
     * @experimental
     * @class
     * @extends sap.ui.core.Control
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @author SAP SE
     * @version 1.132.0
     * @constructor
     * @private
     * @alias sap.sac.df.changeHandler._ModelChangeHandler
     **/
  var ModelChangeHandler = Control.extend("sap.sac.df.changeHandler._ModelChangeHandler", {
    renderer: "sap.ui.core.Renderer",
    metadata: {
      events: {
        applyModelChange: {
          parameters: {
            /** Personalization change of type {@link sap.ui.fl.write.api.ControlPersonalizationWriteAPI.PersonalizationChange} */
            oChange: {
              type: "sap.ui.fl.write.api.ControlPersonalizationWriteAPI.PersonalizationChange"
            }
          }
        },
        revertModelChange: {
          parameters: {
            /** Personalization change of type {@link sap.ui.fl.write.api.ControlPersonalizationWriteAPI.PersonalizationChange} */
            oChange: {
              type: "sap.ui.fl.write.api.ControlPersonalizationWriteAPI.PersonalizationChange"
            }
          }
        }
      },
      publicMethods: ["createModelChange"]
    },
    init: function () {
      Control.prototype.init.apply(this, arguments);
      this.skipApplyModelChange = false;
      var oCustomData = new CustomData({
        key: "sap-ui-custom-settings",
        value: {
          "sap.ui.fl": {
            "flexibility": "sap/sac/df/changeHandler/flexibility/_ModelChangeHandler.flexibility"
          }
        }
      });
      this.addCustomData(oCustomData);
    },

    skipApplyModelChangeOnce: function () {
      this.skipApplyModelChange = true;
    },

    /**
     * Apply model change
     *
     * @param {object} oChange - change object with instructions to be applied on the control
     * @returns {Promise<undefined>} to wait for execution
     * @public
     */
    applyModelChange: function (oChange) {
      if (!this.skipApplyModelChange) {
        return this.fireApplyModelChange({change: oChange});
      }
      this.skipApplyModelChange = false;
    },

    /**
     * Reverts model change
     *
     * @param {object} oChange - change object with instructions to be applied on the control
     * @return {boolean} True if successful
     * @public
     */
    revertModelChange: function (oChange) {
      return this.fireRevertModelChange({change: oChange});
    },

    /**
     * Create model change
     * @param {object} oChangeContent content to be applied in a change object
     * @private
     */
    createModelChange: function (oChangeContent){
      return this._createModelChange(oChangeContent);
    },

    _createModelChange: function (oChangeContent) {
      var that = this;
      this.skipApplyModelChange = true;
      var oChange = {
        selectorElement: this,
        changeSpecificData: {
          changeType: "ModelChange",
          content: oChangeContent,
          transient: false
        }
      };
      return Promise.resolve(
        ControlPersonalizationWriteAPI.add({selector: this, changes: [oChange]})
      ).then(function () {
        that.skipApplyModelChange = false;
      });
    }
  });



  return ModelChangeHandler;
});
