/*!
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/utils/jQuery",
  [
    "sap/base/Log",
    "jquery.sap.global",
    "sap/ui/thirdparty/jqueryui/jquery-ui-core",
    "sap/ui/thirdparty/jqueryui/jquery-ui-widget",
    "sap/ui/thirdparty/jqueryui/jquery-ui-mouse",
    "sap/ui/thirdparty/jqueryui/jquery-ui-draggable",
    "sap/ui/thirdparty/jqueryui/jquery-ui-droppable",
    "sap/ui/thirdparty/jqueryui/jquery-ui-resizable",
    "sap/ui/thirdparty/jqueryui/jquery-ui-sortable"
  ],
  function (Log, jQuery) {
    "use strict";
    [
    ].forEach(
      function (sLib) {
        jQuery.sap.require(sLib);
      }
    );
    Log.info("jQuery UI loaded");
    return jQuery;
  }
);
