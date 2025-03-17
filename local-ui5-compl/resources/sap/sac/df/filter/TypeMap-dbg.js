/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define([
  "sap/ui/mdc/DefaultTypeMap"
], function (DefaultTypeMap) {
  "use strict";

  var DFTypeMap = Object.assign({}, DefaultTypeMap);

  DFTypeMap.import(DefaultTypeMap);
  DFTypeMap.setAlias("Double", "sap.ui.model.type.Float");
  DFTypeMap.freeze();

  var oFormatOptions = {
    "Date": {
      source: {
        format: "yyyy-MM-dd",
        pattern: "yyyy-MM-dd"
      }
    },
    "Time": {
      source: {
        format: "HH:mm:ss",
        pattern: "HH:mm:ss"
      }
    },
    "DateTime": {
      source: {
        format: "yyyy-MM-ddTHH:mm:ss",
        pattern: "yyyy-MM-ddTHH:mm:ss"
      }
    }
  };

  DFTypeMap.getFormatOptions = function (sType) {
    return oFormatOptions[sType];
  };

  return DFTypeMap;
});
