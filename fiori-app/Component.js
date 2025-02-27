sap.ui.define([
  "sap/ui/core/UIComponent"
], function (UIComponent) {
  "use strict";

  return UIComponent.extend("my.fiori.app.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      // Call parent init
      UIComponent.prototype.init.apply(this, arguments);
      // You can do additional app-level initialization here
    }
  });
});
