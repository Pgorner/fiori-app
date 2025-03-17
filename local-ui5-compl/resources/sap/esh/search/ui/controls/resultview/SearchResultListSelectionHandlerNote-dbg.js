/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchResultListSelectionHandler", "sap/m/MessageBox"], function (__SearchResultListSelectionHandler, MessageBox) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchResultListSelectionHandler = _interopRequireDefault(__SearchResultListSelectionHandler);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultListSelectionHandlerNote = SearchResultListSelectionHandler.extend("sap.esh.search.ui.controls.SearchResultListSelectionHandlerNote", {
    isMultiSelectionAvailable: function _isMultiSelectionAvailable() {
      return true;
    },
    actionsForDataSource: function _actionsForDataSource() {
      const actions = [{
        text: "Show Selected Items",
        action: function (selection) {
          let message = "No Items were selected!";
          if (selection.length > 0) {
            message = "Following Items were selected:";
            for (let i = 0; i < selection.length; i++) {
              message += "\n" + selection[i].title;
            }
          }
          MessageBox.show(message, {
            icon: MessageBox.Icon.INFORMATION,
            title: "I'm a Custom Action for testing Multi-Selection",
            actions: [MessageBox.Action.OK]
          });
        }
      }];
      return actions;
    }
  });
  return SearchResultListSelectionHandlerNote;
});
})();