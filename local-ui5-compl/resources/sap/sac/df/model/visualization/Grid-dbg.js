/*! SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
   */
/*global sap, Promise */
sap.ui.define(
  "sap/sac/df/model/visualization/Grid",
  [
    "sap/ui/base/Object",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/sac/df/model/MemberFilter",
    "sap/sac/df/types/Axis",
    "sap/sac/df/model/visualization/Documents"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    _,
    FF,
    SyncActionHelper,
    MemberFilter,
    AxisType,
    Document
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
         * @class
         * Grid Visualization Object
         *
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @hideconstructor
         * @experimental since version 1.132
         * @since 1.132
         * @alias sap.sac.df.model.visualization.Grid
         */
    var Grid = BaseObject.extend("sap.sac.df.model.visualization.Grid", /** @lends sap.sac.df.model.visualization.Grid.prototype */{
      constructor: function (oVisualization) {
        Object.assign(this, Object.getPrototypeOf(this));
        /** @private */
        this._Visualization = oVisualization;
        /** @private */
        this._DataProvider = oVisualization._DataProvider;
        this.Documents = new Document(this._DataProvider);
        Object.assign(this);

        /** @private */
        this._onVisualizationFilled = function () {
          return Promise.resolve(
            this._Visualization._getFFVisualization()
          ).then((oTableVisualization) => {
            let oActiveTableContainer = oTableVisualization.getActiveTableContainer();
            if (FF.notNull(oActiveTableContainer)) {
              if (oActiveTableContainer.getData() && oActiveTableContainer.getData().isValid()) {
                let oTableVizData = oActiveTableContainer.getVisualizationData();
                if (oTableVizData) {
                  try {
                    //For compatibility reasons
                    this.Cells = FF.PivotTableExport.create(oTableVizData, oActiveTableContainer)._export().convertToNative();
                    this._DataProvider._Model.checkUpdate();
                    this._DataProvider.fireDataUpdated();
                  } catch (e) {
                    //Log.error("Grid Update failed", e);
                  }
                }
              } else {
                this._DataProvider._addMessagesToModel(oActiveTableContainer.getData());
                this._DataProvider._Model.checkUpdate();
                this._DataProvider._Model.fireRequestFailed({infoObject: this._DataProvider.Name});
              }
            }
          });
        };
      }
    });

    /**
         * Get the data of the visualization
         * <pre><code>
         * "Cells": [],
         * "TotalColumns": Integer,
         * "TotalRows": Integer
         * </code></pre>
         * @returns {Promise<Object>} a promise which resolves with the visualization data
         * @public
         */
    Grid.prototype.getVisualizationData = function () {
      let oActiveTableContainer = this._Visualization._getFFVisualization().getActiveTableContainer();
      if (FF.notNull(oActiveTableContainer)) {
        if (oActiveTableContainer.getData() && oActiveTableContainer.getData().isValid()) {
          let oTableVizData = oActiveTableContainer.getVisualizationData();
          if (oTableVizData) {
            try {
              return FF.PivotTableExport.create(oTableVizData, oActiveTableContainer)._export().convertToNative();
            } catch (e) {
              //Log.error("Grid Update failed", e);
            }
          }
        } else {
          return oActiveTableContainer.getData();
        }
      }
    };

    /**
         * Gets the cell context for a data cell in the result set
         * @param {int} nRowIndex the row index
         * @param {int} nColumnIndex the column index
         * @returns {Promise<Object>} a promise which resolves with the retrieved cell context
         * @public
         */
    Grid.prototype.getCellContext = function (nRowIndex, nColumnIndex) {
      var that = this;
      var oCCProvider = FF.PivotTableCellContextProvider.create(that._DataProvider._getQueryManager());
      var oCellIndexInfo = FF.RsCellIndexInfo.create();
      oCellIndexInfo.initialize(nRowIndex, nColumnIndex);
      return SyncActionHelper.syncActionToPromise(
        oCCProvider.getCellContext,
        oCCProvider,
        oCellIndexInfo
      ).then(function (oCellContext) {
        var aCellContext = oCellContext ? oCellContext.convertToNative() : null;
        _.forEach(aCellContext, function (oCellContext) {
          oCellContext.Filter = MemberFilter.createFromFFMemberFilter(oCellContext.Filter);
        });
        return Promise.resolve(aCellContext);
      }).catch(function (oError) {
        that._DataProvider._addMessagesToModel(oError.getMessages ? oError : []);
        return Promise.reject(oError);
      });
    };

    /**
         * Get the list of the jump targets associated to a cell defined via
         * the Report-To-Report Interface.
         * @param {int} iRowIndex Row of the data cell
         * @param {int} iColumnIndex Column of the data cell
         * @return {Promise} resolving to the List of jump targets.
         * @public
         */
    Grid.prototype.getRRITargets = function (iRowIndex, iColumnIndex) {
      var rriTargetManager = this._DataProvider._getQueryManager().getRriTargetManager();
      if (!rriTargetManager) {
        return Promise.resolve([]);
      }
      rriTargetManager.setResultSetContext(iRowIndex, iColumnIndex);
      var fResolve, fReject;

      function handleDialog(resolve, reject) {
        fResolve = resolve;
        fReject = reject;
      }

      rriTargetManager.processRriTargetResolution(FF.SyncType.NON_BLOCKING, {
        onRriTargetResolution: function (oRes) {
          if (oRes.hasErrors()) {
            fReject(oRes.getMessages());
          } else {
            let isIntentUrlPromise;
            const Container = sap.ui.require("sap/ushell/Container");
            if (Container && Container.getServiceAsync) {
              isIntentUrlPromise = Container.getServiceAsync("URLParsing").then(oUrlParsing => oUrlParsing.isIntentUrl);
            } else {
              isIntentUrlPromise = Promise.resolve(_.constant(false));
            }
            isIntentUrlPromise.then((isIntentUrl) => {
              fResolve(_.filter(
                oRes.getData().getListFromImplementation().map(
                  function (o) {
                    return o.getParameters().getMapFromImplementation();
                  }),
                function (o) {
                  return isIntentUrl(o.URL) || !!o.URL.match(/#/);
                }
              ).map(
                function (o) {
                  o.URL = o.URL.split("#")[1];
                  return o;
                }));
            }).catch(fReject);

          }
        }
      });
      return new Promise(handleDialog);
    };

    /**
         * Active styling template
         * @param {string} sStylingTemplateName styling template name
         * @return {Promise} resolving to the visualization object
         * @public
         */
    Grid.prototype.activateStylingTemplate = function (sStylingTemplateName) {
      return Promise.resolve(
        this._Visualization._getFFVisualization()
      ).then((oTableVisualization) => {
        if (sStylingTemplateName) {
          var oStyleTemplate = this._DataProvider._Model.getGridStylingTemplateRegistry().getTemplate(sStylingTemplateName);
          if (oStyleTemplate.getStyleForDataProvider && this._DataProvider) {
            oStyleTemplate = oStyleTemplate.getStyleForDataProvider(this._DataProvider);
          }
          const oTemplateManager = oTableVisualization.getQueryManager().getOlapEnv().getVisualizationTemplateManager();
          const oTemplateList = oTemplateManager.getOrCreateTableTemplateList(FF.OlapVisualizationConstants.TABLE_TEMPLATE_LINK);
          var faTableDefinition = oTemplateList.getByKey(sStylingTemplateName);
          faTableDefinition.deserializeFromElementExt(FF.QModelFormat.INA_REPOSITORY, new FF.NativeJsonProxyElement(oStyleTemplate));
          oTemplateList.setActiveTemplate(faTableDefinition);
          oTableVisualization.getTemplateLinker().putLinkedDefinition(FF.OlapVisualizationConstants.TABLE_TEMPLATE_LINK, faTableDefinition);
        }
      });
    };

    /**
         * Set the dimensions on row and column axis
         * @param {sap.sac.df.model.visualization.Grid.AxesLayout} oAxisLayout an object containing the names of the dimensions on row and column axis. The order of the dimensions control the position on the axis.
         * @return {sap.sac.df.model.visualization.Grid} resolving to the axes layout object to allow chaining
         * @public
         */
    Grid.prototype.setAxesLayout = function (oAxisLayout) {

      this._DataProvider._getQueryManager().stopEventing();
      _.forEach(_.map(this._DataProvider.Dimensions, "Name"), (sDim) => {
        this._DataProvider._getQueryModel().getAxis(FF.AxisType.FREE).add(
          this._DataProvider._getQueryModel().getDimensionByName(
            this._DataProvider.getDimension(sDim).TechName
          )
        );
      });
      _.forEach(oAxisLayout[AxisType.Rows], (sDim) => {
        this._DataProvider.getDimension(sDim).toRows();
      });
      _.forEach(oAxisLayout[AxisType.Columns], (sDim) => {
        this._DataProvider.getDimension(sDim).toColumns();
      });
      this._DataProvider._getQueryManager().resumeEventing();
      this._DataProvider._executeModelOperation();
      return this;
    };

    /**
         * Get the current axes layout for rows and columns
         * @return {sap.sac.df.model.visualization.Grid.AxesLayout} columns and rows axes layout object
         * @public
         */
    Grid.prototype.getAxesLayout = function () {
      return {
        Columns: _.map(_.sortBy(_.filter(this._DataProvider.Dimensions, {Axis: FF.AxisType.COLUMNS.getName()}), "Position"), (oDimension) => {
          return oDimension.Name;
        }),
        Rows: _.map(_.sortBy(_.filter(this._DataProvider.Dimensions, {Axis: FF.AxisType.ROWS.getName()}), "Position"), (oDimension) => {
          return oDimension.Name;
        })
      };
    };


    /** Map of properties, that are provided by the object. */
    Grid.M_PROPERTIES = {
      Documents: "Documents"
    };

    /**
         * Documents
         * @name sap.sac.df.model.Grid#Documents
         * @type {sap.sac.df.model.visualization.Grid.Documents}
         * @property Documents
         * @public
         */
    /**
         * AxesLayout object type.
         *
         * @static
         * @constant
         * @typedef {object} sap.sac.df.model.visualization.Grid.AxesLayout
         * @property {string[]} Columns dimensions on column axis
         * @property {string[]} Rows dimensions on row axis
         *
         * @public
         */

    return Grid;
  }
);
