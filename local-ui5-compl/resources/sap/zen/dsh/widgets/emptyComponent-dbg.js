/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/ui/core/Control"
  ],
  function(jQuery, BaseHandler, Control) {
    "use strict";
    return Control.extend(
      "sap.zen.components.Empty", {
        renderer : function(oRm, oControl) {
          oRm.write("<div");
          oRm.writeControlData(oControl);
          oRm.write("></div>");
        },
        insertPage : function() {
        },
        setSelectedIndex : function(){
        }
      }
    );
  }
);
