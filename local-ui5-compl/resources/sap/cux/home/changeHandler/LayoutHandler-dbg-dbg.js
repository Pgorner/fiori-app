/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define([], function () {
  "use strict";

  class LayoutHandler {
    allChanges = [];
    loadPersonalizationDialog(oWrapperControl, mPropertyBag) {
      return new Promise(resolve => {
        this.persDialogResolve = resolve;
        this.keyuserPersDialog = oWrapperControl.getAggregation("keyUserSettingsDialog");
        // Add RTA Class and show dialog
        this.keyuserPersDialog.addStyleClass(mPropertyBag.styleClass);

        // Open the dialog
        this.keyuserPersDialog.open();
      });
    }
    onCancelDialog() {
      this.keyuserPersDialog.close();
    }
    addChanges(aChanges) {
      this.allChanges.push(...aChanges);
    }
    clearChanges() {
      this.allChanges = [];
    }
    resolve() {
      this.persDialogResolve(this.allChanges);
    }
  }
  const layoutHandler = new LayoutHandler();
  return layoutHandler;
});
//# sourceMappingURL=LayoutHandler-dbg-dbg.js.map
