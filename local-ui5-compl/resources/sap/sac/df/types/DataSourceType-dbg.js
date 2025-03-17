
/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/DataSourceType",
  [
  ],
  function(){
    /**
     *  Type of a data source
     *
     * @enum {string}
     * @alias sap.sac.df.types.DataSourceType
     * @experimental since version 1.89
     * @public
     */
    var DataSourceType = {
      /**
       * Query
       * @public
       **/
      Query: "Query",
      /**
       * View
       * @public
       **/
      View: "View",
      /**
       * Ina Model
       * @public
       */
      InAModel: "InAModel",
      /**
       * Cube
       * @public
       */
      Cube: "Cube",
      /**
       * CDS Projection View
       * @public
       */
      CDSProjectionView: "CDSProjectionView"
    };
    return DataSourceType;
  }
);

