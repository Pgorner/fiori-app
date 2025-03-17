/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap, Promise */
sap.ui.define(
  "sap/sac/df/model/DataProvider", [
    "sap/ui/base/Object",
    "sap/base/Log",
    "sap/ui/model/Model",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/sac/df/types/Axis",
    "sap/sac/df/types/DimensionType",
    "sap/sac/df/types/DisplayType",
    "sap/sac/df/types/ComparisonOperator",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/sac/df/utils/ListHelper",
    "sap/sac/df/utils/ResourceBundle",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library",
    "sap/sac/df/model/internal/Capability",
    "sap/sac/df/model/Dimension",
    "sap/sac/df/model/Variable",
    "sap/sac/df/model/Measure",
    "sap/sac/df/model/AxesLayout",
    "sap/sac/df/model/DataSourceInfo",
    "sap/sac/df/model/Visualization",
    "sap/sac/df/types/VisualizationType",
    "sap/sac/df/utils/MetaPathHelper"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    Log,
    Model,
    JSONModel,
    UiCoreDateFormat,
    Axis,
    DimensionType,
    DisplayType,
    ComparisonOperator,
    SyncActionHelper,
    ListHelper,
    ResourceBundle,
    _,
    FF,
    Capability,
    Dimension,
    Variable,
    Measure,
    AxesLayout,
    DataSourceInfo,
    Visualization,
    VisualizationType,
    MetaPathHelper
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
         * @class
         * A data provider is an analytical query exposed via an analytical engine and accessed via InA protocol.
         * It represents a navigable query manager and allows to access and change data.
         * Instances of this class should only be created by the {@link sap.sac.df.model.MultiDimModel}.
         *
         * <b>Structure of Exposed Data:</b>
         * <pre><code>
         * "Name": "",
         * "DataSourceInfo": { },
         * "Variables": { }
         * "Dimensions": { },
         * "Measures": [ ],
         * "Messages": [ ]
         * "AutoFetchEnabled": ""
         * </code></pre>
         * @extends sap.ui.model.json.JSONModel
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @experimental since version 1.119
         * @since 1.119
         * @hideconstructor
         * @alias sap.sac.df.model.DataProvider
         */

    const GDS_TABLE_VIEW = "gds_table_view";
    let DataProvider = JSONModel.extend("sap.sac.df.model.DataProvider", /** @lends sap.sac.df.model.DataProvider.prototype */ {
      constructor: function (oMultiDimModel, sDataProviderName) {
        Object.assign(this, Object.getPrototypeOf(this));
        Model.call(this);
        var that = this;
        /** @private */
        that._Model = oMultiDimModel;
        that.Name = sDataProviderName;
        that.Messages = [];
        that.Variables = {};
        that.Dimensions = {};
        that.Visualizations = {};
        that._VariableDisplayType = {};
        that._metadataCacheEnabled = oMultiDimModel._metadataCacheEnabled;

        /** @private */
        this._getModel = function () {
          return that._Model;
        };
        /** @private */
        this._getQueryManager = function () {
          return this._FFDataProvider.m_queryManager;
        };
        /** @private */
        this._getQueryModel = function () {
          return this._getQueryManager().getQueryModel();
        };
        /** @private */
        this._addMessagesToModel = function (oResult) {
          if (oResult && oResult.getMessages && oResult.getMessages() && oResult.getMessages().length) {
            this._Model._addMessages(transformMessages(oResult));
          }
        };

        function transformMessages(oResult) {
          const aMessages = Array.isArray(oResult.getMessages()) ? oResult.getMessages() : ListHelper.arrayFromList(oResult.getMessages());

          return aMessages.map(function (o) {
            var sSeverity = o.getSeverity().getName();
            if (sSeverity === "Info") {
              sSeverity = "Information";
            }
            return {
              Text: o.getText(),
              Severity: sSeverity,
              Code: o.getCode(),
              MessageClass: o.getMessageClass(),
              LongTextUri: o.getMessageClass() ? [
                "/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID='",
                encodeURIComponent(o.getMessageClass()), "',MSGNO='", encodeURIComponent(o.getCode()), ",',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
              ].join("") : null
            };
          });
        }

        that._callUpdateDimensionData = function () {
          updateDimensions();
        };

        that.resetToMetaData = function () {
          var that = this;
          return Promise.resolve().then(function () {
            that.variableChanged = true;
            that._executeModelOperation(function () {
              that._getQueryModel().queueEventing();
              that._getQueryManager().getConvenienceCommands().resetToDefaultState(true);
              that._getQueryModel().resumeEventing();
            }, true);
          });
        };

        that.invalidateMetaData = function () {
          const cacheKey = that._getQueryManager().getDataSource().getCacheKeyName2();
          that._getQueryManager().getOlapSystemContainer().getCubeContainer(cacheKey).releaseAllQueryMetadata();
        };

        that.logFF = function () {
          return new Promise(function (resolve) {
            that._getQueryManager().processShutdown(FF.SyncType.NON_BLOCKING, {
              onQueryManagerRelease: function (extResult, shutdownQueryManager) {
                FF.XObjectExt.release(shutdownQueryManager);
                resolve();
              }
            });
          });
        };
        that._invalidateState = function () {
          that._Model.setMessages([]);
          that._getQueryManager().invalidateState();
          that._getQueryManager().getResultsetContainer(true);
        };

        that._triggerDataProviderPropertyUpdate = function (bSuppressModelUpdate) {
          if (!bSuppressModelUpdate) {
            that._invalidateState();
            that._FFDataProvider.getEventing().notifyExternalModelChange(null);
          }
        };

        that.isValid = function () {
          var resultSetSyncState = that._getQueryManager().getResultSetSyncState();
          return resultSetSyncState !== FF.SyncState.OUT_OF_SYNC && resultSetSyncState !== FF.SyncState.IN_SYNC_WITH_ERROR;
        };

        function updateMetaData() {
          updateDataSourceInfo();
          updateVariables();
          updateDimensions();
          that._getQueryModel().stopEventing();
          updateVisualization();
          updateMeasures();
          updateConditions();
          updateExceptions();
          that._getQueryModel().resumeEventing();
        }

        function updateVisualization() {
          ListHelper.arrayFromList(that._getQueryModel().getVisualizationManager().getVisualizationDefinitions()
          ).filter(function (oVizDefinition) {
            //TODO: Map types
            const sType = VisualizationType.Grid;
            const oVisualization = new Visualization(that, oVizDefinition.getName(), sType);
            that.setProperty(MetaPathHelper.PathTo.Visualizations + "/" + oVizDefinition.getName(), oVisualization);
          });
        }

        function updateDataSourceInfo() {
          that.DataSourceInfo = new DataSourceInfo(that);
        }

        function updateVariables() {
          var aInputEnabledVariables =
                        ListHelper.arrayFromList(that._getQueryModel().getVariables()
                        ).filter(function (oVariable) {
                          return oVariable.isInputEnabled();
                        });

          that.Variables = _.reduce(aInputEnabledVariables,
            function (oVariables, FFVariable) {
              var oVariable = new Variable(that, FFVariable);
              if (oVariable.Name) {
                oVariables[oVariable.Name] = oVariable;
              }
              return oVariables;
            }, {});
        }

        function updateDimensions() {
          that._getQueryModel().stopEventing();
          that.Dimensions = _.reduce(ListHelper.arrayFromList(that._getQueryModel().getDimensions()),
            function (oDimensions, FFDimension) {
              var oDimension = new Dimension(that, FFDimension);
              if (oDimension.Name) {
                oDimensions[oDimension.Name] = oDimension;
              }
              return oDimensions;
            }, {});

          that.AxesLayout = new AxesLayout(that);
          that._getQueryModel().resumeEventing();
        }

        function updateMeasures() {
          var oMeasureDimension = that.getMeasureStructureDimension();
          var aMeasureMembers = oMeasureDimension && oMeasureDimension.Members || [];
          that.Measures = _.reduce(aMeasureMembers,
            function (oResult, oMeasureMember) {
              oResult[oMeasureMember.Name] = new Measure(that, oMeasureMember, oMeasureDimension._FFDimension.getAllStructureMembers().getByKey(oMeasureMember.Key));
              return oResult;
            }, {});

        }

        function updateConditions() {
          var oQueryModel = that._getQueryModel();
          that.Conditions = _.map(
            oQueryModel.getConditionManager() ? ListHelper.arrayFromList(oQueryModel.getConditionManager()) : [],
            function (o) {
              return {
                Name: o.getName(),
                Description: o.getText(),
                StatusText: ResourceBundle.getText(o.isActive() ? "ACTIVE" : "INACTIVE"),
                active: o.isActive()
              };
            });
        }

        function updateExceptions() {
          var oQueryModel = that._getQueryModel();
          that.Exceptions = _.map(oQueryModel.getExceptionManager() ? ListHelper.arrayFromList(oQueryModel.getExceptionManager()) : [],
            function (o) {
              return {
                Name: o.getName(),
                Description: o.getText(),
                StatusText: ResourceBundle.getText(o.isActive() ? "ACTIVE" : "INACTIVE"),
                active: o.isActive()
              };
            });
        }

        /** @private */
        that._reinitIfNeededPromise = function () {
          const that = this;
          if (that._reinitPromise) {
            return that._reinitPromise;
          }
          that._reinitPromise = that._getQueryManager().isReinitNeeded()
            ? new Promise(function (resolve, reject) {
              that._getQueryManager().reInitVariablesAfterSubmit(FF.SyncType.NON_BLOCKING,
                {
                  onVariableProcessorExecuted: oExtResult => oExtResult.hasErrors() ? reject(SyncActionHelper.reject(oExtResult.getErrors())) : resolve()
                });
            })
            : Promise.resolve();
          return that._reinitPromise.then(function () {
            that._reinitPromise = null;
          });
        };

        /** @private */
        that._executeModelOperation = function (operation, fullUpdate) {
          if (operation) {
            operation();
          }
          that._triggerDataProviderPropertyUpdate();
          if (fullUpdate) {
            updateMetaData();
          } else {
            updateDimensions();
          }
        };

        /** @private */
        that._transferVariablesIfNeededPromise = function () {
          const that = this;
          if (this.variableChanged) {
            return new Promise(
              function (resolve, reject) {
                that._getQueryManager().transferVariables(FF.SyncType.NON_BLOCKING,
                  {
                    onVariableProcessorExecuted: function (oExtResult) {
                      if (oExtResult.hasErrors()) {
                        reject(SyncActionHelper.reject(oExtResult.getErrors()));
                      } else resolve();
                    }
                  });
              });
          }
        };

        /** @private */
        this._createFFDataProviderFromWidget = function (sWidgetId) {
          return Promise.resolve(
            FF.OuDataProviderFactory.createDataProviderFromFile(that._Model.getApplication().getProcess(), sDataProviderName, "/analyticalwidgets/" + sWidgetId, null)
          ).then((FFDataProvider) => {
            that._FFDataProvider = FFDataProvider;
            that.addVisualization(GDS_TABLE_VIEW, VisualizationType.Grid);
            that._registerEventHandlers();
          }).then(() => {
            that._getQueryManager().attachBeforeQueryExecutionListener({
              onBeforeQueryExecuted: function () {
                that._Model.propagateVariableGroupValues(that.Name);
                if (that.variableChanged && that._getQueryManager().getModelCapabilities().supportsAutoVariableSubmit()) {
                  that._getQueryManager().setVariableProcessorState(FF.VariableProcessorState.PROCESSING_AUTO_SUBMIT);
                  that.variableChanged = false;
                }
              },
              isEqualTo: FF.XObject.prototype.isEqualTo
            });
            that._getQueryManager().attachQueryExecutedListener({
              onQueryExecuted: function (extResult) {
                that._getQueryManager().stopEventing();
                FF.XCollectionUtils.forEach(that._getQueryManager().getDimensionMemberVariables(), function (variable) {
                  if (variable.isInputEnabled()) {
                    variable.setWinControlInAutoSubmit(true);
                  }
                }.bind(this));
                that._getQueryManager().resumeEventing();
                that._addMessagesToModel(extResult);
                if (extResult.hasErrors()) {
                  that._Model.checkUpdate();
                  that._Model.fireRequestFailed({infoObject: that.Name});
                } else {
                  updateMetaData();
                }
              },
              isEqualTo: function (other) {
                return this === other;
              }
            }, "UI5GridViz");
          }).then(() => {
            updateMetaData();
          }).then(() => {
            return that;
          }).catch((oError) => {
            throw new Error(oError);
          });
        };

        this._createFFDataProvider = function (sQueryName, sSystem, sPackage, sSchema, sType) {
          const sFullQualifiedQueryName = sQueryName.match(/^.*:\[.*\]\[.*\]\[.*\]/)
            ? sQueryName
            : [(sType || "query"), ":", "[", (sSchema ? sSchema : ""), "]", "[", ((sSchema || sPackage) ? sPackage : ""), "]", "[", sQueryName, "]"].join("");

          const oDataSource = FF.QFactory.createDataSourceWithFqn(sFullQualifiedQueryName);
          oDataSource.setSystemName(sSystem || that._Model.getApplication().getSystemLandscape().getMasterSystemName());
          const oConfig = FF.OuDataProviderConfiguration.createConfig(that._Model.getApplication(), oDataSource);
          oConfig.setMetadataCacheEnabled(that._metadataCacheEnabled);
          //oConfig.setStartWithAutoFetch(false);
          oConfig.setDataProviderName(this.Name);
          oConfig.getHooks().getBeforeRepoLoadRegister().addBiFunction((dp, repo) => {
            return this._addOverrideTextsToConfig(dp, repo);
          });

          this._addGridVisualization(oConfig);
          oConfig.getStartConnection().setStartWithAutoFetch(false);
          return Promise.resolve(
            FF.OuDataProviderFactory.createDataProviderFromSource(oConfig)
          ).then((FFDataProvider) => {
            that._FFDataProvider = FFDataProvider;
            that.setProperty(MetaPathHelper.PathTo.Visualizations + "/" + GDS_TABLE_VIEW, new Visualization(that, GDS_TABLE_VIEW, VisualizationType.Grid));
            //that.addVisualization(GDS_TABLE_VIEW, VisualizationType.Grid);
            that._registerEventHandlers();
          }).then(() => {
            that._getQueryManager().attachBeforeQueryExecutionListener({
              onBeforeQueryExecuted: function () {
                that._Model.propagateVariableGroupValues(that.Name);
                if (that.variableChanged && that._getQueryManager().getModelCapabilities().supportsAutoVariableSubmit()) {
                  that._getQueryManager().setVariableProcessorState(FF.VariableProcessorState.PROCESSING_AUTO_SUBMIT);
                  that.variableChanged = false;
                }
              },
              isEqualTo: FF.XObject.prototype.isEqualTo
            });
            that._getQueryManager().attachQueryExecutedListener({
              onQueryExecuted: function (extResult) {
                that._getQueryManager().stopEventing();
                FF.XCollectionUtils.forEach(that._getQueryManager().getDimensionMemberVariables(), function (variable) {
                  if (variable.isInputEnabled()) {
                    variable.setWinControlInAutoSubmit(true);
                  }
                }.bind(this));
                that._getQueryManager().resumeEventing();
                that._addMessagesToModel(extResult);
                if (extResult.hasErrors()) {
                  that._Model.checkUpdate();
                  that._Model.fireRequestFailed({infoObject: that.Name});
                } else {
                  updateMetaData();
                }
              },
              isEqualTo: function (other) {
                return this === other;
              }
            }, "UI5GridViz");
          }).then(() => {
            updateMetaData();
          }).then(() => {
            return that;
          }).catch((oError) => {
            throw new Error(oError);
          });
        };

        this._addOverrideTextsToConfig = function (dataProvider) {
          let queryManager = dataProvider.getQueryManager();
          if (FF.notNull(queryManager)) {
            let localizationCenter = FF.XLocalizationCenter.getCenter();
            let appSettings = queryManager.getQueryModel().getVisualizationManager().getApplicationSettings();
            appSettings.putOverwriteText(FF.SacTableConstants.S_MEASURE_DIMENSION_OVERWRITE_TEXT, localizationCenter.getText(FF.OlapUiCommonI18n.COMMON_MEASURES));
            appSettings.putOverwriteText(FF.SacTableConstants.S_TOTAL_MEMBER_OVERWRITE_TEXT, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.TOTALS));
            appSettings.putOverwriteText(FF.SacTableConstants.S_TOTAL_INCLUDING_MEMBER_OVERWRITE_TEXT, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.TOTALS_INCLUDING));
            appSettings.putOverwriteText(FF.SacTableConstants.S_TOTAL_REMAINING_MEMBER_OVERWRITE_TEXT, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.TOTALS_REMAINING));
            appSettings.putOverwriteText(FF.SacTableConstants.S_VALUE_EXCEPTION_NULL, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_NULL));
            appSettings.putOverwriteText(FF.SacTableConstants.S_VALUE_EXCEPTION_UNDEFINED, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_UNDEFINED));
            appSettings.putOverwriteText(FF.SacTableConstants.S_VALUE_EXCEPTION_ERROR, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_ERROR));
            appSettings.putOverwriteText(FF.SacTableConstants.S_VALUE_EXCEPTION_OTHER, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_OTHER));
            appSettings.putOverwriteText(FF.SacTableConstants.S_VALUE_EXCEPTION_NO_VALUE, localizationCenter.getText(FF.AuGdsQueryBuilderI18n.VALUE_EXCEPTION_NO_VALUE));
            appSettings.putOverwriteText(FF.SacTableConstants.S_SCALE_SHORT_THOUSAND, localizationCenter.getText(FF.OuNumberFormattingI18n.STYLE_SCALE_SHORT_THOUSAND));
            appSettings.putOverwriteText(FF.SacTableConstants.S_SCALE_SHORT_MILLION, localizationCenter.getText(FF.OuNumberFormattingI18n.STYLE_SCALE_SHORT_MILLION));
            appSettings.putOverwriteText(FF.SacTableConstants.S_SCALE_SHORT_BILLION, localizationCenter.getText(FF.OuNumberFormattingI18n.STYLE_SCALE_SHORT_BILLION));
            appSettings.putOverwriteText(FF.SacTableConstants.S_SCALE_LONG_THOUSAND, localizationCenter.getText(FF.OuNumberFormattingI18n.STYLE_SCALE_LONG_THOUSAND));
            appSettings.putOverwriteText(FF.SacTableConstants.S_SCALE_LONG_MILLION, localizationCenter.getText(FF.OuNumberFormattingI18n.STYLE_SCALE_LONG_MILLION));
            appSettings.putOverwriteText(FF.SacTableConstants.S_SCALE_LONG_BILLION, localizationCenter.getText(FF.OuNumberFormattingI18n.STYLE_SCALE_LONG_BILLION));
            let secondStructure = queryManager.getQueryModel().getDimensionByType(FF.DimensionType.SECONDARY_STRUCTURE);
            if (FF.notNull(secondStructure)) {
              if (!queryManager.getProcess().hasFeature(FF.FeatureToggleOlap.USE_ORIGINAL_STRUCTURE_TEXT_IN_UI) || FF.XStringUtils.isNullOrEmpty(secondStructure.getOriginalText())) {
                appSettings.putOverwriteText(FF.SacTableConstants.S_STRUCTURE_DIMENSION_OVERWRITE_TEXT, localizationCenter.getText(FF.OlapUiCommonI18n.COMMON_STRUCTURE));
              }
            }
          }
          return null;
        };

        /** @private */
        this._addGridVisualization = function (oConfig) {
          let jsonViz = FF.PrFactory.createList();
          let jsonGrid = jsonViz.addNewStructure();
          jsonGrid.putString(FF.OuDataProviderConfiguration.VIZ_NAME, GDS_TABLE_VIEW);
          jsonGrid.putString(FF.OuDataProviderConfiguration.VIZ_TYPE, FF.VisualizationType.GRID.getName());
          jsonGrid.putString(FF.OuDataProviderConfiguration.VIZ_PROTOCOL, FF.ProtocolBindingType.SAC_TABLE_GRID.getName());
          jsonGrid.putBoolean(FF.OuDataProviderConfiguration.VIZ_ACTIVE, false);
          return oConfig.getStartConnection().setVisualizations(jsonViz);
        };

        /** @private */
        this._registerEventHandlers = function () {
          if (FF.notNull(this._FFDataProvider)) {
            this._FFDataProvider.getEventing().getListenerForModelChanges().addConsumer(() => {
              return this._onDataProviderDataProviderModelChange(this._FFDataProvider);
            });

            this._FFDataProvider.getEventing().getListenerForResultDataFetch().addConsumer((oEvent) => {
              this._onDataFetch(oEvent);
            });
          }
        };

        /** @private */
        this._onDataProviderDataProviderModelChange = function () {
          this._invalidateState();
          this._Model.fireDataProviderUpdated({dataProviderName: this.Name});
        };

        /** @private */
        this._onDataFetch = function (oEvent) {
          if (oEvent.getStep() === FF.OuDataProviderResultDataFetchStep.QUERY_EXECUTED) {
            this._onResultSetChange();
          }
        };

        /** @private */
        this._onResultSetChange = function () {
          this._callUpdateDimensionData();
          this._Model.checkUpdate();
          this._Model.fireRequestCompleted({infoObject: this.Name});
        };

      }
    });

    /**
         * Add new visualization
         * @param {string} sName visualization name
         * @param {sap.sac.df.types.VisualizationType} sType type of visualization
         * @returns {sap.sac.df.model.Visualization} Returns visualization
         * @public
         */
    DataProvider.prototype.addVisualization = function (sName, sType) {
      let that = this;
      return Promise.resolve(
        that.removeVisualization(sName)
      ).then(function () {
        const oVisualization = new Visualization(that, sName, sType);
        that.setProperty(MetaPathHelper.PathTo.Visualizations + "/" + sName, oVisualization);
        return oVisualization._createFFVisualization();
      }).then(function () {
        that.fireVisualizationAdded({visualizationName: sName});
        that._Model.fireDataProviderUpdated({dataProviderName: that.Name});
        return that.getVisualization(sName);
      }).catch(function (oError) {
        that._addMessagesToModel();
        return Promise.reject(oError);
      });
    };


    /**
         * Remove existing visualization from data provider
         * @param {string} sName visualization name
         * @returns {Promise<void>} Promise which resolves when the removing s finished
         * @public
         */
    DataProvider.prototype.removeVisualization = function (sName) {
      let that = this;
      if (this.getVisualization(sName)) {
        return Promise.resolve(
          that.getVisualization(sName)._removeFFVisualization()
        ).then(function () {
          that.setProperty(MetaPathHelper.PathTo.Visualizations + "/" + sName, null);
          that.fireDataProviderRemoved({visualizationName: sName});
        }).catch(function (oError) {
          that._addMessagesToModel();
          return Promise.reject(oError);
        });
      }
    };

    /**
         * Get all visualizations
         * @returns {Object<sap.sac.df.model.Visualization>} Object of all visualizations
         * @public
         */
    DataProvider.prototype.getVisualizations = function () {
      return this.getProperty(MetaPathHelper.PathTo.Visualizations);
    };

    /**
         * Get visualization
         * @param {String} sName visualization name
         * @returns {sap.sac.df.model.Visualization} visualization object if found
         * @public
         */
    DataProvider.prototype.getVisualization = function (sName) {
      return this.getProperty(MetaPathHelper.PathTo.Visualizations + "/" + sName);
    };

    /**
         * Get grid visualization
         * @returns {sap.sac.df.model.Visualization} visualization object if found
         * @public
         */
    DataProvider.prototype.getGridVisualization = function () {
      return this.getProperty(MetaPathHelper.PathTo.Visualizations + "/" + GDS_TABLE_VIEW);
    };

    /**
         * Checks whether an InA capability is supported by the server.
         * Throws an error for unhandled capabilities.
         * List of handled capabilities can be seen in type {@link sap.sac.df.model.Capability}
         * @param sCapability Capability name
         * @returns {boolean} Returns true, if the capability is supported, else false
         * @public
         */
    DataProvider.prototype.supportsCapability = function (sCapability) {
      if (sCapability === Capability.SupportsDocuments) {
        var oDocumentsInfo = this._getQueryModel().getDocumentsInfo();
        return !!oDocumentsInfo && oDocumentsInfo.getSupportsDocuments() !== FF.DocumentsSupportType.NONE;
      }
      throw new Error("Unhandled capability : " + sCapability);
    };

    DataProvider.prototype.setProperty = function (sPath, oValue) {
      return this._Model.setProperty(MetaPathHelper.PathTo.DataProviders + "/" + this.Name + sPath, oValue);
    };


    DataProvider.prototype.getProperty = function (sPath) {
      return this._Model.getProperty(MetaPathHelper.PathTo.DataProviders + "/" + this.Name + sPath);
    };

    /**
         * Set the property <code>AutoFetchEnabled</code>, if the data should be automatically be refreshed on invalid.
         * @param {boolean} bAutoFetchEnabled
         * @public
         */
    DataProvider.prototype.setAutoFetchEnabled = function (bAutoFetchEnabled) {
      this._FFDataProvider?.getResulting().setAutoFetchActive(bAutoFetchEnabled);
      if (this.getAutoFetchEnabled() !== bAutoFetchEnabled) {
        this.setProperty("/AutoFetchEnabled", bAutoFetchEnabled);
        this._Model.fireEvent("dataProviderUpdated", {dataProviderName: this.Name});
      }

    };

    /**
         * Get the property AutoFetchEnabled
         * @return {boolean}
         * @public
         */
    DataProvider.prototype.getAutoFetchEnabled = function () {
      return this.getProperty("/AutoFetchEnabled");
    };

    /**
         * Updates the multidimensional model from the given the state of a data provider
         *
         * @param {object} oModelState the JSON object containing the persisted state of a data provider to be applied.
         * @param {string} [sFormat] Format of the serialization (INA_REPOSITORY_DELTA or INA_REPOSITORY).
         * @param {boolean} [bSuppressUpdate] Indicator if the data provider updated should be suppressed after deserialization
         * @return {Promise<this>} Promise with reference to this in order to allow method chaining
         * @public
         */
    DataProvider.prototype.deserialize = function (oModelState, sFormat, bSuppressUpdate) {
      var that = this;
      this._getQueryModel().stopEventing();
      return Promise.resolve().then(function () {
        that.variableChanged = true;
        that._executeModelOperation(function () {
          that._getQueryModel().deserializeExt(sFormat, oModelState);
        }, bSuppressUpdate || true);
      }).then(() => {
        that._getQueryModel().resumeEventing();
      });
    };

    /**
         * Serialize the data provider state to a JSON representation
         * @param {string} [sFormat] Format of the serialization (INA_REPOSITORY_DELTA or INA_REPOSITORY)
         * @return {object} A JSON object which represents the data provider
         * @public
         */
    DataProvider.prototype.serialize = function (sFormat) {
      return this._getQueryModel().serializeToContentExt(sFormat, null).getString();
    };

    /**
         * Get the scaling factor of a measure or cell
         * @param {string} sMeasureStructureMember Measure structure member
         * @param {string} sStructureMember Structure (non-measure) member
         * @return {int} Scaling factor
         * @public
         */
    DataProvider.prototype.getScalingFactor = function (sMeasureStructureMember, sStructureMember) {
      var oMeasureStructure = this.getMeasureStructureDimension();
      if (!oMeasureStructure) {
        throw new Error("No measure Structure");
      }
      var oNonMeasureStructure = sStructureMember ? this.getStructureDimension() : null;
      var aMeasureMembers = ListHelper.arrayFromList(oMeasureStructure._FFDimension.getAllStructureMembers());
      var oMeasureDimDisplayField = oMeasureStructure._FFDimension.getDisplayKeyField();
      var oMeasureMember = (function () {
        var oM = _.find(aMeasureMembers, function (o) {
          var oVal = o.getFieldValue(oMeasureDimDisplayField);
          var s = oVal ? oVal.getString() : o.getName();
          return s === sMeasureStructureMember;
        });
        if (!oM) {
          throw new Error("Member " + sMeasureStructureMember + " not found in structure: " + oMeasureStructure.Name);
        }
        return oM;
      }());
      if (!oNonMeasureStructure) {
        return oMeasureStructure.getScalingFactor(sMeasureStructureMember);
      } else {
        var aNonMeasureMembers = ListHelper.arrayFromList(oNonMeasureStructure._FFDimension.getAllStructureMembers());
        var oNonMeasureDimDisplayField = oNonMeasureStructure._FFDimension.getDisplayKeyField();
        var oNonMeasureMember = (function () {
          var oM = _.find(aNonMeasureMembers, function (o) {
            var oVal = o.getFieldValue(oNonMeasureDimDisplayField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sStructureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureStructureMember + " not found in structure: " + oNonMeasureStructure.Name);
          }
          return oM;
        }());
        var aQC = ListHelper.arrayFromIter(this._getQueryModel().getQueryDataCells().getIterator());
        var oQC = _.find(aQC, function (o) {
          return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oNonMeasureMember);
        });
        if (!oQC) {
          throw new Error("Invalid Query Cell");
        }
        return oQC.getScalingFactor();
      }
    };

    /**
         * Set the scaling factor of a measure or cell
         * @param {int} nFactor Scaling factor
         * @param {string} sMeasureStructureMember Measure structure member
         * @param {string} sStructureMember Structure (non-measure) member
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    DataProvider.prototype.setScalingFactor = function (nFactor, sMeasureStructureMember, sStructureMember) {
      var that = this;
      this._executeModelOperation(function () {
        var oMeasureStructure = that.getMeasureStructureDimension();
        if (!oMeasureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sStructureMember ? that.getStructureDimension() : null;
        var aStructureMembers = ListHelper.arrayFromList(oMeasureStructure._FFDimension.getAllStructureMembers());
        var oField = oMeasureStructure._FFDimension.getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aStructureMembers, function (o) {
            var oVal = o.getFieldValue(oField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureStructureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureStructureMember + " not found in structure: " + oMeasureStructure.Name);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          oMeasureStructure.setScalingFactor(sMeasureStructureMember, nFactor);
          return that;
        } else {
          var aNonMeasureStructureMembers = ListHelper.arrayFromList(oNonMeasureStructure._FFDimension.getAllStructureMembers());
          oField = oNonMeasureStructure._FFDimension.getDisplayKeyField();
          var oM2 = (function () {
            var oM = _.find(aNonMeasureStructureMembers, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sStructureMember;
            });
            if (!oM) {
              throw new Error("Member " + sStructureMember + " not found in structure: " + oNonMeasureStructure.Name);
            }
            return oM;
          }());
          var aQueryCells = ListHelper.arrayFromIter(that._getQueryModel().getQueryDataCells().getIterator());
          aQueryCells = _.filter(aQueryCells, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oM2);
          });
          if (!aQueryCells || aQueryCells.length < 1) {
            throw new Error("Invalid Query Cell");
          }
          return _.forEach(aQueryCells, function (oQueryCell) {
            oQueryCell.setScalingFactor(nFactor);
          });
        }
      });

    };

    /**
         * Set the number of decimal places of a measure or cell
         * @param {int} nNumberOfDecimalPlaces Number of the decimal places
         * @param {string} sMeasureStructureMember Measure structure member
         * @param {string} sStructureMember Structure (non-measure) member
         * @return {this} Reference to this in order to allow method chaining
         * @public
         */
    DataProvider.prototype.setDecimalPlaces = function (nNumberOfDecimalPlaces, sMeasureStructureMember, sStructureMember) {
      var that = this;
      this._executeModelOperation(function () {
        var oMeasureStructure = that.getMeasureStructureDimension();
        if (!oMeasureStructure) {
          throw new Error("No measure Structure");
        }
        var oNonMeasureStructure = sStructureMember ? that.getStructureDimension() : null;
        var aStructureMembers = ListHelper.arrayFromList(oMeasureStructure._FFDimension.getAllStructureMembers());
        var oField = oMeasureStructure._FFDimension.getDisplayKeyField();
        var oMeasureMember = (function () {
          var oM = _.find(aStructureMembers, function (o) {
            var oVal = o.getFieldValue(oField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sMeasureStructureMember;
          });
          if (!oM) {
            throw new Error("Member " + sMeasureStructureMember + " not found in structure: " + oMeasureStructure.Name);
          }
          return oM;
        }());
        if (!oNonMeasureStructure) {
          oMeasureStructure.setDecimalPlaces(sMeasureStructureMember, nNumberOfDecimalPlaces);
          return that;
        } else {
          var aNonMeasureStructureMembers = ListHelper.arrayFromList(oNonMeasureStructure._FFDimension.getAllStructureMembers());
          oField = oNonMeasureStructure._FFDimension.getDisplayKeyField();
          var oStructureMember = (function () {
            var oM = _.find(aNonMeasureStructureMembers, function (o) {
              var oVal = o.getFieldValue(oField);
              var s = oVal ? oVal.getString() : o.getName();
              return s === sStructureMember;
            });
            if (!oM) {
              throw new Error("Member " + sStructureMember + " not found in structure: " + oNonMeasureStructure.Name);
            }
            return oM;
          }());
          var aQueryCells = ListHelper.arrayFromIter(that._getQueryModel().getQueryDataCells().getIterator());
          aQueryCells = _.filter(aQueryCells, function (o) {
            return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oStructureMember);
          });
          if (!aQueryCells || aQueryCells.length < 1) {
            throw new Error("Invalid Query Cell");
          }
          return _.forEach(aQueryCells, function (oQueryCell) {
            oQueryCell.setDecimalPlaces(nNumberOfDecimalPlaces);
          });
        }
      });
    };

    /**
         * Get the scaling factor of a measure or cell
         * @param {string} sMeasureStructureMember Measure structure member
         * @param {string} sStructureMember Structure (non-measure) member
         * @return {int} Number of decimal places
         * @public
         */
    DataProvider.prototype.getDecimalPlaces = function (sMeasureStructureMember, sStructureMember) {
      var oMeasureStructure = this.getMeasureStructureDimension();
      if (!oMeasureStructure) {
        throw new Error("No measure Structure");
      }
      var oNonMeasureStructure = sStructureMember ? this.getStructureDimension() : null;
      var aMeasureMembers = ListHelper.arrayFromList(oMeasureStructure._FFDimension.getAllStructureMembers());
      var oMeasureDisplayField = oMeasureStructure._FFDimension.getDisplayKeyField();
      var oMeasureMember = (function () {
        var oM = _.find(aMeasureMembers, function (o) {
          var oVal = o.getFieldValue(oMeasureDisplayField);
          var s = oVal ? oVal.getString() : o.getName();
          return s === sMeasureStructureMember;
        });
        if (!oM) {
          throw new Error("Member " + sMeasureStructureMember + " not found in structure: " + oMeasureStructure.Name);
        }
        return oM;
      }());
      if (!oNonMeasureStructure) {
        return oMeasureStructure.getDecimalPlaces(sMeasureStructureMember);
      } else {
        var aNonMeasureMembers = ListHelper.arrayFromList(oNonMeasureStructure._FFDimension.getAllStructureMembers());
        var oNonMeasureDisplayField = oNonMeasureStructure._FFDimension.getDisplayKeyField();
        var oNonMeasureMember = (function () {
          var oM = _.find(aNonMeasureMembers, function (o) {
            var oVal = o.getFieldValue(oNonMeasureDisplayField);
            var s = oVal ? oVal.getString() : o.getName();
            return s === sStructureMember;
          });
          if (!oM) {
            throw new Error("Member " + sStructureMember + " not found in oMmeasureStructure: " + oNonMeasureStructure.Name);
          }
          return oM;
        }());
        var aQC = ListHelper.arrayFromIter(this._getQueryModel().getQueryDataCells().getIterator());
        var oQC = _.find(aQC, function (o) {
          return o.hasMemberReference(oMeasureMember) && o.hasMemberReference(oNonMeasureMember);
        });
        if (!oQC) {
          throw new Error("Invalid Query Cell");
        }
        return oQC.getDecimalPlaces();
      }
    };

    /**
         * Export Data
         * @param {object} oDataExportConfig Data export configuration
         * @public
         */
    DataProvider.prototype.exportData = function (oDataExportConfig) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var oTableDef = this.getVisualization(GDS_TABLE_VIEW)._getFFVisualization();
        oDataExportConfig.addOverwriteTextsToQm(that._getQueryModel().getVisualizationManager().getApplicationSettings());
        var oDataExportHelper = FF.DataExportHelper.create(that._getQueryManager(), oTableDef, reject, resolve);
        if (oDataExportConfig.getDisplayDialog()) {
          oDataExportHelper.showExportDialog(oDataExportConfig.getType(), oDataExportConfig.getFileName(), resolve);
        } else {
          var export_config = oDataExportConfig.getFireflyConfig();
          oDataExportHelper.exportData(export_config);
        }
      }.bind(this));
    };

    /**
         * Get Variable
         * @param {string} sVariableName Variable Name
         * @return {sap.sac.df.model.Variable} Variable object
         * @public
         */
    DataProvider.prototype.getVariable = function (sVariableName) {
      return this.getProperty(MetaPathHelper.PathTo.Variables + "/" + sVariableName);
    };

    /**
         * Get all variables
         * @return {Object<sap.sac.df.model.Variable>} Object of all variables
         * @public
         */
    DataProvider.prototype.getVariables = function () {
      return this.getProperty(MetaPathHelper.PathTo.Variables);
    };

    /**
         * Get Dimension
         * @param {string} sDimensionName Dimension name
         * @return {sap.sac.df.model.Dimension} Dimension object
         * @public
         */
    DataProvider.prototype.getDimension = function (sDimensionName) {
      return this.getProperty(MetaPathHelper.PathTo.Dimensions + "/" + sDimensionName);
    };

    /**
         * Get all dimensions
         * @return {Object<sap.sac.df.model.Dimension>} Object of all dimensions
         * @public
         */
    DataProvider.prototype.getDimensions = function () {
      return this.getProperty(MetaPathHelper.PathTo.Dimensions);
    };

    /**
         * Get measure
         * @param {string} sMeasureName Measure name
         * @return {sap.sac.df.model.Measure} Measure object
         * @public
         */
    DataProvider.prototype.getMeasure = function (sMeasureName) {
      return this.getProperty(MetaPathHelper.PathTo.Measures + "/" + sMeasureName);
    };

    /**
         * Get all measures
         * @return {sap.sac.df.model.Measure} Object of all measures
         * @public
         */
    DataProvider.prototype.getMeasures = function () {
      return this.getProperty(MetaPathHelper.PathTo.Measures);
    };

    /**
         * Get axis layout
         * @return {sap.sac.df.model.AxesLayout} Axis layout object
         * @public
         */
    DataProvider.prototype.getAxesLayout = function () {
      return this.getProperty(MetaPathHelper.PathTo.AxesLayout);
    };

    /**
         * Get data source information
         * @return {sap.sac.df.model.DataSourceInfo} data source information object
         * @public
         */
    DataProvider.prototype.getDataSourceInfo = function () {
      return this.getProperty(MetaPathHelper.PathTo.DataSourceInfo);
    };

    /** Map of event names, that are provided by the object. */
    DataProvider.M_EVENTS = {
      dataUpdated: "dataUpdated",
      visualizationAdded: "visualizationAdded",
      visualizationRemoved: "visualizationRemoved"
    };

    /**
         * The <code>dataUpdated</code> event is fired, when a new result set was fetched
         * @name sap.sac.df.model.DataProvider#dataUpdated
         * @event
         * @public
         */

    /**
         * Fires event {@link #event:dataUpdated dataUpdated} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    DataProvider.prototype.fireDataUpdated = function (oParameters) {
      this.fireEvent("dataUpdated", oParameters);
      this._Model.fireEvent("dataLoaded", {dataProviderName: this.Name});
    };

    /**
         * The <code>visualizationAdded</code> event is fired, when a new visualization is added
         * @name sap.sac.df.model.DataProvider#visualizationAdded
         * @event
         * @public
         */

    /**
         * Fires event {@link #event:visualizationAdded visualizationAdded} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    DataProvider.prototype.fireVisualizationAdded = function (oParameters) {
      this.fireEvent("visualizationAdded", oParameters);
    };

    /**
         * The <code>visualizationRemoved</code> event is fired, when a new visualization is removed
         * @name sap.sac.df.model.DataProvider#visualizationRemoved
         * @event
         * @public
         */

    /**
         * Fires event {@link #event:visualizationRemoved visualizationRemoved} to attached listeners.
         *
         * @param {object} [oParameters] Parameters to pass along with the event
         * @returns {this} Reference to this in order to allow method chaining
         * @public
         */
    DataProvider.prototype.fireVisualizationRemoved = function (oParameters) {
      this.fireEvent("visualizationRemoved", oParameters);
    };


    /** Map of properties, that are provided by the object. */
    DataProvider.M_PROPERTIES = {
      Dimensions: "Dimensions",
      Variables: "Variables",
      Measures: "Measures",
      Visualizations: "Visualizations",
      AxesLayout: "AxesLayout",
      DataSourceInfo: "DataSourceInfo",
      AutoFetchEnabled: "AutoFetchEnabled"
    };

    /**
         * Dimensions
         * @name sap.sac.df.model.DataProvider#Dimensions
         * @type {Object<sap.sac.df.model.Dimension>}
         * @property Dimensions
         * @public
         */

    /**
         * Variables
         * @name sap.sac.df.model.DataProvider#Variables
         * @type {Object<sap.sac.df.model.Variable>}
         * @property Variables
         * @public
         */

    /**
         * Measures
         * @name sap.sac.df.model.DataProvider#Measures
         * @type {Object<sap.sac.df.model.Measure>}
         * @property Measures
         * @public
         */

    /**
         * Visualizations
         * @name sap.sac.df.model.DataProvider#Visualizations
         * @type {Object<sap.sac.df.model.Visualization>}
         * @property Visualizations
         * @public
         */

    /**
         * AxesLayout
         * @name sap.sac.df.model.DataProvider#AxesLayout
         * @type {sap.sac.df.model.AxesLayout}
         * @property AxesLayout
         * @public
         */

    /**
         * DataSourceInfo
         * @name sap.sac.df.model.DataProvider#DataSourceInfo
         * @type {sap.sac.df.model.DataSourceInfo}
         * @property DataSourceInfo
         * @public
         */

    /**
         * Indicator if the result set should be fetched automatically. The default value is true.
         * @name sap.sac.df.model.DataProvider#AutoFetchEnabled
         * @type boolean
         * @default true
         * @property AutoFetchEnabled
         * @public
         */

    /**
         * Get Measure Structure Dimension
         * @return {sap.sac.df.model.Dimension} Measure structure dimension
         * @public
         */
    DataProvider.prototype.getMeasureStructureDimension = function () {
      return this.getDimension(DimensionType.MeasureStructure);
    };

    /**
         * Get structure (non-measure) dimension
         * @return {sap.sac.df.model.Dimension} Structure dimension object
         * @public
         */
    DataProvider.prototype.getStructureDimension = function () {
      return this.getDimension(DimensionType.StructureDimension);
    };

    return DataProvider;

  }
)
;
