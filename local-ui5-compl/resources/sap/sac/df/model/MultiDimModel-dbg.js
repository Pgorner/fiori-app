/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise */
sap.ui.define("sap/sac/df/model/MultiDimModel",
  ["sap/base/i18n/Formatting",
    "sap/base/i18n/Localization",
    "sap/ui/model/Model",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/sac/df/utils/ListHelper",
    "sap/sac/df/model/internal/_DFKernel",
    "sap/sac/df/model/internal/SystemLandscape",
    "sap/sac/df/model/DataProvider",
    "sap/sac/df/model/VariableGroup",
    "sap/sac/df/model/Configuration",
    "sap/sac/df/utils/ResourceBundle",
    "sap/ui/core/Configuration",
    "sap/ui/model/BindingMode",
    "sap/sac/df/utils/MetaPathHelper",
    "sap/sac/df/types/VisualizationType",
    "sap/sac/df/model/extensions/contextMenu/ContextMenuProviderRegistry",
    "sap/sac/df/model/extensions/styling/GridStylingTemplateRegistry",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library"], /* eslint-disable max-params */
  function (
    Formatting,
    Localization,
    Model,
    JSONModel,
    Log,
    SyncActionHelper,
    ListHelper,
    DFKernel,
    SystemLandscape,
    DataProvider,
    VariableGroup,
    Configuration,
    ResourceBundle,
    CoreConfiguration,
    BindingMode,
    MetaPathHelper,
    VisualizationType,
    ContextMenuProviderRegistry,
    GridStylingTemplateRegistry,
    _,
    FF) { /* eslint-enable max-params */
    "use strict";

    /**
         * Constructor for a new MultiDimModel. After model creation you need to wait for the event {@link #event:loaded loaded}.
         *
         * @param {string} [sId] - ID for the new control, generated automatically if no ID is given
         * @param {object} [mSettings] - Initial settings for the new control.
         * @example <caption>how to add and configure a MultiDimModel via manifest.json </caption>
         * "MultiDimModel": {
         *   "type": "sap.sac.df.model.MultiDimModel",
         *   "preload": true,
         *   "settings": {
         *     "clientIdentifier": "",
         *     "DataProviders": {
         *       "anyDataProviderName": {
         *         "dataSourceName": "<>",
         *         "systemName": "<>",
         *         "packageName": "<>",
         *         "schemaName": "<>",
         *         "dataSourceType": "<>"
         *       }
         *     }
         *   }
         * }
         * @class
         * The multidimensional model allows to access and change data accessed via the InA Protocol.
         * The multidimensional model populate it's exposed data in JSON format via binding to controls.
         *
         * <b>Structure of Exposed Data:</b>
         * <pre><code>
         * "DataProviders": { },
         * "VariableGroups": { },
         * "Messages": [ ]
         * </code></pre>
         * @extends sap.ui.model.json.JSONModel
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @experimental since version 1.119
         * @since 1.119
         * @alias sap.sac.df.model.MultiDimModel
         */

    var MultiDimModel = JSONModel.extend("sap.sac.df.model.MultiDimModel", /** @lends sap.sac.df.model.MultiDimModel.prototype */ {
      constructor: function (mSettings) {
        Object.assign(this, Object.getPrototypeOf(this));
        Model.call(this);
        //Model.BindingMode = BindingMode.OneWay;
        var that = this;
        this.VariableGroupMapping = {};
        this._metadataCacheEnabled = mSettings && mSettings.metadataCacheEnabled || false;
        mSettings.widgetCatalogPath = mSettings.widgetCatalogPath || "vfs/analyticalwidgets/";
        /** @private */
        this._SystemSettings = {
          systemLandscape: (mSettings && mSettings.systemLandscape) || SystemLandscape,
          systemType: (mSettings && mSettings.systemType) || "BW",
          masterSystem: (mSettings && mSettings.masterSystem) || "local" + ((mSettings && mSettings.systemType) || "BW"),
          clientIdentifier: mSettings && mSettings.clientIdentifier,
          keepAliveInterval: mSettings && mSettings.keepAliveInterval,
          widgetCatalogPath: mSettings.widgetCatalogPath
        };

        this.initCompletedPromise = this._getUserProfile().then((userProfile) => DFKernel.init({
          systemSettings: this._SystemSettings, userProfile: userProfile
        })).then(function (oKernelProgram) {
          that.kernelProgram = oKernelProgram;
          that._setupSharedDataSpace();
          FF.XLocalizationCenter.setExternalAdapter(ResourceBundle);
          FF.XLocalizationCenter.getCenter().setProductive(true);
        }).then(function () {
          that._StylingProviderRegistry = {
            Grid: new GridStylingTemplateRegistry(that)
          };
          that._ContextMenuProviderRegistry = new ContextMenuProviderRegistry(that);
          that.setData({
            DataProviders: {}, VariableGroups: {}, Messages: [], Configuration: {}
          });
          that.checkUpdate();
        });

        /** @private */
        that._openSettingDialog = function () {
          let oRunner = FF.SuSettingsDialog.createRunnerForConfigurationType(this.getApplication().getProcess(), FF.CoConfigurationType.OTHER);
          oRunner.setBooleanArgument(FF.SuSettingsDialog.PARAM_USER_MODE, true);
          oRunner.setStringArgument(FF.SuSettingsDialog.PARAM_CONFIGURATION_NAMES, "ValueHelpDialogConfiguration");
          oRunner.runProgram();
        };

        /** @private */
        that._setupSharedDataSpace = function () {
          // Create a shared space so that multiple plugin instances can share data providers.
          var oParentProcess = this.getSession();
          var oSharedDataSpace = oParentProcess.getSharedDataSpace(FF.OuDataProviderCommandPlugin.DEFAULT_SHARED_SPACE_NAME);
          if (!oSharedDataSpace) {
            oParentProcess.createSharedDataSpace(FF.OuDataProviderCommandPlugin.DEFAULT_SHARED_SPACE_NAME);
          }
        };

        /** @private */
        that._addMessages = function (aMsg) {
          this.setMessages(_.map(_.groupBy(_.concat(this.getMessages(), aMsg), "Text"), (oMsg) => {
            return oMsg[0];
          }));
          return this.checkUpdate();
        };

        var oModelLoadedPromise = this.initCompletedPromise.then(() => {
          this.Configuration = new Configuration(this, mSettings.Configuration, mSettings.ConfigurationURI);
          return this.Configuration.applyConfiguration();
        }).then(() => {
          const aWidgets = mSettings && mSettings.Widgets || [];
          var syncPromises = [];
          _.forEach(aWidgets, (oWidgetDef, sName) => {
            var oRes = this.addDataProviderFromWidget(sName, oWidgetDef.WidgetId);
            syncPromises.push(oRes);
          });
          return Promise.all(syncPromises);
        }).then(() => {
          var syncPromises = [];
          const aDataProviders = mSettings && mSettings.DataProviders || [];
          _.forEach(aDataProviders, (oDataProviderDef, sName) => {
            var oRes = this.addDataProvider(sName, oDataProviderDef.dataSourceName, oDataProviderDef.systemName, oDataProviderDef.packageName, oDataProviderDef.schemaName, oDataProviderDef.dataSourceType, oDataProviderDef.startWithAutoFetch);
            _.forEach(oDataProviderDef.Visualizations, (oVizDef, sName) => {
              oRes.then((oDataProvider) => {
                syncPromises.push(oDataProvider.addVisualization(sName, VisualizationType[oVizDef.type]));
              });
            });
            syncPromises.push(oDataProviderDef.synchronize ? oRes.then(() => {
              return that.getDataProvider(sName).synchronize();
            }) : oRes);
          });
          return Promise.all(syncPromises
          ).then(() => {
            return that;
          }).catch(function (oError) {
            that._addMessages(oError.getMessages ? oError.getMessages() : []);
            return Promise.reject(oError);
          });
        });

        that.metadataLoaded = () => oModelLoadedPromise;
        that.loaded = that.metadataLoaded;
        that.annotationsLoaded = that.metadataLoaded;
        that.attachMetadataFailed = _.constant(null);
        that.fireMetadataFailed = _.constant(null);
        that.dataLoaded = _.constant(null);

        that.attachPropertyChange(function (oParameters) {
          if (oParameters.getParameter("path").includes("/AutoFetchEnabled")) {
            that.getDataProvider(oParameters.getParameter("path").split(MetaPathHelper.PathTo.DataProviders + "/")[1].split("/AutoFetchEnabled")[0]).setAutoFetchEnabled(oParameters.getParameter("value"));
          }
        });
      },

      /** @private */
      _getUserProfile: function () {
        const oUserProfile = new JSONModel({
          "defaults": {
            "dateFormat": "MM/DD/YYYY",
            "groupingSeparator": ".",
            "decimalSeparator": ",",
            "timeFormat": "24hrs"
          }, "header": {
            "language": "EN"
          }
        });
        oUserProfile.setProperty("/header/language", Localization.getLanguage());
        const oFormatSettings = Formatting.getCustomLocaleData();
        if (oFormatSettings && oFormatSettings["dateFormats-medium"]) {
          oUserProfile.setProperty("/defaults/dateFormat", oFormatSettings["dateFormats-medium"]);
        }
        const sDecimalSeparator = Formatting.getNumberSymbol("decimal");
        if (sDecimalSeparator) {
          oUserProfile.setProperty("/defaults/decimalSeparator", sDecimalSeparator);
        }

        const sThousandsGroupingSeparator = Formatting.getNumberSymbol("group");
        if (sThousandsGroupingSeparator) {
          oUserProfile.setProperty("/defaults/groupingSeparator", sThousandsGroupingSeparator);
        }
        if (sDecimalSeparator && sThousandsGroupingSeparator) {
          oUserProfile.setProperty("/defaults/groupingSeparator", sThousandsGroupingSeparator);
        }
        let userInfoServicePromise;
        const Container = sap.ui.require("sap/ushell/Container");
        if (Container && Container.getServiceAsync) {
          userInfoServicePromise = Container.getServiceAsync("UserInfo");
        } else {
          userInfoServicePromise = Promise.resolve(null);
        }
        return userInfoServicePromise.then(oUserInfo => {
          if (oUserInfo) {
            oUserProfile.setProperty("/username", oUserInfo.getId());
            oUserProfile.setProperty("/header/mail", oUserInfo.getEmail());
            oUserProfile.setProperty("/header/firstName", oUserInfo.getFirstName());
            oUserProfile.setProperty("/header/lastName", oUserInfo.getLastName());
            oUserProfile.setProperty("/header/fullName", oUserInfo.getFullName());
          }
          return JSON.stringify(oUserProfile.getData());
        });
      }
      ,

      getSession: function () {
        if (!this.kernelProgram) {
          Log.error("Kernel not initialized");
          return null;
        }
        return this.kernelProgram.getSession();
      }
      ,

      getApplication: function () {
        if (!this.kernelProgram) {
          Log.error("Kernel not initialized");
          return null;
        }
        return this.kernelProgram.getApplication();
      }
      ,

      /**
             * Get advanced styling provider
             * @return {sap.sac.df.model.extensions.AdvancedStylingProvider}
             */
      getStylingProvider: function () {
        return this._StylingProvider;
      }
      ,

      /** @private */
      _updateVariableGroups: function (bSuppressModelUpdate) {
        _.forEach(this.getVariableGroups(), function (oVariableGroup) {
          oVariableGroup.updateVariableGroup(bSuppressModelUpdate);
        });
      }
    });

    /**
         * Fires event {@link #event:dataProviderUpdated dataProviderUpdated} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    MultiDimModel.prototype.fireDataProviderUpdated = function (oParameters) {
      this.fireEvent("dataProviderUpdated", oParameters);
      return MultiDimModel;
    };

    /**
         * Creates a new data provider from file and attaches it to the model.
         * @param {string} sDataProviderName Data provider name
         * @param {string} sWidgetId path to the file content
         * @returns {Promise<sap.sac.df.model.DataProvider>} Promise which resolves the created data provider
         * @private
         */
    MultiDimModel.prototype.addDataProviderFromWidget = function (sDataProviderName, sWidgetId) {
      var that = this;
      return that.initCompletedPromise.then(
        that.removeDataProvider(sDataProviderName)).then(function () {
        const oDataProvider = new DataProvider(that, sDataProviderName);
        that.setProperty(MetaPathHelper.PathTo.DataProviders + "/" + sDataProviderName, oDataProvider);
        return oDataProvider._createFFDataProviderFromWidget(sWidgetId);
      }).then(function (oDataProvider) {
        //that._updateVariableGroups(true);
        that.fireDataProviderAdded({dataProviderName: sDataProviderName});
        return oDataProvider;
      }).then(function (oDataProvider) {
        return oDataProvider;
      }).catch(function (oError) {
        that._addMessages(oError.getMessages ? oError.getMessages() : []);
        return Promise.reject(oError);
      });

    };

    /**
         * Creates a new data provider and attaches it to the model.
         * @param {string} sDataProviderName Data provider name
         * @param {string} sDataSourceName Datasource name which the data provider is supposed to expose
         * @param {string} [sSystem] System name
         * @param {string} [sPackage] Package name
         * @param {string} [sSchema] Schema name
         * @param {sap.sac.df.types.DataSourceType} [sDataSourceType] Data source type
         * @param {boolean} [bAutoFetchEnabled] if the data should be fetched automatically
         * @returns {Promise<sap.sac.df.model.DataProvider>} Promise which resolves the created data provider
         * @public
         */
    MultiDimModel.prototype.addDataProvider = function (sDataProviderName, sDataSourceName, sSystem, sPackage, sSchema, sDataSourceType, bAutoFetchEnabled) {
      var that = this;
      let bStartWithAutoFetch = _.isUndefined(bAutoFetchEnabled) ? true : bAutoFetchEnabled;
      return that.initCompletedPromise.then(that.removeDataProvider(sDataProviderName)).then(function () {
        const oDataProvider = new DataProvider(that, sDataProviderName);
        that.setProperty(MetaPathHelper.PathTo.DataProviders + "/" + sDataProviderName, oDataProvider);
        return oDataProvider._createFFDataProvider(sDataSourceName, sSystem, sPackage, sSchema, sDataSourceType);
      }).then(function (oDataProvider) {
        oDataProvider._FFDataProvider?.getResulting().setAutoFetchActive(bStartWithAutoFetch);
        that.setProperty(MetaPathHelper.PathTo.DataProviders + "/" + sDataProviderName + "/AutoFetchEnabled", bStartWithAutoFetch);
        that._updateVariableGroups(true);
        that.fireDataProviderAdded({dataProviderName: sDataProviderName});
        return oDataProvider;
      }).then(function (oDataProvider) {
        return oDataProvider;
      }).catch(function (oError) {
        that._addMessages(oError.getMessages ? oError.getMessages() : []);
        return Promise.reject(oError);
      });
    };

    /**
         * Fires event {@link #event:dataProviderAdded dataProviderAdded} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    MultiDimModel.prototype.fireDataProviderAdded = function (oParameters) {
      this.fireEvent("dataProviderAdded", oParameters);
      return MultiDimModel;
    };

    /**
         * Fires event {@link #event:dataProviderRemoved dataProviderRemoved} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    MultiDimModel.prototype.fireDataProviderRemoved = function (oParameters) {
      this.fireEvent("dataProviderRemoved", oParameters);
      return MultiDimModel;
    };


    /**
         * Fires event {@link #event:variableGroupsAdded variableGroupsAdded} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    MultiDimModel.prototype.fireVariableGroupsAdded = function (oParameters) {
      this.fireEvent("variableGroupsAdded", oParameters);
      return MultiDimModel;
    };

    /**
         * Fires event {@link #event:stylingTemplateActivated stylingTemplateActivated} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @private
         */
    MultiDimModel.prototype.fireStylingTemplateActivated = function (oParameters) {
      this.fireEvent("stylingTemplateActivated", oParameters);
      return MultiDimModel;
    };

    /**
         * Get a data provider
         * @param {string} sDataProviderName Data provider name
         * @returns {sap.sac.df.model.DataProvider} Data provider object if found
         * @public
         */
    MultiDimModel.prototype.getDataProvider = function (sDataProviderName) {
      return this.getProperty(MetaPathHelper.PathTo.DataProviders + "/" + sDataProviderName);
    };

    /**
         * Get all data providers
         * @returns {Object<sap.sac.df.model.DataProvider>} Object of all data providers
         * @public
         */
    MultiDimModel.prototype.getDataProviders = function () {
      return this.getProperty(MetaPathHelper.PathTo.DataProviders);
    };

    /**
         * Remove existing data provider from the model.
         * @param {string} sDataProviderName Data provider name to be removed
         * @returns {Promise<void>} Promise which resolves when the removing s finished
         * @public
         */
    MultiDimModel.prototype.removeDataProvider = function (sDataProviderName) {
      var that = this;
      var dataProvider = this.getDataProvider(sDataProviderName);
      this.setProperty(MetaPathHelper.PathTo.DataProviders + "/" + sDataProviderName, null);
      if (dataProvider) {
        return dataProvider.logoff && dataProvider.logoff().then(function () {
          that._updateVariableGroups();
          that.fireDataProviderRemoved({dataProviderName: sDataProviderName});
        }).catch(function (oError) {
          return Promise.resolve(oError);
        });
      } else {
        return Promise.resolve();
      }
    };

    /**
         * Get all variable groups
         * @returns {Object<sap.sac.df.model.VariableGroup>} Object of all variable groups
         * @public
         */
    MultiDimModel.prototype.getVariableGroups = function () {
      return this.getProperty(MetaPathHelper.PathTo.VariableGroups);
    };

    /**
         * Get a variable group
         * @param {string} sVariableGroupName Variable group name
         * @returns {sap.sac.df.model.VariableGroup} Variable group object
         * @public
         */
    MultiDimModel.prototype.getVariableGroup = function (sVariableGroupName) {
      return this.getProperty(MetaPathHelper.PathTo.VariableGroups + "/" + sVariableGroupName);
    };

    /**
         * Creates a new variable group and attaches it to the model.
         *
         * A variable group defines which variables of the underlying data providers should behave as the same variable.
         * The group is defined by a name and a rule.
         * The first added variable becomes automatically the <code>MergedVariable</code>.
         *
         * @param {string} sVariableGroupName Variable group name
         * @param {function} fnRule Rule is a function which accept the variable definition and decides if the variable has to be part of te group.
         * @param {Object} oProperties Additional properties
         * @returns {sap.sac.df.model.VariableGroup} created variable group
         * @public
         */
    MultiDimModel.prototype.createVariableGroup = function (sVariableGroupName, fnRule, oProperties) {
      return new VariableGroup(this, sVariableGroupName, fnRule, oProperties);
    };

    /**
         * Set variable groups.
         *
         * A variable group defines which variables of the underlying data providers should behave as the same variable.
         * The group is defined by a name and a rule.
         * The first added variable becomes automatically the <code>MergedVariable</code>.
         *
         * @param {sap.sac.df.model.VariableGroup[]} aVariableGroups array of variable groups
         * @returns {Promise<sap.sac.df.model.VariableGroup[]>} Promise which resolves the created variable group
         * @public
         */
    MultiDimModel.prototype.setVariableGroups = function (aVariableGroups) {
      _.forEach(aVariableGroups, (oVariableGroup) => {
        this.setProperty(MetaPathHelper.PathTo.VariableGroups + "/" + oVariableGroup.Name, oVariableGroup);
      });
      this.fireVariableGroupsAdded();
      return Promise.resolve(aVariableGroups);
    };

    /**
         * Updates the variables of a data provider with given name with the values from group
         *
         * @param {string} sDataProviderName data provider name
         * @returns {Promise<void>} Promise which resolves when update is finished
         * @private
         */
    MultiDimModel.prototype.propagateVariableGroupValues = function (sDataProviderName) {
      var that = this;
      var updateVariablePromises = [];
      var oDataProvider = this.getDataProvider(sDataProviderName);
      const aVariableGroups = this.getVariableGroups();
      const sLeadingDataProvider = aVariableGroups.length > 0 && aVariableGroups[0].MergedVariable.DataProviderName;
      if (sLeadingDataProvider !== sDataProviderName) {
        _.forEach(aVariableGroups, function (oVariableGroup) {
          var aVariables = that.VariableGroupMapping[oVariableGroup.Name];
          _.forEach(aVariables, function (oVariable) {
            if (oVariable.DataProviderName === sDataProviderName) {
              oDataProvider.getVariable(oVariable.Name)._transferMemberFilterFromAnotherVariable(oVariableGroup.MergedVariable);
            }
          });
        });
        this.checkUpdate();
      }
      return Promise.all(updateVariablePromises);
    };

    /**
         * Resets the messages
         *
         * @param {Object<string,sap.ui.core.message.Message[]>} mMessages The new messages for the model, mapping a binding path to an array of sap.ui.core.message.Message objects
         * @public
         */
    MultiDimModel.prototype.setMessages = function (mMessages) {
      return this.setProperty(MetaPathHelper.PathTo.Messages, mMessages);
    };

    /**
         * Get all messages
         * @returns {sap.ui.core.message.Message[]} Array of messages
         * @public
         */
    MultiDimModel.prototype.getMessages = function () {
      return this.getProperty(MetaPathHelper.PathTo.Messages);
    };

    /**
         * Get configuration
         * @returns {sap.sac.df.model.Configuration} Configuration object
         * @private
         */
    MultiDimModel.prototype.getConfiguration = function () {
      return this.getProperty(MetaPathHelper.PathTo.Configuration);
    };

    /**
         * Ensures all aggregated DataProviders are logged off.
         *
         * @returns {Promise<void>} Promise which resolves when logoff is finished.
         * @public
         */
    MultiDimModel.prototype.logoff = function () {
      return Promise.all(_.invokeMap(this.getDataProvider(), "logoff"));
    };

    /**
         *  Reset the model to the initial state
         *  @returns {Promise<void>} Promise which resolves when reset is finished.
         *  @public
         */
    MultiDimModel.prototype.resetModel = function () {
      if (!this.bSkipDeserialization) {
        var that = this;
        var resetPromises = [];
        _.forEach(this.getDataProviders(), function (oDP) {
          resetPromises.push(oDP.resetToMetaData());
        });
        return Promise.all(resetPromises).then(function () {
          that._updateVariableGroups();
        });
      }
    };

    /**
         * Serialize the model with all aggregated data providers to a JSON representation
         * @param {string} [sFormat] Format of the serialization (INA_REPOSITORY_DELTA or INA_REPOSITORY)
         * @return {object} A JSON object which represents the multidimensional model
         * @public
         */
    MultiDimModel.prototype.serialize = function (sFormat) {
      var sRepoFormat = sFormat === "INA_REPOSITORY_DELTA" ? FF.QModelFormat.INA_REPOSITORY_DELTA : FF.QModelFormat.INA_REPOSITORY;
      return {
        AssignedFilters: this.getProperty("/AssignedFilters"),
        DataProviders: _.reduce(this.getDataProviders(), function (oResult, dp) {
          oResult[dp.Name] = dp.serialize(sRepoFormat);
          return oResult;
        }, {})
      };
    };


    /**
         * Updates the model from the given the model state including all aggregated data providers
         *
         * @param {object} oModelState A JSON object which represents the multidimensional model to be applied
         * @param {string} [sFormat] Format of the serialization (INA_REPOSITORY_DELTA or INA_REPOSITORY).
         * @return {Promise<this>} Promise with reference to this in order to allow method chaining
         * @public
         */
    MultiDimModel.prototype.deserialize = function (oModelState, sFormat) {
      if (!this.bSkipDeserialization) {
        var that = this;
        var aDataProvider = this.getDataProviders();
        var sRepoFormat = sFormat === "INA_REPOSITORY_DELTA" ? FF.QModelFormat.INA_REPOSITORY_DELTA : FF.QModelFormat.INA_REPOSITORY;
        this.setProperty(MetaPathHelper.PathTo.DataProviders, aDataProvider || {});

        return this.initCompletedPromise.then(function () {
          var createDPPromises = [];
          that.setProperty("/AssignedFilters", oModelState.AssignedFilters);
          _.forEach(oModelState.DataProviders, function (sDef, sName) {
            let oDataProvider = aDataProvider[sName];
            if (oDataProvider && oDataProvider._FFDataProvider) {
              createDPPromises.push(oDataProvider.deserialize(sDef, sRepoFormat));
            } else {
              that.attachEvent("dataProviderAdded", null, function (oEvent) {
                const sDef = oModelState.DataProviders[oEvent.getParameter("dataProviderName")];
                if (sDef) {
                  return Promise.resolve(that.getDataProvider(oEvent.getParameter("dataProviderName")).deserialize(sDef, sRepoFormat));
                }
              });
            }
          });
          return Promise.all(createDPPromises);
        }).then(function () {
          that._updateVariableGroups();
          return that.checkUpdate();
        });
      }
    };

    /**
         * Skip deserialization if needed
         *
         * @param bStatus status to be set
         * @private
         */
    MultiDimModel.prototype.skipDeserialization = function (bStatus) {
      this.bSkipDeserialization = bStatus;
    };

    /**
         * Get grid styling template registry
         * @return sap.sac.df.model.extentsions.styling.GridStylingTemplateRegistry
         * @public
         */
    MultiDimModel.prototype.getGridStylingTemplateRegistry = function () {
      return this._StylingProviderRegistry.Grid;
    };

    /**
         * Get context menu provider registry
         * @return sap.sac.df.model.extentsions.contextMenu.ContextMenuProviderRegistry
         * @public
         */
    MultiDimModel.prototype.getContextMenuProviderRegistry = function () {
      return this._ContextMenuProviderRegistry;
    };

    /** Map of event names, that are provided by the model. */
    MultiDimModel.M_EVENTS = {
      variableGroupsAdded: "variableGroupsAdded",
      dataProviderAdded: "dataProviderAdded",
      dataProviderUpdated: "dataProviderUpdated",
      dataProviderRemoved: "dataProviderRemoved",
      loaded: "loaded",
      dataLoaded: "dataLoaded",
      stylingTemplateActivated: "stylingTemplateActivated"
    };

    /**
         * The <code>variableGroupsAdded</code> event is fired, when new variables groups are added.
         * @name sap.sac.df.model.MultiDimModel#variableGroupsAdded
         * @event
         * @public
         */

    /**
         * The <code>dataProviderAdded</code> event is fired, when a data provided is added to the model.
         * @name sap.sac.df.model.MultiDimModel#dataProviderAdded
         * @event
         * @param {string} dataProviderName name of the added data provider
         * @public
         */

    /**
         * The <code>dataProviderUpdated</code> event is fired, when a data provider is updated.
         * @name sap.sac.df.model.MultiDimModel#dataProviderUpdated
         * @event
         * @param {string} dataProviderName name of the updated data provider
         * @public
         */

    /**
         * The <code>dataProviderRemoved</code> event is fired, when a data provider is removed from the model.
         * @name sap.sac.df.model.MultiDimModel#dataProviderRemoved
         * @event
         * @param {string} dataProviderName name of the removed data provider
         * @public
         */
    /**
         * The <code>loaded</code> event is fired, when the model finally constructed.
         * @name sap.sac.df.model.MultiDimModel#loaded
         * @event
         * @public
         */

    /**
         * The <code>dataLoaded</code> event is fired, when new data was loaded.
         * @name sap.sac.df.model.MultiDimModel#dataLoaded
         * @param {string} dataProviderName name of the data provider which data was loaded
         * @event
         * @public
         */

    /**
         * The <code>stylingTemplateActivated</code> event is fired, when a styling template is activated.
         * @name sap.sac.df.model.MultiDimModel#stylingTemplateActivated
         * @param {string} stylingTemplateName name of the activated styling template
         * @event
         * @private
         */

    /** Map of properties, that are provided by the model. */
    MultiDimModel.M_PROPERTIES = {
      DataProviders: "DataProviders", VariableGroups: "VariableGroups", Messages: "Messages"
    };


    /**
         * Data Providers
         * @name sap.sac.df.model.MultiDimModel#DataProviders
         * @property DataProviders
         * @type {Object<sap.sac.df.model.DataProvider>}
         * @public
         */

    /**
         * Variable Groups
         * @name sap.sac.df.model.MultiDimModel#VariableGroups
         * @type {Object<sap.sac.df.model.VariableGroup>}
         * @property VariableGroups
         * @public
         */

    /**
         * Messages
         * @name sap.sac.df.model.MultiDimModel#Messages
         * @type {sap.ui.core.message.Message[]}
         * @property Messages
         * @public
         */

    /**
         * Configuration
         * @name sap.sac.df.model.MultiDimModel#Configuration
         * @type {Object<sap.sac.df.model.Configuration>}
         * @property Configuration
         * @public
         */

    return MultiDimModel;
  })
;
