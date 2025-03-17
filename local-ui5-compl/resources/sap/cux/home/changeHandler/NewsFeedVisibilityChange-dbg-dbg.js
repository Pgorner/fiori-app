/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"], function (CondenserClassification) {
  "use strict";

  function getContainer(control) {
    if (control.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer") {
      return control;
    }
    return control.getItems().find(item => item.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer");
  }
  let debounceTimeout = null;
  const NewsFeedVisibilityChange = {
    applyChange: (change, control) => {
      const container = getContainer(control);

      // Debounce the newsPersonalization call
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        container?.newsVisibilityChangeHandler(change.getContent());
      }, 0);
      return true;
    },
    revertChange: (change, control) => {
      const container = getContainer(control);
      let revertChange = change.getContent();
      revertChange.isNewsFeedVisible = !revertChange.isNewsFeedVisible;
      container?.newsVisibilityChangeHandler(revertChange);
    },
    completeChangeContent: () => {
      return;
    },
    getCondenserInfo: change => {
      return {
        affectedControl: change.getSelector(),
        classification: CondenserClassification.LastOneWins,
        uniqueKey: "newsFeedVisibility"
      };
    }
  };
  return NewsFeedVisibilityChange;
});
//# sourceMappingURL=NewsFeedVisibilityChange-dbg-dbg.js.map
