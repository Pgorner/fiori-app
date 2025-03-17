/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise*/
sap.ui.define("sap/sac/df/model/Configuration", [
  "sap/ui/base/Object",
  "sap/sac/df/model/internal/ConfigurationMapping",
  "sap/sac/df/utils/ConfigLoader",
  "sap/sac/df/firefly/library",
  "sap/sac/df/utils/MetaPathHelper",
  "sap/sac/df/types/configuration/ContextMenuVariant",
  "sap/sac/df/types/configuration/DimensionGrouping",
  "sap/sac/df/types/configuration/StylingPanelItem",
  "sap/sac/df/thirdparty/lodash"
], function (BaseObject, FFConfigurationMapping, ConfigLoader, FF, MetaPathHelper, ConfigContextMenuVariant, ConfigDimensionGrouping, ConfigStylingPanelItem, _) {
  "use strict";
  /**
     *
     * @class
     * Configuration of the multidimensional model and its components
     *
     * @author SAP SE
     * @version 1.132.0
     * @public
     * @hideconstructor
     * @experimental since version 1.132
     * @since 1.132
     * @alias sap.sac.df.model.Configuration
     */

  const SAPUI5_Configuration = {
    Calculations: true,
    ContextMenuVariant: ConfigContextMenuVariant.sapui5,
    Commenting: false,
    StylingPanelItems: [ConfigStylingPanelItem.TableProperties, ConfigStylingPanelItem.NumberFormatting]
  };

  const Configuration = BaseObject.extend("sap.sac.df.model.Configuration", /** @lends sap.sac.df.model.Configuration.prototype */ {
    metadata: {
      properties: {
        /**
                 * Calculations
                 * @since 1.132
                 * @experimental since version 1.132
                 **/
        Calculations: {
          type: "boolean",
          defaultValue: true
        },
        /**
                 * Commenting
                 * @since 1.132
                 * @experimental since version 1.132
                 **/
        Commenting: {
          type: "boolean",
          defaultValue: false
        },
        /** Variant of context menu configuration
                 *  @since 1.132
                 * @experimental since version 1.132
                 **/
        ContextMenuVariant: {
          type: "sap.sac.df.types.configuration.ContextMenuVariant",
          defaultValue: ConfigContextMenuVariant.sapui5
        },
        /**
                 * Styling Panel Items
                 * @since 1.132
                 * @experimental since version 1.132
                 **/
        StylingPanelItems: {
          type: "sap.sac.df.types.configuration.StylingPanelItem[]",
          defaultValue: [ConfigStylingPanelItem.TableProperties, ConfigStylingPanelItem.NumberFormatting]
        }
      }
    },

    constructor: function (oMultiDimModel, oConfiguration, sConfigurationURI) {
      Object.assign(this, Object.getPrototypeOf(this));
      this._Model = oMultiDimModel;
      this._Configuration = oConfiguration;
      this._ConfigurationURI = sConfigurationURI;
    },

    /** @private */
    _loadConfiguration: function (sPathToConfiguration) {
      if (sPathToConfiguration) {
        return ConfigLoader.loadConfigFromFile(sPathToConfiguration).then(oConfiguration => {
          return oConfiguration?.FeatureConfiguration;
        });
      } else {
        return Promise.resolve();
      }
    },

    /** @private */
    applyConfiguration: function () {
      const oProcess = this._Model.getSession();
      const oConfigManager = oProcess.getKernel()?.getConfigurationManager();
      this.ConsolidatedConfig = FF.PrFactory.createStructure();

      return Promise.resolve(
        this._applySAPUI5Configuration()
      ).then(() => {
        return this._applyProvidedConfiguration();
      }).then(() => {
        oConfigManager.writePlatformConfiguration(this.ConsolidatedConfig);
      });
    },


    /** @private */
    _applyProvidedConfiguration: function () {
      return Promise.resolve(this._Configuration ? this._Configuration : this._loadConfiguration(this._ConfigurationURI)
      ).then((oConfiguration) => {
        return this._applyFeatureConfiguration(oConfiguration);
      }).then(() => {
        return this._applyContextMenuConfiguration();
      });
    },

    /** @private */
    _applySAPUI5Configuration: function () {
      return Promise.resolve(
        this._applyTechnicalSAPUI5Configuration()
      ).then(() => {
        return this._applyFeatureConfiguration(SAPUI5_Configuration);
      }).then(() => {
        return this._applyContextMenuConfiguration();
      });
    },

    /** @private */
    _applyTechnicalSAPUI5Configuration: function () {
      if (this._Configuration?.FilterDialogVariant === "Fiori") {
        return this._setFioriFilterDialogConfig();
      } else {
        return this._setSAPUI5FilterDialogConfig();
      }
    },

    /** @private */
    _setSAPUI5FilterDialogConfig: function () {
      // Filter dialog for dimensions
      const oFilterDialogConfigForDimension = this._getOrCreateProgramConfig(FF.FilterDialog.DEFAULT_PROGRAM_NAME_DIMENSION);
      oFilterDialogConfigForDimension.putString(FF.FilterDialog.PARAM_SELECTION_MODE, FF.UiSelectionMode.MULTI_SELECT.getName());
      oFilterDialogConfigForDimension.putString(FF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE, FF.FilterDialogTextUsageType.RESULTSET_TEXT);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_READMODE_CHANGE, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_HIERARCHY_CHANGE, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_READMODE_EXTENDED_SETTINGS, true);

      // Filter dialog for variables
      const oFilterDialogConfigForVariable = this._getOrCreateProgramConfig(FF.FilterDialog.DEFAULT_PROGRAM_NAME_VARIABLE);
      oFilterDialogConfigForVariable.putString(FF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE, FF.FilterDialogTextUsageType.RESULTSET_TEXT);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_ALWAYS_SHOW_SELECTION_CONTAINER, true);
    },

    /** @private */
    _setFioriFilterDialogConfig: function () {
      // Filter dialog for dimensions
      const oFilterDialogConfigForDimension = this._getOrCreateProgramConfig(FF.FilterDialog.DEFAULT_PROGRAM_NAME_DIMENSION);
      oFilterDialogConfigForDimension.putString(FF.FilterDialog.PARAM_SELECTION_MODE, FF.UiSelectionMode.MULTI_SELECT.getName());
      oFilterDialogConfigForDimension.putString(FF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE, FF.FilterDialogTextUsageType.RESULTSET_TEXT);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_READMODE_CHANGE, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_READMODE_EXTENDED_SETTINGS, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_LIST_VIEW, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_RANGE_VIEW, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_SIMPLIFIED_SEARCH, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_EXCLUDE_ADVANCED, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_HIERARCHY_CHANGE, true);
      oFilterDialogConfigForDimension.putBoolean(FF.FilterDialog.PARAM_OFFER_DISPLAY_INFO_EXTENDED_SETTINGS, true);
      oFilterDialogConfigForDimension.putString(FF.FilterDialog.PARAM_DISPLAY_PATTERN_RANGE, "$1...$2");

      // Filter dialog for variables
      const oFilterDialogConfigForVariable = this._getOrCreateProgramConfig(FF.FilterDialog.DEFAULT_PROGRAM_NAME_VARIABLE);
      oFilterDialogConfigForVariable.putString(FF.FilterDialog.PARAM_DIMENSION_TEXT_USAGE_TYPE, FF.FilterDialogTextUsageType.RESULTSET_TEXT);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_ALWAYS_SHOW_SELECTION_CONTAINER, true);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_OFFER_LIST_VIEW, true);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_OFFER_RANGE_VIEW, true);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_SIMPLIFIED_SEARCH, true);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_OFFER_EXCLUDE_ADVANCED, true);
      oFilterDialogConfigForVariable.putBoolean(FF.FilterDialog.PARAM_OFFER_DISPLAY_INFO_EXTENDED_SETTINGS, true);
      oFilterDialogConfigForVariable.putString(FF.FilterDialog.PARAM_DISPLAY_PATTERN_RANGE, "$1...$2");
    },

    /** @private */
    _applyFeatureConfiguration: function (oConfiguration) {
      if (oConfiguration) {
        _.map(oConfiguration, (sValue, sKey) => {
          if (sKey !== "ContextMenuVariant") {
            this._setConfigurationProperty(sKey, sValue);
            this.setProperty(sKey, sValue);
          }
        });
      }
    },

    /** @private */
    _getOrCreateProgramConfig: function (sProgramName) {
      let oProgramConfig = this.ConsolidatedConfig.getStructureByKey(sProgramName);
      if (!oProgramConfig) {
        oProgramConfig = this.ConsolidatedConfig.putNewStructure(sProgramName);
      }
      return oProgramConfig;
    },

    /** @private */
    _applyContextMenuConfiguration: function () {
      let configId = this._Configuration?.ContextMenuVariant || "sap-ui5";
      if (configId) {
        this.setProperty("ContextMenuVariant", configId);
        const sConfigFile = configId ? "sap/sac/df/fa/configs/" + configId + "-config.json" : "sap/sac/df/fa/configs/sap-ui5-config.json";
        return ConfigLoader.loadConfigFromFile(sConfigFile).then(oContextMenuConfiguration => {
          this._ContextMenuConfiguration = JSON.stringify(oContextMenuConfiguration?.QueryBuilder?.MenuSettings);
        });
      }
    },

    getContextMenuConfiguration: function () {
      return this._ContextMenuConfiguration;
    },

    /** @private */
    _setConfigurationProperty: function (sKey, sValue) {
      if (!Object.hasOwn(FFConfigurationMapping, sKey)) {
        return;
      }
      const oPropertyMap = FFConfigurationMapping[sKey];
      const aProgramConfiguration = Array.isArray(oPropertyMap.Program) ? _.map(oPropertyMap.Program, (sProgram) => {
        return this._getOrCreateProgramConfig(sProgram);
      }) : [this._getOrCreateProgramConfig(oPropertyMap.Program)];

      switch (oPropertyMap.Type) {
        case  FF.PrElementType.BOOLEAN:
          aProgramConfiguration.forEach(oConfig => {
            oConfig.putBoolean(oPropertyMap.FFName, sValue);
          });
          break;
        case  FF.PrElementType.STRING:
          aProgramConfiguration.forEach(oConfig => {
            oConfig.putString(oPropertyMap.FFName, sValue);
          });
          break;
        case  FF.PrElementType.LIST:
          aProgramConfiguration.forEach(oConfig => {
            let oList = oConfig.putNewList(oPropertyMap.FFName);
            sValue.forEach(sValue => {
              oList.addString(sValue);
            });
          });
          break;
      }
    }
  });

  Configuration.prototype.setProperty = function (sPath, oValue) {
    return this._Model.setProperty(MetaPathHelper.PathTo.Configuration + "/" + sPath, oValue);
  };

  Configuration.prototype.getProperty = function (sPath) {
    return this._Model.getProperty(MetaPathHelper.PathTo.Configuration + "/" + sPath);
  };

  return Configuration;
})
;
