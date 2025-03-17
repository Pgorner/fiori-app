/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/SpreadSheet/CXpDataCellValueType",
  [],
  function () {
    "use strict";
    var CXpDataCellValueType = {
      STANDARD :"STANDARD",
      NUMBER: "NUMBER",
      NUMBER_AS_STRING :"NUMBER_AS_STRING",
      DATE:  "DATE",
      TIME: "TIME" ,
      TIMESTAMP:  "TIMESTAMP"
    };
    return CXpDataCellValueType;
  }
);
