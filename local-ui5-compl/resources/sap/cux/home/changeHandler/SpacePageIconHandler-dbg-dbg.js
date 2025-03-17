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
  const SpacePageIconHandler = {
    applyChange: (change, control) => {
      const container = getContainer(control);
      container?.setIconPersonalizations(change.getContent());
      return true;
    },
    revertChange: (change, control) => {
      const revertChange = change.getContent();
      revertChange.forEach(changeContent => {
        changeContent.icon = changeContent.oldIcon;
      });
      const container = getContainer(control);
      container?.setIconPersonalizations(revertChange);
    },
    completeChangeContent: () => {
      return;
    },
    getCondenserInfo: change => {
      const changeContent = change.getContent();
      return {
        affectedControl: change.getSelector(),
        classification: CondenserClassification.LastOneWins,
        uniqueKey: changeContent.spaceId + (changeContent.pageId || "") + "_icon"
      };
    }
  };
  return SpacePageIconHandler;
});
//# sourceMappingURL=SpacePageIconHandler-dbg-dbg.js.map
