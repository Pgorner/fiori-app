/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/_internal/controls/MultiDimChat", [
  "sap/sac/df/controls/MultiDimControlBase",
  "sap/sac/df/firefly/library",
  "sap/sac/df/firefly/ff8020.olap.ui.plugins"
], function (MultiDimControlBase, FF) {
  /**
   * Constructor for a new <code>MultiDimChat</code> control.
   *
   * @class MultiDimChat A chat control
   * @private
   * @experimental
   * @extends sap.sac.df.controls.MultiDimControlBase
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @private
   * @alias sap.sac.df._internal.controls.MultiDimChat
   */
  var MultiDimChat = MultiDimControlBase.extend("sap.sac.df._internal.controls.MultiDimChat",
    /** @lends sap.sac.df.controls.MultiDimControlBase.prototype */ {
      metadata: {
        library: "sap.sac.df",
        properties: {
          serviceEndpoint: {
            type: "string"
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
        return "InsightVisionAi";
      },

      _getPluginConfig: function () {
        if (!this._oPluginConfig) {
          this._oPluginConfig = {
            "configuration": {
              "toolbarVisible": false,
              "menuVisible": false,
              "statusBarVisible": false
            },
            "layout": {
              "type": "SinglePlugin"
            },
            "plugins": [
              {
                "plugin": "InsightVisionAi",
                "config": {
                  "serviceEndpoint": this.getServiceEndpoint() || "https://firefly.wdf.sap." + "corp/openai",
                  "useServiceEndpoint": true
                }
              }
            ],
            "commands": [
              {
                "plugin": "DataProviderCommand"
              },
              {
                "plugin": "MenuActionsProviderPlugin"
              },
              {
                "plugin": "MenuEngine"
              }
            ]
          };
        }
        return this._oPluginConfig;
      },

      /**
       * Adds system message to open AI as to provide the context of the application.
       *
       * @param {string} sSystemMessage system message
       * @public
       */
      addSystemMessage: function (sSystemMessage) {
        this.oHorizonProgram.executeActionById(FF.OpInsightVisionAiPlugin.PLUGIN_NAME + "." + FF.HpAzureOpenAiCommandPlugin.SET_SYSTEM_MESSAGE, sSystemMessage);
      },

      /**
       * Adds function to open AI
       *
       * @param {string} sFunctionName name of the function
       * @param {boolean} sFunctionDescription description of the function. Please provide as much as possible information for open AI
       * @param {function} fn the function to be executed
       * @public
       */
      addFunction: function (sFunctionName, sFunctionDescription, fn) {
        let oFunction = FF.UtAzureOpenAiConnectorFunction.create(sFunctionName, sFunctionDescription);
        oFunction.setFunction( ( ) => { fn(); });
        oFunction.setFunction(() => {
          return FF.XPromise.resolve(fn());
        });

        this.oHorizonProgram.executeActionById(FF.HpAzureOpenAiCommandPlugin.PLUGIN_NAME + "." + FF.HpAzureOpenAiCommandPlugin.ADD_FUNCTION, oFunction);
      }
    }
  );

  return MultiDimChat;
});
