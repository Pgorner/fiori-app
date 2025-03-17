/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/fl/changeHandler/condenser/Classification"], function (CondenserClassification) {
  "use strict";

  function getNewsPageContainer(control) {
    return control.getItems().find(item => item.getMetadata().getName() === "sap.cux.home.NewsAndPagesContainer");
  }
  const SpacePageColorHandler = {
    applyChange: (change, control) => {
      const container = getNewsPageContainer(control);
      container?.setColorPersonalizations(change.getContent());
      return true;
    },
    revertChange: (change, control) => {
      const revertChange = change.getContent();
      revertChange.forEach(changeContent => {
        changeContent.BGColor = changeContent.oldColor;
        changeContent.applyColorToAllPages = changeContent.oldApplyColorToAllPages;
      });
      const container = getNewsPageContainer(control);
      container?.setColorPersonalizations(revertChange);
    },
    completeChangeContent: () => {
      return;
    },
    getCondenserInfo: change => {
      const changeContent = change.getContent();
      return {
        affectedControl: change.getSelector(),
        classification: CondenserClassification.LastOneWins,
        uniqueKey: changeContent.spaceId + (changeContent.pageId || "") + "_color"
      };
    }
  };
  return SpacePageColorHandler;
});
//# sourceMappingURL=SpacePageColorHandler-dbg-dbg.js.map
