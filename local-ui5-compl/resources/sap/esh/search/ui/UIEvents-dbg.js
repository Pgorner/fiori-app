/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  var UIEvents = /*#__PURE__*/function (UIEvents) {
    UIEvents["ESHSearchFinished"] = "ESHSearchFinished";
    UIEvents["ESHSearchStarted"] = "ESHSearchStarted";
    UIEvents["ESHSearchLayoutChanged"] = "ESHSearchLayoutChanged";
    UIEvents["ESHSelectionChanged"] = "ESHSelectionChanged";
    UIEvents["ESHResultViewTypeChanged"] = "ESHResultViewTypeChanged";
    return UIEvents;
  }(UIEvents || {});
  return UIEvents;
});
})();