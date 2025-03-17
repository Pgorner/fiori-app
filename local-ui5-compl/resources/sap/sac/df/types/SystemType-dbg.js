/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/types/SystemType",
  [],
  function () {
    /**
     * System Type of an InA System
     *
     * @enum {string}
     * @alias sap.sac.df.types.SystemType
     * @experimental since version 1.89
     * @public
     */
    var SystemType = {
      /**
       * The BW analytic engine
       * @public
       **/
      BW: "BW",
      /**
       * The ABAP analytic engine
       * @public
       **/
      ABAP_MDS: "ABAP_MDS",
      /**
       * The Data Warehouce Cloud analytic engine
       * @public
       **/
      DWC: "DWC",
      /**
       * The HANA/MDS analytic engine
       * @public
       **/
      HANA: "HANA"
    };
    return SystemType;
  }
);
