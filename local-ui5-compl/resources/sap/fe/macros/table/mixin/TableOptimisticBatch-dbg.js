/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element"], function (UI5Element) {
  "use strict";

  var _exports = {};
  let TableOptimisticBatch = /*#__PURE__*/function () {
    function TableOptimisticBatch() {}
    _exports = TableOptimisticBatch;
    var _proto = TableOptimisticBatch.prototype;
    _proto.setupMixin = function setupMixin(_baseClass) {
      this.optimisticBatchEnablerPromise = undefined;
    };
    _proto.setupOptimisticBatch = async function setupOptimisticBatch() {
      const table = this.getContent();
      if (!table) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const tableDelegate = await table?.awaitControlDelegate();
      const filterBar = UI5Element.getElementById(table?.getFilter());
      if (filterBar && filterBar.getParent) {
        filterBar.getParent()?.attachEvent("search", searchEvent => {
          const tableAPI = table.getParent();
          const controller = tableAPI.getPageController();
          const controllerExtension = controller.extension;
          if (controller && controller.isA("sap.fe.templates.ListReport.ListReportController") && controllerExtension === undefined && !["Go", "Enter"].includes(searchEvent.getParameter("reason"))) {
            try {
              tableDelegate?.setOptimisticBatchPromiseForModel(controller, tableAPI);
              tableDelegate?.enableOptimisticBatchMode(controller, table);
            } catch (e) {
              // An exception will be thrown when the user clicks go and the table data has already been loaded
              // (setOptimisticBatchPromiseForModel is not supposed to be called once a batch has already been sent)
              // We just ignore this exception
            }
          }
          const internalBindingContext = table.getBindingContext("internal");
          internalBindingContext?.setProperty("searchFired", true);
        });
      }
    }

    /**
     * Setter for the optimisticBatchEnablerPromise property.
     * @param optimisticBatchEnablerPromiseObject The Promise that is to be resolved by the V4 model
     */;
    _proto.setOptimisticBatchEnablerPromise = function setOptimisticBatchEnablerPromise(optimisticBatchEnablerPromiseObject) {
      this.optimisticBatchEnablerPromise = optimisticBatchEnablerPromiseObject;
    }

    /**
     * Getter for the optimisticBatchEnablerPromise property.
     * @returns The optimisticBatchEnablerPromise property.
     */;
    _proto.getOptimisticBatchEnablerPromise = function getOptimisticBatchEnablerPromise() {
      return this.optimisticBatchEnablerPromise;
    }

    /**
     * Method to know if ListReport is configured with Optimistic batch mode disabled.
     * @returns Is Optimistic batch mode disabled
     */;
    _proto.isOptimisticBatchDisabled = function isOptimisticBatchDisabled() {
      return this.getTableDefinition().control.disableRequestCache || false;
    };
    return TableOptimisticBatch;
  }();
  _exports = TableOptimisticBatch;
  return _exports;
}, false);
//# sourceMappingURL=TableOptimisticBatch-dbg.js.map
