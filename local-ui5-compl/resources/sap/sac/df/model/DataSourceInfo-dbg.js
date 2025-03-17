/*!
* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
*/
/*global sap */
sap.ui.define(
  "sap/sac/df/model/DataSourceInfo",
  [
    "sap/ui/base/Object",
    "sap/sac/df/thirdparty/lodash",
    "sap/sac/df/firefly/library",
    "sap/sac/df/utils/SyncActionHelper",
    "sap/ui/core/format/DateFormat"
  ], /*eslint-disable max-params*/
  function (
    BaseObject,
    _,
    FF,
    SyncActionHelper,
    UiCoreDateFormat
  ) {
    "use strict";
    /*eslint-disable max-statements*/
    /**
     *
     * @class
     * Data source information.
     *
     * <b>Structure of Exposed Data:</b>
     * <pre><code>
     *  "QueryTitle": "",
     *  "QueryName": "",
     *  "QueryType": "",
     *  "SystemName": "",
     *  "CreatedBy": "",
     *  "CreatedOn": "",
     *  "QueryDueDateText": "",
     *  "CreatedOnText": "",
     *  "QueryDueDate": "",
     *  "ResultAlignmentRows": "",
     *  "ResultAlignmentColumns": "",
     *  "LastUpdated": "",
     *  "LastUpdatedBy": "",
     *  "LastUpdatedText": ""
     * </code></pre>
     * @author SAP SE
     * @version 1.132.0
     * @public
     * @hideconstructor
     * @experimental since version 1.119
     * @since 1.119
     * @alias sap.sac.df.model.DataSourceInfo
     */

    var DataSourceInfo = BaseObject.extend("sap.sac.df.model.DataSourceInfo", /** @lends sap.sac.df.model.DataSourceInfo.prototype */ {
      constructor: function (oDataProvider) {
        Object.assign(this,Object.getPrototypeOf(this));
        var that = this;
        /** @private */
        this._DataProvider = oDataProvider;

        this.QueryTitle = this._DataProvider._getQueryModel().getText() || this._DataProvider._getQueryModel().getDataSource().getName();
        this.QueryName = this._DataProvider._getQueryModel().getDataSource().getName();
        this.QueryType = this._DataProvider._getQueryModel().getDataSource().getType().getName();
        this.SystemName = this._DataProvider._getQueryManager().getSystemDescription().getName();

        if (this._DataProvider._getQueryModel().getCubeInfo()) {
          this.CreatedBy = this._DataProvider._getQueryModel().getCubeInfo().getCreatedBy();
          this.CreatedOn = (function () {
            var oD = that._DataProvider._getQueryModel().getCubeInfo().getCreatedOn();
            return oD ? new Date(
              [
                oD.getYear(),
                oD.getMonthOfYear(),
                oD.getDayOfMonth()
              ].join("-")
            ) : new Date();
          }());
          this.CreatedOnText = this.QueryDueDateText = UiCoreDateFormat.getDateInstance({
            style: "medium"
          }).format(
            this.CreatedOn
          );
          this.QueryDueDate = (function () {
            var oD = that._DataProvider._getQueryModel().getCubeInfo().getDueDate();
            return oD ? new Date(
              [
                oD.getYear(),
                oD.getMonthOfYear(),
                oD.getDayOfMonth()
              ].join("-")
            ) : new Date();
          }());
          this.QueryDueDateText = UiCoreDateFormat.getDateInstance({
            style: "medium"
          }).format(
            this.QueryDueDate
          );
          if (this._DataProvider._getQueryModel().getResultAlignment()) {
            this.ResultAlignmentRows = this._DataProvider._getQueryModel().getResultAlignment().getName();
            this.ResultAlignmentColumns = this._DataProvider._getQueryModel().getResultAlignment().getName();
          }
          this.LastUpdated = (function () {
            var oD = that._DataProvider._getQueryModel().getCubeInfo().getUpdatedOn();
            return oD ? new Date(
              [
                oD.getYear(),
                oD.getMonthOfYear(),
                oD.getDayOfMonth()
              ].join("-")
            ) : new Date();
          }());
          this.LastUpdatedBy = this._DataProvider._getQueryModel().getCubeInfo().getUpdatedBy();
          this.LastUpdatedText = UiCoreDateFormat.getDateInstance({
            style: "medium"
          }).format(
            this.LastUpdated
          );
        }
      }

    });

    return DataSourceInfo;
  }
);
