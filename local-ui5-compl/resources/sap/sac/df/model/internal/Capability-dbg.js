/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define(
  "sap/sac/df/model/internal/Capability",
  ["sap/sac/df/firefly/library"],
  function (FF) {
    "use strict";

    /*
    Returns an object containing InA capabilities
     */
    return {
      "SupportsDocuments" : FF.InACapabilities.V274_CELL_DOCUMENT_ID
    };
  }
);
