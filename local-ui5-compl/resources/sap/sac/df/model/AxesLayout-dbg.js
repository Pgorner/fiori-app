/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap */
sap.ui.define(
  "sap/sac/df/model/AxesLayout",
  [
    "sap/ui/base/Object",
    "sap/sac/df/firefly/library",
    "sap/sac/df/thirdparty/lodash"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    FF,
    _
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
         *
         * @class
         * Axis Layout showing which dimensions are set on rows and which on columns.
         *
         * <b>Structure of Exposed Data:</b>
         * <pre><code>
         * "Rows": [],
         * "Columns": []
         * </code></pre>
         *
         * @author SAP SE
         * @version 1.132.0
         * @public
         * @hideconstructor
         * @deprecated As of version 1.132. Replaced by {@link sap.sac.df.model.visualization.Grid Grid}.
         * @experimental since version 1.119
         * @since 1.119
         * @alias sap.sac.df.model.AxesLayout
         */

    const AxesLayout = BaseObject.extend("sap.sac.df.model.AxesLayout", /** @lends sap.sac.df.model.AxesLayout.prototype */ {
      constructor: function (oDataProvider) {
        Object.assign(this, Object.getPrototypeOf(this));
        /** @private */
        this._DataProvider = oDataProvider;
        this.Columns = _.map(_.sortBy(_.filter(this._getDimensions(), {Axis: FF.AxisType.COLUMNS.getName()}), "Position"), function (oDimension) {
          return oDimension.Name;
        });
        this.Rows = _.map(_.sortBy(_.filter(this._getDimensions(), {Axis: FF.AxisType.ROWS.getName()}), "Position"), function (oDimension) {
          return oDimension.Name;
        });
      },

      /** @private */
      _getDimensions: function () {
        return this._DataProvider.Dimensions;
      }
    });


    /**
         * Distribute the dimension among the rows and columns
         * @param {string[]} aDimensionOnRowsAxis an array containing the names of the dimensions on rows. The order in the array control the position on the axis.
         * @param {string[]} aDimensionOnColumnsAxis an array containing a containing the names of the dimensions on columns. The order in the array control the position on the axis.
         * @return {sap.sac.df.model.AxesLayout} resolving to the axes layout object to allow chaining
         * @public
         */
    AxesLayout.prototype.setAxesLayout = function (aDimensionOnRowsAxis, aDimensionOnColumnsAxis) {
      var that = this;
      that._DataProvider._getQueryManager().stopEventing();
      _.forEach(_.map(that._getDimensions(), "Name"), function (sDim) {
        that._DataProvider._getQueryModel().getAxis(FF.AxisType.FREE).add(
          that._DataProvider._getQueryModel().getDimensionByName(
            that._DataProvider.getDimension(sDim).TechName
          )
        );
      });
      _.forEach(aDimensionOnRowsAxis, function (sDim) {
        that._DataProvider.getDimension(sDim).toRows();
      });
      _.forEach(aDimensionOnColumnsAxis, function (sDim) {
        that._DataProvider.getDimension(sDim).toColumns();
      });
      that._DataProvider._getQueryManager().resumeEventing();
      this._DataProvider._executeModelOperation();
      return that;
    };

    return AxesLayout;
  }
);
